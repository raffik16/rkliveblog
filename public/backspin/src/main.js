// BACKSPIN: start-up, the screens, and the one loop that runs everything.
//
// The sounds are synthesized as soon as the page loads (that needs no AudioContext). The first
// click starts the audio. From then on a single requestAnimationFrame loop updates the clock, the
// game, the 3D club and the HUD over it. Inputs (keys, MIDI pads, the mouse, fingers) arrive as
// events with their own timestamps and are judged on the audio clock (clock.js), never on frame
// times.
//
// URL options:  ?mute  no sound   ?debug  timing readout   ?poster  a still frame for the share
// image   ?autoplay=easy,medium,hard  a bot plays the listed levels in a row (for testing), and
// with &practice=verse&speed=75 it practises instead   ?mouse, ?hybrid  play with the mouse, or
// in Hybrid, this time (the bot too: it clicks, and in Hybrid presses A, S, D and Space as well).
//
// How to play starts out as whatever suits the device (touch on a phone or a tablet, the keys
// and the mouse on a computer), and the player can pick another in the menus.

import { AudioEngine } from './engine.js'
import { Clock } from './clock.js'
import { Input, TOUCH_SCALE } from './input.js'
import { Game, FADE_VALUE } from './game.js'
import { Scene, RPS } from './scene.js'
import { Hud } from './hud.js'
import { loadChart, buildChart, practiceChart, LEVELS } from './chart.js'
import { settings, bestFor, bestKey, recordResult, SPEEDS } from './storage.js'
import { UI, formatMs } from './ui.js'
import { Calibration } from './calibrate.js'
import { Bot } from './bot.js'
import { Midi, noteName } from './midi.js'
import { BASE_BPM, BEAT, BPM, beatTime } from './music.js'
import { PADS, PAD_OF_KEY, HYBRID_PADS, HYBRID_PAD_OF_KEY, layoutFor } from './pads.js'
import { makeCursors } from './cursors.js'

const params = new URLSearchParams(location.search)
const MUTED = params.has('mute')
const DEBUG = params.has('debug')
const POSTER = params.has('poster')
const AUTOPLAY = params.has('autoplay')
  ? (params.get('autoplay') || 'hard').split(',').filter((l) => LEVELS.includes(l))
  : []
const AUTO_PRACTICE = params.get('practice')

const TURN = Math.PI * 2 * RPS // radians of platter per second of record
const FADE_KEY = { KeyZ: 'L', KeyX: 'C', KeyC: 'R' }
// What the device has: its main pointer is a finger (a phone, a tablet), it has a touch screen
// (those, and some laptops), it has a mouse or a trackpad (which can come and go on a tablet)
const COARSE = !window.matchMedia('(pointer: fine)').matches
const TOUCH = COARSE || navigator.maxTouchPoints > 0
const FINE = window.matchMedia('(any-pointer: fine)')
const FORCED = params.has('hybrid') ? 'hybrid' : params.has('mouse') ? 'mouse' : null
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const PRACTICE_SECTIONS = { verse: 1, scratch: 1, freestyle: 1, final: 1, song: 1 }

const stage = document.getElementById('stage')
const engine = new AudioEngine()
let scene = null
let sceneError = null
try {
  scene = new Scene(stage, { reduced: REDUCED })
} catch (err) {
  sceneError = err
}
const hud = new Hud(document.getElementById('hud'), { reduced: REDUCED })
let clock = null
let audioReady = null
let raw = null // the chart as written
let noteCounts = {}
let game = null
let bot = null
let calibration = null
let calResult = null
let lastResult = null
let mode = 'loading' // loading | menu | calibrate | play | sandbox | paused | results
let pausedFrom = null
let level = 'medium'
let practice = null // the practice settings while a practice run is on
let resumeTimer = 0
let autoTimer = 0
let lastHeard = 0 // how far the song's own pad hits have been shown
let lastSeq = 0 // the last game event shown
// How the game is played: 'keys' (the keys play the pads and the mouse turns the record),
// 'mouse' (it plays the picture, one click at a time), 'hybrid' (six pads: A, S and D play the
// kick, snare and clap, and the mouse the rest) or 'touch' (fingers on the picture)
let controls = 'keys'
const autoQueue = [...AUTOPLAY]
const trail = [] // screens to go Back to

// What the scene and the HUD draw this frame
const view = {
  mode: 'menu',
  live: false,
  controls: 'keys',
  t: 0,
  dt: 0.016,
  energy: 0.15,
  game: null,
  deckAngle: 0,
  deckSpeed: 0,
  deckHeld: false,
  beatAngle: 0,
  crossfader: 0.5,
  loop: 'A',
  autoPads: true,
  practice: null,
  precise: false,
  midi: '',
  liveScratch: null,
}
let sandboxHeat = 0

// ---- MIDI ---------------------------------------------------------------------------------

const midi = new Midi({
  onPad: (index, ms, vel) => hitPad(index, ms, vel),
  map: settings.midiMap,
  onChange: () => refreshMidi(),
})

function refreshMidi() {
  const names = midi.devices()
  view.midi = midi.state === 'on' && names.length ? shorten(names[0]) : ''
  ui.midi({
    state: midi.state,
    devices: names,
    learning: midi.learning,
    notes: PADS.map((_, i) => midi.noteFor(i)),
    last: midi.last
      ? `Last hit: ${noteName(midi.last.note)} (note ${midi.last.note}) → ${PADS[midi.last.pad].name}`
      : '',
  })
}

function shorten(name) {
  return name.length > 22 ? `${name.slice(0, 21)}…` : name
}

// A handle for tests and the curious (the console): results of autoplay runs, and the parts
const autoResults = (window.__backspin = {
  results: [],
  get engine() {
    return engine
  },
  get clock() {
    return clock
  },
  get game() {
    return game
  },
  get scene() {
    return scene
  },
  get midi() {
    return midi
  },
  get calibration() {
    return calibration
  },
  get mode() {
    return mode
  },
})

// ---- Input --------------------------------------------------------------------------------

// The hand on the record goes to the scratch deck (sound) and the game (scoring) alike
const hand = {
  down(ms) {
    engine.scratch({ t: 'down', at: ms / 1000 })
    if (mode === 'play') game.handDown()
  },
  move(list) {
    engine.scratch({ t: 'move', m: list })
    if (mode === 'play') game.handMove(list)
  },
  up(ms) {
    engine.scratch({ t: 'up', at: ms / 1000 })
    if (game) game.handUp()
  },
}

const input = new Input(
  stage,
  {
    ...hand,
    key: onKey,
    pad: (index, ms, vel) => hitPad(index, ms, vel),
    fader(x, ms, sliding) {
      const pos = x < 1 / 3 ? 'L' : x < 2 / 3 ? 'C' : 'R'
      // A slide only counts when it reaches another third of the fader
      if (sliding && FADE_VALUE[pos] === view.crossfader) return
      setFade(pos, ms)
    },
    tap: (x, y, hit, finger) => hud.tap(x, y, hit, finger),
  },
  {
    // The HUD's buttons sit over the club, so they come first
    hitTest: (x, y) => hud.hitTest(x, y) || scene.hitTest(x, y),
    faderAt: (x) => scene.faderAt(x),
  }
)
input.sensitivity = settings.sensitivity
input.cursors = makeCursors()

/** The ways to play this device has: the keys always, the mouse and Hybrid, touch. */
function controlsOffered() {
  const list = ['keys']
  if (FINE.matches) list.push('mouse', 'hybrid')
  if (TOUCH) list.push('touch')
  return list
}

/** How to play: the URL's, or the player's pick if this device has it, or what suits it. */
function applyControls() {
  const picked = settings.controls
  controls = FORCED || (controlsOffered().includes(picked) ? picked : COARSE ? 'touch' : 'keys')
  // Anything but the keys plays the picture, and a mouse there (a laptop's, a tablet's trackpad)
  // plays it the way a finger does
  input.pointerPlay = controls !== 'keys'
  view.controls = controls
  if (scene) scene.setControls(controls)
}

// A trackpad or a mouse plugged into a tablet (or taken away) changes what's on offer
FINE.addEventListener('change', () => {
  if (mode !== 'menu' && mode !== 'results') return
  applyControls()
  refreshMenus()
})

/** The chart the controls play: thinned for the mouse ('mouse', 'hybrid'), or whole (null). */
function chartControls() {
  return controls === 'mouse' || controls === 'hybrid' ? controls : null
}

// Where things are, for the bot when it plays by tapping and clicking
const botScreen = {
  stage,
  layout: () => scene.layout,
  button: (code) => hud.buttonAt(code),
  scale: () => (controls === 'touch' ? TOUCH_SCALE : 1) * input.sensitivity,
}

function onKey(code, ms) {
  if (code === 'Escape') {
    if (mode === 'play' || mode === 'sandbox') pause()
    else if (mode === 'calibrate' || (mode === 'menu' && trail.length)) back()
    return
  }
  // In Hybrid only A, S and D play pads: the mouse plays the rest
  const pads = controls === 'hybrid' ? HYBRID_PAD_OF_KEY : PAD_OF_KEY
  if (code in pads) return hitPad(pads[code], ms, 0.85)
  if (code in FADE_KEY) return setFade(FADE_KEY[code], ms)
  const digit = code.startsWith('Digit') ? Number(code.slice(5)) : 0
  if (mode === 'play') {
    // 'Boost' is the hype meter's button
    if (code === 'Space' || code === 'Boost') game.boost(ms)
    else if (digit >= 1 && digit <= 3) game.loop('ABC'[digit - 1], ms)
  } else if (mode === 'sandbox') {
    if (digit >= 1 && digit <= 3) {
      view.loop = 'ABC'[digit - 1]
      engine.jamLoop(view.loop)
    } else if (digit === 4) {
      view.autoPads = !view.autoPads
      engine.setAutoPads(view.autoPads)
    }
  }
}

/** A pad hit from the keys, a MIDI controller or a finger. */
function hitPad(index, ms, vel) {
  // Hybrid's six pads are all there is to play (a pad controller's other two do nothing)
  if ((mode === 'play' || mode === 'sandbox') && !layoutFor(controls).slots[index]) return
  if (mode === 'play') {
    game.pad(index, ms, vel)
  } else if (mode === 'sandbox') {
    engine.pad(index, vel, null, clock ? (clock.judged(ms) - engine.songStart) / BEAT : 0)
    sandboxHeat = Math.min(1, sandboxHeat + 0.06)
  } else if (ui.current === 'settings' && engine.ctx && engine.ctx.state === 'running') {
    // Trying the pads (and MIDI learn) in Settings
    engine.pad(index, vel)
    refreshMidi()
  } else {
    return
  }
  scene.press(index, vel)
}

function setFade(pos, ms) {
  if (mode === 'play') game.fade(pos, ms)
  else if (mode === 'sandbox') engine.setCrossfader(FADE_VALUE[pos])
  else return
  view.crossfader = FADE_VALUE[pos]
}

// Clicking the stage while playing (re)locks the mouse to the record (unless the mouse plays it all)
stage.addEventListener('pointerdown', (e) => {
  if (e.pointerType !== 'mouse' || controls !== 'keys') return
  if ((mode === 'play' && !bot) || mode === 'sandbox') input.lock()
})
document.addEventListener('pointerlockchange', () => {
  if (!input.locked && (mode === 'play' || mode === 'sandbox')) pause()
})
document.addEventListener('visibilitychange', () => {
  if (document.hidden && !bot && (mode === 'play' || mode === 'sandbox')) pause()
})

// Calibration taps: any key but Escape, or a click on the circle
window.addEventListener(
  'keydown',
  (e) => {
    if (mode !== 'calibrate' || !calibration || !calibration.running) return
    if (e.code === 'Escape' || e.metaKey || e.ctrlKey || e.altKey) return
    e.preventDefault()
    if (!e.repeat) calibration.tap(e.timeStamp)
  },
  true
)
document.getElementById('cal-pad').addEventListener('pointerdown', (e) => {
  if (mode === 'calibrate' && calibration && calibration.running) {
    e.preventDefault()
    calibration.tap(e.timeStamp)
  }
})

window.addEventListener('resize', () => {
  if (!scene) return
  scene.resize()
  hud.resize(scene.layout)
})

// ---- Screens ------------------------------------------------------------------------------

const actions = {
  play() {
    if (autoQueue.length) return startGame(autoQueue.shift())
    ensureAudio()
    if (mode === 'results') {
      // From the results, Back on the level list goes to the title
      stopPlay()
      mode = 'menu'
      trail.length = 0
      trail.push('title')
      refreshMenus()
      ui.show('difficulty')
      return
    }
    open('difficulty')
  },
  level(el) {
    startGame(el.dataset.level)
  },
  practice() {
    ensureAudio()
    if (mode === 'results') {
      stopPlay()
      mode = 'menu'
      trail.length = 0
      trail.push('title')
      refreshMenus()
      ui.show('practice')
      return
    }
    open('practice')
  },
  practiceSet(el) {
    const { key, value } = el.dataset
    settings.setPractice({ [key]: key === 'speed' || key === 'times' ? Number(value) : value })
    refreshMenus()
  },
  practiceGuide(el) {
    settings.setPractice({ guide: el.checked })
  },
  practiceStart() {
    startPractice()
  },
  sandbox() {
    startSandbox()
  },
  calibrate() {
    openCalibration()
  },
  settings() {
    ensureAudio()
    open('settings')
  },
  how() {
    open('how')
  },
  back() {
    back()
  },
  title() {
    toTitle()
  },
  resume() {
    resume()
  },
  restart() {
    restart()
  },
  retry() {
    if (lastResult && lastResult.practice) startPractice()
    else startGame(level)
  },
  sensitivity(value) {
    settings.sensitivity = value
    input.sensitivity = settings.sensitivity
    refreshMenus()
  },
  controls(el) {
    settings.controls = el.dataset.value
    applyControls()
    refreshMenus()
  },
  offsetDown() {
    setOffset(settings.offsetMs - 5)
  },
  offsetUp() {
    setOffset(settings.offsetMs + 5)
  },
  calStart() {
    startCalibration()
  },
  calSave() {
    if (calResult) {
      setOffset(calResult.offsetMs)
      settings.calibrated = true
    }
    back()
  },
  async midiConnect() {
    ensureAudio()
    if (await midi.connect()) settings.midiOn = true
    refreshMidi()
  },
  midiLearn(el) {
    const pad = Number(el.dataset.pad)
    midi.learn(midi.learning === pad ? -1 : pad, (note, p) => {
      settings.learnMidi(note, p)
      refreshMidi()
    })
    refreshMidi()
  },
  midiReset() {
    settings.resetMidi()
    midi.map = settings.midiMap
    midi.learn(-1)
    refreshMidi()
  },
}

const ui = new UI(document.getElementById('ui'), actions)

function open(name) {
  if (ui.current && ui.current !== name) trail.push(ui.current)
  refreshMenus()
  ui.show(name)
}

function back() {
  if (mode === 'calibrate') {
    if (calibration) calibration.cancel()
    mode = 'menu'
  }
  if (ui.current === 'settings') midi.learn(-1)
  refreshMenus()
  ui.show(trail.pop() || (mode === 'paused' ? 'pause' : 'title'))
}

function refreshMenus() {
  ui.settings({ sensitivity: settings.sensitivity, offsetMs: settings.offsetMs })
  ui.calibrated(settings.calibrated, settings.offsetMs)
  // The choice, where the device offers more than one way to play (and not in the middle of a run)
  const offered = controlsOffered()
  ui.controls(controls, offered.length > 1 && mode !== 'paused', offered)
  ui.touchNotice(controls === 'touch')
  const style = chartControls()
  if (raw) {
    ui.levels(
      LEVELS.map((l) => ({
        level: l,
        notes: noteCounts[l][style || 'keys'],
        best: bestFor(bestKey(l, style)),
      }))
    )
  }
  ui.practice(settings.practice)
  refreshMidi()
  // Calibrating plays clicks, which would mean un-pausing the song: not from the pause menu
  for (const el of document.querySelectorAll(
    '[data-screen="settings"] [data-action="calibrate"]'
  )) {
    el.hidden = mode === 'paused'
  }
}

function setOffset(ms) {
  settings.offsetMs = ms
  if (clock) clock.offset = settings.offsetMs / 1000
  refreshMenus()
}

function toTitle() {
  stopPlay()
  if (engine.ctx && engine.ctx.state !== 'running') engine.resume()
  mode = 'menu'
  trail.length = 0
  refreshMenus()
  ui.show('title')
}

/** Stop the song, the bot and the hand, and let go of the mouse. */
function stopPlay() {
  clearTimeout(resumeTimer)
  clearTimeout(autoTimer)
  ui.countdown('')
  ui.preparing(null)
  if (bot) bot.stop()
  bot = null
  input.release(performance.now())
  input.active = false
  input.unlock()
  if (engine.ctx) {
    engine.hush()
    engine.stopSong()
    engine.scratch({ t: 'reset' })
  }
  game = null
}

// ---- Audio --------------------------------------------------------------------------------

/** Start (or wake) the audio. Call from a click: browsers only allow sound after one. */
function ensureAudio() {
  if (!audioReady) {
    audioReady = engine
      .start({ muted: MUTED })
      .then(() => {
        clock = new Clock(engine.ctx)
        clock.offset = settings.offsetMs / 1000
        return true
      })
      .catch((err) => {
        console.error(err)
        audioReady = null
        const why = window.AudioWorkletNode
          ? err.message
          : 'this browser has no AudioWorklet (it needs https or localhost)'
        ui.fail(`The audio engine couldn't start: ${why}.`)
        mode = 'loading'
        return false
      })
  }
  return audioReady.then(async (ok) => {
    if (ok && engine.ctx.state !== 'running') await engine.resume()
    return ok
  })
}

/** Put the band at a tempo (rendering its loops again if they haven't been at that one). */
async function tempo(bpm) {
  if (bpm === BPM && engine.tempoSounds.has(bpm)) return
  const slow = !engine.tempoSounds.has(bpm)
  if (slow) ui.preparing(0)
  await engine.setTempo(bpm, (f) => ui.preparing(f))
  ui.preparing(null)
}

// ---- Play ---------------------------------------------------------------------------------

/** Everything a run needs before it starts, after the click that started it. */
async function begin(lock) {
  stopPlay()
  if (lock && controls === 'keys') input.lock() // still inside the click, or the browser refuses
  trail.length = 0
  ui.hide()
  return ensureAudio()
}

function run(chart) {
  view.crossfader = 0.5
  engine.setCrossfader(0.5)
  game = new Game({ engine, clock, chart })
  game.start(2.4)
  lastSeq = 0
  lastHeard = clock.heardNow()
  const auto = AUTOPLAY.length > 0
  bot = auto
    ? new Bot(game, hand, onKey, {
        miss: Number(params.get('miss')) || 0,
        jitter: Number(params.get('jitter')) || 0,
        pointer: controls === 'keys' ? null : controls === 'hybrid' ? 'mouse' : controls,
        screen: botScreen,
        keyPads:
          controls === 'hybrid' ? Object.fromEntries(HYBRID_PADS.map((h) => [h.pad, h.key])) : null,
      })
    : null
  input.sensitivity = settings.sensitivity
  input.active = playerInput()
  mode = 'play'
}

/** Input is live for a player, and for the bot when it plays by tapping or clicking. */
function playerInput() {
  return !bot || !!bot.pointer
}

async function startGame(lvl) {
  const auto = AUTOPLAY.length > 0
  if (!(await begin(!auto))) return
  level = lvl
  practice = null
  engine.guide = false
  if (auto && AUTO_PRACTICE) {
    // Testing practice with the bot
    settings.setPractice({
      section: AUTO_PRACTICE,
      level: lvl,
      speed: Number(params.get('speed')) || 75,
      times: Number(params.get('times')) || 1,
    })
    return startPractice()
  }
  await tempo(BASE_BPM)
  run(buildChart(raw, lvl, { controls: chartControls() }))
}

async function startPractice() {
  const auto = AUTOPLAY.length > 0
  const p = { ...settings.practice }
  if (!PRACTICE_SECTIONS[p.section]) p.section = 'verse'
  if (!SPEEDS.includes(p.speed)) p.speed = 75
  if (!(await begin(!auto))) return
  await tempo(Math.round((BASE_BPM * p.speed) / 100))
  practice = p
  engine.guide = p.guide
  const whole = p.section === 'song'
  const chart = buildChart(
    practiceChart(raw, whole ? null : p.section, whole ? 1 : p.times),
    p.level,
    { controls: chartControls() }
  )
  level = p.level
  run(chart)
}

async function startSandbox() {
  if (!(await begin(true))) return
  practice = null
  engine.guide = false
  await tempo(BASE_BPM)
  view.crossfader = 0.5
  engine.setCrossfader(0.5)
  view.loop = 'A'
  view.autoPads = true
  engine.startJam('A')
  engine.setAutoPads(true)
  lastHeard = clock.heardNow()
  input.sensitivity = settings.sensitivity
  input.active = true
  mode = 'sandbox'
}

function pause() {
  if (mode !== 'play' && mode !== 'sandbox') return
  pausedFrom = mode
  mode = 'paused'
  clearTimeout(resumeTimer)
  input.release(performance.now())
  input.active = false
  input.unlock()
  if (bot) bot.stop()
  engine.pause()
  ui.pauseFor(pausedFrom === 'sandbox', !!practice)
  trail.length = 0
  ui.show('pause')
}

function resume() {
  if (mode !== 'paused') return
  if (!bot && controls === 'keys') input.lock()
  ui.hide()
  let n = 3
  ui.countdown(String(n))
  const step = () => {
    n--
    if (n > 0) {
      ui.countdown(String(n))
      resumeTimer = setTimeout(step, 420)
      return
    }
    ui.countdown('')
    engine.resume().then(() => {
      if (mode !== 'paused' || ui.current) return
      mode = pausedFrom
      input.active = playerInput()
    })
  }
  resumeTimer = setTimeout(step, 420)
}

function restart() {
  if (pausedFrom === 'sandbox') return startSandbox()
  if (practice) return startPractice()
  startGame(level)
}

function finish() {
  mode = 'results'
  const result = (lastResult = game.result())
  const auto = !!bot
  if (bot) bot.stop()
  bot = null
  input.release(performance.now())
  input.active = false
  input.unlock()
  const style = game.chart.controls
  const isBest = !auto && !result.practice && recordResult(bestKey(result.level, style), result)
  const what = practice ? `Practice · ${sectionName(practice.section)} · ${practice.speed}%` : null
  ui.results(result, isBest, raw.title, what, style)
  ui.show('results')
  if (auto) {
    autoResults.results.push(result)
    console.info('[autoplay]', JSON.stringify(result))
    if (autoQueue.length) autoTimer = setTimeout(() => startGame(autoQueue.shift()), 2500)
  }
}

function sectionName(id) {
  if (id === 'song') return 'Whole song'
  const s = raw.sections.find((x) => x.type === id)
  return s ? s.label : id
}

// ---- Calibration --------------------------------------------------------------------------

async function openCalibration() {
  if (!(await ensureAudio())) return
  if (!calibration) {
    calibration = new Calibration(engine, clock, {
      pulse: (label, amount, slot) => ui.calPulse(label, amount, slot),
      tap: (slot, ms) => ui.calTap(slot, ms),
      done: (result, taps) => {
        calResult = result
        ui.calDone(result, taps)
      },
    })
  }
  calResult = null
  ui.calReset()
  open('calibrate')
  mode = 'calibrate'
}

function startCalibration() {
  if (document.activeElement) document.activeElement.blur()
  calResult = null
  ui.calReset()
  ui.calRunning()
  calibration.start()
}

// ---- The loop -----------------------------------------------------------------------------

let last = performance.now()
let frames = 0
let fpsAt = last
let fps = 60
let slowFor = 0 // seconds of slow frames in a row, to lower the quality
let modeSince = 0
let lastMode = mode
let playingClass = false // body.playing: the page's styles know a run is on (the rotate hint)
const debugEl = DEBUG ? document.getElementById('debug') : null
const onSongHit = (pad) => scene.songHit(pad)

function frame(now) {
  requestAnimationFrame(frame)
  const dt = Math.min(0.1, Math.max(0.0005, (now - last) / 1000))
  last = now
  if (clock) clock.update()

  if (mode === 'play') {
    if (bot) bot.update()
    game.update(dt)
    if (game.finished) finish()
  } else if (mode === 'sandbox') {
    engine.keepJamGoing()
  } else if (mode === 'calibrate' && calibration) {
    calibration.update()
  }

  // The song's own pad hits light their pads as they're heard
  if (clock && (mode === 'play' || mode === 'sandbox')) {
    const heard = clock.heardNow()
    if (heard > lastHeard) engine.autoHits(lastHeard, heard, onSongHit)
    lastHeard = heard
  }
  // The game's judgements and calls, to the club and the HUD
  if (game) {
    const events = game.events
    for (let i = 0; i < events.length; i++) {
      const e = events[i]
      if (e.seq <= lastSeq) continue
      lastSeq = e.seq
      scene.event(e)
      hud.event(e, scene.layout)
    }
  }

  const playing = mode === 'play' || mode === 'sandbox'
  if (playing !== playingClass) {
    playingClass = playing
    document.body.classList.toggle('playing', playing)
  }

  // Before drawing: a lower resolution resizes the canvas, and that wipes what's on it
  adaptQuality(dt)
  updateView(now, dt)
  scene.draw(view)
  view.liveScratch = scene.liveScratch
  hud.draw(view, scene.layout)
  ui.lockHint(
    controls === 'keys' &&
      ((mode === 'play' && !bot) || mode === 'sandbox') &&
      !input.locked &&
      !input.held
  )

  if (debugEl && ++frames % 15 === 0) {
    fps = Math.round((15 * 1000) / (now - fpsAt))
    fpsAt = now
    showDebug()
  }
}

/** If frames keep coming slowly while playing, draw less: a lower resolution, then no glow. */
function adaptQuality(dt) {
  if (mode !== lastMode) {
    lastMode = mode
    modeSince = 0
  }
  modeSince += dt
  const playing = mode === 'play' || mode === 'sandbox'
  if (!playing || modeSince < 3 || document.hidden) {
    slowFor = 0
    return
  }
  slowFor = dt > 1 / 40 ? slowFor + dt : Math.max(0, slowFor - dt * 0.5)
  if (slowFor > 2) {
    slowFor = 0
    modeSince = 0
    if (scene.lowerQuality()) hud.resize(scene.layout)
  }
}

function updateView(now, dt) {
  view.dt = dt
  const showing = mode === 'paused' ? pausedFrom : mode
  view.mode = showing === 'results' ? 'play' : showing
  view.live = mode === 'play' || mode === 'sandbox'
  const ctx = engine.ctx

  // Which time to draw at: the game's (frozen while paused), the jam's, or idle menu time
  if (game && (showing === 'play' || showing === 'results')) {
    view.game = game
    view.t = game.time
  } else {
    view.game = null
    if (mode === 'sandbox') view.t = clock.judged(now) - engine.songStart
    else if (mode !== 'paused') view.t += dt
  }
  view.practice = game ? practice : null
  view.precise = !!view.practice

  if (ctx) {
    view.deckAngle = engine.deckPosition() * TURN
    view.deckSpeed = mode === 'paused' ? 0 : engine.deck.speed
  }
  view.deckHeld = input.held

  // The Beat Deck's platter turns while the song plays (and slows in the brake at the end)
  let rate = 0
  if (mode === 'play' && game.time >= 0) rate = engine.beatDeckRate(ctx.currentTime)
  else if (mode === 'sandbox') rate = 1
  view.beatAngle = (view.beatAngle + dt * rate * TURN) % (Math.PI * 2)

  if (view.game) view.crossfader = FADE_VALUE[game.crossfader]

  // How hard the crowd is going
  let target = 0.14
  if (view.game) {
    target = 0.1 + 0.75 * (game.hype / 100) + 0.35 * game.free.heat
    if (game.boosting) target = 1
    if (mode === 'results' && lastResult) target = 0.15 + 0.85 * (lastResult.crowdLevel / 100)
  } else if (mode === 'sandbox') {
    const speed = Math.min(1, Math.abs(view.deckSpeed) / 2.5)
    // Scratching and drumming warm the crowd up; they cool off slowly
    if (speed > sandboxHeat) sandboxHeat += (speed - sandboxHeat) * Math.min(1, dt * 5)
    else sandboxHeat = Math.max(0, sandboxHeat - dt * 0.12)
    target = 0.15 + 0.85 * sandboxHeat
  }
  view.energy += (Math.min(1, target) - view.energy) * Math.min(1, dt * 2.5)
}

function showDebug() {
  const lines = [`fps ${fps}   mode ${mode}   bpm ${BPM}`]
  if (clock) {
    lines.push(
      `output latency ${(clock.latency * 1000).toFixed(1)} ms   offset ${formatMs(clock.offset * 1000)}`
    )
  }
  const d = engine.deck
  lines.push(`deck pos ${d.pos.toFixed(3)} s   speed ${d.speed.toFixed(2)}x   mode ${d.mode}`)
  if (game) {
    lines.push(
      `t ${game.time.toFixed(3)}   next ${game.next}/${game.notes.length}   hype ${game.hype.toFixed(0)}   combo ${game.combo}`
    )
  }
  lines.push(`pointer ${input.raw ? 'pointerrawupdate' : 'pointermove'}   locked ${input.locked}`)
  lines.push(
    `render ${scene.renderer.getPixelRatio().toFixed(2)}x   glow ${scene.bloomOn}   midi ${midi.state}`
  )
  debugEl.textContent = lines.join('\n')
}

// ---- Start-up -----------------------------------------------------------------------------

function fontsReady() {
  if (!document.fonts || !document.fonts.load) return Promise.resolve()
  return Promise.race([
    document.fonts.load('800 20px Unbounded').catch(() => {}),
    new Promise((resolve) => setTimeout(resolve, 2500)),
  ])
}

/** A still frame for the share image: the final section on Hard, crowd going, meter full. */
async function poster() {
  document.body.classList.add('poster')
  ui.hide()
  await fontsReady()
  scene.redrawText()
  scene.resize()
  hud.resize(scene.layout)
  const chart = buildChart(raw, 'hard')
  const g = new Game({ engine: {}, clock: { judged: () => 0 }, chart })
  const t = beatTime(Number(params.get('beat')) || 115.32)
  g.time = t
  for (const n of chart.notes) {
    if (n.time < t - 0.05) {
      n.judged = true
      n.grade = 'perfect'
      if (n.type === 'scratch') n.good = n.end - n.time
    }
  }
  while (g.next < g.notes.length && g.notes[g.next].judged) g.next++
  g.score = 84720
  g.combo = 61
  g.maxCombo = 61
  g.hype = 100
  g.crossfader = 'C'
  // The hits just landed: the clap and the horn
  const landed = chart.notes.filter((n) => n.type === 'pad' && n.time < t && n.time > t - 0.4)
  for (const n of landed) {
    scene.press(n.pad, 1)
    const e = {
      kind: 'judge',
      grade: 'perfect',
      lane: n.lane,
      note: n,
      error: 0.004,
      at: performance.now() - 60,
    }
    scene.event(e)
    hud.event(e, scene.layout)
  }
  Object.assign(view, {
    mode: 'play',
    game: g,
    t,
    dt: 0.016,
    energy: 0.95,
    deckAngle: 2.3,
    deckSpeed: -2.6,
    deckHeld: true,
    beatAngle: 0.8,
    crossfader: 0.5,
  })
  // A few frames, so the sparks have spread
  for (let i = 0; i < 8; i++) scene.draw(view)
  view.liveScratch = scene.liveScratch
  hud.draw(view, scene.layout)
  document.body.dataset.ready = 'true'
}

async function boot() {
  if (!scene) {
    console.error(sceneError)
    ui.fail(
      'BACKSPIN draws its club with WebGL, and this browser couldn’t start it. ' +
        'Try a current version of Chrome, Edge, Firefox or Safari, with hardware acceleration on.'
    )
    return
  }
  applyControls()
  ui.show('loading')
  ui.progress(0)
  hud.resize(scene.layout)
  if (!POSTER) requestAnimationFrame(frame)
  fontsReady().then(() => {
    scene.redrawText()
    hud.resize(scene.layout)
  })
  try {
    const [chart] = await Promise.all([
      loadChart(new URL('./charts/track1.json', import.meta.url)),
      POSTER ? null : engine.prepare((f) => ui.progress(f)),
    ])
    raw = chart
  } catch (err) {
    console.error(err)
    ui.fail(`Something went wrong while building the sounds: ${err.message}`)
    return
  }
  for (const l of LEVELS) {
    noteCounts[l] = {
      keys: buildChart(raw, l).notes.length,
      mouse: buildChart(raw, l, { controls: 'mouse' }).notes.length,
      hybrid: buildChart(raw, l, { controls: 'hybrid' }).notes.length,
    }
  }
  if (POSTER) {
    poster()
    return
  }
  ui.progress(1)
  mode = 'menu'
  refreshMenus()
  ui.show('title')
  if (DEBUG && debugEl) debugEl.hidden = false
  if (settings.midiOn) midi.resume().then(() => refreshMidi())
}

boot()
