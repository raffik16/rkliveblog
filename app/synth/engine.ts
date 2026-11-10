// The sound of /synth: a polyphonic subtractive synth with a step sequencer and an arpeggiator,
// on the Web Audio API, no libraries.
//
//   per note:  osc ─┐
//              osc ─┴─> low-pass filter ─> gain (envelope) ─┬─> bus
//                 ▲         ▲ filter envelope + LFO          └─> expression send ─┐
//                 pitch bend (a finger moving on the pad)                         │
//                                                                                 ▼
//   bus ─┬──────────────────────────────────────────> master ─> limiter ─> soft clip ─> out
//        ├─> delay ⟲ ─> echo gain ───────────────────────┤
//        └─> reverb send ─> convolver ───────────────────┘
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
  /** Filter resonance in dB, 0..18 */
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
  /** 0..1, the knob's position; see masterGain */
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
  /** A held note's own way into the reverb, opened by a finger moving on its pad */
  send: GainNode | null
  /** Cents the pad's finger is bending the note by */
  bend: number
  /** What the send was last asked to be, to tell opening from closing */
  sendLevel: number
  /** What the envelope was given when the note started, to work out where it is at release */
  t0: number
  attack: number
  decayTc: number
  sustain: number
  envCents: number
}

// Loudness of one note at the top of its attack. With the master gain and the limiter's
// make-up gain a single note leaves at roughly half of full scale, loud enough for a phone
// speaker, and the limiter holds chords under full scale (see start).
const VOICE_PEAK = 0.32
const MASTER_MAX = 1.5
// What the limiter hands on is turned down a little, so that a full chord peaks at about the
// point where the soft clipper starts to act and not above it
const OUTPUT_TRIM = 0.85
const MIN_CUTOFF = 60
const MAX_CUTOFF = 12000
const ENV_RANGE = 4800 // cents: the filter envelope opens up to four octaves
const LFO_RANGE = 2400 // cents: the LFO swings up to two octaves each way
const DELAY_FEEDBACK = 0.42
const REVERB_SECONDS = 2.2
// How quickly a turned knob is followed. Long enough not to click, short enough to feel direct.
const SMOOTH = 0.015
// The sequencer looks this far ahead and wakes up this often (see tick)
const LOOKAHEAD = 0.12
const TICK_MS = 25
// Notes the sequencer and arpeggiator may have ringing at once before the oldest is cut short
const MAX_SCHEDULED = 20
// The soft clipper is drawn for inputs up to this many times full scale, and is a straight
// line (it changes nothing) below CLIP_KNEE
const CLIP_RANGE = 4
const CLIP_KNEE = 0.8
// A finger moving on a held pad (see express). How much of the note goes to the reverb at
// full stretch, how fast the pitch follows the finger, and how the send opens and closes: fast
// up, slow down, so the bloom outlasts the wiggle that made it.
const EXPRESSION_SEND = 1
const BEND_SMOOTH = 0.012
const SEND_OPEN = 0.03
const SEND_CLOSE = 0.4
// How long the first tap sounds for when the browser had not let audio start yet (see noteOff)
const FIRST_TAP = 0.18
// One second of silence (see openSession). A file rather than a blob made here, because the
// site's Content-Security-Policy only lets media load from its own address.
const SILENCE_URL = '/static/audio/silence.wav'

export const cutoffHz = (cutoff: number) => MIN_CUTOFF * Math.pow(MAX_CUTOFF / MIN_CUTOFF, cutoff)

export const midiToHz = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12)

// Loudness is heard on a log scale, so the volume knob is squared: half way round sounds
// about half as loud rather than barely quieter.
const masterGain = (volume: number) => volume * volume * MASTER_MAX

type AudioSessionNavigator = Navigator & { audioSession?: { type: string } }

const isIOS = () =>
  /iP(hone|ad|od)/.test(navigator.userAgent) ||
  // An iPad asking for desktop sites calls itself a Mac, but a Mac has no touch screen
  (navigator.maxTouchPoints > 1 && /Mac/.test(navigator.userAgent))

export class SynthEngine {
  private ctx: AudioContext | null = null
  private bus!: GainNode
  private master!: GainNode
  private delay!: DelayNode
  private echo!: GainNode
  private reverb!: GainNode
  private room!: ConvolverNode
  private lfo!: OscillatorNode
  private lfoGain!: GainNode
  private analyserNode!: AnalyserNode
  /** A silent, looping <audio> element: see openSession */
  private silence: HTMLAudioElement | null = null

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

  private get stepSeconds() {
    return 60 / this.transport.tempo / 4
  }

  // ------------------------------------------------------------------------ starting audio

  // On an iPhone or iPad, sound made with Web Audio counts as "ambient", like a game's sound
  // effects, and the silent switch on the side of the phone mutes it. Everything still runs
  // and the scope still moves; nothing comes out. Declaring this page's audio as "playback",
  // like music or video, makes it sound whatever the switch says.
  private openSession() {
    const session = (navigator as AudioSessionNavigator).audioSession
    if (session) {
      try {
        session.type = 'playback'
      } catch {
        // An unknown type on an early implementation: carry on with the default
      }
      return
    }
    // Older versions of iOS have no audioSession. There, an <audio> element that is playing
    // puts the whole page in the playback category, so a loop of silence does the same job.
    if (!isIOS()) return
    const audio = new Audio(SILENCE_URL)
    audio.loop = true
    audio.preload = 'auto'
    audio.setAttribute('playsinline', '')
    // Keep it off AirPlay and out of the lock screen's "now playing" as far as iOS allows
    audio.setAttribute('x-webkit-airplay', 'deny')
    this.silence = audio
  }

  // Browsers only let a page make sound after a click, tap or key press, so the audio graph is
  // built on the first one rather than on page load.
  private start(): AudioContext | null {
    if (this.ctx) {
      // "suspended" before the first allowed gesture, or after sleep(); "interrupted" on iOS
      // after a phone call or a switch to another app
      if (this.ctx.state !== 'running') this.ctx.resume().catch(() => {})
      return this.ctx
    }

    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null

    this.openSession()
    let ctx: AudioContext
    try {
      ctx = new Ctor()
    } catch {
      // No audio device, or the browser has run out of audio contexts: stay silent, keep working
      return null
    }
    const p = this.patch

    this.bus = ctx.createGain()
    this.master = ctx.createGain()
    this.master.gain.value = masterGain(p.volume)

    // Echo: a delay line that feeds itself, timed to three steps (a dotted eighth note) so the
    // repeats fall between the notes of a pattern rather than on top of them
    this.delay = ctx.createDelay(1)
    this.delay.delayTime.value = this.stepSeconds * 3
    const feedback = ctx.createGain()
    feedback.gain.value = DELAY_FEEDBACK
    this.echo = ctx.createGain()
    this.echo.gain.value = p.echo

    // Reverb: convolve the sound with the "sound of a room", here a burst of fading noise.
    // The reverb knob sets how much of everything is sent into the room. A held note can
    // also send itself in directly (see express), whatever the knob says.
    this.room = ctx.createConvolver()
    this.room.buffer = roomImpulse(ctx, REVERB_SECONDS)
    this.reverb = ctx.createGain()
    this.reverb.gain.value = p.reverb

    // One LFO for the whole instrument, so every note's filter moves together
    this.lfo = ctx.createOscillator()
    this.lfo.frequency.value = p.lfoRate
    this.lfoGain = ctx.createGain()
    this.lfoGain.gain.value = p.lfoDepth * LFO_RANGE
    this.lfo.connect(this.lfoGain)
    this.lfo.start()

    // Limiter. One note arrives just under the threshold and passes almost untouched; a chord
    // arrives well over it and is held down. The node adds its own make-up gain (about 5 dB
    // at these settings), which is what brings a single note up to a healthy level.
    const limiter = ctx.createDynamicsCompressor()
    limiter.threshold.value = -9
    limiter.knee.value = 6
    limiter.ratio.value = 10
    limiter.attack.value = 0.003
    limiter.release.value = 0.15

    // A limiter needs a few milliseconds to react, and a resonant filter can throw out a peak
    // faster than that. The last stage bends anything that still gets past it smoothly towards
    // full scale instead of letting the sound card chop it flat.
    const trim = ctx.createGain()
    trim.gain.value = OUTPUT_TRIM / CLIP_RANGE
    const clip = ctx.createWaveShaper()
    clip.curve = softClipCurve()
    clip.oversample = '2x'

    this.analyserNode = ctx.createAnalyser()
    this.analyserNode.fftSize = 2048
    this.analyserNode.smoothingTimeConstant = 0.75

    this.bus.connect(this.master)
    this.bus.connect(this.delay)
    this.delay.connect(feedback)
    feedback.connect(this.delay)
    this.delay.connect(this.echo)
    this.echo.connect(this.master)
    this.bus.connect(this.reverb)
    this.reverb.connect(this.room)
    this.room.connect(this.master)
    this.master.connect(limiter)
    limiter.connect(trim)
    trim.connect(clip)
    clip.connect(this.analyserNode)
    this.analyserNode.connect(ctx.destination)

    this.ctx = ctx
    return ctx
  }

  /**
   * Call from any click, tap or key press. A touch only counts as "the visitor did something"
   * when the finger lifts, so a note started as it lands can find the audio still locked; this
   * is what unlocks it, and what brings it back after the browser has paused it.
   */
  unlock() {
    this.start()
    if (this.silence?.paused) this.silence.play().catch(() => {})
  }

  /** The tab went to the background: stop the audio clock rather than run it unheard */
  sleep() {
    this.stop()
    this.silence?.pause()
    if (this.ctx?.state === 'running') this.ctx.suspend().catch(() => {})
  }

  /** The tab is back. Where the browser wants a gesture first, the next tap does it (unlock) */
  wake() {
    if (this.ctx && this.ctx.state !== 'running') this.ctx.resume().catch(() => {})
  }

  // ---------------------------------------------------------------------------------- voices

  // Build one note. With a duration the whole envelope, release included, is scheduled up
  // front (the sequencer's notes); without one the note holds until release() is called.
  private makeVoice(ctx: AudioContext, midi: number, time: number, duration: number | null): Voice {
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

    // A note held by hand gets its own send into the reverb, closed until a finger moves
    let send: GainNode | null = null
    if (duration === null) {
      send = ctx.createGain()
      send.gain.value = 0
      amp.connect(send)
      send.connect(this.room)
    }

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
      send,
      bend: 0,
      sendLevel: 0,
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
      this.scheduled = this.scheduled.filter((v) => v !== voice)
      try {
        this.lfoGain.disconnect(voice.filter.detune)
        voice.amp.disconnect()
        voice.send?.disconnect()
      } catch {
        // Already disconnected, or the context has been closed
      }
    }
  }

  // Where a held note's envelope has got to, as a fraction of its peak
  private envelopeAt(voice: Voice, time: number) {
    const dt = Math.max(0, time - voice.t0)
    if (dt < voice.attack) return dt / voice.attack
    return voice.sustain + (1 - voice.sustain) * Math.exp(-(dt - voice.attack) / voice.decayTc)
  }

  // Release: from wherever the envelope is at that moment, ease to silence, then stop the
  // oscillators.
  private release(ctx: AudioContext, voice: Voice, seconds: number, time = ctx.currentTime) {
    const level = this.envelopeAt(voice, time)
    const timeConstant = Math.max(seconds, 0.01) / 5

    const fall = (param: AudioParam, peak: number) => {
      // Freeze the envelope at the value it has then. cancelAndHoldAtTime does exactly that;
      // where it is missing, cancel the schedule and set the value worked out above.
      if (typeof param.cancelAndHoldAtTime === 'function') {
        param.cancelAndHoldAtTime(time)
      } else {
        param.cancelScheduledValues(time)
        param.setValueAtTime(peak * level, time)
      }
      // setTargetAtTime approaches its target exponentially: after 5 time constants it is
      // within 1% of it, which is where the oscillator can stop without a click.
      param.setTargetAtTime(0, time, timeConstant)
    }
    fall(voice.amp.gain, VOICE_PEAK)
    fall(voice.filter.detune, voice.envCents)
    this.stopAt(voice, time + timeConstant * 7)
  }

  noteOn(midi: number) {
    const ctx = this.start()
    if (!ctx) return
    // The same note again before its release has finished: let the old one fade quickly
    // rather than stacking two voices on one pitch.
    const old = this.voices.get(midi)
    if (old) this.release(ctx, old, 0.03)
    this.voices.set(midi, this.makeVoice(ctx, midi, ctx.currentTime, null))
  }

  noteOff(midi: number) {
    const voice = this.voices.get(midi)
    if (!voice || !this.ctx) return
    this.voices.delete(midi)

    // The very first tap on a touch screen: the note was built as the finger landed, but the
    // browser only lets audio start when it lifts, so the audio clock has not moved yet.
    // Released now, the note would be over before it began. Give it a short fixed length
    // instead, and it sounds as the clock starts.
    const waiting = this.ctx.state !== 'running' && this.ctx.currentTime < 0.01
    const time = waiting ? this.ctx.currentTime + FIRST_TAP : undefined
    this.release(this.ctx, voice, this.patch.release, time)
  }

  /**
   * A finger moving on a held pad. `bend` is cents of pitch, following the finger sideways;
   * `amount` (0..1) is how far it has strayed from where it landed, and opens that note's own
   * send into the reverb. Only notes held by hand have one.
   */
  express(midi: number, bend: number, amount: number) {
    const voice = this.voices.get(midi)
    if (!voice || !voice.send || !this.ctx) return
    const now = this.ctx.currentTime
    voice.bend = bend
    voice.oscs.forEach((osc, i) =>
      osc.detune.setTargetAtTime(this.tuning(voice, i) + bend, now, BEND_SMOOTH)
    )
    const level = amount * EXPRESSION_SEND
    voice.send.gain.setTargetAtTime(level, now, level > voice.sendLevel ? SEND_OPEN : SEND_CLOSE)
    voice.sendLevel = level
  }

  // Where one of a note's oscillators sits before any bend: the two are spread either side
  private tuning(voice: Voice, index: number) {
    if (voice.oscs.length < 2) return 0
    return index === 0 ? -this.patch.detune : this.patch.detune
  }

  allNotesOff() {
    for (const midi of [...this.voices.keys()]) this.noteOff(midi)
  }

  // A note with a known length, starting at an exact time on the audio clock
  private playNote(ctx: AudioContext, midi: number, time: number, duration: number) {
    if (this.scheduled.length >= MAX_SCHEDULED) {
      const oldest = this.scheduled.shift()!
      oldest.amp.gain.cancelScheduledValues(time)
      oldest.amp.gain.setTargetAtTime(0, time, 0.02)
      this.stopAt(oldest, time + 0.15)
    }
    this.scheduled.push(this.makeVoice(ctx, midi, time, duration))
    this.lights.push({ midi, on: time, off: time + Math.max(duration, 0.06) })
  }

  /** Play one short note now (a step being auditioned) */
  preview(midi: number) {
    const ctx = this.start()
    if (ctx) this.playNote(ctx, midi, ctx.currentTime, 0.18)
  }

  // ------------------------------------------------------------------- sequencer, arpeggiator

  // JavaScript timers are too sloppy to play a rhythm: a 25 ms timer can fire 10 or 50 ms
  // late. So the timer never plays anything. It wakes up often, looks a little way ahead on
  // the audio clock, and schedules every step that starts inside that window at its exact time.
  private tick = () => {
    const ctx = this.ctx
    if (!ctx) return
    // After a stall (a throttled timer, a suspended clock) carry on from now rather than
    // firing every step that was missed in one burst
    if (this.nextTime < ctx.currentTime - 0.2) this.nextTime = ctx.currentTime + 0.02
    while (this.nextTime < ctx.currentTime + LOOKAHEAD) {
      this.scheduleStep(ctx, this.nextTime)
      this.nextTime += this.stepSeconds
    }
    if (!this.playing && !this.arpRunning) this.stopClock()
  }

  private get arpRunning() {
    return this.arpOn && this.arpNotes.length > 0
  }

  private scheduleStep(ctx: AudioContext, gridTime: number) {
    const step = this.stepSeconds
    // Swing: every second sixteenth arrives late
    const time = gridTime + (this.clockStep % 2 === 1 ? this.transport.swing * step * 0.5 : 0)
    this.clockStep++

    if (this.playing) {
      const index = this.seqStep % STEPS
      const midi = this.pattern[index]
      if (midi !== null) this.playNote(ctx, midi, time, step * this.transport.gate)
      this.marks.push({ step: index, time })
      if (this.marks.length > STEPS * 2) this.marks = this.marks.slice(-STEPS)
      this.seqStep++
    }

    if (this.arpRunning) {
      this.playNote(ctx, this.nextArpNote(), time, step * Math.min(this.transport.gate, 0.9))
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
    if (!ctx || this.timer !== null) return
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
    return current
  }

  /** The step a note played right now belongs to: the nearest one, not the last one started */
  nearestStep(): number {
    if (!this.playing || !this.ctx) return -1
    const now = this.ctx.currentTime
    let started: { step: number; time: number } | null = null
    for (const mark of this.marks) {
      if (mark.time <= now) started = mark
      else break
    }
    if (!started) return -1
    const late = now - started.time > this.stepSeconds / 2
    return late ? (started.step + 1) % STEPS : started.step
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
  // running graph straight away, so a held note changes as the knob turns. Only what changed
  // is touched: a knob being dragged calls this sixty times a second.
  setPatch(patch: Patch) {
    const old = this.patch
    this.patch = patch
    if (!this.ctx) return
    const now = this.ctx.currentTime
    const glide = (param: AudioParam, value: number) => param.setTargetAtTime(value, now, SMOOTH)

    if (patch.echo !== old.echo) glide(this.echo.gain, patch.echo)
    if (patch.reverb !== old.reverb) glide(this.reverb.gain, patch.reverb)
    if (patch.volume !== old.volume) glide(this.master.gain, masterGain(patch.volume))
    if (patch.lfoRate !== old.lfoRate) glide(this.lfo.frequency, patch.lfoRate)
    if (patch.lfoDepth !== old.lfoDepth) glide(this.lfoGain.gain, patch.lfoDepth * LFO_RANGE)

    const cutoff = patch.cutoff !== old.cutoff
    const resonance = patch.resonance !== old.resonance
    const wave = patch.wave !== old.wave
    const detune = patch.detune !== old.detune
    if (!cutoff && !resonance && !wave && !detune) return

    for (const voice of [...this.voices.values(), ...this.scheduled]) {
      if (cutoff) glide(voice.filter.frequency, cutoffHz(patch.cutoff))
      if (resonance) glide(voice.filter.Q, patch.resonance)
      voice.oscs.forEach((osc, i) => {
        if (wave) osc.type = patch.wave
        if (detune && voice.oscs.length > 1) glide(osc.detune, this.tuning(voice, i) + voice.bend)
      })
    }
  }

  setTransport(transport: Transport) {
    const tempo = transport.tempo !== this.transport.tempo
    this.transport = transport
    if (!this.ctx || !tempo) return
    // Glide to the new echo time. A delay line that changes length bends the pitch of what is
    // inside it, which is the tape-echo wobble you hear when the tempo knob turns.
    this.delay.delayTime.setTargetAtTime(this.stepSeconds * 3, this.ctx.currentTime, 0.1)
  }

  dispose() {
    this.stopClock()
    this.voices.clear()
    this.scheduled = []
    this.lights = []
    this.silence?.pause()
    this.silence = null
    this.ctx?.close().catch(() => {})
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

// The curve a WaveShaperNode maps its input through, here over -CLIP_RANGE..CLIP_RANGE.
// Below the knee the output is the input; above it the output bends over and creeps towards
// full scale without ever reaching it.
function softClipCurve() {
  const points = 4097
  const curve = new Float32Array(points)
  const room = 1 - CLIP_KNEE
  for (let i = 0; i < points; i++) {
    const x = ((i / (points - 1)) * 2 - 1) * CLIP_RANGE
    const size = Math.abs(x)
    const bent = size <= CLIP_KNEE ? size : CLIP_KNEE + room * Math.tanh((size - CLIP_KNEE) / room)
    curve[i] = Math.sign(x) * bent
  }
  return curve
}
