// Autoplay, for testing the whole game without a person: ?autoplay=hard, or
// ?autoplay=easy,medium,hard to play all three in a row. It goes through the same paths a
// player's input does (keys and record movement with page timestamps), presses each pad as its
// note reaches the pads, and has a go at the freestyle: a finger-drum groove, scratching on the
// 8ths, switching loops, cutting the crossfader and boosting when the meter fills. Add &miss=0.2
// to skip a fifth of the notes and &jitter=0.1 to be up to 100 ms late on the rest.
//
// Played with the mouse (&mouse) or on a touch screen, it taps the picture instead: pointer
// events on the stage where a player's finger or cursor would go (the pads, the record, the
// fader, the buttons the HUD draws), so the hit tests are tested too. The mouse is one pointer,
// so it lets go of the record before it clicks anything else. In Hybrid (&hybrid) it presses
// A, S and D for the kick, the snare and the clap, and Space for the boost, and clicks the rest.

import { BEAT } from './music.js'
import { PADS } from './pads.js'
import { FADE_VALUE } from './game.js'
import { RECORD_PER_PIXEL } from './input.js'

const FADE_KEY = { L: 'KeyZ', C: 'KeyX', R: 'KeyC' }
const HAND_SPEED = 1.8 // record seconds per second
const POINTER_HAND_SPEED = 1.2 // slower with a cursor or a finger, which can run out of screen

// The freestyle groove, in 8th notes through a bar: which pad keys to press on each
const GROOVE = [
  ['KeyA', 'KeyW'], // kick and crash on the one
  [],
  ['KeyS'], // snare
  ['KeyE'], // vox
  ['KeyA'],
  ['KeyA', 'KeyZ'], // kick, and cut the beat out
  ['KeyS', 'KeyX'], // snare, beat back in
  ['KeyR'], // horn
]

export class Bot {
  /**
   * hand: { down(ms), move(list), up(ms) }, key(code, ms): the same handlers the Input uses.
   * pointer: null (keys), 'mouse' or 'touch', with screen: { stage, layout(), button(code),
   * scale() } to know where things are and how far a pixel turns the record. keyPads: { [pad]:
   * key code } for the pads it plays on the keys while the pointer does the rest (Hybrid).
   */
  constructor(
    game,
    hand,
    key,
    { miss = 0, jitter = 0, pointer = null, screen = null, keyPads = null } = {}
  ) {
    this.game = game
    this.hand = hand
    this.key = key
    this.miss = miss // chance of skipping a note altogether
    this.jitter = jitter // up to this many seconds late on each note
    this.pointer = pointer
    this.screen = screen
    this.keyPads = keyPads
    this.down = false
    this.lastMs = 0
    this.bar = -1
    this.eighth = -1
    this.list = [0, 0, 0]
    this.handY = 0
    this.handId = pointer === 'mouse' ? 1 : 2
    this.nextFinger = 10
  }

  update() {
    const g = this.game
    const ms = performance.now()
    const dt = this.lastMs ? Math.min(0.05, (ms - this.lastMs) / 1000) : 0.016
    this.lastMs = ms
    const t = g.now

    // Pads and crossfader cuts, as each note reaches the pads
    let dir = 0
    for (let i = g.next; i < g.notes.length; i++) {
      const n = g.notes[i]
      if (n.time > t) break
      if (n.judged) continue
      if (n.botAt === undefined) {
        n.botAt = Math.random() < this.miss ? Infinity : n.time + Math.random() * this.jitter
      }
      if (n.type === 'scratch') {
        if (t < n.end && t >= n.botAt) dir = n.dir
      } else if (!n.bot && t >= n.botAt) {
        n.bot = true
        if (!this.pointer) this.key(n.type === 'fade' ? FADE_KEY[n.pos] : PADS[n.pad].key, ms)
        else if (n.type === 'fade') this.tapFader(n.pos)
        else this.playPad(n.pad, ms)
      }
    }

    const f = g.freestyleAt(t)
    if (f) dir = this.pointer ? this.freestyleTaps(f, t, ms) : this.freestyle(f, t, ms)
    else this.bar = this.eighth = -1

    // The hand on the record, moving the way the arrow points
    if (dir) {
      if (!this.down) this.grab(ms)
      this.turn(dir, dt, ms)
    } else if (this.down) {
      this.letGo(ms)
    }

    if (g.hype >= 100 && !g.boosting) {
      if (!this.pointer || this.keyPads) this.key('Space', ms)
      else if (this.pointer === 'touch' || !this.down) this.tapButton('Boost')
    }
  }

  freestyle(f, t, ms) {
    const beats = (t - f.start) / BEAT
    const bar = Math.floor(beats / 4)
    if (bar !== this.bar) {
      this.bar = bar
      this.key(`Digit${1 + ((bar + 1) % 3)}`, ms)
    }
    const eighth = Math.floor(beats * 2)
    if (eighth !== this.eighth) {
      this.eighth = eighth
      for (const code of GROOVE[eighth % 8]) {
        // The laser on the last 8th of every other bar, in place of the horn
        this.key(code === 'KeyR' && bar % 2 ? 'KeyQ' : code, ms)
      }
    }
    // Back and forth on the 8ths
    return eighth % 2 ? -1 : 1
  }

  /**
   * The freestyle with one thing at a time, by 8ths through each bar: a new loop, three 8ths of
   * scratching, the kick, a cut and back, then the horn, the vox, the laser or the snare (those
   * of them the layout has: Hybrid has no laser).
   */
  freestyleTaps(f, t, ms) {
    const beats = (t - f.start) / BEAT
    const bar = Math.floor(beats / 4)
    const eighth = Math.floor(beats * 2)
    const step = eighth % 8
    if (eighth !== this.eighth) {
      this.eighth = eighth
      if (step === 0) this.tapButton(`Digit${1 + ((bar + 1) % 3)}`)
      else if (step === 4) this.playPad(0, ms)
      else if (step === 5) this.tapFader('L')
      else if (step === 6) this.tapFader('C')
      else if (step === 7) {
        const pads = this.screen.layout().pads
        const last = [7, 6, 4, 1].filter((i) => !pads[i].hidden)
        this.playPad(last[bar % last.length], ms)
      }
    }
    return step >= 1 && step <= 3 ? (eighth % 2 ? -1 : 1) : 0
  }

  // ---- The hand on the record -----------------------------------------------------------------

  grab(ms) {
    this.down = true
    if (!this.pointer) {
      this.hand.down(ms)
      return
    }
    const deck = this.screen.layout().decks[0]
    this.handY = deck.y
    this.send('pointerdown', this.handId, deck.x, deck.y, 1)
  }

  turn(dir, dt, ms) {
    if (!this.pointer) {
      this.list[0] = dir * HAND_SPEED * dt
      this.list[1] = (ms - dt * 1000) / 1000
      this.list[2] = ms / 1000
      this.hand.move(this.list)
      return
    }
    // Up the screen is forward
    this.handY -= (dir * POINTER_HAND_SPEED * dt) / (RECORD_PER_PIXEL * this.screen.scale())
    this.send('pointermove', this.handId, this.screen.layout().decks[0].x, this.handY, 1)
  }

  letGo(ms) {
    this.down = false
    if (!this.pointer) this.hand.up(ms)
    else this.send('pointerup', this.handId, this.screen.layout().decks[0].x, this.handY, 0)
  }

  // ---- Taps -------------------------------------------------------------------------------------

  /** A pad: on its key if it has one (Hybrid), or a tap on the picture. */
  playPad(index, ms) {
    const code = this.keyPads && this.keyPads[index]
    if (code) this.key(code, ms)
    else this.tapPad(index)
  }

  tapPad(index) {
    const p = this.screen.layout().pads[index]
    this.tap(p.x, p.y)
  }

  tapFader(pos) {
    const f = this.screen.layout().fader
    this.tap(f.x0 + FADE_VALUE[pos] * (f.x1 - f.x0), f.y)
  }

  /** A button the HUD draws (it stands in for a key), if it's showing. */
  tapButton(code) {
    const at = this.screen.button(code)
    if (at) this.tap(at.x, at.y)
  }

  tap(x, y) {
    // The mouse is one pointer: it has to leave the record first
    if (this.pointer === 'mouse' && this.down) this.letGo(performance.now())
    const id = this.pointer === 'mouse' ? 1 : this.nextFinger++
    this.send('pointerdown', id, x, y, 1)
    this.send('pointerup', id, x, y, 0)
  }

  send(type, id, x, y, buttons) {
    this.screen.stage.dispatchEvent(
      new PointerEvent(type, {
        bubbles: true,
        cancelable: true,
        pointerId: id,
        pointerType: this.pointer,
        isPrimary: id === this.handId || this.pointer === 'mouse',
        clientX: x,
        clientY: y,
        button: type === 'pointermove' ? -1 : 0,
        buttons,
        pressure: buttons ? 0.5 : 0,
      })
    )
  }

  stop() {
    if (this.down) this.letGo(performance.now())
    this.down = false
  }
}
