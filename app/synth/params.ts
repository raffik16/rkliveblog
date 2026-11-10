import { cutoffHz, type Patch, type Pattern, type Transport, type Wave } from './engine'

export type Settings = Patch & Transport
export type KnobKey = Exclude<keyof Settings, 'wave'>
/** Which picture the screen shows while a control is being moved */
export type Page = 'wave' | 'filter' | 'env' | 'bar'

const ms = (seconds: number) =>
  seconds < 1 ? `${Math.round(seconds * 1000)} ms` : `${seconds.toFixed(2)} s`
const hz = (value: number) =>
  value < 1000 ? `${Math.round(value)} Hz` : `${(value / 1000).toFixed(1)} kHz`
const pct = (value: number) => `${Math.round(value * 100)}%`

export interface KnobDef {
  key: KnobKey
  label: string
  /** Full name, shown on the screen while the knob turns */
  name: string
  min: number
  max: number
  /** The knob's travel is raised to this power, so time knobs have room at the short end */
  curve?: number
  step?: number
  page: Page
  format: (value: number) => string
}

const knob = (def: KnobDef) => def

export const KNOBS_LEFT: KnobDef[] = [
  knob({
    key: 'detune',
    label: 'Detune',
    name: 'Detune',
    min: 0,
    max: 40,
    step: 1,
    page: 'wave',
    format: (v) => (v === 0 ? 'Off' : `±${Math.round(v)} ct`),
  }),
  knob({
    key: 'cutoff',
    label: 'Cutoff',
    name: 'Filter cutoff',
    min: 0,
    max: 1,
    page: 'filter',
    format: (v) => hz(cutoffHz(v)),
  }),
  knob({
    key: 'resonance',
    label: 'Reso',
    name: 'Resonance',
    min: 0,
    max: 20,
    page: 'filter',
    format: (v) => `${v.toFixed(1)} dB`,
  }),
  knob({
    key: 'envAmount',
    label: 'Env',
    name: 'Filter envelope',
    min: 0,
    max: 1,
    page: 'filter',
    format: (v) => `+${(v * 4).toFixed(1)} oct`,
  }),
  knob({
    key: 'lfoRate',
    label: 'LFO rate',
    name: 'LFO rate',
    min: 0.1,
    max: 12,
    curve: 2,
    page: 'filter',
    format: (v) => `${v.toFixed(v < 2 ? 2 : 1)} Hz`,
  }),
  knob({
    key: 'lfoDepth',
    label: 'LFO depth',
    name: 'LFO depth',
    min: 0,
    max: 1,
    page: 'filter',
    format: pct,
  }),
  knob({
    key: 'tempo',
    label: 'Tempo',
    name: 'Tempo',
    min: 60,
    max: 180,
    step: 1,
    page: 'bar',
    format: (v) => `${Math.round(v)} BPM`,
  }),
  knob({
    key: 'volume',
    label: 'Volume',
    name: 'Volume',
    min: 0,
    max: 1,
    page: 'bar',
    format: pct,
  }),
]

export const KNOBS_RIGHT: KnobDef[] = [
  knob({
    key: 'attack',
    label: 'Attack',
    name: 'Attack',
    min: 0.003,
    max: 2,
    curve: 3,
    page: 'env',
    format: ms,
  }),
  knob({
    key: 'decay',
    label: 'Decay',
    name: 'Decay',
    min: 0.01,
    max: 2,
    curve: 3,
    page: 'env',
    format: ms,
  }),
  knob({
    key: 'sustain',
    label: 'Sustain',
    name: 'Sustain',
    min: 0,
    max: 1,
    page: 'env',
    format: pct,
  }),
  knob({
    key: 'release',
    label: 'Release',
    name: 'Release',
    min: 0.02,
    max: 4,
    curve: 3,
    page: 'env',
    format: ms,
  }),
  knob({ key: 'echo', label: 'Echo', name: 'Echo', min: 0, max: 0.8, page: 'bar', format: pct }),
  knob({
    key: 'reverb',
    label: 'Reverb',
    name: 'Reverb',
    min: 0,
    max: 1,
    page: 'bar',
    format: pct,
  }),
  knob({ key: 'swing', label: 'Swing', name: 'Swing', min: 0, max: 0.6, page: 'bar', format: pct }),
  knob({
    key: 'gate',
    label: 'Gate',
    name: 'Note length',
    min: 0.1,
    max: 1,
    page: 'bar',
    format: pct,
  }),
]

export const KNOBS = [...KNOBS_LEFT, ...KNOBS_RIGHT]

/** Knob position (0..1) to value, and back */
export function fromPosition(def: KnobDef, position: number) {
  const value = def.min + (def.max - def.min) * Math.pow(position, def.curve ?? 1)
  return def.step ? Math.round(value / def.step) * def.step : value
}

export function toPosition(def: KnobDef, value: number) {
  const linear = (value - def.min) / (def.max - def.min)
  return Math.pow(Math.min(1, Math.max(0, linear)), 1 / (def.curve ?? 1))
}

export const WAVES: { id: Wave; label: string; path: string }[] = [
  { id: 'sine', label: 'Sine', path: 'M1 8 C 5 -2, 9 -2, 13 8 S 21 18, 25 8' },
  { id: 'triangle', label: 'Tri', path: 'M1 8 L7 2 L19 14 L25 8' },
  { id: 'sawtooth', label: 'Saw', path: 'M1 14 L13 2 L13 14 L25 2 L25 14' },
  { id: 'square', label: 'Sqr', path: 'M1 14 L1 2 L13 2 L13 14 L25 14 L25 2' },
]

/** A preset is the sound only: tempo, swing, note length and volume stay where they are */
export type Sound = Omit<Patch, 'volume'>

export const PRESETS: { name: string; sound: Sound }[] = [
  {
    name: 'Pluck',
    sound: {
      wave: 'sawtooth',
      detune: 6,
      cutoff: 0.36,
      resonance: 6,
      envAmount: 0.6,
      attack: 0.003,
      decay: 0.22,
      sustain: 0.1,
      release: 0.25,
      lfoRate: 5,
      lfoDepth: 0,
      echo: 0.3,
      reverb: 0.2,
    },
  },
  {
    name: 'Pad',
    sound: {
      wave: 'sawtooth',
      detune: 14,
      cutoff: 0.42,
      resonance: 1,
      envAmount: 0.25,
      attack: 0.6,
      decay: 0.9,
      sustain: 0.8,
      release: 1.8,
      lfoRate: 0.3,
      lfoDepth: 0.25,
      echo: 0.2,
      reverb: 0.55,
    },
  },
  {
    name: 'Bass',
    sound: {
      wave: 'square',
      detune: 4,
      cutoff: 0.24,
      resonance: 9,
      envAmount: 0.55,
      attack: 0.003,
      decay: 0.18,
      sustain: 0.35,
      release: 0.1,
      lfoRate: 5,
      lfoDepth: 0,
      echo: 0,
      reverb: 0.05,
    },
  },
  {
    name: 'Lead',
    sound: {
      wave: 'square',
      detune: 9,
      cutoff: 0.6,
      resonance: 3,
      envAmount: 0.2,
      attack: 0.01,
      decay: 0.12,
      sustain: 0.85,
      release: 0.22,
      lfoRate: 5.5,
      lfoDepth: 0.12,
      echo: 0.3,
      reverb: 0.25,
    },
  },
]

export const INITIAL: Settings = {
  ...PRESETS[0].sound,
  volume: 0.7,
  tempo: 112,
  swing: 0,
  gate: 0.6,
}

// The pattern the sequencer starts with: a C minor riff, so PLAY does something straight away
const _ = null
export const INITIAL_PATTERN: Pattern = [48, _, 60, 48, _, 55, 58, _, 48, _, 63, 60, _, 55, 58, 60]

const NOTE_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B']
export const noteName = (midi: number) => `${NOTE_NAMES[midi % 12]}${Math.floor(midi / 12) - 1}`
