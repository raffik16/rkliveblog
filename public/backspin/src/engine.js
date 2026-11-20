// The sound system: one AudioContext, two decks, the pads and an equal-power crossfader.
//
//   Scratch Deck (left)  the AudioWorklet in scratch-worklet.js. Silent until the VOX pad cues
//                        it or a hand moves it.
//   Beat Deck (right)    the song's backing (hats, bass, keys) in 4-bar loops, scheduled
//                        bar-accurately on the audio clock, plus the pad part: every kick, snare,
//                        clap, open hat and horn stab the song has, played one hit at a time,
//                        except the ones the chart gives to you.
//   Pads                 your hits. The drums and horns are on the Beat Deck, so the crossfader
//                        cuts them with the rest of the beat; LASER goes straight to the master.
//
//   loop stems ─► stem gain ─► arrangement gain ─┐
//   song's pad hits ─► block ─► auto bus ────────┼─► beat bus ─► crossfader R ─┐
//   your drum and horn hits ─► pad bus ──────────┤                            │
//   practice guide (your notes, quietly) ─► guide┘                            │
//   scratch worklet ──────────────────────────────────────────► crossfader L ─┼─► master
//   laser, riser ─► fx ───────────────────────────────────────────────────────┘

import { synthesizeAll, synthesizeTempo, STEMS, KIT_LEVEL } from './synth.js'
import {
  BAR,
  BEAT,
  LOOP,
  LOOP_BEATS,
  BPM,
  BASE_BPM,
  SCRATCH,
  HORN_FOR_CHORD,
  beatTime,
  chordAt,
  loopEvents,
  setTempo,
} from './music.js'
import { PADS, PAD_INDEX } from './pads.js'
import { claimKey } from './chart.js'

export const SAMPLE_RATE = 48000

// How loud each pad plays (before the velocity of the hit)
const PAD_LEVEL = {
  kick: KIT_LEVEL * 1.08,
  snare: KIT_LEVEL * 0.98,
  hat: KIT_LEVEL * 0.6,
  clap: KIT_LEVEL * 0.78,
  crash: KIT_LEVEL * 0.55,
  horn: 1,
  laser: 1,
}
// The song's own pad hits are played at this velocity, so yours can be a touch harder
const SONG_VELOCITY = { kick: 1, snare: 0.95, hat: 0.9, clap: 0.85, horn: 0.92 }

export class AudioEngine {
  constructor() {
    this.ctx = null
    this.sounds = null
    this.ready = null
    this.deck = { pos: 0, speed: 0, mode: 0, time: 0 } // the scratch deck, as last reported
    this.blocks = [] // scheduled 4-bar loop instances on the Beat Deck
    this.scheduled = [] // one-shots timed to the song
    this.songStart = 0
    this.xfade = 0.5
    this.claimed = new Set() // pad hits the chart gives to the player: `${pad}@${beat}`
    this.rules = null // which of the song's pad hits play in the intro and outro
    this.arrangement = [] // the loop in each 16-beat block (for the horns' chords)
    this.tempoSounds = new Map() // bpm -> { loops, fx } rendered for that tempo
    this.guide = false // practice: play the hits the chart gives you too, quietly, as a guide
    this.media = new MediaChannel() // so an iPhone's silent switch doesn't mute the game
    this.holding = false // the game paused the audio itself (pause()), so it isn't a halt
    this.onHalt = null // called when something else stops the audio: a call, Siri, an alarm
  }

  /** Render every sound. Needs no AudioContext, so it can start before the first click. */
  prepare(onProgress) {
    if (!this.ready) {
      this.ready = synthesizeAll(SAMPLE_RATE, onProgress).then((s) => {
        this.sounds = s
        this.tempoSounds.set(BASE_BPM, { loops: s.loops, fx: s.fx })
        return s
      })
    }
    return this.ready
  }

  /** Call from a click or key press: browsers only let a page make sound after one. */
  async start({ muted = false } = {}) {
    // First, while this is still the tap: the silent track, where it's needed, has to be
    // started by one
    this.media.on()
    if (this.ctx) {
      await this.ctx.resume()
      return
    }
    let ctx
    try {
      ctx = new AudioContext({ sampleRate: SAMPLE_RATE, latencyHint: 'interactive' })
    } catch {
      ctx = new AudioContext({ latencyHint: 'interactive' })
    }
    this.ctx = ctx
    // On an iPhone or an iPad the system can take the audio away mid-song (a phone call, Siri,
    // an alarm): the context stops, and the game is told so it can pause
    ctx.addEventListener('statechange', () => {
      if (ctx.state !== 'running' && !this.holding && this.onHalt) this.onHalt(ctx.state)
    })
    const resumed = ctx.resume()
    await this.prepare()
    if (ctx.sampleRate !== SAMPLE_RATE) {
      // This browser ignored the requested rate: the worklet reads raw samples, so re-render
      this.sounds = await synthesizeAll(ctx.sampleRate)
      this.tempoSounds.clear()
      this.tempoSounds.set(BASE_BPM, { loops: this.sounds.loops, fx: this.sounds.fx })
    }
    await ctx.audioWorklet.addModule(new URL('./scratch-worklet.js', import.meta.url))
    this.build(muted)
    await resumed
  }

  build(muted) {
    const ctx = this.ctx
    const limiter = ctx.createDynamicsCompressor()
    limiter.threshold.value = -4
    limiter.knee.value = 3
    limiter.ratio.value = 12
    limiter.attack.value = 0.002
    limiter.release.value = 0.12
    limiter.connect(ctx.destination)
    this.level = muted ? 0 : 0.95
    this.master = gain(ctx, this.level)
    this.master.connect(limiter)

    // Crossfader
    this.xfL = gain(ctx, Math.SQRT1_2)
    this.xfR = gain(ctx, Math.SQRT1_2)
    this.xfL.connect(this.master)
    this.xfR.connect(this.master)

    // Beat Deck: the backing stems, the song's pad hits and yours
    this.beatBus = gain(ctx, 1)
    this.beatBus.connect(this.xfR)
    this.stemGain = {}
    this.arrGain = {}
    for (const stem of STEMS) {
      this.arrGain[stem] = gain(ctx, 1)
      this.arrGain[stem].connect(this.beatBus)
      this.stemGain[stem] = gain(ctx, 1)
      this.stemGain[stem].connect(this.arrGain[stem])
    }
    this.autoBus = gain(ctx, 1) // the song's own pad hits (muted in the sandbox to play them)
    this.autoBus.connect(this.beatBus)
    this.padBus = gain(ctx, 1) // yours
    this.padBus.connect(this.beatBus)
    this.guideBus = gain(ctx, 0.3) // the practice guide: your part, played quietly under you
    this.guideBus.connect(this.beatBus)

    // Scratch Deck
    this.scratchNode = new AudioWorkletNode(ctx, 'scratch-deck', {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      outputChannelCount: [1],
    })
    this.scratchNode.port.onmessage = (e) => {
      if (e.data.t === 'pos') this.deck = e.data
    }
    const { levels, cue } = this.sounds.scratch
    // Hand the record over to the audio thread (transferred, not copied)
    this.scratchNode.port.postMessage(
      { t: 'buffers', levels, cue },
      levels.map((l) => l.buffer)
    )
    this.scratchOut = gain(ctx, 0.95)
    this.scratchNode.connect(this.scratchOut).connect(this.xfL)

    // FX
    this.fxBus = gain(ctx, 0.75)
    this.fxBus.connect(this.master)
    this.click = clickBuffer(ctx)
  }

  get now() {
    return this.ctx ? this.ctx.currentTime : 0
  }

  // ---- Tempo (practice) ---------------------------------------------------------------------

  /**
   * Play the song at another tempo. The loops, the laser's echo and the riser are rendered again
   * for it (once; kept for next time). Everything timed in beats follows on its own.
   */
  async setTempo(bpm, onProgress) {
    if (bpm === BPM && this.sounds) return
    let sounds = this.tempoSounds.get(bpm)
    if (!sounds) {
      const before = BPM
      setTempo(bpm) // the renders read the tempo from music.js
      try {
        let done = 0
        sounds = await synthesizeTempo(this.ctx.sampleRate, this.sounds.kit, () =>
          onProgress?.(++done / 11)
        )
      } catch (err) {
        setTempo(before)
        throw err
      }
      this.tempoSounds.set(bpm, sounds)
    }
    setTempo(bpm)
    this.sounds.loops = sounds.loops
    this.sounds.fx = sounds.fx
  }

  // ---- Scratch Deck -------------------------------------------------------------------------

  scratch(message) {
    this.scratchNode?.port.postMessage(message)
  }

  /** The record's position in seconds right now, from the last report and its speed. */
  deckPosition() {
    const d = this.deck
    if (!this.ctx || d.mode === 0) return d.pos
    return d.pos + d.speed * Math.min(0.05, Math.max(0, this.ctx.currentTime - d.time))
  }

  // ---- Crossfader ---------------------------------------------------------------------------

  /** 0 is all Scratch Deck, 1 all Beat Deck. Equal power: the middle is -3 dB on each. */
  setCrossfader(x) {
    this.xfade = x
    if (!this.ctx) return
    const a = (x * Math.PI) / 2
    const t = this.ctx.currentTime
    this.xfL.gain.setTargetAtTime(Math.cos(a), t, 0.003)
    this.xfR.gain.setTargetAtTime(Math.sin(a), t, 0.003)
  }

  // ---- Pads ---------------------------------------------------------------------------------

  /**
   * Play a pad now: `vel` 0..1 (how hard), `voicing` for the horns (the stab the song has here;
   * without one, the stab for the chord playing at `songBeat`).
   */
  pad(index, vel = 0.9, voicing = null, songBeat = null) {
    const id = PADS[index].id
    if (id === 'vox') {
      this.scratch({ t: 'tap', stop: SCRATCH.vowelEnd })
      return
    }
    const level = PAD_LEVEL[id] * velocityCurve(vel)
    if (id === 'laser') {
      this.play(this.sounds.fx.laser, 0, level)
      return
    }
    const buffer = id === 'horn' ? this.hornFor(voicing, songBeat) : this.sounds.pads[id]
    this.play(buffer, 0, level, this.padBus)
  }

  hornFor(voicing, songBeat) {
    let v = voicing
    if (!v) {
      const beat = songBeat ?? 0
      v = HORN_FOR_CHORD[chordAt(this.loopsNow(), beat)] || HORN_FOR_CHORD.Dm9
    }
    return this.sounds.horns.get(v.join(',')) || this.sounds.horns.values().next().value
  }

  /** The loop in each block of the song as it stands (loops change in the freestyle). */
  loopsNow() {
    if (this.loopMode) return [this.loopMode]
    const out = this.arrangement.slice()
    for (const b of this.blocks) if (b.index >= 0) out[b.index] = b.loop
    return out
  }

  /** The song's pad hits between two context times (for the pads on screen to light up). */
  autoHits(t0, t1, cb) {
    for (let i = 0; i < this.blocks.length; i++) {
      const ev = this.blocks[i].events
      for (let j = 0; j < ev.length; j++) {
        if (ev[j].at > t0 && ev[j].at <= t1) cb(ev[j].pad)
      }
    }
  }

  /** Sandbox: let the song play its own pad part, or leave it all to you. */
  setAutoPads(on) {
    this.autoPads = on
    if (!this.ctx) return
    this.autoBus.gain.setTargetAtTime(on ? 1 : 0, this.ctx.currentTime, 0.01)
  }

  // ---- Beat Deck ----------------------------------------------------------------------------

  /** Schedule the whole song, `delay` seconds from now. Returns the context time of beat 0. */
  startSong(chart, delay = 0.3) {
    this.stopSong()
    const ctx = this.ctx
    const t0 = ctx.currentTime + delay
    this.songStart = t0
    this.loopMode = null
    this.arrangement = chart.arrangement
    this.claimed = chart.claimed
    this.setAutoPads(true)

    // The arrangement around the loops: the intro builds up, the outro thins out and stops
    const intro = chart.sections.find((s) => s.type === 'intro')
    const outro = chart.sections.find((s) => s.type === 'outro')
    this.rules = {
      hornFrom: intro ? intro.startBeat + 8 : -Infinity,
      hornUntil: outro ? outro.startBeat + 12 : Infinity,
      until: outro ? chart.lengthBeats - 2 : Infinity,
    }
    for (const stem of STEMS) {
      this.stemGain[stem].gain.cancelScheduledValues(0)
      this.stemGain[stem].gain.setValueAtTime(1, ctx.currentTime)
      this.arrGain[stem].gain.cancelScheduledValues(0)
      this.arrGain[stem].gain.setValueAtTime(1, ctx.currentTime)
    }
    this.blocks = chart.arrangement.map((loop, i) => this.block(loop, t0 + i * LOOP))

    if (intro) {
      const at = (beat) => t0 + beatTime(beat)
      const a = intro.startBeat
      this.arrGain.bass.gain.setValueAtTime(0, at(a))
      this.arrGain.keys.gain.setValueAtTime(0.55, at(a))
      this.arrGain.bass.gain.setTargetAtTime(1, at(a + 8) - 0.01, 0.004)
      this.arrGain.keys.gain.setTargetAtTime(1, at(a + 8) - 0.01, 0.004)
    }
    if (outro) {
      const at = (beat) => t0 + beatTime(beat)
      const b = outro.startBeat
      this.arrGain.bass.gain.setTargetAtTime(0, at(b + 8), 0.25)
      this.arrGain.keys.gain.setTargetAtTime(0.4, at(b + 8), 0.4)
      this.spinDownAt = at(chart.lengthBeats - 2)
      this.spinDown(this.spinDownAt)
    }
    // A riser into each freestyle
    for (const f of chart.freestyle) this.riser(t0 + f.start)
    return t0
  }

  /**
   * One 4-bar loop on the Beat Deck, nominally starting at `start`, sounding from `from`: its
   * backing stems, and the pad hits the song plays itself in it.
   */
  block(loop, start, from = start) {
    const ctx = this.ctx
    const index = this.loopMode ? -1 : Math.round((start - this.songStart) / LOOP)
    const b = { loop, start, index, sources: [], gains: [], events: [] }
    const offset = Math.max(0, from - start)
    for (const stem of STEMS) {
      const src = ctx.createBufferSource()
      src.buffer = this.sounds.loops[loop][stem]
      const g = gain(ctx, 1)
      src.connect(g).connect(this.stemGain[stem])
      src.start(Math.max(from, ctx.currentTime), offset)
      b.sources.push(src)
      b.gains.push(g)
    }

    // The pad part (and, when practising with the guide on, your part too)
    const pads = gain(ctx, 1)
    pads.connect(this.autoBus)
    const guide = gain(ctx, 1)
    guide.connect(this.guideBus)
    b.gains.push(pads, guide)
    const base = index >= 0 ? index * LOOP_BEATS : 0
    const rules = this.loopMode ? null : this.rules
    for (const ev of loopEvents(loop)) {
      const at = start + beatTime(ev.beat)
      if (at < from - 0.002 || at < ctx.currentTime) continue
      const beat = base + ev.beat
      if (rules) {
        if (beat >= rules.until) continue
        if (ev.pad === 'horn' && (beat < rules.hornFrom || beat >= rules.hornUntil)) continue
      }
      const yours = this.claimed.has(claimKey(ev.pad, beat))
      if (yours && !this.guide) continue
      const src = ctx.createBufferSource()
      src.buffer = ev.pad === 'horn' ? this.hornFor(ev.voicing) : this.sounds.pads[ev.pad]
      const v = SONG_VELOCITY[ev.pad] ?? 0.9
      src.connect(gain(ctx, PAD_LEVEL[ev.pad] * velocityCurve(v))).connect(yours ? guide : pads)
      src.start(at)
      b.sources.push(src)
      if (!yours) b.events.push({ at, pad: PAD_INDEX[ev.pad] })
    }
    return b
  }

  /**
   * Swap the loop playing from the next beat on, in step: for the freestyle and the sandbox.
   * Only blocks between `fromTime` and `untilTime` (context times) change.
   */
  switchLoop(loop, fromTime = 0, untilTime = Infinity) {
    const ctx = this.ctx
    const beat = Math.ceil((ctx.currentTime + 0.03 - this.songStart) / BEAT)
    const t = Math.max(fromTime, this.songStart + beat * BEAT)
    if (t >= untilTime) return t
    for (let i = 0; i < this.blocks.length; i++) {
      const old = this.blocks[i]
      if (old.start + LOOP <= t || old.start < fromTime - 0.001 || old.start >= untilTime) continue
      if (old.loop === loop) continue
      if (old.start >= t) {
        // Not started yet: cancel it and schedule the new loop in its place
        old.sources.forEach((s) => s.stop())
        this.blocks[i] = this.block(loop, old.start)
      } else {
        // Playing: duck it out on the beat and bring the new loop in at the same point
        old.gains.forEach((g) => g.gain.setTargetAtTime(0, t, 0.004))
        old.sources.forEach((s) => s.stop(t + 0.05))
        this.blocks[i] = this.block(loop, old.start, t)
      }
    }
    return t
  }

  /** Loop one pattern forever (the sandbox). Keeps a few loops scheduled ahead. */
  startJam(loop) {
    this.stopSong()
    this.songStart = this.ctx.currentTime + 0.15
    this.loopMode = loop
    this.claimed = new Set()
    this.rules = null
    this.blocks = []
    this.keepJamGoing()
  }

  keepJamGoing() {
    if (!this.loopMode) return
    const horizon = this.ctx.currentTime + LOOP * 1.5
    // Drop blocks that have finished ringing
    while (this.blocks.length && this.blocks[0].start + LOOP + 3 < this.ctx.currentTime) {
      this.blocks.shift()
    }
    let next = this.blocks.length
      ? this.blocks[this.blocks.length - 1].start + LOOP
      : this.songStart
    while (next < horizon) {
      this.blocks.push(this.block(this.loopMode, next))
      next += LOOP
    }
  }

  jamLoop(loop) {
    this.loopMode = loop
    return this.switchLoop(loop)
  }

  stopSong() {
    const t = this.ctx.currentTime
    for (const b of this.blocks) {
      b.gains.forEach((g) => g.gain.setTargetAtTime(0, t, 0.01))
      b.sources.forEach((s) => {
        try {
          s.stop(t + 0.08)
        } catch {
          // already stopped
        }
      })
    }
    this.blocks = []
    // Risers already scheduled for this song (a freestyle or boost it won't reach now)
    for (const s of this.scheduled) {
      try {
        s.stop(t + 0.02)
      } catch {
        // already stopped
      }
    }
    this.scheduled = []
    this.loopMode = null
    this.spinDownAt = null
  }

  /** Silence everything for a moment, so stopping a song part-way through doesn't click. */
  hush(seconds = 0.15) {
    if (!this.master) return
    const g = this.master.gain
    const t = this.ctx.currentTime
    g.cancelScheduledValues(t)
    g.setTargetAtTime(0, t, 0.004)
    g.setValueAtTime(this.level, t + seconds)
  }

  /** The vinyl brake at the end of the song: everything slows to a stop over about a second. */
  spinDown(at) {
    for (const b of this.blocks) {
      if (b.start + LOOP + 2 < at) continue
      for (const s of b.sources) {
        s.playbackRate.setValueAtTime(1, at)
        s.playbackRate.exponentialRampToValueAtTime(0.03, at + 1.15)
      }
      for (const g of b.gains) g.gain.setTargetAtTime(0, at + 0.9, 0.08)
    }
  }

  /** Beat Deck platter speed at a context time: 1 while playing, slowing in the brake. */
  beatDeckRate(t) {
    if (this.spinDownAt == null || t < this.spinDownAt) return 1
    const u = Math.min(1, (t - this.spinDownAt) / 1.15)
    return Math.pow(0.03, u)
  }

  // ---- FX -----------------------------------------------------------------------------------

  play(buffer, when = 0, level = 1, dest = this.fxBus) {
    const src = this.ctx.createBufferSource()
    src.buffer = buffer
    const g = gain(this.ctx, level)
    src.connect(g).connect(dest)
    src.start(Math.max(when, this.ctx.currentTime))
    return src
  }

  /** The two-beat noise riser, timed to end on `at`. */
  riser(at, level = 0.7) {
    this.scheduled.push(this.play(this.sounds.fx.riser, at - 2 * BEAT, level))
  }

  /** A metronome click for calibration and the practice count-in. */
  tick(when, accent = false) {
    const src = this.play(this.click, when, accent ? 1 : 0.7, this.master)
    this.scheduled.push(src)
    return src
  }

  // ---- Pause --------------------------------------------------------------------------------

  async pause() {
    this.holding = true
    this.media.off()
    if (this.ctx && this.ctx.state === 'running') await this.ctx.suspend()
  }

  async resume() {
    if (!this.ctx) return
    this.holding = false
    this.media.on()
    await this.ctx.resume()
    // The audio clock stood still while the page clock ran on: let the deck re-measure
    this.scratch({ t: 'clock' })
  }
}

/**
 * iPhones and iPads play a page's Web Audio on the ringer's channel, so with the silent switch on
 * (or silent mode, on an iPad) the whole game is silent, with no sign why. Safari 17 and later
 * let a page say it plays media (navigator.audioSession), and then it follows the media volume,
 * like a video. Before that, the way round it is an HTML <audio> element playing alongside:
 * while one plays, iOS puts the page's Web Audio on the media channel too. Its track is a second
 * of silence, made here as MP3 (iOS keeps compressed audio playing in silent mode, but not
 * uncompressed) at the game's own sample rate, so it can't change the rate the hardware runs at.
 */
class MediaChannel {
  constructor() {
    this.el = null
    try {
      if (navigator.audioSession) {
        navigator.audioSession.type = 'playback'
        return
      }
    } catch {
      // not this browser
    }
    const ua = navigator.userAgent
    // An iPad asking for desktop sites says it's a Mac, but a Mac has no touch screen
    const ios = /iP(hone|ad|od)/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)
    if (!ios) return
    const el = document.createElement('audio')
    el.loop = true
    el.preload = 'auto'
    el.setAttribute('playsinline', '')
    el.disableRemotePlayback = true
    el.src = URL.createObjectURL(new Blob([silentMp3()], { type: 'audio/mpeg' }))
    this.el = el
  }

  /** Keep the silent track playing. The first time, this has to be in a tap. */
  on() {
    if (this.el && this.el.paused) this.el.play().catch(() => {})
  }

  /** Let it stop (while paused, so it isn't playing silence in the background). */
  off() {
    if (this.el && !this.el.paused) this.el.pause()
  }
}

/**
 * A second of silent MP3 at 48 kHz (SAMPLE_RATE): MPEG-1 Layer III frames, mono at 32 kbit/s,
 * each a 4-byte header and nothing else (all-zero side info means no sound in either granule).
 */
function silentMp3() {
  const size = (144 * 32000) / 48000 // 96 bytes, 1152 samples
  const frames = 42
  const bytes = new Uint8Array(size * frames)
  // Sync, MPEG-1, Layer III, no CRC | 32 kbit/s, 48 kHz, no padding | mono, original
  for (let i = 0; i < frames; i++) bytes.set([0xff, 0xfb, 0x14, 0xc4], i * size)
  return bytes
}

/** A harder hit is louder, but not in proportion: soft hits are still clearly heard. */
function velocityCurve(vel) {
  return 0.25 + 0.75 * Math.pow(Math.max(0, Math.min(1, vel)), 0.8)
}

function gain(ctx, value) {
  const g = ctx.createGain()
  g.gain.value = value
  return g
}

/** A short woodblock-ish click: two decaying sines. */
function clickBuffer(ctx) {
  const sr = ctx.sampleRate
  const n = Math.round(0.06 * sr)
  const buf = ctx.createBuffer(1, n, sr)
  const d = buf.getChannelData(0)
  for (let i = 0; i < n; i++) {
    const t = i / sr
    d[i] =
      0.7 * Math.sin(2 * Math.PI * 1800 * t) * Math.exp(-t / 0.008) +
      0.4 * Math.sin(2 * Math.PI * 900 * t) * Math.exp(-t / 0.015)
  }
  return buf
}

export { BAR, BEAT, LOOP, LOOP_BEATS }
