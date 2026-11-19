// The sound of a dream, all made in Web Audio with no recordings: a pad that changes chord with
// each part of your life, a little song that keeps coming back in different voices, and the
// world around you (a heartbeat, birds, crickets, rain, the sea, wind, a city) made out of
// filtered noise and a few oscillators.
//
// Two buses: the dream, which can be muffled and drenched in reverb, and the room you are
// really in, where the kettle is. The kettle's whistle is in the room, so it comes through the
// dream from outside it, which is how it wakes you.

export type Voice = 'box' | 'bell' | 'synth' | 'warm' | 'low'

export interface Music {
  /** MIDI notes, four to a chord */
  chords: number[][]
  /** dream seconds per chord */
  chordSec: number
  /** pad volume and brightness, 0..1 */
  pad: number
  tone: number
  /** what plays the scattered notes over the pad, and how many a second */
  voice: Voice
  sparkle: number
  /** how much of those notes goes into the echo */
  echo: number
  /** a clock ticking, beats a second */
  tick?: number
}

const AMBIENCE = ['heart', 'birds', 'crickets', 'rain', 'sea', 'wind', 'city'] as const
type AmbienceName = (typeof AMBIENCE)[number]
export type Ambience = Partial<Record<AmbienceName, number>>

// Each layer at full strength
const AMBIENCE_GAIN: Record<AmbienceName, number> = {
  heart: 0.55,
  birds: 1,
  crickets: 0.02,
  rain: 0.11,
  sea: 0.16,
  wind: 0.09,
  city: 0.07,
}

// The song you keep for the rest of your life: two phrases in D major, [MIDI note, beats]
const SONG: [number, number][] = [
  [69, 1],
  [74, 1],
  [76, 1],
  [78, 2],
  [76, 1],
  [74, 1],
  [71, 1],
  [69, 2],
  [78, 1],
  [81, 1],
  [78, 1],
  [76, 1],
  [74, 1],
  [76, 1],
  [74, 3],
]

type Partial3 = [ratio: number, amp: number, decay: number, wave?: OscillatorType]

const VOICES: Record<
  Voice,
  {
    gain: number
    attack: number
    decay: number
    partials: Partial3[]
    vibrato?: number
    up: number
  }
> = {
  // a music box: bright, quick, a metallic overtone
  box: {
    gain: 0.085,
    attack: 0.002,
    decay: 1.6,
    partials: [
      [1, 1, 1],
      [2, 0.32, 0.45],
      [5.04, 0.1, 0.18],
    ],
    up: 24,
  },
  // a bell: long, with the out-of-tune partials that make a bell a bell
  bell: {
    gain: 0.075,
    attack: 0.003,
    decay: 3.2,
    partials: [
      [1, 1, 1],
      [2.76, 0.32, 0.5],
      [5.4, 0.12, 0.25],
      [8.93, 0.05, 0.12],
    ],
    up: 12,
  },
  // a cheap synth through an echo, for being seventeen
  synth: {
    gain: 0.055,
    attack: 0.012,
    decay: 1.1,
    partials: [
      [1, 1, 1, 'triangle'],
      [2, 0.18, 0.5],
    ],
    up: 12,
  },
  // someone humming
  warm: {
    gain: 0.07,
    attack: 0.16,
    decay: 2.4,
    partials: [
      [1, 1, 1],
      [2, 0.22, 0.7],
      [3, 0.06, 0.5],
    ],
    vibrato: 0.004,
    up: 12,
  },
  // the same tune, older and slower
  low: {
    gain: 0.08,
    attack: 0.25,
    decay: 3.4,
    partials: [
      [1, 1, 1],
      [2, 0.18, 0.6],
    ],
    vibrato: 0.003,
    up: 0,
  },
}

const SILENCE_URL = '/static/audio/silence.wav'

type AudioSessionNavigator = Navigator & { audioSession?: { type: string } }

const isIOS = () =>
  /iP(hone|ad|od)/.test(navigator.userAgent) ||
  (navigator.maxTouchPoints > 1 && /Mac/.test(navigator.userAgent))

const mtof = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12)

export interface SoundState {
  /** dream time and time into the current chapter, in dream seconds */
  t: number
  local: number
  rate: number
  hold: number
  dreaming: boolean
  /** 0..1 through waking up */
  waking: number
  /** 0..1, the kettle's whistle */
  whistle: number
  /** 0..1 as the dream first comes up out of the dark (it starts muffled) */
  emerge: number
  /** 0..1, how much of the real room you can still hear as you drift off */
  room: number
}

export class DreamSound {
  private ctx: AudioContext | null = null
  private silence: HTMLAudioElement | null = null
  private out!: GainNode
  private dreamIn!: GainNode
  private muffle!: BiquadFilterNode
  private dreamOut!: GainNode
  private verbSend!: GainNode
  private echoSend!: GainNode
  private notes!: GainNode
  private room!: GainNode
  private noise!: AudioBuffer
  private padOsc: OscillatorNode[] = []
  private padFilter!: BiquadFilterNode
  private padGain!: GainNode
  private amb = {} as Record<AmbienceName, GainNode>
  private seaSwell!: GainNode
  private seaFilter!: BiquadFilterNode
  private windFilter!: BiquadFilterNode
  private cricketPulse: GainNode[] = []
  private roomTone!: GainNode
  private rumble!: GainNode
  private breath!: GainNode
  private breathFilter!: BiquadFilterNode
  private whistleGain!: GainNode
  private whistleOsc: OscillatorNode[] = []
  private whistleHiss!: BiquadFilterNode
  private analyser: AnalyserNode | null = null
  private sampleBuffer: Float32Array<ArrayBuffer> | null = null

  private music: Music | null = null
  private ambience: Ambience = {}
  private chord: number[] = [50, 57, 62, 66]
  private chordIndex = -1
  private nextSparkle = 0
  private nextBird = 0
  private nextCricket = [0, 0.4]
  private nextBeat = 0
  private nextTick = 0
  private lastSlow = 0
  private kettleOn = false

  get running() {
    return !!this.ctx && this.ctx.state === 'running'
  }

  // ------------------------------------------------------------------------ starting audio

  /** Call from the click, tap or key press that starts the dream: browsers only let a page
   *  make sound after one, and on a phone it has to be made inside that event. */
  unlock() {
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Ctor) return
      this.openSession()
      try {
        this.ctx = new Ctor()
      } catch {
        return
      }
      this.build(this.ctx)
    }
    if (this.ctx.state !== 'running') this.ctx.resume().catch(() => {})
    if (this.silence?.paused) this.silence.play().catch(() => {})
  }

  // An iPhone treats Web Audio like a game's sound effects, which the silent switch mutes.
  // Declaring the page's audio as playback, like music, makes it heard (as Pocket Synth does).
  private openSession() {
    const session = (navigator as AudioSessionNavigator).audioSession
    if (session) {
      try {
        session.type = 'playback'
      } catch {
        // an early implementation that doesn't know the type: keep the default
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

  private build(ctx: AudioContext) {
    const gain = (value: number, to?: AudioNode) => {
      const node = ctx.createGain()
      node.gain.value = value
      if (to) node.connect(to)
      return node
    }
    const filter = (type: BiquadFilterType, frequency: number, q: number, to?: AudioNode) => {
      const node = ctx.createBiquadFilter()
      node.type = type
      node.frequency.value = frequency
      node.Q.value = q
      if (to) node.connect(to)
      return node
    }

    // white noise, four seconds of it, different in each ear
    this.noise = ctx.createBuffer(2, ctx.sampleRate * 4, ctx.sampleRate)
    for (let c = 0; c < 2; c++) {
      const data = this.noise.getChannelData(c)
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
    }
    const loop = (to: AudioNode) => {
      const source = ctx.createBufferSource()
      source.buffer = this.noise
      source.loop = true
      source.connect(to)
      source.start(0, Math.random() * 3.5)
      return source
    }

    // master: a gentle compressor keeps the loud moments and the quiet ones in the same room
    const compressor = ctx.createDynamicsCompressor()
    compressor.threshold.value = -16
    compressor.knee.value = 10
    compressor.ratio.value = 3.5
    compressor.attack.value = 0.01
    compressor.release.value = 0.3
    this.analyser = ctx.createAnalyser()
    this.analyser.fftSize = 2048
    this.out = gain(0.85, compressor)
    compressor.connect(this.analyser)
    this.analyser.connect(ctx.destination)

    // the dream bus: everything dreamt goes through a lowpass that can close (muffled, far
    // away) or open, and a long reverb
    this.dreamOut = gain(0, this.out)
    this.muffle = filter('lowpass', 400, 0.5, this.dreamOut)
    this.dreamIn = gain(1, this.muffle)
    const verb = ctx.createConvolver()
    verb.buffer = impulse(ctx, 4.2, 3)
    verb.connect(gain(0.55, this.muffle))
    this.verbSend = gain(0.32, verb)
    this.dreamIn.connect(this.verbSend)

    // notes, with an echo of their own
    this.notes = gain(1, this.dreamIn)
    const delay = ctx.createDelay(1.5)
    delay.delayTime.value = 0.42
    const echoTone = filter('lowpass', 2600, 0.5)
    delay.connect(echoTone)
    echoTone.connect(gain(0.38, delay))
    echoTone.connect(gain(0.8, this.dreamIn))
    this.echoSend = gain(0.25, delay)
    this.notes.connect(this.echoSend)

    // the pad: four voices of two slightly detuned saws, through a slowly breathing filter
    this.padGain = gain(0, this.dreamIn)
    this.padFilter = filter('lowpass', 900, 0.6, this.padGain)
    const wobble = ctx.createOscillator()
    wobble.frequency.value = 0.07
    const wobbleDepth = gain(180)
    wobbleDepth.connect(this.padFilter.frequency)
    wobble.connect(wobbleDepth)
    wobble.start()
    for (let v = 0; v < 4; v++) {
      for (const cents of [-6, 7]) {
        const osc = ctx.createOscillator()
        osc.type = 'sawtooth'
        osc.frequency.value = mtof(this.chord[v])
        osc.detune.value = cents
        osc.connect(gain(0.024, this.padFilter))
        osc.start()
        this.padOsc.push(osc)
      }
    }

    // the world around you
    for (const name of AMBIENCE) this.amb[name] = gain(0, this.dreamIn)
    {
      const high = filter('highpass', 1200, 0.5)
      high.connect(filter('lowpass', 7000, 0.4, this.amb.rain))
      loop(high)
    }
    loop(filter('lowpass', 170, 0.7, this.amb.city))
    this.seaSwell = gain(0.5, this.amb.sea)
    this.seaFilter = filter('lowpass', 700, 0.3, this.seaSwell)
    loop(this.seaFilter)
    this.windFilter = filter('bandpass', 450, 1.4, this.amb.wind)
    loop(this.windFilter)
    // crickets: two high tones switched on and off in quick pulses (see chirpCrickets)
    ;[4400, 4720].forEach((frequency, i) => {
      const osc = ctx.createOscillator()
      osc.frequency.value = frequency
      const pulse = gain(0)
      const pan = ctx.createStereoPanner()
      pan.pan.value = i ? 0.6 : -0.5
      osc.connect(pulse)
      pulse.connect(pan)
      pan.connect(this.amb.crickets)
      osc.start()
      this.cricketPulse.push(pulse)
    })

    // the room you are really in
    this.room = gain(1, this.out)
    this.roomTone = gain(0, this.room)
    loop(filter('lowpass', 300, 0.5, this.roomTone))
    this.rumble = gain(0, this.room)
    {
      const low = filter('lowpass', 220, 0.8, this.rumble)
      const high = filter('highpass', 45, 0.5, low)
      loop(high)
    }
    this.breath = gain(0, this.room)
    this.breathFilter = filter('bandpass', 700, 0.6, this.breath)
    loop(this.breathFilter)

    // the kettle's whistle: two close sine tones with a wobble, and a breathy edge
    this.whistleGain = gain(0, this.room)
    const vibrato = ctx.createOscillator()
    vibrato.frequency.value = 5.2
    const vibratoDepth = gain(9)
    vibrato.connect(vibratoDepth)
    vibrato.start()
    for (const ratio of [1, 1.004]) {
      const osc = ctx.createOscillator()
      osc.frequency.value = 900 * ratio
      vibratoDepth.connect(osc.frequency)
      osc.connect(gain(0.5, this.whistleGain))
      osc.start()
      this.whistleOsc.push(osc)
    }
    this.whistleHiss = filter('bandpass', 900, 14)
    this.whistleHiss.connect(gain(0.6, this.whistleGain))
    loop(this.whistleHiss)
  }

  // --------------------------------------------------------------------------------- the story

  /** The kettle goes on: a click, the room, a rumble that grows as it heats */
  begin() {
    const ctx = this.ctx
    if (!ctx) return
    const now = ctx.currentTime
    this.chordIndex = -1
    this.nextSparkle = 0
    this.nextBird = 0
    this.nextCricket = [0, 0.4]
    this.nextBeat = 0
    this.nextTick = 0
    this.music = null
    this.ambience = {}
    for (const name of AMBIENCE) this.amb[name].gain.setTargetAtTime(0, now, 0.05)
    this.padGain.gain.setTargetAtTime(0, now, 0.05)
    this.dreamOut.gain.setTargetAtTime(0, now, 0.05)
    this.muffle.frequency.setTargetAtTime(400, now, 0.05)
    this.whistleGain.gain.setTargetAtTime(0, now, 0.05)
    this.click(now + 0.05, 0.22)
    this.kettleOn = true
  }

  /** One slow breath, in and out, starting `delay` seconds from now */
  breathe(delay: number, length = 6) {
    const ctx = this.ctx
    if (!ctx) return
    const t0 = ctx.currentTime + delay
    const g = this.breath.gain
    g.setValueAtTime(0, t0)
    g.linearRampToValueAtTime(0.05, t0 + length * 0.4)
    g.linearRampToValueAtTime(0, t0 + length)
    const f = this.breathFilter.frequency
    f.setValueAtTime(550, t0)
    f.linearRampToValueAtTime(950, t0 + length * 0.4)
    f.linearRampToValueAtTime(480, t0 + length)
  }

  /** Asleep: the dream fades in (the room fades out as SoundState.room falls) */
  fallAsleep() {
    const ctx = this.ctx
    if (!ctx) return
    const now = ctx.currentTime
    this.dreamOut.gain.setTargetAtTime(1, now, 2)
    this.muffle.frequency.setTargetAtTime(9000, now + 1, 2.5)
  }

  /** The chapter's music and the world around it. Everything crossfades. */
  scene(music: Music, ambience: Ambience) {
    const ctx = this.ctx
    this.music = music
    this.ambience = ambience
    this.chordIndex = -1
    if (!ctx) return
    const now = ctx.currentTime
    for (const name of AMBIENCE) {
      this.amb[name].gain.setTargetAtTime((ambience[name] || 0) * AMBIENCE_GAIN[name], now, 1.6)
    }
    this.padGain.gain.setTargetAtTime(music.pad, now, 2)
    this.padFilter.frequency.setTargetAtTime(350 + music.tone * 1800, now, 2)
    this.echoSend.gain.setTargetAtTime(music.echo, now, 1)
  }

  /** The song, from the start, in this voice and tempo */
  song(voice: Voice, bpm: number, transpose = 0) {
    const ctx = this.ctx
    if (!ctx) return
    let at = ctx.currentTime + 0.12
    const beat = 60 / bpm
    for (const [midi, beats] of SONG) {
      this.note(voice, midi + transpose, at, 0.95, 0, beats * beat)
      at += beats * beat
    }
  }

  /** Something happened: a chime that fits whatever chord is playing */
  chime(kind: 'catch' | 'meet' | 'born' | 'star') {
    const ctx = this.ctx
    if (!ctx) return
    const now = ctx.currentTime + 0.02
    const pick = () => this.chord[1 + Math.floor(Math.random() * 3)]
    if (kind === 'catch') {
      this.note('bell', pick() + 24, now, 0.55, (Math.random() - 0.5) * 0.8)
    } else if (kind === 'meet') {
      this.note('bell', this.chord[1] + 12, now, 0.8, -0.2)
      this.note('bell', this.chord[2] + 12, now + 0.09, 0.7, 0.2)
      for (const midi of this.chord) this.note('warm', midi + 12, now + 0.05, 0.45, 0)
    } else if (kind === 'born') {
      const tones = [...this.chord].sort((a, b) => a - b)
      tones.forEach((midi, i) => this.note('box', midi + 24, now + i * 0.09, 0.6, -0.3 + i * 0.2))
    } else {
      this.note('bell', pick() + 36, now, 0.4, -0.4)
    }
  }

  /** Waking up: the dream drops away, the whistle stops with a click, the room is just a room */
  wake() {
    const ctx = this.ctx
    if (!ctx) return
    const now = ctx.currentTime
    this.dreamOut.gain.setTargetAtTime(0, now, 0.06)
    this.whistleGain.gain.cancelScheduledValues(now)
    this.whistleGain.gain.setTargetAtTime(0, now + 0.35, 0.015)
    this.click(now + 0.36, 0.3)
    this.rumble.gain.setTargetAtTime(0, now + 0.36, 0.08)
    this.roomTone.gain.setTargetAtTime(0.03, now + 0.36, 0.05)
    this.roomTone.gain.setTargetAtTime(0, now + 2.6, 1)
    this.kettleOn = false
    this.music = null
    for (const name of AMBIENCE) this.amb[name].gain.setTargetAtTime(0, now + 0.4, 0.3)
    this.padGain.gain.setTargetAtTime(0, now + 0.4, 0.3)
  }

  /** The tab is hidden: stop rather than play to nobody */
  pause() {
    this.silence?.pause()
    if (this.ctx?.state === 'running') this.ctx.suspend().catch(() => {})
  }

  resume() {
    if (this.ctx && this.ctx.state !== 'running') this.ctx.resume().catch(() => {})
  }

  dispose() {
    this.silence?.pause()
    this.silence = null
    this.ctx?.close().catch(() => {})
    this.ctx = null
  }

  /** Loudest sample in the last few milliseconds, for checking levels in development */
  peak(): number {
    if (!this.analyser) return 0
    if (!this.sampleBuffer) this.sampleBuffer = new Float32Array(this.analyser.fftSize)
    this.analyser.getFloatTimeDomainData(this.sampleBuffer)
    let peak = 0
    for (const v of this.sampleBuffer) peak = Math.max(peak, Math.abs(v))
    return peak
  }

  // ------------------------------------------------------------------------------ every frame

  update(s: SoundState) {
    const ctx = this.ctx
    if (!ctx || ctx.state !== 'running') return
    const now = ctx.currentTime
    const m = this.music

    if (m && s.dreaming) {
      const index = Math.floor(Math.max(0, s.local) / m.chordSec) % m.chords.length
      if (index !== this.chordIndex) {
        this.chordIndex = index
        this.setChord(m.chords[index], now)
      }
      if (m.sparkle > 0 && s.t >= this.nextSparkle) {
        this.nextSparkle = s.t + Math.min(4, -Math.log(1 - Math.random() * 0.95) / m.sparkle)
        const tone = this.chord[Math.floor(Math.random() * 4)] + VOICES[m.voice].up
        const midi = tone > 96 ? tone - 12 : tone
        this.note(
          m.voice,
          midi,
          now + 0.03,
          0.45 + Math.random() * 0.45,
          (Math.random() - 0.5) * 1.2
        )
      }
      if (m.tick && s.t >= this.nextTick) {
        this.nextTick = s.t + 1 / m.tick
        this.tick(now + 0.03)
      }
    }

    // the world, when it is there to be heard
    const a = this.ambience
    if (s.dreaming && (a.heart || 0) > 0.02 && s.t >= this.nextBeat) {
      this.nextBeat = s.t + 0.88
      this.thump(now + 0.03, 1)
      this.thump(now + 0.31, 0.65)
    }
    if (s.dreaming && (a.birds || 0) > 0.02 && s.t >= this.nextBird) {
      this.nextBird = s.t + (0.9 + Math.random() * 2.2) / Math.max(a.birds || 0, 0.3)
      this.birdsong(now + 0.05)
    }
    if (s.dreaming && (a.crickets || 0) > 0.02) {
      for (let i = 0; i < 2; i++) {
        if (s.t < this.nextCricket[i]) continue
        this.nextCricket[i] = s.t + 0.7 + Math.random() * 0.5
        this.chirpCrickets(i, now + 0.05)
      }
    }

    // slower changes, about fifteen times a second
    if (now - this.lastSlow < 0.066) return
    this.lastSlow = now
    const swell = 0.25 + 0.75 * Math.pow(0.5 + 0.5 * Math.sin((s.t * Math.PI * 2) / 7.5), 1.8)
    this.seaSwell.gain.setTargetAtTime(swell, now, 0.12)
    this.seaFilter.frequency.setTargetAtTime(350 + 900 * swell, now, 0.12)
    this.windFilter.frequency.setTargetAtTime(
      420 + 240 * Math.sin(s.t * 0.23) + 120 * Math.sin(s.t * 0.71),
      now,
      0.2
    )
    if (!this.kettleOn) return
    if (s.dreaming) {
      // holding on brings the dream closer and warmer; waking muffles it and pulls it away
      const cutoff = (9000 - 4800 * s.hold) * Math.pow(0.06, s.waking)
      this.muffle.frequency.setTargetAtTime(
        Math.max(380, 500 + (cutoff - 500) * s.emerge),
        now,
        0.25
      )
      this.verbSend.gain.setTargetAtTime(0.32 + 0.25 * s.hold + 0.45 * s.waking, now, 0.3)
      for (let i = 0; i < this.padOsc.length; i++) {
        const drift = s.waking * 45 * Math.sin(s.t * (1.3 + i * 0.37) + i)
        this.padOsc[i].detune.setTargetAtTime((i % 2 ? 7 : -6) + drift, now, 0.2)
      }
    }
    const level = s.whistle
    // the kettle bubbles unevenly as it heats; you hear it while the room is still there, and
    // again when it comes to the boil
    const presence = Math.max(s.room, level)
    this.rumble.gain.setTargetAtTime((0.03 + 0.02 * Math.random()) * presence, now, 0.08)
    this.roomTone.gain.setTargetAtTime(0.03 * s.room, now, 0.4)
    this.whistleGain.gain.setTargetAtTime(0.09 * level * level, now, 0.15)
    const pitch = 880 + 460 * level
    this.whistleOsc[0].frequency.setTargetAtTime(pitch, now, 0.3)
    this.whistleOsc[1].frequency.setTargetAtTime(pitch * 1.004, now, 0.3)
    this.whistleHiss.frequency.setTargetAtTime(pitch, now, 0.3)
  }

  // --------------------------------------------------------------------------------- the parts

  private setChord(chord: number[], at: number) {
    this.chord = chord
    for (let v = 0; v < 4; v++) {
      const frequency = mtof(chord[v])
      this.padOsc[v * 2].frequency.setTargetAtTime(frequency, at, 0.35)
      this.padOsc[v * 2 + 1].frequency.setTargetAtTime(frequency, at, 0.35)
    }
  }

  private note(voice: Voice, midi: number, when: number, velocity: number, pan: number, held = 0) {
    const ctx = this.ctx
    if (!ctx) return
    const spec = VOICES[voice]
    const frequency = mtof(midi)
    const panner = ctx.createStereoPanner()
    panner.pan.value = Math.max(-1, Math.min(1, pan))
    panner.connect(this.notes)
    const decay = Math.max(spec.decay, held * 1.2)
    const end = when + spec.attack + decay * 1.3 + 0.1
    let vibrato: OscillatorNode | null = null
    let depth: GainNode | null = null
    if (spec.vibrato) {
      vibrato = ctx.createOscillator()
      vibrato.frequency.value = 4.6 + Math.random()
      depth = ctx.createGain()
      depth.gain.value = frequency * spec.vibrato
      vibrato.connect(depth)
      vibrato.start(when)
      vibrato.stop(end)
    }
    for (const [ratio, amp, partDecay, wave] of spec.partials) {
      const osc = ctx.createOscillator()
      osc.type = wave || 'sine'
      osc.frequency.value = frequency * ratio
      if (depth) depth.connect(osc.frequency)
      const env = ctx.createGain()
      const peak = spec.gain * amp * velocity
      env.gain.setValueAtTime(0, when)
      env.gain.linearRampToValueAtTime(peak, when + spec.attack)
      env.gain.setTargetAtTime(0, when + spec.attack, (decay * partDecay) / 4)
      osc.connect(env)
      env.connect(panner)
      osc.start(when)
      osc.stop(end)
      osc.onended = () => {
        env.disconnect()
        panner.disconnect()
      }
    }
  }

  private thump(when: number, velocity: number) {
    const ctx = this.ctx
    if (!ctx) return
    const env = ctx.createGain()
    env.gain.setValueAtTime(0, when)
    env.gain.linearRampToValueAtTime(velocity, when + 0.008)
    env.gain.setTargetAtTime(0, when + 0.03, 0.06)
    const lowpass = ctx.createBiquadFilter()
    lowpass.type = 'lowpass'
    lowpass.frequency.value = 260
    env.connect(lowpass)
    lowpass.connect(this.amb.heart)
    // the deep part, and an octave above it so small speakers can hear it too
    const parts: [OscillatorType, number, number, number][] = [
      ['sine', 78, 42, 1],
      ['triangle', 150, 84, 0.3],
    ]
    for (const [wave, from, to, level] of parts) {
      const osc = ctx.createOscillator()
      osc.type = wave
      osc.frequency.setValueAtTime(from, when)
      osc.frequency.exponentialRampToValueAtTime(to, when + 0.13)
      const g = ctx.createGain()
      g.gain.value = level
      osc.connect(g)
      g.connect(env)
      osc.start(when)
      osc.stop(when + 0.5)
      osc.onended = () => {
        g.disconnect()
        env.disconnect()
        lowpass.disconnect()
      }
    }
  }

  private birdsong(when: number) {
    const ctx = this.ctx
    if (!ctx) return
    const level = 0.05
    const base = 2500 + Math.random() * 1300
    const pan = (Math.random() - 0.5) * 1.6
    const count = 2 + Math.floor(Math.random() * 4)
    let at = when
    for (let i = 0; i < count; i++) {
      const f = base * (0.92 + Math.random() * 0.16)
      const osc = ctx.createOscillator()
      osc.frequency.setValueAtTime(f, at)
      osc.frequency.exponentialRampToValueAtTime(f * 1.4, at + 0.045)
      osc.frequency.exponentialRampToValueAtTime(f * 0.82, at + 0.11)
      const env = ctx.createGain()
      env.gain.setValueAtTime(0, at)
      env.gain.linearRampToValueAtTime(level, at + 0.012)
      env.gain.setTargetAtTime(0, at + 0.06, 0.025)
      const panner = ctx.createStereoPanner()
      panner.pan.value = pan
      osc.connect(env)
      env.connect(panner)
      panner.connect(this.amb.birds)
      osc.start(at)
      osc.stop(at + 0.25)
      osc.onended = () => {
        env.disconnect()
        panner.disconnect()
      }
      at += 0.11 + Math.random() * 0.08
    }
  }

  private chirpCrickets(which: number, when: number) {
    const g = this.cricketPulse[which].gain
    const pulses = 3 + Math.floor(Math.random() * 2)
    for (let k = 0; k < pulses; k++) {
      const t = when + k * 0.042
      g.setValueAtTime(0, t)
      g.linearRampToValueAtTime(1, t + 0.006)
      g.linearRampToValueAtTime(0, t + 0.026)
    }
  }

  private burst(
    when: number,
    length: number,
    type: BiquadFilterType,
    frequency: number,
    q: number
  ) {
    const ctx = this.ctx!
    const source = ctx.createBufferSource()
    source.buffer = this.noise
    const shape = ctx.createBiquadFilter()
    shape.type = type
    shape.frequency.value = frequency
    shape.Q.value = q
    const env = ctx.createGain()
    env.gain.setValueAtTime(1, when)
    env.gain.setTargetAtTime(0, when + length * 0.3, length / 3)
    source.connect(shape)
    shape.connect(env)
    source.start(when, Math.random() * 3)
    source.stop(when + length * 2 + 0.05)
    source.onended = () => {
      shape.disconnect()
      env.disconnect()
    }
    return env
  }

  /** The kettle's switch */
  private click(when: number, level: number) {
    const ctx = this.ctx
    if (!ctx) return
    const out = ctx.createGain()
    out.gain.value = level
    out.connect(this.room)
    this.burst(when, 0.012, 'highpass', 1800, 0.7).connect(out)
    this.burst(when + 0.004, 0.03, 'bandpass', 900, 2).connect(out)
  }

  private tick(when: number) {
    const ctx = this.ctx
    if (!ctx) return
    const out = ctx.createGain()
    out.gain.value = 0.05
    out.connect(this.dreamIn)
    this.burst(when, 0.01, 'bandpass', 3400, 3).connect(out)
  }
}

// The sound of a large room: noise that fades away, different in each ear so it sounds wide
function impulse(ctx: AudioContext, seconds: number, decay: number) {
  const length = Math.floor(ctx.sampleRate * seconds)
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate)
  for (let c = 0; c < 2; c++) {
    const data = buffer.getChannelData(c)
    for (let i = 0; i < length; i++)
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay)
  }
  return buffer
}
