// Charts. A chart is written in beats (see README.md for the format); here it is turned into
// timed notes for one difficulty. Hard is the chart as written. Medium and Easy are made from it
// by thinning: fewer notes off the beat, simpler scratch chains, and on Easy one thing at a time.
//
// The song has its own pad part (the kicks, snares, claps, open hats and horn stabs in the
// loops). A pad note in the chart hands one of those hits to you: it sounds only if you play it.
// Hits the chart doesn't give you, including the ones thinned out of an easier level, the song
// plays itself, so every level sounds like the whole song when it's played well.
//
// Played with the mouse, a level is thinned once more for one pointer (see onePointer below).
// Hybrid has six pads: their notes are all there is, the keys play the kick, the snare and the
// clap, and only the rest is thinned for the mouse. The song plays the hats itself.

import { beatTime, loopEvents, LOOP_BEATS } from './music.js'
import { HYBRID_PADS, LAYOUTS, PADS, PAD_INDEX, SONG_PADS } from './pads.js'

// Lanes: the eight pads are 0-7 (pad order), then the record and the crossfader
export const SCRATCH_LANE = 8
export const FADE_LANE = 9
export const LEVELS = ['easy', 'medium', 'hard']

// Hybrid's pads, and the ones it plays on the keys, by name
const IN_HYBRID = new Set(PADS.filter((_, i) => LAYOUTS.hybrid.slots[i]).map((p) => p.id))
const KEYED = new Set(HYBRID_PADS.map((h) => PADS[h.pad].id))

export async function loadChart(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Chart ${url}: ${res.status}`)
  return res.json()
}

/** The key a pad hit of the song is known by, to tell which ones the chart gives the player. */
export function claimKey(pad, beat) {
  return `${pad}@${Math.round(beat * 1000)}`
}

/**
 * The playable chart for a difficulty: timed notes in order, plus the song's shape. For the
 * `controls` 'mouse' it leaves out what one pointer can't reach in time; for 'hybrid', the notes
 * on its six pads, with the same done to the ones the mouse plays (the keys' pads come through
 * whole). Anything else (the keys, touch) gets the whole level.
 */
export function buildChart(raw, level, { controls = null } = {}) {
  let playable = thin(raw.notes, level)
  const pointer = controls === 'mouse' || controls === 'hybrid' ? controls : null
  if (pointer === 'hybrid')
    playable = playable.filter((n) => n.type !== 'pad' || IN_HYBRID.has(n.pad))
  if (pointer) playable = onePointer(playable, pointer === 'hybrid' ? KEYED : null)
  const claimed = new Set()
  const notes = playable.map((n) => {
    const note = {
      id: 0,
      type: n.type,
      lane: 0,
      beat: n.beat,
      time: beatTime(n.beat), // seconds from the first beat of the song
      judged: false,
      grade: null,
      error: 0,
    }
    if (n.type === 'pad') {
      note.pad = PAD_INDEX[n.pad]
      note.padId = n.pad
      note.lane = note.pad
      if (n.pad === 'horn') note.voicing = hornAt(raw.arrangement, n.beat)
      if (SONG_PADS.has(n.pad)) claimed.add(claimKey(n.pad, n.beat))
    } else if (n.type === 'scratch') {
      note.lane = SCRATCH_LANE
      note.dir = n.dir === 'down' ? -1 : 1
      note.len = n.len
      note.end = beatTime(n.beat + n.len)
      note.good = 0 // seconds of the window spent moving the right way
    } else if (n.type === 'fade') {
      note.lane = FADE_LANE
      note.pos = n.pos
    }
    return note
  })
  notes.sort((a, b) => a.time - b.time || a.lane - b.lane)
  notes.forEach((n, i) => (n.id = i))
  const sections = raw.sections.map((s) => ({
    ...s,
    start: beatTime(s.startBeat),
    end: beatTime(s.endBeat),
  }))
  return {
    title: raw.title,
    level,
    notes,
    claimed,
    sections,
    arrangement: raw.arrangement,
    lengthBeats: raw.lengthBeats,
    length: beatTime(raw.lengthBeats),
    freestyle: sections.filter((s) => s.type === 'freestyle'),
    practice: !!raw.practice,
    countIn: raw.countIn || 0,
    controls: pointer, // 'mouse' or 'hybrid' when thinned for the mouse, else null
  }
}

/** The horn stab the song plays at a beat (so hitting HORN there plays the same chord). */
function hornAt(arrangement, beat) {
  const block = Math.floor(beat / LOOP_BEATS)
  const loop = arrangement[block]
  if (!loop) return null
  const inLoop = beat - block * LOOP_BEATS
  const ev = loopEvents(loop).find((e) => e.pad === 'horn' && near(e.beat, inLoop))
  return ev ? ev.voicing : null
}

/**
 * A practice chart: one section of the song (or all of it) played `times` times in a row, with
 * a bar of count-in clicks before it. Built as an ordinary chart, so everything else just works.
 */
export function practiceChart(raw, sectionType, times) {
  const s = sectionType ? raw.sections.find((x) => x.type === sectionType) : null
  if (!s) return { ...raw, practice: true, countIn: 4 }
  const from = s.startBeat
  const len = s.endBeat - s.startBeat
  const firstBlock = Math.floor(from / LOOP_BEATS)
  const blocks = Math.ceil(len / LOOP_BEATS)
  const loops = raw.arrangement.slice(firstBlock, firstBlock + blocks)
  const out = {
    title: raw.title,
    bpm: raw.bpm,
    practice: true,
    countIn: 4,
    lengthBeats: len * times,
    arrangement: [],
    sections: [],
    notes: [],
  }
  for (let k = 0; k < times; k++) {
    out.arrangement.push(...loops)
    out.sections.push({
      type: s.type,
      label: `${s.label} ${k + 1}/${times}`,
      startBeat: k * len,
      endBeat: (k + 1) * len,
    })
    for (const n of raw.notes) {
      if (n.beat >= from && n.beat < s.endBeat)
        out.notes.push({ ...n, beat: n.beat - from + k * len })
    }
  }
  return out
}

const near = (a, b) => Math.abs(a - b) < 1e-6
const onGrid = (beat, step) => near(beat / step, Math.round(beat / step))

/** Scratch notes that run straight into each other form a chain. */
function chains(scratches) {
  const out = []
  let chain = []
  for (const n of scratches) {
    const last = chain[chain.length - 1]
    if (last && near(last.beat + last.len, n.beat)) chain.push(n)
    else {
      if (chain.length) out.push(chain)
      chain = [n]
    }
  }
  if (chain.length) out.push(chain)
  return out
}

// When notes on Easy are too close together, the one listed first here stays
const PRIORITY = {
  fade: 0,
  scratch: 1,
  crash: 2,
  snare: 3,
  clap: 4,
  vox: 5,
  horn: 6,
  kick: 7,
  hat: 8,
  laser: 9,
}
const kindOf = (n) => (n.type === 'pad' ? n.pad : n.type)

function thin(source, level) {
  const notes = source.map((n) => ({ ...n })).sort((a, b) => a.beat - b.beat)
  if (level === 'hard') return notes

  const out = []
  const easy = level === 'easy'

  // Scratch chains. Medium keeps the back-and-forth but at most one change of direction per
  // beat; Easy plays each chain as a single push in one direction.
  for (const chain of chains(notes.filter((n) => n.type === 'scratch'))) {
    const total = chain.reduce((sum, n) => sum + n.len, 0)
    if (easy) {
      out.push({ ...chain[0], len: Math.min(2, total) })
      continue
    }
    let dir = chain[0].dir
    let beat = chain[0].beat
    const end = chain[0].beat + total
    while (beat < end - 1e-6) {
      const len = Math.min(1, end - beat)
      out.push({ type: 'scratch', beat, dir, len })
      dir = dir === 'up' ? 'down' : 'up'
      beat += len
    }
  }

  // Pads. Medium: the kick only on the beat, no open hats, no horn or vox straight after
  // another. Easy: the snare, the crashes, one horn a bar, the vox on the beat, no kicks or
  // open hats. Whatever is thinned out of the song's part, the song plays itself.
  const last = { horn: -Infinity, vox: -Infinity }
  let hornBar = -1
  for (const n of notes) {
    if (n.type !== 'pad') continue
    let keep = true
    switch (n.pad) {
      case 'kick':
        keep = !easy && onGrid(n.beat, 1)
        break
      case 'hat':
        keep = false
        break
      case 'horn': {
        const bar = Math.floor(n.beat / 4)
        keep = easy ? bar !== hornBar : n.beat - last.horn >= 0.75
        if (keep) hornBar = bar
        break
      }
      case 'vox':
        keep = easy ? onGrid(n.beat, 1) && n.beat - last.vox >= 2 : n.beat - last.vox >= 0.75
        break
      case 'laser':
        keep = !easy || onGrid(n.beat, 1)
        break
      default:
        keep = true
    }
    if (keep) {
      out.push(n)
      if (n.pad in last) last[n.pad] = n.beat
    }
  }

  // Crossfader cuts. Easy keeps only the first cut and the return that follows it.
  const fades = notes.filter((n) => n.type === 'fade')
  if (easy) {
    const first = fades.findIndex((n) => n.pos !== 'C')
    if (first >= 0) {
      out.push(fades[first])
      const back = fades.slice(first + 1).find((n) => n.pos === 'C')
      if (back) out.push(back)
    }
  } else {
    out.push(...fades)
  }

  // No pile-ups. On Easy nothing lands within half a beat of another note; on Medium a laser
  // never lands on another note, and a pad never lands on the record while it's being scratched.
  out.sort((a, b) => a.beat - b.beat || PRIORITY[kindOf(a)] - PRIORITY[kindOf(b)])
  const kept = []
  for (const n of out) {
    const clash = kept.some((k) => {
      const kEnd = k.type === 'scratch' ? k.beat + k.len : k.beat
      const gap = easy ? 0.5 : 0.25
      return n.beat > k.beat - gap && n.beat < kEnd + gap
    })
    const inScratch = kept.some(
      (k) => k.type === 'scratch' && n.beat > k.beat - 1e-6 && n.beat < k.beat + k.len - 1e-6
    )
    if (clash && (easy || kindOf(n) === 'laser')) continue
    if (!easy && n.type === 'pad' && inScratch) continue
    kept.push(n)
  }
  return kept
}

// Beats of travel one pointer needs from one target (a pad, the record, the fader) to another
const MOVE_BEATS = 0.5

/**
 * A chart one pointer can play: never two notes at once, nothing on the pads while the hand is
 * on the record, and half a beat to get from one target to another. A note on the same target
 * can follow straight on (the same pad again, the next scratch of a chain). The scratches and
 * cuts are placed first, then the pads in order of PRIORITY, each only where it fits between
 * the notes already placed. Easy already plays one thing at a time, so it comes through whole.
 *
 * In Hybrid, notes on the pads in `keyed` are for the keys: they come through as they are, and
 * the rest is thinned for the mouse.
 */
function onePointer(notes, keyed = null) {
  const onKeys = (n) => keyed !== null && n.type === 'pad' && keyed.has(n.pad)
  const target = (n) => (n.type === 'pad' ? n.pad : n.type)
  const end = (n) => (n.type === 'scratch' ? n.beat + n.len : n.beat)
  const follows = (a, b) =>
    target(a) === target(b)
      ? b.beat > a.beat + 1e-6 && b.beat > end(a) - 1e-6
      : b.beat > end(a) + MOVE_BEATS - 1e-6
  const order = notes
    .filter((n) => !onKeys(n))
    .sort((a, b) => PRIORITY[kindOf(a)] - PRIORITY[kindOf(b)] || a.beat - b.beat)
  const kept = [] // in order of beat
  for (const n of order) {
    let i = 0
    while (i < kept.length && kept[i].beat < n.beat) i++
    if (i > 0 && !follows(kept[i - 1], n)) continue
    if (i < kept.length && !follows(n, kept[i])) continue
    kept.splice(i, 0, n)
  }
  return keyed ? [...kept, ...notes.filter(onKeys)].sort((a, b) => a.beat - b.beat) : kept
}
