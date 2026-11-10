// The sound of /synth: a polyphonic subtractive synth with a step sequencer and an arpeggiator,
// on the Web Audio API, no libraries.
//
//   per note:  osc ─┐
//              osc ─┴─> low-pass filter ─> gain (envelope) ─┐
//                         ▲ filter envelope + LFO           │
//                                                           ▼
//   bus ─┬──────────────────────────────> master ─> limiter ─> analyser ─> speakers
//        ├─> delay ⟲ ─> echo gain ───────────┤
//        └─> convolver ─> reverb gain ───────┘
//
// Every note has its own filter, because every note has its own filter envelope: a note struck
// now is bright while one held for a second has already gone dark.

export type Wave = 'sine' | 'triangle' | 'sawtooth' | 'square'
export type ArpMode = 'up' | 'down' | 'updown' | 'random'

export interface Patch {
  wave: Wave
  /** Cents the two oscillators are pulled apart by (0 = one oscillator) */
  detune: number
  /** 0..1, mapped onto 60 Hz..12 kHz on a log scale (see cutoffHz) */
  cutoff: number
  /** Filter resonance in dB, 0..20 */
  resonance: number
  /** 0..1, how far the envelope opens the filter above the cutoff (1 = four octaves) */
  envAmount: number
  /** Seconds */
  attack: number
  /** Seconds */
  decay: number
  /** 0..1, the level a held note settles at */
  sustain: number
  /** Seconds */
  release: number
  /** Hz */
  lfoRate: number
  /** 0..1, how far the LFO moves the filter (1 = two octaves each way) */
  lfoDepth: number
  /** 0..1 */
  echo: number
  /** 0..1 */
  reverb: number
  /** 0..1 */
  volume: number
}

export interface Transport {
  /** Beats per minute; a step is a sixteenth note */
  tempo: number
  /** 0..0.6, how late every second step is played */
  swing: number
  /** 0.1..1, how much of a step a sequenced note is held for */
  gate: number
}

export const STEPS = 16
export type Pattern = (number | null)[]

interface Voice {
  oscs: OscillatorNode[]
  filter: BiquadFilterNode
  amp: GainNode
  /** What the envelope was given when the note started, to work out where it is at release */
  t0: number
  attack: number
  decayTc: number
  sustain: number
  envCents: number
}

// Loudness of one note at the top of its attack. A handful of notes still sit under 1.0, and
// the limiter catches what resonance, echo and reverb add on top.
const VOICE_PEAK = 0.2
const MIN_CUTOFF = 60
const MAX_CUTOFF = 12000
const ENV_RANGE = 4800 // cents: the filter envelope opens up to four octaves
const LFO_RANGE = 2400 // cents: the LFO swings up to two octaves each way
const DELAY_FEEDBACK = 0.42
// How quickly a turned knob is followed. Long enough not to click, short enough to feel direct.
const SMOOTH = 0.015
// The sequencer looks this far ahead and wakes up this often (see tick)
const LOOKAHEAD = 0.12
const TICK_MS = 25
// Notes the sequencer and arpeggiator may have ringing at once before the oldest is cut short
const MAX_SCHEDULED = 20

export const cutoffHz = (cutoff: number) => MIN_CUTOFF * Math.pow(MAX_CUTOFF / MIN_CUTOFF, cutoff)

export const midiToHz = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12)

export class SynthEngine {
  private ctx: AudioContext | null = null
  private bus!: GainNode
  private master!: GainNode
  private delay!: DelayNode
  private echo!: GainNode
  private reverb!: GainNode
  private lfo!: OscillatorNode
  private lfoGain!: GainNode
  private analyserNode!: AnalyserNode

  private patch: Patch
  private transport: Transport
  private pattern: Pattern = new Array(STEPS).fill(null)

  /** Notes held by hand, by MIDI number */
  private voices = new Map<number, Voice>()
  /** Notes started by the sequencer or the arpeggiator, oldest first */
  private scheduled: Voice[] = []
  /** When each scheduled note sounds, so the interface can light its pad at the right moment */
  private lights: { midi: number; on: number; off: number }[] = []
  /** When each sequencer step starts, for the same reason */
  private marks: { step: number; time: number }[] = []

  private timer: ReturnType<typeof setInterval> | null = null
  private nextTime = 0
  private clockStep = 0
  private seqStep = 0
  private playing = false
  private arpOn = false
  private arpMode: ArpMode = 'up'
  private arpNotes: number[] = []
  private arpCount = 0

  constructor(patch: Patch, transport: Transport) {
    this.patch = patch
    this.transport = transport
  }

  get analyser(): AnalyserNode | null {
    return this.ctx ? this.analyserNode : null
  }

  get now(): number {
    return this.ctx ? this.ctx.currentTime : 0
  }

  private get stepSeconds() {
    return 60 / this.transport.tempo / 4
  }

  // Browsers only let a page make sound after a click, tap or key press, so the audio graph is
  // built on the first note rather than on page load.
  private start(): AudioContext {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume()
      return this.ctx
    }

    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new Ctor()
    const p = this.patch

    this.bus = ctx.createGain()
    this.master = ctx.createGain()
    this.master.gain.value = p.volume

    // Echo: a delay line that feeds itself, timed to three steps (a dotted eighth note) so the
    // repeats fall between the notes of a pattern rather than on top of them
    this.delay = ctx.createDelay(1)
    this.delay.delayTime.value = this.stepSeconds * 3
    const feedback = ctx.createGain()
    feedback.gain.value = DELAY_FEEDBACK
    this.echo = ctx.createGain()
    this.echo.gain.value = p.echo

    // Reverb: convolve the sound with the "sound of a room", here 2.6 seconds of fading noise
    const convolver = ctx.createConvolver()
    convolver.buffer = roomImpulse(ctx, 2.6)
    this.reverb = ctx.createGain()
    this.reverb.gain.value = p.reverb

    // One LFO for the whole instrument, so every note's filter moves together
    this.lfo = ctx.createOscillator()
    this.lfo.frequency.value = p.lfoRate
    this.lfoGain = ctx.createGain()
    this.lfoGain.gain.value = p.lfoDepth * LFO_RANGE
    this.lfo.connect(this.lfoGain)
    this.lfo.start()

    const limiter = ctx.createDynamicsCompressor()
    limiter.threshold.value = -10
    limiter.knee.value = 6
    limiter.ratio.value = 12
    limiter.attack.value = 0.003
    limiter.release.value = 0.2

    this.analyserNode = ctx.createAnalyser()
    this.analyserNode.fftSize = 2048
    this.analyserNode.smoothingTimeConstant = 0.75

    this.bus.connect(this.master)
    this.bus.connect(this.delay)
    this.delay.connect(feedback)
    feedback.connect(this.delay)
    this.delay.connect(this.echo)
    this.echo.connect(this.master)
    this.bus.connect(convolver)
    convolver.connect(this.reverb)
    this.reverb.connect(this.master)
    this.master.connect(limiter)
    limiter.connect(this.analyserNode)
    this.analyserNode.connect(ctx.destination)

    this.ctx = ctx
    return ctx
  }

  // ---------------------------------------------------------------------------------- voices

  // Build one note. With a duration the whole envelope, release included, is scheduled up
  // front (the sequencer's notes); without one the note holds until release() is called.
  private makeVoice(midi: number, time: number, duration: number | null): Voice {
    const ctx = this.start()
    const p = this.patch
    const attack = Math.max(p.attack, 0.002)
    const decayTc = Math.max(p.decay, 0.01) / 3
    const releaseTc = Math.max(p.release, 0.01) / 5
    const envCents = p.envAmount * ENV_RANGE

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = cutoffHz(p.cutoff)
    filter.Q.value = p.resonance
    this.lfoGain.connect(filter.detune)

    const amp = ctx.createGain()

    // Two oscillators a few cents apart drift in and out of phase, which is the slow shimmer
    // of a "fat" synth sound. At zero detune the second would only double the first.
    const tunings = p.detune > 0 ? [-p.detune, p.detune] : [0]
    const oscs = tunings.map((cents) => {
      const osc = ctx.createOscillator()
      osc.type = p.wave
      osc.frequency.value = midiToHz(midi)
      osc.detune.value = cents
      if (tunings.length > 1) {
        const half = ctx.createGain()
        half.gain.value = 0.7
        osc.connect(half)
        half.connect(filter)
      } else {
        osc.connect(filter)
      }
      osc.start(time)
      return osc
    })

    filter.connect(amp)
    amp.connect(this.bus)

    // The same attack-decay-sustain shape drives loudness (amp.gain) and brightness
    // (filter.detune, in cents above the cutoff).
    const shape = (param: AudioParam, peak: number) => {
      param.setValueAtTime(0, time)
      if (duration !== null && duration < attack) {
        // Released before the attack finishes: ramp only as far as it gets
        param.linearRampToValueAtTime((peak * duration) / attack, time + duration)
      } else {
        param.linearRampToValueAtTime(peak, time + attack)
        param.setTargetAtTime(peak * p.sustain, time + attack, decayTc)
      }
      if (duration !== null) param.setTargetAtTime(0, time + duration, releaseTc)
    }
    shape(amp.gain, VOICE_PEAK)
    shape(filter.detune, envCents)

    const voice: Voice = {
      oscs,
      filter,
      amp,
      t0: time,
      attack,
      decayTc,
      sustain: p.sustain,
      envCents,
    }
    if (duration !== null) this.stopAt(voice, time + duration + releaseTc * 7)
    return voice
  }

  private stopAt(voice: Voice, time: number) {
    voice.oscs.forEach((osc) => osc.stop(time))
    voice.oscs[0].onended = () => {
      this.lfoGain.disconnect(voice.filter.detune)
      voice.amp.disconnect()
      this.scheduled = this.scheduled.filter((v) => v !== voice)
    }
  }

  // Where a held note's envelope has got to, as a fraction of its peak
  private envelopeAt(voice: Voice, time: number) {
    const dt = Math.max(0, time - voice.t0)
    if (dt < voice.attack) return dt / voice.attack
    return voice.sustain + (1 - voice.sustain) * Math.exp(-(dt - voice.attack) / voice.decayTc)
  }

  // Release: from wherever the envelope is right now, ease to silence, then stop the oscillators.
  private release(voice: Voice, seconds: number) {
    if (!this.ctx) return
    const now = this.ctx.currentTime
    const level = this.envelopeAt(voice, now)
    const timeConstant = Math.max(seconds, 0.01) / 5

    const fall = (param: AudioParam, peak: number) => {
      // Freeze the envelope at its current value. cancelAndHoldAtTime does exactly that;
      // where it is missing, cancel the schedule and set the value worked out above.
      if (typeof param.cancelAndHoldAtTime === 'function') {
        param.cancelAndHoldAtTime(now)
      } else {
        param.cancelScheduledValues(now)
        param.setValueAtTime(peak * level, now)
      }
      // setTargetAtTime approaches its target exponentially: after 5 time constants it is
      // within 1% of it, which is where the oscillator can stop without a click.
      param.setTargetAtTime(0, now, timeConstant)
    }
    fall(voice.amp.gain, VOICE_PEAK)
    fall(voice.filter.detune, voice.envCents)
    this.stopAt(voice, now + timeConstant * 7)
  }

  noteOn(midi: number) {
    const ctx = this.start()
    // The same note again before its release has finished: let the old one fade quickly
    // rather than stacking two voices on one pitch.
    const old = this.voices.get(midi)
    if (old) this.release(old, 0.03)
    this.voices.set(midi, this.makeVoice(midi, ctx.currentTime, null))
  }

  noteOff(midi: number) {
    const voice = this.voices.get(midi)
    if (!voice) return
    this.voices.delete(midi)
    this.release(voice, this.patch.release)
  }

  allNotesOff() {
    for (const midi of [...this.voices.keys()]) this.noteOff(midi)
  }

  // A note with a known length, starting at an exact time on the audio clock
  private playNote(midi: number, time: number, duration: number) {
    if (this.scheduled.length >= MAX_SCHEDULED) {
      const oldest = this.scheduled.shift()!
      oldest.amp.gain.cancelScheduledValues(time)
      oldest.amp.gain.setTargetAtTime(0, time, 0.02)
      this.stopAt(oldest, time + 0.15)
    }
    this.scheduled.push(this.makeVoice(midi, time, duration))
    this.lights.push({ midi, on: time, off: time + Math.max(duration, 0.06) })
  }

  /** Play one short note now (a step being auditioned) */
  preview(midi: number) {
    const ctx = this.start()
    this.playNote(midi, ctx.currentTime, 0.18)
  }

  // ------------------------------------------------------------------- sequencer, arpeggiator

  // JavaScript timers are too sloppy to play a rhythm: a 25 ms timer can fire 10 or 50 ms
  // late. So the timer never plays anything. It wakes up often, looks a little way ahead on
  // the audio clock, and schedules every step that starts inside that window at its exact time.
  private tick = () => {
    if (!this.ctx) return
    while (this.nextTime < this.ctx.currentTime + LOOKAHEAD) {
      this.scheduleStep(this.nextTime)
      this.nextTime += this.stepSeconds
    }
    if (!this.playing && !this.arpRunning) this.stopClock()
  }

  private get arpRunning() {
    return this.arpOn && this.arpNotes.length > 0
  }

  private scheduleStep(gridTime: number) {
    const step = this.stepSeconds
    // Swing: every second sixteenth arrives late
    const time = gridTime + (this.clockStep % 2 === 1 ? this.transport.swing * step * 0.5 : 0)
    this.clockStep++

    if (this.playing) {
      const index = this.seqStep % STEPS
      const midi = this.pattern[index]
      if (midi !== null) this.playNote(midi, time, step * this.transport.gate)
      this.marks.push({ step: index, time })
      this.seqStep++
    }

    if (this.arpRunning) {
      this.playNote(this.nextArpNote(), time, step * Math.min(this.transport.gate, 0.9))
    }
  }

  private nextArpNote() {
    const notes = this.arpNotes
    const n = notes.length
    const i = this.arpCount++
    switch (this.arpMode) {
      case 'down':
        return notes[n - 1 - (i % n)]
      case 'updown': {
        if (n < 3) return notes[i % n]
        const cycle = 2 * n - 2
        const at = i % cycle
        return notes[at < n ? at : cycle - at]
      }
      case 'random':
        return notes[Math.floor(Math.random() * n)]
      default:
        return notes[i % n]
    }
  }

  private startClock() {
    const ctx = this.start()
    if (this.timer !== null) return
    this.nextTime = ctx.currentTime + 0.02
    this.clockStep = 0
    this.timer = setInterval(this.tick, TICK_MS)
    this.tick()
  }

  private stopClock() {
    if (this.timer !== null) clearInterval(this.timer)
    this.timer = null
  }

  play() {
    this.playing = true
    this.seqStep = 0
    this.marks = []
    // Restart the clock so the pattern starts on its first step, on the beat
    this.stopClock()
    this.arpCount = 0
    this.startClock()
  }

  stop() {
    this.playing = false
    this.marks = []
    if (!this.arpRunning) this.stopClock()
  }

  setPattern(pattern: Pattern) {
    this.pattern = pattern
  }

  setArp(on: boolean, mode: ArpMode) {
    this.arpOn = on
    this.arpMode = mode
    if (this.arpRunning) this.startClock()
  }

  /** The notes the arpeggiator cycles through, low to high */
  setArpNotes(notes: number[]) {
    if (this.arpNotes.length === 0) this.arpCount = 0
    this.arpNotes = [...notes].sort((a, b) => a - b)
    if (this.arpRunning) this.startClock()
  }

  /** The sequencer step sounding right now, or -1 when it is stopped */
  currentStep(): number {
    if (!this.playing || !this.ctx) return -1
    const now = this.ctx.currentTime
    let current = -1
    for (const mark of this.marks) {
      if (mark.time <= now) current = mark.step
      else break
    }
    if (this.marks.length > STEPS * 2) this.marks = this.marks.slice(-STEPS)
    return current
  }

  /** The step a note played right now belongs to: the nearest one, not the last one started */
  nearestStep(): number {
    const current = this.currentStep()
    if (current < 0 || !this.ctx) return -1
    const started = [...this.marks].reverse().find((m) => m.time <= this.ctx!.currentTime)!
    const late = this.ctx.currentTime - started.time > this.stepSeconds / 2
    return late ? (current + 1) % STEPS : current
  }

  /** MIDI numbers of the sequenced and arpeggiated notes sounding right now */
  litNotes(): Set<number> {
    const lit = new Set<number>()
    if (!this.ctx) return lit
    const now = this.ctx.currentTime
    this.lights = this.lights.filter((light) => light.off > now)
    for (const light of this.lights) if (light.on <= now) lit.add(light.midi)
    return lit
  }

  // ------------------------------------------------------------------------------- settings

  // Envelope times are read when a note starts or ends. Everything else is applied to the
  // running graph straight away, so a held note changes as the knob turns.
  setPatch(patch: Patch) {
    this.patch = patch
    if (!this.ctx) return
    const now = this.ctx.currentTime

    this.echo.gain.setTargetAtTime(patch.echo, now, SMOOTH)
    this.reverb.gain.setTargetAtTime(patch.reverb, now, SMOOTH)
    this.master.gain.setTargetAtTime(patch.volume, now, SMOOTH)
    this.lfo.frequency.setTargetAtTime(patch.lfoRate, now, SMOOTH)
    this.lfoGain.gain.setTargetAtTime(patch.lfoDepth * LFO_RANGE, now, SMOOTH)

    for (const voice of [...this.voices.values(), ...this.scheduled]) {
      voice.filter.frequency.setTargetAtTime(cutoffHz(patch.cutoff), now, SMOOTH)
      voice.filter.Q.setTargetAtTime(patch.resonance, now, SMOOTH)
      voice.oscs.forEach((osc, i) => {
        osc.type = patch.wave
        if (voice.oscs.length > 1) {
          osc.detune.setTargetAtTime(i === 0 ? -patch.detune : patch.detune, now, SMOOTH)
        }
      })
    }
  }

  setTransport(transport: Transport) {
    this.transport = transport
    if (!this.ctx) return
    // Glide to the new echo time. A delay line that changes length bends the pitch of what is
    // inside it, which is the tape-echo wobble you hear when the tempo knob turns.
    this.delay.delayTime.setTargetAtTime(this.stepSeconds * 3, this.ctx.currentTime, 0.1)
  }

  dispose() {
    this.stopClock()
    this.voices.clear()
    this.scheduled = []
    this.ctx?.close()
    this.ctx = null
  }
}

// An impulse response made of noise that fades out: the cheapest believable room. Left and
// right get different noise, which is what makes the reverb sound wide.
function roomImpulse(ctx: AudioContext, seconds: number) {
  const length = Math.floor(ctx.sampleRate * seconds)
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate)
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel)
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.4)
    }
  }
  return buffer
}
