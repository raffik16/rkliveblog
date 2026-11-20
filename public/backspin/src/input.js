// Mouse, keyboard and touch. The mouse is the record: hold the left button to put your hand on
// it, and up/down movement turns it. Pointer Lock keeps the cursor from running off the screen
// and reports raw movement; every movement keeps its own timestamp (see scratch-worklet.js for
// why). The keys are the pads, the crossfader and the rest.
//
// On a touch screen the picture is the controller: tap the pads, drag a finger up and down on
// the record, tap or slide the crossfader, and tap the buttons the HUD draws (the hype meter,
// pause, the loops). Every finger is its own pointer, so you can drum with one hand and scratch
// with the other. Played with the mouse, in Hybrid or with touch chosen (`pointerPlay`), the
// mouse plays the picture the same way, one click at a time: no pointer lock. Then the cursor
// says what a click would do (cursors.js draws them), and each click or tap that hits something
// is passed on (`tap`) for the HUD to flash.

import { PAD_OF_KEY } from './pads.js'

// Seconds of record per pixel of mouse movement at sensitivity 1. A comfortable 300-pixel
// stroke covers about half a second: the length of the "ahh".
export const RECORD_PER_PIXEL = 0.0016
// A finger moves in screen pixels, not raw mouse counts: give it a little more reach
export const TOUCH_SCALE = 1.6

const GAME_KEYS = new Set([
  ...Object.keys(PAD_OF_KEY),
  'KeyZ',
  'KeyX',
  'KeyC',
  'Space',
  'Digit1',
  'Digit2',
  'Digit3',
  'Digit4',
])

export class Input {
  /**
   * handlers: { down(at), move(list), up(at), key(code, at), pad(index, at, vel),
   * fader(x, at, sliding), tap(x, y, hit, finger) } with times in page milliseconds, and move
   * lists flat: [distance, t0, t1, ...] in seconds of record and page seconds.
   *
   * screen.hitTest(x, y) says what is under a finger or the cursor: { kind: 'pad', index } |
   * { kind: 'record' } | { kind: 'fader', x } | { kind: 'key', code } (a button on the HUD that
   * stands in for a key) | null. screen.faderAt(x) is how far along the crossfader (0..1) a
   * screen x is.
   */
  constructor(element, handlers, screen) {
    this.el = element
    this.h = handlers
    this.screen = screen
    this.live = false
    this.pointerPlay = false
    this.held = false
    this.sensitivity = 1
    this.lastT = null
    this.gap = 0.008
    this.list = []
    this.recordPointer = -1 // the finger (or the mouse, in pointer play) on the record
    this.pointerY = 0
    this.faderPointer = -1 // the finger (or the mouse) sliding the crossfader
    this.cursors = {} // CSS cursors by name (see cursors.js)
    this.cursor = ''
    this.mouseX = -1 // where the mouse was last seen, to pick a cursor before it moves
    this.mouseY = -1
    const raw = 'onpointerrawupdate' in window
    this.raw = raw

    document.addEventListener('pointerdown', (e) => this.onDown(e))
    document.addEventListener('pointerup', (e) => this.onUp(e))
    document.addEventListener('pointercancel', (e) => this.onUp(e))
    document.addEventListener(raw ? 'pointerrawupdate' : 'pointermove', (e) => this.onMove(e))
    document.addEventListener('pointermove', (e) => this.onPointMove(e))
    window.addEventListener('blur', () => this.release(performance.now()))
    window.addEventListener('keydown', (e) => this.onKey(e))
    this.el.addEventListener('contextmenu', (e) => e.preventDefault())
  }

  /** Scratching, pads and game keys are live. */
  get active() {
    return this.live
  }

  set active(on) {
    this.live = on
    if (on && this.pointerPlay) this.hoverAt(this.mouseX, this.mouseY)
    else this.setCursor('')
  }

  get locked() {
    return document.pointerLockElement === this.el
  }

  /** Ask for pointer lock. Must run inside a click or key press. Fine if it fails. */
  lock() {
    if (this.locked || !this.el.requestPointerLock) return
    try {
      const p = this.el.requestPointerLock()
      if (p && p.catch) p.catch(() => {})
    } catch {
      // not allowed right now: the game still works, the cursor just stays visible
    }
  }

  unlock() {
    if (this.locked) document.exitPointerLock()
  }

  onDown(e) {
    if (!this.active) return
    if (e.pointerType !== 'mouse' || this.pointerPlay) {
      this.onPointDown(e)
      return
    }
    if (e.button !== 0) return
    // Without the lock, only presses on the game itself count (not on menus)
    if (!this.locked && e.target !== this.el) return
    e.preventDefault()
    this.held = true
    this.lastT = null
    this.h.down(e.timeStamp)
  }

  onUp(e) {
    if (e.pointerId === this.faderPointer) this.faderPointer = -1
    if (e.pointerId === this.recordPointer) {
      this.recordPointer = -1
      this.release(e.timeStamp)
    } else if (e.pointerType === 'mouse' && !this.pointerPlay && e.button === 0) {
      this.release(e.timeStamp)
    }
    if (this.active && this.pointerPlay && e.pointerType === 'mouse') this.hover(e)
  }

  release(at) {
    this.recordPointer = -1
    this.faderPointer = -1
    if (!this.held) return
    this.held = false
    this.h.up(at)
    if (this.live && this.pointerPlay) this.hoverAt(this.mouseX, this.mouseY)
  }

  /** The locked mouse on the record. */
  onMove(e) {
    if (!this.active || !this.held || e.pointerType !== 'mouse' || this.pointerPlay) return
    const list = this.list
    list.length = 0
    let events = null
    if (!this.raw && e.getCoalescedEvents) events = e.getCoalescedEvents()
    if (!events || events.length === 0) this.addMove(e.movementY, e.timeStamp, list)
    else
      for (let i = 0; i < events.length; i++)
        this.addMove(events[i].movementY, events[i].timeStamp, list)
    if (list.length) this.h.move(list)
  }

  addMove(dy, timeStamp, list, scale = 1) {
    if (!dy) return
    let t1 = timeStamp / 1000
    let t0 = this.lastT
    if (t0 === null || t1 - t0 > 0.05) {
      // The first movement after a rest: assume it took a typical report interval
      t0 = t1 - Math.min(0.012, this.gap)
    } else if (t1 <= t0) {
      t1 = t0 + 0.0005
    } else {
      this.gap += 0.2 * (t1 - t0 - this.gap)
    }
    this.lastT = t1
    // Up is forward
    list.push(-dy * RECORD_PER_PIXEL * this.sensitivity * scale, t0, t1)
  }

  // ---- Fingers, and the mouse in pointer play ------------------------------------------------

  onPointDown(e) {
    if (e.target !== this.el || (e.pointerType === 'mouse' && e.button !== 0)) return
    const hit = this.screen.hitTest(e.clientX, e.clientY)
    if (!hit) return
    e.preventDefault()
    if (hit.kind !== 'record') this.h.tap(e.clientX, e.clientY, hit, e.pointerType !== 'mouse')
    if (hit.kind === 'pad') {
      // Pressure, where the screen reports it (0.5 means "doesn't know")
      const vel = e.pressure > 0 && e.pressure !== 0.5 ? 0.35 + 0.65 * e.pressure : 0.85
      this.h.pad(hit.index, e.timeStamp, vel)
    } else if (hit.kind === 'key') {
      this.h.key(hit.code, e.timeStamp)
    } else if (hit.kind === 'fader') {
      this.faderPointer = e.pointerId
      this.h.fader(hit.x, e.timeStamp, false)
    } else if (hit.kind === 'record' && this.recordPointer < 0) {
      this.recordPointer = e.pointerId
      this.pointerY = e.clientY
      this.held = true
      this.lastT = null
      this.h.down(e.timeStamp)
      if (e.pointerType === 'mouse') this.setCursor('scratch')
    }
  }

  onPointMove(e) {
    if (e.pointerType === 'mouse') {
      this.mouseX = e.clientX
      this.mouseY = e.clientY
    }
    if (!this.active) return
    const fader = e.pointerId === this.faderPointer
    if (!fader && (e.pointerId !== this.recordPointer || !this.held)) {
      if (this.pointerPlay && e.pointerType === 'mouse' && !e.buttons) this.hover(e)
      return
    }
    const events = e.getCoalescedEvents ? e.getCoalescedEvents() : []
    const all = events.length ? events : [e]
    if (fader) {
      // Sliding the crossfader: each sample, so a cut is timed where it crossed
      for (let i = 0; i < all.length; i++) {
        this.h.fader(this.screen.faderAt(all[i].clientX), all[i].timeStamp, true)
      }
      return
    }
    const list = this.list
    list.length = 0
    const scale = e.pointerType === 'mouse' ? 1 : TOUCH_SCALE
    for (let i = 0; i < all.length; i++) {
      const dy = all[i].clientY - this.pointerY
      this.pointerY = all[i].clientY
      this.addMove(dy, all[i].timeStamp, list, scale)
    }
    if (list.length) this.h.move(list)
  }

  /** In pointer play the cursor says what a click there would do. */
  hover(e) {
    this.hoverAt(e.clientX, e.clientY)
  }

  hoverAt(x, y) {
    if (this.held) return
    const hit = this.screen.hitTest(x, y)
    this.setCursor(
      !hit
        ? 'aim'
        : hit.kind === 'pad'
          ? `pad${hit.index}`
          : hit.kind === 'record'
            ? 'record'
            : 'target'
    )
  }

  /** A cursor by name ('aim', 'pad0'…'pad7', 'target', 'record', 'scratch'), or '' for none. */
  setCursor(name) {
    if (name === this.cursor) return
    this.cursor = name
    this.el.style.cursor = (name && this.cursors[name]) || ''
    this.el.dataset.cursor = name
  }

  // ---- Keys ---------------------------------------------------------------------------------

  onKey(e) {
    if (e.code === 'Escape') {
      this.h.key('Escape', e.timeStamp)
      return
    }
    if (!this.active || !GAME_KEYS.has(e.code)) return
    if (e.metaKey || e.ctrlKey || e.altKey) return
    e.preventDefault()
    if (e.repeat) return
    this.h.key(e.code, e.timeStamp)
  }
}
