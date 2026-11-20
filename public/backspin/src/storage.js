// Settings and best scores, kept in localStorage. Every read and write is wrapped: storage can
// be missing, full, or blocked (private windows, strict privacy settings), and the game must
// still run with the defaults when it is.
//
// v2 came with the pads and a new chart, so best scores start again; the calibration and the
// scratch sensitivity carry over from v1.

const KEY = 'backspin.v2'
const OLD_KEY = 'backspin.v1'

export const SPEEDS = [60, 75, 90, 100]
export const CONTROLS = ['keys', 'mouse', 'hybrid', 'touch']
export const PRACTICE_TIMES = [1, 2, 4, 8]

const DEFAULTS = {
  offsetMs: 0, // audio/input latency from calibration: added to every judgement
  sensitivity: 1, // how far the record turns per pixel of mouse movement
  calibrated: false,
  // How the player picked to play: 'keys', 'mouse', 'hybrid' or 'touch'. Null until they pick:
  // until then the device decides.
  playWith: null,
  // { easy: { score, accuracy, grade, combo }, ..., 'hard-mouse': ..., 'hard-hybrid': ... }
  // (the mouse's and Hybrid's charts differ)
  best: {},
  midi: { on: false, map: {} }, // map: { [MIDI note]: pad index }, learned in Settings
  practice: { section: 'verse', speed: 75, times: 4, level: 'medium', guide: true },
}

let cache = null

function read(key) {
  const raw = window.localStorage.getItem(key)
  const data = raw ? JSON.parse(raw) : null
  return data && typeof data === 'object' ? data : null
}

function load() {
  if (cache) return cache
  cache = structuredClone(DEFAULTS)
  try {
    const saved = read(KEY) || read(OLD_KEY)
    if (saved) {
      if (Number.isFinite(saved.offsetMs)) cache.offsetMs = clamp(saved.offsetMs, -250, 250)
      if (Number.isFinite(saved.sensitivity)) {
        cache.sensitivity = clamp(saved.sensitivity, 0.25, 3)
      }
      cache.calibrated = saved.calibrated === true
      if (saved.version === 2) {
        if (CONTROLS.includes(saved.playWith)) cache.playWith = saved.playWith
        if (saved.best && typeof saved.best === 'object') cache.best = saved.best
        if (saved.midi && typeof saved.midi === 'object') {
          cache.midi.on = saved.midi.on === true
          const map = saved.midi.map
          if (map && typeof map === 'object') {
            for (const [note, pad] of Object.entries(map)) {
              const n = Number(note)
              if (n >= 0 && n < 128 && Number.isInteger(pad) && pad >= 0 && pad < 8) {
                cache.midi.map[n] = pad
              }
            }
          }
        }
        const p = saved.practice
        if (p && typeof p === 'object') {
          const d = cache.practice
          if (typeof p.section === 'string') d.section = p.section
          if (SPEEDS.includes(p.speed)) d.speed = p.speed
          if (PRACTICE_TIMES.includes(p.times)) d.times = p.times
          if (['easy', 'medium', 'hard'].includes(p.level)) d.level = p.level
          d.guide = p.guide !== false
        }
      }
    }
  } catch {
    // unreadable or blocked: keep the defaults
  }
  return cache
}

function save() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ ...cache, version: 2 }))
  } catch {
    // full or blocked: the setting still applies for this visit
  }
}

const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x))

export const settings = {
  get offsetMs() {
    return load().offsetMs
  },
  set offsetMs(ms) {
    load().offsetMs = clamp(Math.round(ms), -250, 250)
    save()
  },
  get sensitivity() {
    return load().sensitivity
  },
  set sensitivity(x) {
    load().sensitivity = clamp(x, 0.25, 3)
    save()
  },
  get calibrated() {
    return load().calibrated
  },
  set calibrated(yes) {
    load().calibrated = !!yes
    save()
  },
  /** How the player picked to play ('keys', 'mouse', 'hybrid', 'touch'), or null: not yet. */
  get controls() {
    return load().playWith
  },
  set controls(value) {
    load().playWith = CONTROLS.includes(value) ? value : null
    save()
  },
  /** Connect to MIDI devices when the game opens (once the player has turned it on). */
  get midiOn() {
    return load().midi.on
  },
  set midiOn(yes) {
    load().midi.on = !!yes
    save()
  },
  /** Notes the player has taught the game: { [note]: pad }. */
  get midiMap() {
    return load().midi.map
  },
  learnMidi(note, pad) {
    const map = load().midi.map
    // One note per pad: teaching a pad a new note forgets its old one
    for (const n of Object.keys(map)) if (map[n] === pad) delete map[n]
    map[note] = pad
    save()
  },
  resetMidi() {
    load().midi.map = {}
    save()
  },
  get practice() {
    return load().practice
  },
  setPractice(changes) {
    Object.assign(load().practice, changes)
    save()
  },
}

/**
 * Where a level's best is kept: the charts for the mouse and for Hybrid have fewer notes, so
 * they keep their own. `controls` is the chart's ('mouse', 'hybrid' or null).
 */
export function bestKey(level, controls) {
  return controls === 'mouse' || controls === 'hybrid' ? `${level}-${controls}` : level
}

export function bestFor(key) {
  const b = load().best[key]
  return b && Number.isFinite(b.score) ? b : null
}

/** Keeps the result if it beats the stored best. Returns true when it is a new best. */
export function recordResult(key, result) {
  const store = load()
  const prev = bestFor(key)
  if (prev && prev.score >= result.score) return false
  store.best[key] = {
    score: result.score,
    accuracy: result.accuracy,
    grade: result.grade,
    combo: result.maxCombo,
  }
  save()
  return true
}
