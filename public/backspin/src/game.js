// One play of the song: judging, score, combo, the crowd's hype and the freestyle.
//
// Every time here is song time on the audio clock: seconds since beat 0 as the player hears
// it, minus their calibrated offset. Inputs are judged by their own event timestamps.

import { BEAT, BAR, LOOP_BEATS, beatTime, swing } from './music.js'
import { PADS, MOVE_KIND } from './pads.js'

export const WINDOW = { perfect: 0.045, great: 0.09, good: 0.135 }
const POINTS = { perfect: 300, great: 200, good: 100 }
const SCRATCH_POINTS = { perfect: 400, great: 260, good: 120 }
const ACCURACY = { perfect: 1, great: 0.75, good: 0.4, miss: 0 }
const HYPE_GAIN = { perfect: 4, great: 2.5, good: 1, miss: -8 }
const OVERHIT_HYPE = -1.5 // a pad hit with no note for it, in the middle of charted play
const SCRATCH_MIN_SPEED = 0.25 // a scratch must move the record at least this fast to count
const SCRATCH_GRACE = 0.05 // seconds ignored at each end of a scratch window (the turn-around)
const BOOST_BEATS = 8
const FREESTYLE_FULL = 6000 // freestyle points the crowd counts as a full set
const PADS_PER_STEP = 2 // freestyle pad hits that score in one 16th (a kick and a hat, say)
export const FADE_VALUE = { L: 0, C: 0.5, R: 1 }

export class Game {
  constructor({ engine, clock, chart }) {
    this.engine = engine
    this.clock = clock
    this.chart = chart
    this.notes = chart.notes
    this.score = 0
    this.combo = 0
    this.maxCombo = 0
    this.hype = 30
    this.hypeSum = 0
    this.hypeSamples = 0
    this.boostStart = -1
    this.boostEnd = -1
    this.counts = { perfect: 0, great: 0, good: 0, miss: 0 }
    this.accuracySum = 0
    this.judgedCount = 0
    this.overhits = 0
    this.next = 0 // first note that might still need judging
    this.crossfader = 'C'
    this.finished = false
    this.started = false
    this.time = -10 // song time as last updated (for visuals)
    this.events = [] // judgements and other moments for the picture to show, newest last
    this.seq = 0

    // How early or late the hits land: overall and per pad, for the results
    this.timing = { n: 0, sum: 0, sumSq: 0, pads: PADS.map(() => ({ n: 0, sum: 0 })) }

    // Hand movement, for scratch notes and the freestyle
    this.handDir = 0
    this.handLastMove = -10
    this.handTravel = 0

    // Freestyle
    this.free = {
      score: 0,
      heat: 0, // 0..1: how hard the crowd is going right now
      bar: -1,
      used: new Set(), // kinds of move used in this bar
      loops: new Set(),
      lastAction: -10,
      scratchStep: -1,
      padStep: -1,
      padsInStep: 0,
      deadBeats: 0,
      loopSwitches: 0,
      switched: null, // { section, loop }: the loop switched to in a freestyle
    }
  }

  /** Schedule the song (and a count-in, if the chart has one) `delay` seconds from now. */
  start(delay = 2.2) {
    const countIn = this.chart.countIn || 0
    delay = Math.max(delay, (countIn + 0.6) * BEAT)
    this.songStart = this.engine.startSong(this.chart, delay)
    for (let k = countIn; k >= 1; k--) this.engine.tick(this.songStart - k * BEAT, k === countIn)
    this.started = true
  }

  /** Song time for an input event's page timestamp, calibration included. */
  songTimeAt(pageMs) {
    return this.clock.judged(pageMs) - this.songStart
  }

  /** Song time right now, for drawing (notes cross the line when you should press). */
  get now() {
    return this.clock.judged(performance.now()) - this.songStart
  }

  get multiplier() {
    return this.combo >= 30 ? 4 : this.combo >= 20 ? 3 : this.combo >= 10 ? 2 : 1
  }

  get boosting() {
    return this.time >= this.boostStart && this.time < this.boostEnd
  }

  get section() {
    return within(this.chart.sections, this.time)
  }

  inFreestyle(t) {
    return within(this.chart.freestyle, t) !== null
  }

  freestyleAt(t) {
    return within(this.chart.freestyle, t)
  }

  /** The loop playing in freestyle section `f`: the song's, until you switch. */
  freestyleLoop(f) {
    const s = this.free.switched
    if (s && s.section === f) return s.loop
    return this.chart.arrangement[Math.floor(f.startBeat / LOOP_BEATS)] || 'A'
  }

  // ---- Inputs -------------------------------------------------------------------------------

  /**
   * A pad hit: `vel` 0..1. It always makes its sound (a pad is an instrument). On a note it is
   * judged and plays exactly what the song has there (the horns' chord); in a freestyle it
   * scores; anywhere else in the middle of the chart it is an extra hit and costs a little hype.
   */
  pad(index, pageMs, vel = 0.85) {
    const t = this.songTimeAt(pageMs)
    const note = this.closest(t, (n) => n.type === 'pad' && n.pad === index)
    if (note) {
      this.engine.pad(index, vel, note.voicing, note.beat)
      this.judge(note, gradeFor(Math.abs(t - note.time)), t - note.time)
      return note
    }
    this.engine.pad(index, vel, null, t / BEAT)
    if (this.inFreestyle(t)) {
      this.freestyleAction(MOVE_KIND[PADS[index].id], t)
    } else if (this.chartedNear(t)) {
      this.overhits++
      if (!this.boosting) this.hype = clamp(this.hype + OVERHIT_HYPE, 0, 100)
    }
    return null
  }

  /** The crossfader moved to `pos` ('L', 'C' or 'R'). */
  fade(pos, pageMs) {
    const t = this.songTimeAt(pageMs)
    const moved = pos !== this.crossfader
    this.crossfader = pos
    this.engine.setCrossfader(FADE_VALUE[pos])
    const note = this.closest(t, (n) => n.type === 'fade' && n.pos === pos)
    if (note) this.judge(note, gradeFor(Math.abs(t - note.time)), t - note.time)
    else if (moved) this.freestyleAction('cut', t)
  }

  /** Switch the loop playing (freestyle only). */
  loop(name, pageMs) {
    const t = this.songTimeAt(pageMs)
    const f = this.freestyleAt(t)
    if (!f) return
    const at = this.engine.switchLoop(name, this.songStart + f.start, this.songStart + f.end)
    this.free.switched = { section: f, loop: name }
    this.freestyleAction('loop', at - this.songStart, name)
  }

  boost(pageMs) {
    this.tryBoost(this.songTimeAt(pageMs))
  }

  handDown() {
    this.handDir = 0
  }

  handUp() {
    this.handDir = 0
  }

  /** Movement while the hand is on the record: [distance, t0, t1, ...] (page seconds). */
  handMove(list) {
    for (let i = 0; i + 2 < list.length; i += 3) {
      const d = list[i]
      const s0 = this.clock.judged(list[i + 1] * 1000) - this.songStart
      const s1 = this.clock.judged(list[i + 2] * 1000) - this.songStart
      if (!(s1 > s0)) continue
      const v = d / (s1 - s0)
      this.scoreScratchMotion(v, s0, s1)
      const dir = d > 0 ? 1 : -1
      const fast = Math.abs(v) >= 0.3
      if (fast && dir !== this.handDir) {
        if (this.handDir !== 0 && this.handTravel > 0.012) {
          this.freestyleAction(dir > 0 ? 'scratchUp' : 'scratchDown', s0)
        }
        this.handDir = dir
        this.handTravel = 0
      }
      this.handTravel += Math.abs(d)
      this.handLastMove = s1
      if (this.inFreestyle(s1)) this.free.lastAction = s1
    }
  }

  // ---- Notes --------------------------------------------------------------------------------

  /** The open note closest to time t that `match` accepts, if one is within the window. */
  closest(t, match) {
    let best = null
    let bestErr = Infinity
    for (let i = this.next; i < this.notes.length; i++) {
      const n = this.notes[i]
      if (n.time - t > WINDOW.good) break
      if (n.judged || !match(n)) continue
      const err = Math.abs(t - n.time)
      if (err <= WINDOW.good && err < bestErr) {
        best = n
        bestErr = err
      }
    }
    return best
  }

  /** Is there charted play around time t (so a stray hit counts as an extra hit)? */
  chartedNear(t) {
    const from = Math.max(0, this.next - 12)
    for (let i = from; i < this.notes.length; i++) {
      const n = this.notes[i]
      const end = n.type === 'scratch' ? n.end : n.time
      if (end < t - BEAT) continue
      return n.time < t + BEAT
    }
    return false
  }

  /** Credit hand movement to any scratch note whose window it overlaps. */
  scoreScratchMotion(v, s0, s1) {
    const speedOk = Math.abs(v) >= SCRATCH_MIN_SPEED
    for (let i = this.next; i < this.notes.length; i++) {
      const n = this.notes[i]
      if (n.time > s1) break
      if (n.type !== 'scratch' || n.judged) continue
      const a = Math.max(s0, n.time + SCRATCH_GRACE)
      const b = Math.min(s1, n.end - SCRATCH_GRACE * 0.5)
      if (b <= a) continue
      if (speedOk && Math.sign(v) === n.dir) n.good += b - a
      else n.bad = (n.bad || 0) + (b - a)
    }
  }

  judge(note, grade, error = 0) {
    note.judged = true
    note.grade = grade
    note.error = error
    this.counts[grade]++
    this.judgedCount++
    this.accuracySum += ACCURACY[grade]
    const boost = this.boosting ? 2 : 1
    if (grade === 'miss') {
      this.combo = 0
    } else {
      this.combo++
      this.maxCombo = Math.max(this.maxCombo, this.combo)
      const table = note.type === 'scratch' ? SCRATCH_POINTS : POINTS
      this.score += table[grade] * this.multiplier * boost
      if (note.type !== 'scratch') {
        const s = this.timing
        s.n++
        s.sum += error
        s.sumSq += error * error
        if (note.type === 'pad') {
          s.pads[note.pad].n++
          s.pads[note.pad].sum += error
        }
      }
    }
    if (!this.boosting) {
      let gain = HYPE_GAIN[grade]
      if (grade !== 'miss' && this.combo > 0 && this.combo % 10 === 0) gain += 4
      this.hype = clamp(this.hype + gain, 0, 100)
    }
    this.push({ kind: 'judge', grade, lane: note.lane, note, error })
    while (this.next < this.notes.length && this.notes[this.next].judged) this.next++
  }

  // ---- Hype ---------------------------------------------------------------------------------

  tryBoost(t) {
    // Not while one runs, or while one waits for its beat (a second press would stack risers)
    if (this.hype < 100 || this.boosting || this.boostStart > t) return
    // Starts on the next beat and runs for eight
    const beat = Math.ceil(t / BEAT - 0.25)
    this.boostStart = beat * BEAT
    this.boostEnd = this.boostStart + BOOST_BEATS * BEAT
    this.engine.riser(this.songStart + this.boostStart + 2 * BEAT, 0.45)
    this.push({ kind: 'boost', time: this.boostStart })
  }

  // ---- Freestyle ----------------------------------------------------------------------------

  /**
   * Something the player did during a freestyle. Rhythm is rewarded: moves near the 8th/16th
   * grid score more. Variety is rewarded at the end of each bar.
   */
  freestyleAction(kind, t, loop = null) {
    const f = this.freestyleAt(t)
    if (!f) return
    const free = this.free
    free.lastAction = Math.max(free.lastAction, t)
    free.used.add(kind)
    let points = 0
    let label = null
    if (kind === 'loop') {
      free.loopSwitches++
      points = free.loops.has(loop) ? 40 : 120
      free.loops.add(loop)
      label = `LOOP ${loop}`
    } else {
      // Distance to the nearest 16th (swung), and whether that 16th is also an 8th
      const beats = t / BEAT
      const step = Math.round(unswing(beats) * 4)
      const gridTime = beatTime(step / 4)
      const err = Math.abs(t - gridTime)
      // Moving faster than the grid doesn't pay: one scratch move per 16th, and a couple of pad
      // hits (mashing all eight at once is not a groove)
      if (kind === 'scratchUp' || kind === 'scratchDown') {
        if (step === free.scratchStep) return
        free.scratchStep = step
      } else if (kind !== 'cut') {
        if (step === free.padStep) {
          if (++free.padsInStep > PADS_PER_STEP) return
        } else {
          free.padStep = step
          free.padsInStep = 1
        }
      }
      if (err <= 0.035) {
        points = step % 2 === 0 ? 60 : 45
        if (kind === 'cut') label = 'CUT!'
      } else if (err <= 0.07) {
        points = 25
      } else {
        points = 8
      }
    }
    this.addFreestyle(points, label)
  }

  addFreestyle(points, label) {
    const free = this.free
    const boost = this.boosting ? 2 : 1
    free.score += points * boost
    this.score += points * boost
    free.heat = Math.min(1, free.heat + points / 600)
    if (!this.boosting) this.hype = clamp(this.hype + points / 60, 0, 100)
    if (label) this.push({ kind: 'free', label, points: points * boost })
  }

  updateFreestyle(t, dt) {
    const free = this.free
    const f = this.freestyleAt(t)
    free.heat = Math.max(0, free.heat - dt * 0.35)
    // Variety, scored as each bar ends (the last one as the freestyle ends): drums, the laser,
    // the vox, the horns, cuts, both ways of scratching and loop switches each count once
    const bar = f ? Math.floor((t - f.start) / BAR) : -1
    if (bar !== free.bar) {
      if (free.bar >= 0) {
        const n = Math.min(6, free.used.size)
        if (n >= 2) this.addFreestyle(25 * n * n, n >= 4 ? 'VARIETY!' : null)
      }
      free.used.clear()
      free.bar = bar
    }
    if (!f) return
    // Dead air: a whole beat with nothing happening
    if (t - free.lastAction > BEAT && t - f.start > BEAT) {
      free.lastAction = t
      free.deadBeats++
      this.score = Math.max(0, this.score - 20)
      free.score = Math.max(0, free.score - 20)
      if (!this.boosting) this.hype = clamp(this.hype - 3, 0, 100)
      free.heat = Math.max(0, free.heat - 0.2)
      this.push({ kind: 'free', label: 'KEEP IT MOVING', points: -20 })
    }
  }

  // ---- Each frame ---------------------------------------------------------------------------

  update(dt) {
    const t = this.now
    this.time = t
    // Notes that went past without a hit
    for (let i = this.next; i < this.notes.length; i++) {
      const n = this.notes[i]
      if (n.judged) continue
      if (n.type === 'scratch') {
        if (t > n.end + 0.03) this.judgeScratch(n)
        else if (n.time > t) break
        continue
      }
      if (t > n.time + WINDOW.good + 0.02) this.judge(n, 'miss', 0)
      else break
    }
    while (this.next < this.notes.length && this.notes[this.next].judged) this.next++

    this.updateFreestyle(t, dt)

    if (this.boosting) {
      this.hype = clamp(
        100 * (1 - (t - this.boostStart) / (this.boostEnd - this.boostStart)),
        0,
        100
      )
    }
    if (t > 0 && t < this.chart.length) {
      // The crowd is at its loudest during a boost, even though the meter is draining
      this.hypeSum += (this.boosting ? 100 : this.hype) * dt
      this.hypeSamples += dt
    }
    if (!this.finished && t > this.chart.length + 0.6) this.finished = true
  }

  judgeScratch(n) {
    const span = Math.max(0.05, n.end - n.time - SCRATCH_GRACE * 1.5)
    const f = n.good / span
    n.fraction = f
    const grade = f >= 0.72 ? 'perfect' : f >= 0.52 ? 'great' : f >= 0.32 ? 'good' : 'miss'
    this.judge(n, grade, 0)
  }

  push(event) {
    event.at = performance.now()
    event.seq = ++this.seq
    this.events.push(event)
    if (this.events.length > 24) this.events.shift()
  }

  /** The numbers for the results screen. */
  result() {
    const total = this.notes.length
    const accuracy = total ? (this.accuracySum / total) * 100 : 0
    const grade =
      accuracy >= 95
        ? 'S'
        : accuracy >= 88
          ? 'A'
          : accuracy >= 78
            ? 'B'
            : accuracy >= 65
              ? 'C'
              : 'D'
    // What the crowd thought: how hyped they were on average, how clean the playing was, and
    // the freestyle (FREESTYLE_FULL points or more counts as a full freestyle; a chart without
    // one is judged on the rest)
    const avgHype = this.hypeSamples ? this.hypeSum / this.hypeSamples : this.hype
    const hasFree = this.chart.freestyle.length > 0
    const freePct = Math.min(100, (this.free.score / FREESTYLE_FULL) * 100)
    const crowdLevel = hasFree
      ? 0.35 * avgHype + 0.45 * accuracy + 0.2 * freePct
      : 0.4 * avgHype + 0.6 * accuracy
    const crowd =
      crowdLevel >= 80
        ? 'Lost their minds'
        : crowdLevel >= 62
          ? 'Hands in the air'
          : crowdLevel >= 45
            ? 'Nodding along'
            : crowdLevel >= 28
              ? 'Polite applause'
              : 'Heading for the bar'
    // Timing: the average error (positive is late) and how widely the hits spread around it
    const s = this.timing
    const mean = s.n ? s.sum / s.n : 0
    const spread = s.n > 1 ? Math.sqrt(Math.max(0, s.sumSq / s.n - mean * mean)) : 0
    return {
      level: this.chart.level,
      practice: !!this.chart.practice,
      score: Math.round(this.score),
      accuracy: Math.round(accuracy * 10) / 10,
      grade,
      maxCombo: this.maxCombo,
      counts: { ...this.counts },
      overhits: this.overhits,
      freestyle: Math.round(this.free.score),
      hasFreestyle: hasFree,
      crowd,
      crowdLevel,
      total,
      timing: {
        hits: s.n,
        meanMs: Math.round(mean * 1000),
        spreadMs: Math.round(spread * 1000),
        pads: s.pads.map((p, i) => ({
          pad: i,
          hits: p.n,
          meanMs: p.n ? Math.round((p.sum / p.n) * 1000) : null,
        })),
      },
    }
  }
}

/** The section (or freestyle) that time t falls in, or null. A loop: this runs every frame. */
function within(list, t) {
  for (let i = 0; i < list.length; i++) {
    if (t >= list[i].start && t < list[i].end) return list[i]
  }
  return null
}

function gradeFor(err) {
  return err <= WINDOW.perfect ? 'perfect' : err <= WINDOW.great ? 'great' : 'good'
}

const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x))

/** Beats with swing taken back out (the inverse of music.js `swing`). */
function unswing(beats) {
  const eighth = Math.floor(beats * 2)
  const w = beats * 2 - eighth
  const a = swing(0.25) * 2 // where the off-16th lands, as a fraction of the 8th
  const f = w < a ? (w / a) * 0.5 : 0.5 + ((w - a) / (1 - a)) * 0.5
  return (eighth + f) / 2
}
