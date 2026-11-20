// Every sound in BACKSPIN is synthesized here, at load time, with OfflineAudioContext. There are
// no audio files. Drums are rendered once as one-shots: the pads play them one hit at a time, and
// the closed hats and ghost notes are sequenced into the backing. The bass and keys are played
// note by note into their own stem for each of the three loops, and each horn stab the song uses
// is rendered once so the HORN pad can play it.

import { BEAT, LOOP, LOOPS, CHORDS, SCRATCH, hz, stepTime, hornVoicings } from './music.js'

// Seconds rendered past the end of each 4-bar loop, so releases and echoes ring on into the next
// loop. Loops are scheduled to overlap by this much and simply add up.
export const TAIL = 2

// The backing, per loop. The kick, snare, clap, open hat and horns are on the pads now.
export const STEMS = ['drums', 'bass', 'keys']

// Peak level the bass and keys stems are normalized to, the same factor for all three loops so
// they match. The backing drums (hats and ghost notes) are left at the kit's own level, so they
// sit right against the same kit played on the pads.
const STEM_PEAK = { bass: 0.85, keys: 0.8 }

/**
 * Render everything. `onProgress` gets a 0..1 fraction as jobs finish.
 * Returns { loops: {A: {drums, bass, keys}, B, C}, kit, pads: {kick, snare, clap, hat, crash},
 *           horns: Map('62,69,74' -> buffer), scratch: {levels, cue, sampleRate},
 *           fx: {laser, riser} }
 */
export async function synthesizeAll(sampleRate, onProgress = () => {}) {
  const sr = sampleRate
  let done = 0
  let total = 0
  const job = (promise) => {
    total++
    return promise.then((value) => {
      done++
      onProgress(done / total)
      return value
    })
  }

  const voicings = hornVoicings()
  const kitJobs = [kick(sr), snare(sr), clap(sr), hat(sr, false), hat(sr, true), crash(sr)].map(job)
  const hornJobs = voicings.map((v) => job(hornStab(sr, v)))
  const recordJob = job(scratchRecord(sr))
  // The loops and tempo effects need the kit; count them up front for the progress bar
  total += Object.keys(LOOPS).length * STEMS.length + 2
  const [kickB, snareB, clapB, hatB, openB, crashB] = await Promise.all(kitJobs)
  const kit = { kick: kickB, snare: snareB, clap: clapB, hat: hatB, open: openB, crash: crashB }
  const tempo = await synthesizeTempo(sr, kit, () => {
    done++
    onProgress(done / total)
  })

  const hornBuffers = await Promise.all(hornJobs)
  // One scale for all the horn stabs, as if they were one stem: the biggest peaks at 0.8
  const hornPeak = Math.max(...hornBuffers.map(peakOf))
  const horns = new Map()
  voicings.forEach((v, i) => horns.set(v.join(','), scale(hornBuffers[i], 0.8 / hornPeak)))

  const record = await recordJob
  return {
    ...tempo,
    kit,
    pads: { kick: kickB, snare: snareB, clap: clapB, hat: openB, crash: crashB },
    horns,
    scratch: { levels: mipLevels(record, sr), cue: SCRATCH.cue, sampleRate: sr },
  }
}

/**
 * The sounds that depend on the tempo: the three loops' backing stems, the laser (its echo is
 * on the 8th notes) and the riser (two beats long). Rendered again when practice changes the
 * tempo. Returns { loops, fx: {laser, riser} }.
 */
export async function synthesizeTempo(sr, kit, tick = () => {}) {
  const names = Object.keys(LOOPS)
  const counted = (p) =>
    p.then((value) => {
      tick()
      return value
    })
  const loopJobs = names.flatMap((name, i) => {
    const loop = LOOPS[name]
    return [renderDrums(loop, sr, kit, 101 + i), renderBass(loop, sr), renderKeys(loop, sr)].map(
      counted
    )
  })
  const fxJobs = [laser(sr), riser(sr)].map(counted)
  const rendered = await Promise.all(loopJobs)
  const loops = {}
  names.forEach((name, i) => {
    loops[name] = {}
    STEMS.forEach((stem, j) => (loops[name][stem] = rendered[i * STEMS.length + j]))
  })
  // One scale per stem across the loops, so switching loops never jumps in level
  for (const stem of Object.keys(STEM_PEAK)) {
    const peak = Math.max(...names.map((name) => peakOf(loops[name][stem])))
    if (peak > 0) names.forEach((name) => scale(loops[name][stem], STEM_PEAK[stem] / peak))
  }
  const [laserB, riserB] = await Promise.all(fxJobs)
  return { loops, fx: { laser: laserB, riser: riserB } }
}

// ---------------------------------------------------------------------------------------------
// Helpers

function mulberry(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const offline = (channels, seconds, sr) =>
  new OfflineAudioContext(channels, Math.ceil(seconds * sr), sr)

function gainNode(ctx, value) {
  const g = ctx.createGain()
  g.gain.value = value
  return g
}

function filter(ctx, type, frequency, Q = 0.707, gain = 0) {
  const f = ctx.createBiquadFilter()
  f.type = type
  f.frequency.value = frequency
  f.Q.value = Q
  f.gain.value = gain
  return f
}

function noise(ctx, seconds, seed) {
  const n = Math.ceil(seconds * ctx.sampleRate)
  const buffer = ctx.createBuffer(1, n, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  const rand = mulberry(seed)
  for (let i = 0; i < n; i++) data[i] = rand() * 2 - 1
  return buffer
}

function noiseSource(ctx, seconds, seed) {
  const source = ctx.createBufferSource()
  source.buffer = noise(ctx, seconds, seed)
  return source
}

/** A soft clipper: tanh, scaled so full scale in is full scale out. */
function saturator(ctx, drive) {
  const shaper = ctx.createWaveShaper()
  const n = 2048
  const curve = new Float32Array(n)
  const norm = Math.tanh(drive)
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * 2 - 1
    curve[i] = Math.tanh(x * drive) / norm
  }
  shaper.curve = curve
  shaper.oversample = '2x'
  return shaper
}

/** A synthetic room: decaying noise that also darkens as it decays, one channel per ear. */
function impulse(ctx, seconds, decay, seed, channels = 2) {
  const sr = ctx.sampleRate
  const n = Math.ceil(seconds * sr)
  const buffer = ctx.createBuffer(channels, n, sr)
  for (let ch = 0; ch < channels; ch++) {
    const data = buffer.getChannelData(ch)
    const rand = mulberry(seed + ch * 7919)
    let lp = 0
    for (let i = 0; i < n; i++) {
      const t = i / sr
      const k = 0.92 - 0.75 * (t / seconds) // one-pole low-pass, closing as the tail decays
      lp += k * (rand() * 2 - 1 - lp)
      // a 4 ms fade-in keeps the first reflection from clicking
      data[i] = lp * Math.exp(-t / decay) * Math.min(1, t / 0.004)
    }
  }
  return buffer
}

function peakOf(buffer) {
  let peak = 0
  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const d = buffer.getChannelData(ch)
    for (let i = 0; i < d.length; i++) {
      const a = Math.abs(d[i])
      if (a > peak) peak = a
    }
  }
  return peak
}

function scale(buffer, factor) {
  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const d = buffer.getChannelData(ch)
    for (let i = 0; i < d.length; i++) d[i] *= factor
  }
  return buffer
}

function normalize(buffer, peak) {
  const p = peakOf(buffer)
  return p > 0 ? scale(buffer, peak / p) : buffer
}

/** A short linear fade at the end, so a buffer never stops on a non-zero sample. */
function fadeOut(buffer, seconds = 0.05) {
  const n = Math.min(buffer.length, Math.floor(seconds * buffer.sampleRate))
  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const d = buffer.getChannelData(ch)
    for (let i = 0; i < n; i++) d[d.length - 1 - i] *= i / n
  }
  return buffer
}

// ---------------------------------------------------------------------------------------------
// Drum one-shots

async function kick(sr) {
  const ctx = offline(1, 0.7, sr)
  const sat = saturator(ctx, 2.2)
  sat.connect(ctx.destination)
  // The body: a sine that drops from 180 Hz to 47 Hz in a few tens of milliseconds
  const body = ctx.createOscillator()
  body.frequency.setValueAtTime(180, 0)
  body.frequency.setTargetAtTime(47, 0.001, 0.03)
  const amp = ctx.createGain()
  amp.gain.setValueAtTime(0, 0)
  amp.gain.linearRampToValueAtTime(1, 0.002)
  amp.gain.setTargetAtTime(0, 0.04, 0.11)
  body.connect(amp).connect(sat)
  body.start(0)
  body.stop(0.7)
  // The beater: three milliseconds of bright noise
  const click = noiseSource(ctx, 0.03, 3)
  const clickGain = ctx.createGain()
  clickGain.gain.setValueAtTime(0.5, 0)
  clickGain.gain.setTargetAtTime(0, 0.0005, 0.0035)
  click
    .connect(filter(ctx, 'highpass', 1800))
    .connect(clickGain)
    .connect(sat)
  click.start(0)
  return normalize(await ctx.startRendering(), 0.95)
}

async function snare(sr) {
  const ctx = offline(1, 0.7, sr)
  const bus = gainNode(ctx, 1)
  bus.connect(ctx.destination)
  const room = ctx.createConvolver()
  room.buffer = impulse(ctx, 0.6, 0.11, 21, 1)
  bus.connect(room).connect(gainNode(ctx, 0.22)).connect(ctx.destination)
  // The shell: two tuned modes with a quick pitch drop
  for (const [f, level] of [
    [185, 0.75],
    [320, 0.28],
  ]) {
    const osc = ctx.createOscillator()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(f * 1.3, 0)
    osc.frequency.setTargetAtTime(f, 0, 0.01)
    const amp = ctx.createGain()
    amp.gain.setValueAtTime(0, 0)
    amp.gain.linearRampToValueAtTime(level, 0.001)
    amp.gain.setTargetAtTime(0, 0.003, 0.05)
    osc.connect(amp).connect(bus)
    osc.start(0)
    osc.stop(0.7)
  }
  // The wires: noise, high-passed with a lift around 4.5 kHz
  const wires = noiseSource(ctx, 0.7, 5)
  const amp = ctx.createGain()
  amp.gain.setValueAtTime(0, 0)
  amp.gain.linearRampToValueAtTime(0.85, 0.0012)
  amp.gain.setTargetAtTime(0, 0.006, 0.07)
  wires
    .connect(filter(ctx, 'highpass', 1500, 0.6))
    .connect(filter(ctx, 'peaking', 4500, 0.9, 5))
    .connect(filter(ctx, 'lowpass', 11000))
    .connect(amp)
    .connect(bus)
  wires.start(0)
  return normalize(await ctx.startRendering(), 0.92)
}

async function clap(sr) {
  const ctx = offline(1, 0.6, sr)
  const bus = gainNode(ctx, 1)
  bus.connect(ctx.destination)
  const room = ctx.createConvolver()
  room.buffer = impulse(ctx, 0.5, 0.09, 33, 1)
  bus.connect(room).connect(gainNode(ctx, 0.3)).connect(ctx.destination)
  // Several hands a few milliseconds apart, then the decay of the last
  const amp = ctx.createGain()
  amp.gain.setValueAtTime(0, 0)
  const bursts = [0, 0.011, 0.023, 0.034]
  bursts.forEach((t, i) => {
    amp.gain.setValueAtTime(0, t)
    amp.gain.linearRampToValueAtTime(1, t + 0.0008)
    amp.gain.setTargetAtTime(0, t + 0.0008, i < bursts.length - 1 ? 0.0035 : 0.07)
  })
  const src = noiseSource(ctx, 0.6, 9)
  src
    .connect(filter(ctx, 'bandpass', 1150, 1.1))
    .connect(filter(ctx, 'highpass', 600))
    .connect(amp)
    .connect(bus)
  src.start(0)
  return normalize(await ctx.startRendering(), 0.9)
}

/**
 * 808-style hats: six detuned square waves, band-passed high, plus a little air. The open one is
 * the OPEN HAT pad: it rings for a moment and closes by itself, as if the pedal came down.
 */
async function hat(sr, open) {
  const len = open ? 0.6 : 0.3
  const ctx = offline(1, len, sr)
  const env = ctx.createGain()
  env.gain.setValueAtTime(0, 0)
  env.gain.linearRampToValueAtTime(1, 0.0006)
  env.gain.setTargetAtTime(0, 0.002, open ? 0.12 : 0.017)
  if (open) env.gain.setTargetAtTime(0, 0.24, 0.025) // the pedal closes
  env.connect(ctx.destination)
  const metal = gainNode(ctx, 0.16)
  for (const f of [205.3, 304.4, 369.6, 522.7, 540, 800]) {
    const osc = ctx.createOscillator()
    osc.type = 'square'
    osc.frequency.value = f * 1.2
    osc.connect(metal)
    osc.start(0)
    osc.stop(len)
  }
  metal
    .connect(filter(ctx, 'bandpass', 9500, 0.9))
    .connect(filter(ctx, 'highpass', 7200, 0.8))
    .connect(env)
  const air = noiseSource(ctx, len, open ? 17 : 13)
  air
    .connect(filter(ctx, 'highpass', 9000))
    .connect(gainNode(ctx, 0.35))
    .connect(env)
  air.start(0)
  return normalize(await ctx.startRendering(), 0.9)
}

/** A crash: a splash of detuned metal and noise that washes out over a couple of seconds. */
async function crash(sr) {
  const len = 2.4
  const ctx = offline(2, len, sr)
  const env = ctx.createGain()
  env.gain.setValueAtTime(0, 0)
  env.gain.linearRampToValueAtTime(1, 0.001)
  env.gain.setTargetAtTime(0.42, 0.001, 0.045) // the splash...
  env.gain.setTargetAtTime(0, 0.05, 0.6) // ...and the wash
  env.connect(ctx.destination)
  const metal = gainNode(ctx, 0.11)
  for (const f of [263, 371, 427, 593, 657, 883, 1127, 1381]) {
    const osc = ctx.createOscillator()
    osc.type = 'square'
    osc.frequency.value = f
    osc.connect(metal)
    osc.start(0)
    osc.stop(len)
  }
  metal
    .connect(filter(ctx, 'highpass', 3800, 0.7))
    .connect(filter(ctx, 'peaking', 6500, 0.8, 4))
    .connect(env)
  // Noise, a different seed in each ear, so it is wide
  for (const [seed, pan] of [
    [81, -0.6],
    [83, 0.6],
  ]) {
    const air = noiseSource(ctx, len, seed)
    const p = ctx.createStereoPanner()
    p.pan.value = pan
    air
      .connect(filter(ctx, 'highpass', 5200, 0.6))
      .connect(filter(ctx, 'lowpass', 13000))
      .connect(gainNode(ctx, 0.5))
      .connect(p)
      .connect(env)
    air.start(0)
  }
  return fadeOut(normalize(await ctx.startRendering(), 0.9), 0.2)
}

// ---------------------------------------------------------------------------------------------
// Pitched voices

function bassVoice(ctx, dest, t, dur, midi) {
  const f = hz(midi)
  const amp = ctx.createGain()
  amp.gain.setValueAtTime(0, t)
  amp.gain.linearRampToValueAtTime(0.8, t + 0.005)
  amp.gain.setTargetAtTime(0.62, t + 0.005, 0.15)
  amp.gain.setTargetAtTime(0, t + dur, 0.02)
  amp.connect(dest)
  // A sine for the weight, and a filtered saw so the line is still heard on small speakers
  const sub = ctx.createOscillator()
  sub.frequency.value = f
  sub.connect(amp)
  const saw = ctx.createOscillator()
  saw.type = 'sawtooth'
  saw.frequency.value = f
  saw.detune.value = 4
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.Q.value = 2
  lp.frequency.setValueAtTime(1000, t)
  lp.frequency.setTargetAtTime(240, t, 0.07)
  saw.connect(lp).connect(gainNode(ctx, 0.35)).connect(amp)
  const end = t + dur + 0.2
  sub.start(t)
  saw.start(t)
  sub.stop(end)
  saw.stop(end)
}

/** An electric piano: two-operator FM with a bright attack that mellows, and a short tine. */
function epVoice(ctx, dest, t, dur, midi, vel, pan) {
  const f = hz(midi)
  const amp = ctx.createGain()
  amp.gain.setValueAtTime(0, t)
  amp.gain.linearRampToValueAtTime(0.3 * vel, t + 0.003)
  amp.gain.setTargetAtTime(0, t + 0.003, 0.9)
  amp.gain.setTargetAtTime(0, t + dur, 0.05) // the damper when the key comes up
  const panner = ctx.createStereoPanner()
  panner.pan.value = pan
  amp.connect(panner).connect(dest)

  const carrier = ctx.createOscillator()
  carrier.frequency.value = f
  const mod = ctx.createOscillator()
  mod.frequency.value = f
  const index = ctx.createGain()
  index.gain.setValueAtTime(f * (1.1 + 1.6 * vel), t)
  index.gain.setTargetAtTime(f * 0.25, t, 0.16)
  mod.connect(index).connect(carrier.frequency)
  carrier.connect(amp)

  const tine = ctx.createOscillator()
  tine.frequency.value = f * 4.01
  const tineAmp = ctx.createGain()
  tineAmp.gain.setValueAtTime(0, t)
  tineAmp.gain.linearRampToValueAtTime(0.09 * vel, t + 0.001)
  tineAmp.gain.setTargetAtTime(0, t + 0.001, 0.025)
  tine.connect(tineAmp).connect(amp)

  const end = t + dur + 0.45
  for (const osc of [carrier, mod, tine]) {
    osc.start(t)
    osc.stop(end)
  }
}

/** A horn hit: three detuned saws that scoop up into pitch through a filter that blares open. */
function brassVoice(ctx, dest, t, midi, vel, len) {
  const f = hz(midi)
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.Q.value = 1.8
  lp.frequency.setValueAtTime(380, t)
  lp.frequency.linearRampToValueAtTime(3600 + 1200 * vel, t + 0.03)
  lp.frequency.setTargetAtTime(1300, t + 0.03, 0.07)
  const amp = ctx.createGain()
  amp.gain.setValueAtTime(0, t)
  amp.gain.linearRampToValueAtTime(0.2 * vel, t + 0.014)
  amp.gain.setTargetAtTime(0.11 * vel, t + 0.014, 0.06)
  amp.gain.setTargetAtTime(0, t + len, 0.045)
  lp.connect(amp).connect(dest)
  for (const cents of [-11, 0, 9]) {
    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.value = f
    osc.detune.setValueAtTime(cents - 70, t)
    osc.detune.setTargetAtTime(cents, t, 0.018)
    osc.connect(lp)
    osc.start(t)
    osc.stop(t + len + 0.35)
  }
}

// ---------------------------------------------------------------------------------------------
// Loop stems. Each is LOOP + TAIL seconds long; the part past LOOP is the ring-out.

// The kit's level in the mix: the backing hats and ghost notes are rendered at it, and the
// engine plays the drum pads at it too (engine.js PAD_LEVEL)
export const KIT_LEVEL = 0.6

/** The backing drums: the closed hats and ghost notes. The rest of the kit is on the pads. */
async function renderDrums(loop, sr, kit, seed) {
  const ctx = offline(2, LOOP + TAIL, sr)
  const out = gainNode(ctx, KIT_LEVEL)
  out.connect(ctx.destination)
  const rand = mulberry(seed)
  const hit = (buffer, t, vel, pan = 0) => {
    const src = ctx.createBufferSource()
    src.buffer = buffer
    const g = gainNode(ctx, vel)
    const p = ctx.createStereoPanner()
    p.pan.value = pan
    src.connect(g).connect(p).connect(out)
    src.start(Math.max(0, t))
    return g
  }
  for (const [s, v] of loop.ghost) hit(kit.snare, stepTime(s), v, -0.05)
  // Hats get a few milliseconds of human timing and a little velocity wobble
  for (const [s, v] of loop.hats) {
    hit(kit.hat, stepTime(s) + (rand() - 0.5) * 0.004, v * (0.92 + rand() * 0.16), 0.18)
  }
  return fadeOut(await ctx.startRendering())
}

async function renderBass(loop, sr) {
  const ctx = offline(1, LOOP + TAIL, sr)
  const duck = ctx.createGain()
  const warm = saturator(ctx, 1.6)
  warm
    .connect(filter(ctx, 'lowpass', 2400, 0.5))
    .connect(duck)
    .connect(ctx.destination)
  // Sidechain-style ducking: the bass dips under every kick and swells back, so the two never
  // fight for the low end
  duck.gain.setValueAtTime(1, 0)
  for (const s of [...loop.kick].sort((a, b) => a - b)) {
    const t = stepTime(s)
    duck.gain.setTargetAtTime(0.3, t, 0.003)
    duck.gain.setTargetAtTime(1, t + 0.035, 0.075)
  }
  for (const [s, len, midi] of loop.bass) {
    const t = stepTime(s)
    bassVoice(ctx, warm, t, stepTime(s + len) - t - 0.012, midi)
  }
  return fadeOut(await ctx.startRendering())
}

async function renderKeys(loop, sr) {
  const ctx = offline(2, LOOP + TAIL, sr)
  const bus = gainNode(ctx, 1)
  const tone = filter(ctx, 'lowpass', 5500, 0.6)
  bus.connect(tone)
  tone.connect(gainNode(ctx, 0.85)).connect(ctx.destination)
  const verb = ctx.createConvolver()
  verb.buffer = impulse(ctx, 2.2, 0.55, 77)
  tone.connect(verb).connect(gainNode(ctx, 0.28)).connect(ctx.destination)
  // A dotted-8th echo, darker on every repeat
  const echo = ctx.createDelay(1.5)
  echo.delayTime.value = BEAT * 0.75
  const echoTone = filter(ctx, 'lowpass', 2500)
  tone.connect(echo).connect(echoTone)
  echoTone.connect(gainNode(ctx, 0.28)).connect(echo)
  echoTone.connect(gainNode(ctx, 0.18)).connect(ctx.destination)
  for (const [s, len, vel] of loop.keys) {
    const chord = CHORDS[loop.chords[Math.floor(s / 16)]]
    const t = stepTime(s)
    const dur = stepTime(s + len) - t
    const n = chord.voicing.length
    chord.voicing.forEach((midi, i) => {
      // a 4 ms roll from the bottom note up, and the chord spread across the stereo field
      epVoice(ctx, bus, t + i * 0.004, dur, midi, vel, (i / (n - 1) - 0.5) * 0.5)
    })
  }
  return fadeOut(await ctx.startRendering())
}

/** One horn stab (a voicing from the song), with the slapback and room the horns always had. */
async function hornStab(sr, voicing) {
  const ctx = offline(2, 1.3, sr)
  const bus = gainNode(ctx, 1)
  bus.connect(ctx.destination)
  // A slapback on the right and a little room
  const slap = ctx.createDelay(0.5)
  slap.delayTime.value = 0.11
  const slapPan = ctx.createStereoPanner()
  slapPan.pan.value = 0.35
  bus.connect(slap).connect(gainNode(ctx, 0.16)).connect(slapPan).connect(ctx.destination)
  const verb = ctx.createConvolver()
  verb.buffer = impulse(ctx, 1.1, 0.35, 55)
  bus.connect(verb).connect(gainNode(ctx, 0.2)).connect(ctx.destination)
  voicing.forEach((midi, i) => brassVoice(ctx, bus, 0.004, midi, 1 - i * 0.12, 0.17))
  return fadeOut(await ctx.startRendering(), 0.15)
}

// ---------------------------------------------------------------------------------------------
// The scratch record

/** The 1-bar phrase on the Scratch Deck: "ahh", then a horn stab a beat later, then groove. */
async function scratchRecord(sr) {
  const [vowelB, hornB] = await Promise.all([vowel(sr), horn(sr)])
  const v = vowelB.getChannelData(0)
  const h = hornB.getChannelData(0)
  // Balance the two by loudness (RMS over where each one sounds), horn a touch hotter
  const rms = (d, from, to) => {
    let sum = 0
    const a = Math.floor(from * sr)
    const b = Math.min(d.length, Math.floor(to * sr))
    for (let i = a; i < b; i++) sum += d[i] * d[i]
    return Math.sqrt(sum / Math.max(1, b - a))
  }
  const vr = rms(v, SCRATCH.onset, SCRATCH.onset + SCRATCH.vowelLength)
  const hr = rms(h, SCRATCH.stabAt, SCRATCH.stabAt + 0.25)
  const hornGain = hr > 0 ? (vr / hr) * 1.15 : 1
  const out = new Float32Array(v.length)
  let peak = 0
  for (let i = 0; i < out.length; i++) {
    out[i] = v[i] + h[i] * hornGain
    peak = Math.max(peak, Math.abs(out[i]))
  }
  const norm = peak > 0 ? 0.9 / peak : 1
  for (let i = 0; i < out.length; i++) out[i] *= norm
  // The groove before the cue and after the phrase is silent; make sure it starts at zero
  const lead = Math.floor(0.01 * sr)
  for (let i = 0; i < lead; i++) out[i] = 0
  return out
}

/** A sung "ahh": a sawtooth "voice" through the formants of the vowel, with a little vibrato. */
async function vowel(sr) {
  const ctx = offline(1, SCRATCH.length, sr)
  const t0 = SCRATCH.onset
  const dur = SCRATCH.vowelLength
  const f0 = hz(SCRATCH.vowelMidi)

  const voice = ctx.createOscillator()
  voice.type = 'sawtooth'
  voice.frequency.setValueAtTime(f0 * 0.93, t0)
  voice.frequency.setTargetAtTime(f0, t0, 0.018)
  voice.frequency.setTargetAtTime(f0 * 0.82, t0 + dur - 0.12, 0.06) // the fall at the end
  const vib = ctx.createOscillator()
  vib.frequency.value = 5.4
  const vibDepth = ctx.createGain()
  vibDepth.gain.value = 0
  vibDepth.gain.setValueAtTime(0, t0)
  vibDepth.gain.linearRampToValueAtTime(f0 * 0.014, t0 + 0.25)
  vib.connect(vibDepth).connect(voice.frequency)

  // The glottis: loudness envelope for the voice and its breath
  const glottis = ctx.createGain()
  glottis.gain.value = 0 // the voice starts a moment early; keep it silent until the onset
  glottis.gain.setValueAtTime(0, t0)
  glottis.gain.linearRampToValueAtTime(1, t0 + 0.008)
  glottis.gain.setTargetAtTime(0.8, t0 + 0.008, 0.12)
  glottis.gain.setTargetAtTime(0, t0 + dur - 0.04, 0.025)
  voice.connect(filter(ctx, 'lowpass', 3200, 0.5)).connect(glottis)
  const breath = noiseSource(ctx, dur + 0.2, 41)
  breath
    .connect(filter(ctx, 'bandpass', 2000, 0.6))
    .connect(gainNode(ctx, 0.05))
    .connect(glottis)

  // Formants of "ah" for a low voice: frequency, Q, level
  for (const [f, q, level] of [
    [730, 9, 1],
    [1090, 11, 0.55],
    [2440, 16, 0.2],
    [3400, 14, 0.09],
  ]) {
    glottis
      .connect(filter(ctx, 'bandpass', f, q))
      .connect(gainNode(ctx, level))
      .connect(ctx.destination)
  }
  // Some of the raw voice underneath, for body
  glottis
    .connect(filter(ctx, 'lowpass', 400))
    .connect(gainNode(ctx, 0.25))
    .connect(ctx.destination)

  const end = t0 + dur + 0.2
  for (const osc of [voice, vib]) {
    osc.start(Math.max(0, t0 - 0.01))
    osc.stop(end)
  }
  breath.start(t0)
  return ctx.startRendering()
}

async function horn(sr) {
  const ctx = offline(1, SCRATCH.length, sr)
  const bus = gainNode(ctx, 1)
  bus.connect(ctx.destination)
  const room = ctx.createConvolver()
  room.buffer = impulse(ctx, 0.9, 0.18, 63, 1)
  bus.connect(room).connect(gainNode(ctx, 0.18)).connect(ctx.destination)
  SCRATCH.stab.forEach((midi, i) => brassVoice(ctx, bus, SCRATCH.stabAt, midi, 1 - i * 0.1, 0.24))
  return ctx.startRendering()
}

/**
 * Pre-filtered copies of the record for playing it fast, like mipmaps for a texture: playing a
 * sample at 4x speed moves everything up two octaves, and whatever lands above the Nyquist
 * frequency folds back as harsh aliasing. The worklet reads from the copy whose top end will
 * still fit at the current speed. Filtered forwards and backwards, so no copy is shifted in time.
 */
export function mipLevels(data, sr) {
  const levels = [data]
  for (const cutoff of [sr / 4.5, sr / 9, sr / 18]) {
    const out = Float32Array.from(data)
    biquadLowpass(out, sr, cutoff, 0.541)
    biquadLowpass(out, sr, cutoff, 1.307)
    out.reverse()
    biquadLowpass(out, sr, cutoff, 0.541)
    biquadLowpass(out, sr, cutoff, 1.307)
    out.reverse()
    levels.push(out)
  }
  return levels
}

function biquadLowpass(x, sr, fc, Q) {
  const w = (2 * Math.PI * fc) / sr
  const cos = Math.cos(w)
  const alpha = Math.sin(w) / (2 * Q)
  const a0 = 1 + alpha
  const b0 = (1 - cos) / 2 / a0
  const b1 = (1 - cos) / a0
  const b2 = b0
  const a1 = (-2 * cos) / a0
  const a2 = (1 - alpha) / a0
  let x1 = 0
  let x2 = 0
  let y1 = 0
  let y2 = 0
  for (let i = 0; i < x.length; i++) {
    const x0 = x[i]
    const y0 = b0 * x0 + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2
    x2 = x1
    x1 = x0
    y2 = y1
    y1 = y0
    x[i] = y0
  }
}

// ---------------------------------------------------------------------------------------------
// FX one-shots

/** A laser: a falling saw and square, then a ping-pong echo on the 8th notes. */
async function laser(sr) {
  const len = 1.6
  const ctx = offline(2, len, sr)
  const out = gainNode(ctx, 1)
  out.connect(ctx.destination)
  const amp = ctx.createGain()
  amp.gain.setValueAtTime(0, 0)
  amp.gain.linearRampToValueAtTime(0.7, 0.002)
  amp.gain.exponentialRampToValueAtTime(0.001, 0.24)
  const tone = filter(ctx, 'lowpass', 5000, 1.2)
  amp.connect(tone).connect(out)
  const a = ctx.createOscillator()
  a.type = 'sawtooth'
  a.frequency.setValueAtTime(2800, 0)
  a.frequency.exponentialRampToValueAtTime(120, 0.2)
  const b = ctx.createOscillator()
  b.type = 'square'
  b.frequency.setValueAtTime(1400, 0)
  b.frequency.exponentialRampToValueAtTime(60, 0.2)
  a.connect(amp)
  b.connect(gainNode(ctx, 0.4)).connect(amp)
  for (const osc of [a, b]) {
    osc.start(0)
    osc.stop(0.3)
  }
  // Ping-pong: left on the first echo, right on the second, and so on
  const merger = ctx.createChannelMerger(2)
  merger.connect(ctx.destination)
  const left = ctx.createDelay(1)
  const right = ctx.createDelay(1)
  left.delayTime.value = BEAT / 2
  right.delayTime.value = BEAT / 2
  tone.connect(gainNode(ctx, 0.45)).connect(left)
  left.connect(merger, 0, 0)
  left.connect(right)
  right.connect(merger, 0, 1)
  right.connect(gainNode(ctx, 0.32)).connect(left)
  return fadeOut(normalize(await ctx.startRendering(), 0.85))
}

/** A noise riser two beats long: a band-pass sweeping up while the level climbs. */
async function riser(sr) {
  const dur = BEAT * 2
  const len = dur + 0.08
  const ctx = offline(2, len, sr)
  const merger = ctx.createChannelMerger(2)
  merger.connect(ctx.destination)
  const amp = ctx.createGain()
  amp.gain.setValueAtTime(0.001, 0)
  amp.gain.exponentialRampToValueAtTime(0.9, dur - 0.02)
  amp.gain.linearRampToValueAtTime(0, dur + 0.03)
  for (let ch = 0; ch < 2; ch++) {
    const src = noiseSource(ctx, len, 70 + ch)
    const bp = filter(ctx, 'bandpass', 300, 2.5)
    bp.frequency.setValueAtTime(300, 0)
    bp.frequency.exponentialRampToValueAtTime(9000, dur)
    const chAmp = ctx.createGain()
    amp.connect(chAmp.gain) // modulate by the shared envelope
    chAmp.gain.value = 0
    src.connect(bp).connect(chAmp).connect(merger, 0, ch)
    src.start(0)
  }
  // A quiet sine sweeping under it, so it has a pitch to rise
  const sweep = ctx.createOscillator()
  sweep.frequency.setValueAtTime(200, 0)
  sweep.frequency.exponentialRampToValueAtTime(1600, dur)
  const sweepAmp = ctx.createGain()
  sweepAmp.gain.value = 0
  amp.connect(sweepAmp.gain)
  sweep.connect(gainNode(ctx, 0.15)).connect(sweepAmp).connect(ctx.destination)
  sweep.start(0)
  sweep.stop(len)
  // The envelope rides on a constant source so it can drive several gains at once
  const dc = ctx.createConstantSource()
  dc.connect(amp)
  dc.start(0)
  return fadeOut(normalize(await ctx.startRendering(), 0.8), 0.02)
}
