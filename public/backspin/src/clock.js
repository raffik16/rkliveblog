// The master clock. Everything is judged on the AudioContext's clock, never on
// performance.now() or animation frames alone.
//
// The context renders audio a little ahead of what you hear (the output latency). The browser
// tells us which context time is coming out of the speakers at which page time
// (getOutputTimestamp), so an input event's timestamp can be turned into "what the player was
// hearing at that moment" on the audio clock. The player's calibrated offset is then
// subtracted, so a player who always taps 30 ms after the sound is judged as on time.

export class Clock {
  constructor(ctx) {
    this.ctx = ctx
    // heard context time = page time (s) + this.shift. Smoothed, because the raw timestamps
    // jitter by a millisecond or two from call to call.
    this.shift = NaN
    this.offset = 0 // the player's calibration, in seconds
  }

  /** Re-read the browser's timestamp pair. Call once a frame. */
  update() {
    const ctx = this.ctx
    let shift = NaN
    if (typeof ctx.getOutputTimestamp === 'function') {
      const ts = ctx.getOutputTimestamp()
      if (ts && ts.performanceTime > 0 && ts.contextTime > 0) {
        shift = ts.contextTime - ts.performanceTime / 1000
        // Trust it only if it puts the speakers a sensible distance behind the context
        const behind = ctx.currentTime - (performance.now() / 1000 + shift)
        if (!(behind > -0.01 && behind < 0.5)) shift = NaN
      }
    }
    if (!(shift === shift)) {
      // No timestamp (yet): assume the speakers lag the context by its reported latency
      const latency = (ctx.outputLatency || 0) + (ctx.baseLatency || 0)
      shift = ctx.currentTime - latency - performance.now() / 1000
    }
    // Follow slowly (the two clocks drift apart by a few parts per million), but jump straight
    // to a big change: the context was suspended, or the first reading
    if (!(this.shift === this.shift) || Math.abs(shift - this.shift) > 0.03) this.shift = shift
    else this.shift += 0.05 * (shift - this.shift)
  }

  /** The context time being heard at a page time in milliseconds (an event's timeStamp). */
  heard(pageMs) {
    if (!(this.shift === this.shift)) this.update()
    return pageMs / 1000 + this.shift
  }

  /** The context time being heard right now. */
  heardNow() {
    return this.heard(performance.now())
  }

  /** Where an input at page time `pageMs` lands on the audio clock, calibration included. */
  judged(pageMs) {
    return this.heard(pageMs) - this.offset
  }

  /** How far ahead of the speakers the context renders, in seconds. */
  get latency() {
    return Math.max(0, this.ctx.currentTime - this.heardNow())
  }
}
