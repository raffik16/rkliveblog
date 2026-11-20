// Calibration: tap along to clicks, and the game learns how late your taps land.
//
// Four count-in clicks, then eight to tap to, at the song's tempo. Each tap's event timestamp is
// turned into the context time being heard at that moment (clock.heard) and compared with the
// nearest click. The median of those errors becomes the offset. It covers what the browser
// can't report: Bluetooth headphones, a slow keyboard, a habit of playing behind the beat.

import { BEAT } from './music.js'

export const COUNT_IN = 4
export const CLICKS = 8
const MIN_TAPS = 5

export class Calibration {
  /** view: { pulse(label, amount, slot), tap(slot, errorMs), done(result | null, taps) } */
  constructor(engine, clock, view) {
    this.engine = engine
    this.clock = clock
    this.view = view
    this.running = false
  }

  start() {
    this.t0 = this.engine.now + 0.8
    this.clicks = []
    for (let i = 0; i < COUNT_IN + CLICKS; i++) {
      const at = this.t0 + i * BEAT
      this.engine.tick(at, i === 0 || i === COUNT_IN)
      if (i >= COUNT_IN) this.clicks.push(at)
    }
    this.errors = new Array(CLICKS).fill(null)
    this.end = this.t0 + (COUNT_IN + CLICKS - 0.5) * BEAT
    this.running = true
  }

  cancel() {
    this.running = false
  }

  /** A tap at page time `pageMs` (an event's timeStamp). */
  tap(pageMs) {
    if (!this.running) return
    const heard = this.clock.heard(pageMs)
    let slot = -1
    let error = Infinity
    for (let i = 0; i < CLICKS; i++) {
      const e = heard - this.clicks[i]
      if (Math.abs(e) < Math.abs(error)) {
        error = e
        slot = i
      }
    }
    // Only taps clearly aimed at a click count, and only the first one for each click
    if (slot < 0 || Math.abs(error) > BEAT * 0.4 || this.errors[slot] !== null) return
    this.errors[slot] = error
    this.view.tap(slot, error * 1000)
  }

  /** Once a frame: drive the pulse on screen from what is being heard, and finish at the end. */
  update() {
    if (!this.running) return
    const beats = (this.clock.heardNow() - this.t0) / BEAT
    const k = Math.floor(beats)
    const amount = k >= 0 ? Math.pow(1 - (beats - k), 2.5) : 0
    let label = ''
    if (k >= 0 && k < COUNT_IN) label = String(COUNT_IN - k)
    else if (k >= COUNT_IN && k < COUNT_IN + CLICKS) label = 'TAP'
    this.view.pulse(label, amount, k - COUNT_IN)
    if (this.clock.heardNow() > this.end + BEAT * 0.5) this.finish()
  }

  finish() {
    this.running = false
    const got = this.errors.filter((e) => e !== null).sort((a, b) => a - b)
    if (got.length < MIN_TAPS) {
      this.view.done(null, got.length)
      return
    }
    const mid = got.length >> 1
    const median = got.length % 2 ? got[mid] : (got[mid - 1] + got[mid]) / 2
    const spread = got[Math.floor(got.length * 0.75)] - got[Math.floor(got.length * 0.25)]
    this.view.done(
      { offsetMs: Math.round(median * 1000), spreadMs: Math.round(spread * 1000) },
      got.length
    )
  }
}
