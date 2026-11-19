// The chord the speaker plays into the plate, on the Web Audio API.
//
//   root  ─┐
//   upper ─┴─> tone (low-pass) ─┬─> dry ──────────────┬─> master ─> limiter ─> out
//                               └─> wet ─> room ──────┘
//
// Each note is a fundamental with a soft row of harmonics above it. The harmonics matter: they
// are what make a mistuned interval beat. In a pure fifth, the root's third harmonic and the
// upper note's second land on the same pitch; tune the fifth like a piano and they miss by
// 0.74 Hz, and the chord swells and fades 0.74 times a second.

const SILENCE_URL = '/static/audio/silence.wav'

/** Harmonic amplitudes, fundamental first */
const HARMONICS = [1, 0.5, 0.34, 0.22, 0.15, 0.1, 0.065, 0.04]
const VOICE_GAIN = 0.3
const MAX_LEVEL = 0.6
const GLIDE = 0.08
const FADE = 0.35
const ROOM_SECONDS = 3.4

type AudioSessionNavigator = Navigator & { audioSession?: { type: string } }

const isIOS = () =>
  /iP(hone|ad|od)/.test(navigator.userAgent) ||
  (navigator.maxTouchPoints > 1 && /Mac/.test(navigator.userAgent))

/** A room to play in: a burst of noise that dies away over a few seconds, slightly different per ear */
function roomImpulse(ctx: AudioContext, seconds: number) {
  const length = Math.floor(ctx.sampleRate * seconds)
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch)
    for (let i = 0; i < length; i++) {
      const t = i / length
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 3.2) * (t < 0.004 ? t / 0.004 : 1)
    }
  }
  return buffer
}

export class ChordAudio {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private oscs: OscillatorNode[] = []
  private silence: HTMLAudioElement | null = null
  private on = false
  private drive = 0.6
  private hz: [number, number] = [220, 330]

  get enabled() {
    return this.on
  }

  /** Declare the page as playing media, so an iPhone's silent switch doesn't mute it */
  private openSession() {
    const session = (navigator as AudioSessionNavigator).audioSession
    if (session) {
      try {
        session.type = 'playback'
      } catch {
        // An early implementation that doesn't know the type: keep the default
      }
      return
    }
    if (!isIOS()) return
    const audio = new Audio(SILENCE_URL)
    audio.loop = true
    audio.preload = 'auto'
    audio.setAttribute('playsinline', '')
    audio.setAttribute('x-webkit-airplay', 'deny')
    this.silence = audio
  }

  private start(): AudioContext | null {
    if (this.ctx) {
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
      return null
    }

    const real = new Float32Array(HARMONICS.length + 1)
    const imag = new Float32Array(HARMONICS.length + 1)
    HARMONICS.forEach((a, i) => (imag[i + 1] = a))
    const wave = ctx.createPeriodicWave(real, imag)

    const bus = ctx.createGain()
    const tone = ctx.createBiquadFilter()
    tone.type = 'lowpass'
    tone.frequency.value = 2800
    tone.Q.value = 0.5
    const dry = ctx.createGain()
    dry.gain.value = 0.78
    const wet = ctx.createGain()
    wet.gain.value = 0.34
    const room = ctx.createConvolver()
    room.buffer = roomImpulse(ctx, ROOM_SECONDS)
    const master = ctx.createGain()
    master.gain.value = 0
    const limiter = ctx.createDynamicsCompressor()
    limiter.threshold.value = -10
    limiter.knee.value = 6
    limiter.ratio.value = 10
    limiter.attack.value = 0.004
    limiter.release.value = 0.2

    bus.connect(tone)
    tone.connect(dry)
    tone.connect(wet)
    wet.connect(room)
    dry.connect(master)
    room.connect(master)
    master.connect(limiter)
    limiter.connect(ctx.destination)

    // Root a touch to the left, upper note a touch to the right: still close enough together
    // for their harmonics to meet in the air and beat
    this.oscs = this.hz.map((hz, i) => {
      const osc = ctx.createOscillator()
      osc.setPeriodicWave(wave)
      osc.frequency.value = hz
      const gain = ctx.createGain()
      gain.gain.value = VOICE_GAIN
      const pan = ctx.createStereoPanner()
      pan.pan.value = i === 0 ? -0.14 : 0.14
      osc.connect(gain)
      gain.connect(pan)
      pan.connect(bus)
      osc.start()
      return osc
    })

    this.ctx = ctx
    this.master = master
    return ctx
  }

  /** Call from any click, tap or key press: browsers only allow sound after one */
  unlock() {
    if (!this.on) return
    this.start()
    if (this.silence?.paused) this.silence.play().catch(() => {})
  }

  private level() {
    // A plate driven gently still sings, quietly; the square root keeps the low end audible
    return this.on ? MAX_LEVEL * Math.sqrt(Math.max(0, Math.min(1, this.drive))) : 0
  }

  private apply() {
    const ctx = this.ctx
    if (!ctx || !this.master) return
    const now = ctx.currentTime
    this.master.gain.setTargetAtTime(this.level(), now, FADE)
    this.oscs.forEach((osc, i) => osc.frequency.setTargetAtTime(this.hz[i], now, GLIDE))
  }

  setOn(on: boolean) {
    this.on = on
    if (on) {
      this.start()
      if (this.silence?.paused) this.silence.play().catch(() => {})
    } else {
      this.silence?.pause()
    }
    this.apply()
  }

  setChord(root: number, upper: number) {
    this.hz = [root, upper]
    this.apply()
  }

  setDrive(drive: number) {
    this.drive = drive
    this.apply()
  }

  /** The tab went to the background */
  sleep() {
    this.silence?.pause()
    if (this.ctx?.state === 'running') this.ctx.suspend().catch(() => {})
  }

  /** Back again: where the browser wants a gesture first, the next tap does it (unlock) */
  wake() {
    if (this.on && this.ctx && this.ctx.state !== 'running') this.ctx.resume().catch(() => {})
  }

  dispose() {
    this.silence?.pause()
    this.silence = null
    this.oscs.forEach((osc) => {
      try {
        osc.stop()
      } catch {
        // already stopped
      }
    })
    this.oscs = []
    this.ctx?.close().catch(() => {})
    this.ctx = null
    this.master = null
  }
}
