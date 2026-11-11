// A tape recorder for the Pocket Synth.
//
// The page at /synth plays through an AudioContext: in real time, to the speakers. This runs
// the same SynthEngine against an OfflineAudioContext, which renders into a buffer as fast as
// the machine can go. Nothing about the instrument is written again here. A take is a list of
// the things a player does to it (press a pad, turn a knob, press PLAY) and when, and those
// arrive through the same methods the page calls.
//
// record.mjs bundles this file and runs it in a headless browser.

import {
  SynthEngine,
  type ArpMode,
  type Patch,
  type Pattern,
  type Transport,
} from '../../app/synth/engine'

export type Settings = Patch & Transport

/** One thing a player does to the instrument, `at` seconds into the take */
export type Action = { at: number } & (
  | { do: 'on'; midi: number }
  | { do: 'off'; midi: number }
  | { do: 'express'; midi: number; bend: number; amount: number }
  | { do: 'knobs'; settings: Partial<Settings> }
  | { do: 'pattern'; pattern: Pattern }
  | { do: 'play' }
  | { do: 'stop' }
  | { do: 'arp'; on: boolean; mode: ArpMode }
  | { do: 'arpNotes'; notes: number[] }
)

export interface Take {
  seconds: number
  /** Where every knob is when the take starts */
  settings: Settings
  actions: Action[]
}

/** One part of a song: a take, and where it sits in the mix (see record.mjs) */
export interface Track {
  name: string
  /** Level in the mix */
  gain: number
  /** Seconds into the take at which the song starts; negative for a part that comes in later */
  origin: number
  take: Take
}

export interface Score {
  name: string
  seconds: number
  /** Seconds over which the end of the mix fades to nothing */
  fadeOut?: number
  tracks: Track[]
}

// An offline context can only be paused on a boundary between blocks of this many frames, so
// that is how finely a hand can be timed: 2.7 ms at 48 kHz. Notes the sequencer and the
// arpeggiator play are scheduled by the engine itself and land on the exact frame.
const QUANTUM = 128
// How often the engine's sequencer clock is wound. On the page a timer does it every 25 ms.
const TICK = 9 * QUANTUM

async function record(take: Take, sampleRate: number): Promise<AudioBuffer> {
  const frames = Math.ceil(take.seconds * sampleRate)
  const ctx = new OfflineAudioContext(2, frames, sampleRate)

  // The engine resumes its context whenever it is touched, which is right for a tab that may
  // have been asleep. Here the context is paused on purpose while the player's hands move, and
  // only the loop below lets it run on.
  const resume = ctx.resume.bind(ctx)
  ctx.resume = () => Promise.resolve()

  // The engine builds its graph on `new AudioContext()` and keeps time with setInterval. Hand
  // it the offline context, and keep its clock to wind by the context's time, not the wall's.
  const page = {
    AudioContext: window.AudioContext,
    setInterval: window.setInterval,
    clearInterval: window.clearInterval,
  }
  const clock: { tick: (() => void) | null } = { tick: null }
  window.AudioContext = function () {
    return ctx
  } as unknown as typeof AudioContext
  window.setInterval = ((tick: () => void) => {
    clock.tick = tick
    return 1
  }) as unknown as typeof window.setInterval
  window.clearInterval = (() => {
    clock.tick = null
  }) as typeof window.clearInterval

  try {
    let settings = take.settings
    const engine = new SynthEngine(settings, settings)
    // The first tap on the page: builds the audio graph
    engine.unlock()

    const perform = (action: Action) => {
      switch (action.do) {
        case 'on':
          return engine.noteOn(action.midi)
        case 'off':
          return engine.noteOff(action.midi)
        case 'express':
          return engine.express(action.midi, action.bend, action.amount)
        case 'knobs':
          settings = { ...settings, ...action.settings }
          engine.setPatch(settings)
          engine.setTransport(settings)
          return
        case 'pattern':
          return engine.setPattern(action.pattern)
        case 'play':
          return engine.play()
        case 'stop':
          return engine.stop()
        case 'arp':
          return engine.setArp(action.on, action.mode)
        case 'arpNotes':
          return engine.setArpNotes(action.notes)
      }
    }

    // Everything that happens at each pause, in the order it was written down
    const moments = new Map<number, Action[]>()
    const last = Math.floor((frames - 1) / QUANTUM) * QUANTUM
    for (const action of [...take.actions].sort((a, b) => a.at - b.at)) {
      const block = Math.round((action.at * sampleRate) / QUANTUM) * QUANTUM
      const frame = Math.min(last, Math.max(0, block))
      moments.set(frame, [...(moments.get(frame) ?? []), action])
    }
    for (let frame = TICK; frame <= last; frame += TICK) {
      if (!moments.has(frame)) moments.set(frame, [])
    }

    for (const [frame, actions] of moments) {
      if (frame === 0) continue
      ctx.suspend(frame / sampleRate).then(() => {
        actions.forEach(perform)
        clock.tick?.()
        resume()
      })
    }
    // What is done before the tape rolls
    moments.get(0)?.forEach(perform)

    return await ctx.startRendering()
  } finally {
    Object.assign(window, page)
  }
}

// Sound travels back to Node as text. Base64 of the raw 32-bit floats, a stretch at a time.
function encode(samples: Float32Array, from: number, to: number) {
  const end = Math.min(to, samples.length)
  const bytes = new Uint8Array(samples.buffer, samples.byteOffset + from * 4, (end - from) * 4)
  let binary = ''
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  }
  return btoa(binary)
}

let tape: Float32Array[] = []

const recorder = {
  /** Record a take and keep it; returns its length in frames */
  async record(take: Take, sampleRate: number) {
    const buffer = await record(take, sampleRate)
    tape = [buffer.getChannelData(0), buffer.getChannelData(1)]
    return buffer.length
  },
  /** Part of one channel of the take just recorded */
  read: (channel: number, from: number, to: number) => encode(tape[channel], from, to),
}

export type Recorder = typeof recorder
;(window as unknown as { pocketSynthRecorder: Recorder }).pocketSynthRecorder = recorder
