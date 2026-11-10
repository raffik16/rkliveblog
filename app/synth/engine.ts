// The sound of /synth: a polyphonic subtractive synth on the Web Audio API, no libraries.
//
//   one oscillator + one gain (the envelope) per held note
//        └─> low-pass filter ─┬─────────────> master gain ─> limiter ─> analyser ─> speakers
//                             └─> delay ⟲ ─> echo gain ─┘
//
// The filter is shared by every note. Its settings don't change per note, and a filter is
// linear, so filtering the sum of the notes sounds the same as filtering each one and costs
// one node instead of one per voice.

export type Wave = 'sine' | 'triangle' | 'sawtooth' | 'square'

export interface Patch {
  wave: Wave
  /** 0..1, mapped onto 60 Hz..12 kHz on a log scale (see cutoffHz) */
  cutoff: number
  /** Filter Q, 0.1..18 */
  resonance: number
  /** Seconds */
  attack: number
  /** Seconds */
  decay: number
  /** 0..1, the level a held note settles at */
  sustain: number
  /** Seconds */
  release: number
  /** 0..1, how much of the delay line is mixed back in */
  echo: number
  /** 0..1 */
  volume: number
}

interface Voice {
  osc: OscillatorNode
  amp: GainNode
}

// Loudness of one note at the top of its attack. Six notes at once still sit under 1.0 after
// the filter, and the limiter catches what resonance adds on top.
const VOICE_PEAK = 0.22
const MIN_CUTOFF = 60
const MAX_CUTOFF = 12000
const DELAY_TIME = 0.3
const DELAY_FEEDBACK = 0.38
// How quickly a moved slider is followed. Long enough not to click, short enough to feel direct.
const SMOOTH = 0.015

export const cutoffHz = (cutoff: number) => MIN_CUTOFF * Math.pow(MAX_CUTOFF / MIN_CUTOFF, cutoff)

export const midiToHz = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12)

export class SynthEngine {
  private ctx: AudioContext | null = null
  private filter!: BiquadFilterNode
  private master!: GainNode
  private echo!: GainNode
  private analyserNode!: AnalyserNode
  private voices = new Map<number, Voice>()
  private patch: Patch

  constructor(patch: Patch) {
    this.patch = patch
  }

  get analyser(): AnalyserNode | null {
    return this.ctx ? this.analyserNode : null
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

    this.filter = ctx.createBiquadFilter()
    this.filter.type = 'lowpass'
    this.filter.frequency.value = cutoffHz(p.cutoff)
    this.filter.Q.value = p.resonance

    this.master = ctx.createGain()
    this.master.gain.value = p.volume

    const delay = ctx.createDelay(1)
    delay.delayTime.value = DELAY_TIME
    const feedback = ctx.createGain()
    feedback.gain.value = DELAY_FEEDBACK
    this.echo = ctx.createGain()
    this.echo.gain.value = p.echo

    const limiter = ctx.createDynamicsCompressor()
    limiter.threshold.value = -10
    limiter.knee.value = 6
    limiter.ratio.value = 12
    limiter.attack.value = 0.003
    limiter.release.value = 0.2

    this.analyserNode = ctx.createAnalyser()
    this.analyserNode.fftSize = 2048

    this.filter.connect(this.master)
    this.filter.connect(delay)
    delay.connect(feedback)
    feedback.connect(delay)
    delay.connect(this.echo)
    this.echo.connect(this.master)
    this.master.connect(limiter)
    limiter.connect(this.analyserNode)
    this.analyserNode.connect(ctx.destination)

    this.ctx = ctx
    return ctx
  }

  noteOn(midi: number) {
    const ctx = this.start()
    const now = ctx.currentTime
    const p = this.patch

    // The same note again before its release has finished: let the old one fade quickly
    // rather than stacking two oscillators on one pitch.
    const old = this.voices.get(midi)
    if (old) this.fade(old, 0.03)

    const osc = ctx.createOscillator()
    osc.type = p.wave
    osc.frequency.value = midiToHz(midi)

    const amp = ctx.createGain()
    amp.gain.setValueAtTime(0, now)
    // Attack: a straight ramp up to the peak
    amp.gain.linearRampToValueAtTime(VOICE_PEAK, now + p.attack)
    // Decay: ease down to the sustain level and stay there for as long as the key is held
    amp.gain.setTargetAtTime(VOICE_PEAK * p.sustain, now + p.attack, Math.max(p.decay, 0.01) / 3)

    osc.connect(amp)
    amp.connect(this.filter)
    osc.start(now)

    this.voices.set(midi, { osc, amp })
  }

  noteOff(midi: number) {
    const voice = this.voices.get(midi)
    if (!voice) return
    this.voices.delete(midi)
    this.fade(voice, this.patch.release)
  }

  allNotesOff() {
    for (const midi of [...this.voices.keys()]) this.noteOff(midi)
  }

  // Release: from wherever the envelope is right now, ease to silence, then stop the oscillator.
  private fade(voice: Voice, seconds: number) {
    if (!this.ctx) return
    const now = this.ctx.currentTime
    const gain = voice.amp.gain

    // Freeze the envelope at its current value. cancelAndHoldAtTime does exactly that; where
    // it is missing, cancel and re-set the value the param reports.
    if (typeof gain.cancelAndHoldAtTime === 'function') {
      gain.cancelAndHoldAtTime(now)
    } else {
      const current = gain.value
      gain.cancelScheduledValues(now)
      gain.setValueAtTime(current, now)
    }

    // setTargetAtTime approaches its target exponentially: after 5 time constants it is within
    // 1% of it, which is where the oscillator can stop without a click.
    const timeConstant = Math.max(seconds, 0.01) / 5
    gain.setTargetAtTime(0, now, timeConstant)
    voice.osc.stop(now + timeConstant * 7)
    voice.osc.onended = () => {
      voice.osc.disconnect()
      voice.amp.disconnect()
    }
  }

  // Envelope times are read when a note starts or ends. Everything else is applied to the
  // running graph straight away, so a held note changes as the slider moves.
  setPatch(patch: Patch) {
    this.patch = patch
    if (!this.ctx) return
    const now = this.ctx.currentTime

    this.filter.frequency.setTargetAtTime(cutoffHz(patch.cutoff), now, SMOOTH)
    this.filter.Q.setTargetAtTime(patch.resonance, now, SMOOTH)
    this.echo.gain.setTargetAtTime(patch.echo, now, SMOOTH)
    this.master.gain.setTargetAtTime(patch.volume, now, SMOOTH)
    for (const { osc } of this.voices.values()) osc.type = patch.wave
  }

  dispose() {
    this.voices.clear()
    this.ctx?.close()
    this.ctx = null
  }
}
