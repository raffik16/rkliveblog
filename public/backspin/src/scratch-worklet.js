// The Scratch Deck. This runs on the audio thread and plays the scratch record from a playhead
// that the player's hand moves, sample by sample. Nothing here triggers a recorded scratch
// sound: every "wicka" is the record itself, played forwards or backwards at whatever speed the
// mouse is moving.
//
// Messages from the main thread (times are event timestamps in seconds on the page's
// performance clock; distances are seconds of record):
//   { t: 'buffers', levels: [Float32Array x4], cue }  the record and its pre-filtered copies
//   { t: 'down', at }          hand on the record: it stops under the hand
//   { t: 'move', m: [d, t0, t1, d, t0, t1, ...] }  the hand moved the record by d from t0 to t1
//   { t: 'up', at }            hand off: the record stops, unless it was flung (a backspin)
//   { t: 'tap', stop }         play the phrase from the cue point at normal speed (and stop
//                              `stop` seconds into the record, if given: the VOX pad)
//   { t: 'reset' }             back to the cue, stopped
//   { t: 'clock' }             the context was suspended: forget the clock offset
// It reports { t: 'pos', pos (seconds into the record), speed, mode, time } every 8 ms.
//
// Why timestamps: browsers deliver mouse movement in bursts, often once per display frame, and
// a burst can hold anywhere from one to a dozen mouse reports. Dividing "how far it moved" by
// "time since the last message" makes the speed lurch at the frame rate, which you hear as a
// buzzing flutter. Instead each movement carries the time the mouse reported it, and the hand's
// path is replayed a few milliseconds behind real time. Where a report hasn't arrived yet, the
// record carries on at the hand's recent speed and catches up when it does; when the burst
// rhythm is slower than the mouse, the speed is also averaged over one burst.

const IDLE = 0 // stopped; the playhead stays where it is
const PLAY = 1 // running at normal speed after a tap
const HAND = 2 // the hand is on it
const THROW = 3 // let go mid-flick: spinning down on its own

const SMOOTH = 0.005 // seconds: the one-pole that smooths the speed (no clicks, no zipper noise)
const CATCH_UP = 0.008 // seconds: how quickly the record catches up with movement that was late
const LAG = 0.003 // the hand's path plays this long after the quickest a report has ever arrived
const VELOCITY_WINDOW = 0.008 // seconds of recent movement averaged into the hand's speed
const AHEAD_MAX = 0.025 // when movement is late, carry on at the hand's speed for at most this long
const BOX_MAX = 0.02 // the longest the speed is averaged over to iron out bursts
const POINTS = 1024 // the hand's recent path, as (time, position) points in a ring
const ARRIVALS = 64 // recent arrival delays remembered
const BURSTS = 32 // recent gaps between bursts remembered
const THROW_MIN = 2.5 // let go while moving at least this fast and the record spins on
const RELEASE_GAP = 0.03 // a release this soon after the last movement can still be a flick
const FRICTION = 3 // a flung record slows by this much speed per second...
const DRAG = 1.5 // ...plus this fraction of its speed per second
const REPORT_EVERY = 3 // blocks of 128 samples, about 8 ms

class ScratchProcessor extends AudioWorkletProcessor {
  constructor() {
    super()
    this.levels = null
    this.length = 0
    this.cue = 0
    this.pos = 0 // playhead, in samples (fractional)
    this.speed = 0 // smoothed playback rate: 1 is normal, negative is backwards
    this.mode = IDLE
    this.stopAt = Infinity // a tap that plays only part of the record stops here (samples)
    this.alpha = 1 - Math.exp(-1 / (SMOOTH * sampleRate))

    // The hand's path during this hold: where it had moved the record at each moment
    this.ptT = new Float64Array(POINTS)
    this.ptP = new Float64Array(POINTS)
    this.ptHead = 0
    this.ptCount = 0
    this.lag = NaN // clock offset plus playback delay for this hold; NaN until known
    this.handLead = 0 // how far the replayed hand has moved the record
    this.handSpeed = 0 // the hand's speed over its last few milliseconds of movement
    this.reportGap = 0.008 // typical time between the mouse's movement reports
    this.ahead = AHEAD_MAX // how long to carry on when movement is late
    this.releaseAt = -1 // the hand lets go at this moment
    this.lastTarget = 0

    // Arrival delays: audio clock minus the event's time. The two clocks have an unknown offset,
    // so these are only ever compared with each other.
    this.early = new Float64Array(ARRIVALS)
    this.earlyCount = 0
    this.earlyNext = 0

    // Bursts: when movement arrives in display-frame bunches, average over one bunch
    this.burstGap = new Float64Array(BURSTS)
    this.burstCount = 0
    this.burstNext = 0
    this.lastBurst = -1
    this.burstTypical = 0
    this.box = new Float64Array(Math.ceil(BOX_MAX * sampleRate) + 1)
    this.boxWidth = 1
    this.boxSum = 0
    this.boxAt = 0

    // Tone: a low-pass that closes when the record moves slowly, then a DC blocker
    this.ic1 = 0
    this.ic2 = 0
    this.dcX = 0
    this.dcY = 0
    this.dcR = 1 - (2 * Math.PI * 12) / sampleRate

    // Surface noise
    this.seed = 0x2545f491
    this.hissLp = 0
    this.hissLpPrev = 0
    this.hiss = 0
    this.crackle = 0
    this.noise = 0 // smoothed noise level, so a record stopping at its end doesn't cut off

    // A short crossfade from the old playhead when a tap jumps to the cue (no click)
    this.ghostPos = 0
    this.ghostSpeed = 0
    this.ghostLeft = 0
    this.ghostLength = Math.round(0.006 * sampleRate)

    this.blocks = 0
    this.port.onmessage = (event) => this.receive(event.data)
  }

  receive(m) {
    switch (m.t) {
      case 'buffers':
        this.levels = m.levels
        this.length = m.levels[0].length
        this.cue = Math.round(m.cue * sampleRate)
        this.pos = this.cue
        this.speed = 0
        this.mode = IDLE
        break
      case 'down':
        // A hand landing on a moving record stops it (the smoothing makes it a 5 ms grab)
        this.noteArrival(currentTime - m.at)
        this.mode = HAND
        this.clearHand()
        this.lag = this.minEarly() + LAG
        this.chooseBox()
        this.addPoint(m.at, 0)
        break
      case 'move': {
        if (this.mode !== HAND) {
          // Only sent while the button is held; one arriving now means the hand is back on
          this.mode = HAND
          this.clearHand()
        }
        const a = m.m
        if (this.lag !== this.lag) {
          this.noteArrival(currentTime - a[a.length - 1])
          this.lag = this.minEarly() + LAG
          this.chooseBox()
        }
        this.noteBurst()
        for (let i = 0; i + 2 < a.length; i += 3) {
          this.noteArrival(currentTime - a[i + 2])
          this.addMotion(a[i], a[i + 1], a[i + 2])
        }
        break
      }
      case 'up':
        if (this.mode === HAND) this.release(m.at)
        break
      case 'tap':
        this.jump(this.cue)
        this.speed = 1
        this.mode = PLAY
        this.stopAt = m.stop > 0 ? m.stop * sampleRate : Infinity
        this.clearHand()
        break
      case 'reset':
        this.jump(this.cue)
        this.speed = 0
        this.mode = IDLE
        this.clearHand()
        break
      case 'clock':
        this.earlyCount = 0
        this.burstCount = 0
        this.lastBurst = -1
        break
    }
  }

  clearHand() {
    this.ptCount = 0
    this.lag = NaN
    this.handLead = 0
    this.handSpeed = 0
    this.releaseAt = -1
    this.lastTarget = 0
  }

  noteArrival(early) {
    // Far quicker than anything seen lately means the clocks moved apart (a suspend): start over
    if (this.earlyCount > 0 && early < this.minEarly() - 0.05) this.earlyCount = 0
    this.early[this.earlyNext] = early
    this.earlyNext = (this.earlyNext + 1) % ARRIVALS
    if (this.earlyCount < ARRIVALS) this.earlyCount++
  }

  minEarly() {
    let min = Infinity
    for (let i = 0; i < this.earlyCount; i++) if (this.early[i] < min) min = this.early[i]
    return min
  }

  /** Movement arriving in a new audio callback starts a new burst. */
  noteBurst() {
    if (currentTime === this.lastBurst) return
    const gap = currentTime - this.lastBurst
    this.lastBurst = currentTime
    if (gap > 0.05) return // the hand was resting
    this.burstGap[this.burstNext] = gap
    this.burstNext = (this.burstNext + 1) % BURSTS
    if (this.burstCount < BURSTS) this.burstCount++
  }

  /**
   * When movement comes in bursts with several reports in each (display frames), average the
   * speed over one burst. Movement that arrives as it happens needs no averaging. Called as the
   * hand lands, so the average starts empty.
   */
  chooseBox() {
    let w = 1
    if (this.burstCount >= 8) {
      const sorted = Array.from(this.burstGap.subarray(0, this.burstCount)).sort((a, b) => a - b)
      this.burstTypical = sorted[this.burstCount >> 1]
      if (this.burstTypical > 1.5 * this.reportGap) w = Math.round(this.burstTypical * sampleRate)
    }
    this.boxWidth = Math.max(1, Math.min(this.box.length - 1, w))
    this.box.fill(0)
    this.boxSum = 0
    this.boxAt = 0
  }

  addPoint(t, p) {
    if (this.ptCount === POINTS) {
      this.ptHead = (this.ptHead + 1) % POINTS
      this.ptCount--
    }
    const k = (this.ptHead + this.ptCount) % POINTS
    this.ptT[k] = t
    this.ptP[k] = p
    this.ptCount++
  }

  /** The hand moved the record by `d` between t0 and t1: extend its path. */
  addMotion(d, t0, t1) {
    if (!(t1 > t0)) return
    const span = t1 - t0
    if (this.ptCount === 0) {
      this.addPoint(t0, 0)
    } else {
      const k = (this.ptHead + this.ptCount - 1) % POINTS
      const lastT = this.ptT[k]
      // Overlapping the previous report: start where it ended
      if (t0 < lastT) t0 = lastT
      if (t1 <= t0) t1 = t0 + 0.0001
      // A gap: the hand was still in between
      if (t0 > lastT) {
        this.addPoint(t0, this.ptP[k])
        this.handSpeed *= Math.exp(-(t0 - lastT) / VELOCITY_WINDOW)
      }
    }
    const k = (this.ptHead + this.ptCount - 1) % POINTS
    this.addPoint(t1, this.ptP[k] + d)
    this.handSpeed += (1 - Math.exp(-span / VELOCITY_WINDOW)) * (d / span - this.handSpeed)
    this.reportGap += 0.3 * ((span < 0.03 ? span : 0.03) - this.reportGap)
    // Carry on for as long as the next report could plausibly take to arrive
    const wait = 1.25 * Math.max(this.burstTypical, this.reportGap) + 0.002
    this.ahead = wait < AHEAD_MAX ? wait : AHEAD_MAX
  }

  /**
   * The hand lets go at `at`. A flick usually ends with the button coming up while the hand is
   * still moving, a few milliseconds after the last movement report: carry that speed on to the
   * moment of release, so the record leaves the hand at full speed and spins on.
   */
  release(at) {
    this.releaseAt = at
    if (this.ptCount < 2) return
    const k = (this.ptHead + this.ptCount - 1) % POINTS
    const j = (this.ptHead + this.ptCount - 2) % POINTS
    const gap = at - this.ptT[k]
    if (gap <= 0 || gap > RELEASE_GAP) return
    const slope = (this.ptP[k] - this.ptP[j]) / (this.ptT[k] - this.ptT[j])
    if (Math.abs(slope) < THROW_MIN * 0.5 || Math.abs(this.handSpeed) < THROW_MIN * 0.5) return
    this.addPoint(at, this.ptP[k] + slope * gap)
  }

  jump(to) {
    this.ghostPos = this.pos
    this.ghostSpeed = this.speed
    this.ghostLeft = this.ghostLength
    this.pos = to
  }

  /** The record at a fractional position, from the copy that suits the current speed. */
  read(pos, absSpeed) {
    const levels = this.levels
    // Up to 1.1x the full-bandwidth record; then each octave faster, the next copy down
    let lv = absSpeed <= 1.1 ? 0 : Math.log2(absSpeed / 1.1)
    if (lv >= 3) return cubic(levels[3], pos, this.length)
    const i = lv | 0
    const a = cubic(levels[i], pos, this.length)
    lv -= i
    return lv > 0 ? a + (cubic(levels[i + 1], pos, this.length) - a) * lv : a
  }

  /** Where the speed is heading while the hand is on the record. */
  handTarget(tau, dt) {
    // Forget the parts of the path already played
    while (this.ptCount > 2 && this.ptT[(this.ptHead + 1) % POINTS] <= tau) {
      this.ptHead = (this.ptHead + 1) % POINTS
      this.ptCount--
    }
    let slope = 0
    let at = this.handLead
    if (this.ptCount > 0) {
      const k = (this.ptHead + this.ptCount - 1) % POINTS
      const over = tau - this.ptT[k]
      if (over >= 0) {
        // Past everything that has arrived. Usually more is on its way, so carry on at the
        // hand's speed for a moment; if nothing comes the hand had stopped, and once it has let
        // go we know it had.
        at = this.ptP[k]
        if (this.releaseAt < 0) {
          if (over < this.ahead) {
            slope = this.handSpeed
            at += slope * over
          } else {
            at += this.handSpeed * this.ahead
          }
        }
      } else {
        const a = this.ptHead
        const b = (a + 1) % POINTS
        if (tau <= this.ptT[a]) {
          at = this.ptP[a]
        } else {
          slope = (this.ptP[b] - this.ptP[a]) / (this.ptT[b] - this.ptT[a])
          at = this.ptP[a] + slope * (tau - this.ptT[a])
        }
      }
    }

    if (slope === 0) {
      // A still hand holds a still record. If the record ran on a little past it while the
      // movement was late, pulling it back would be an audible blip, so it stays where it is.
      this.handLead = at
    }

    if (this.releaseAt >= 0 && tau >= this.releaseAt) {
      // The hand comes off. Still moving fast: the record spins on by itself.
      const flung =
        Math.abs(this.lastTarget) >= THROW_MIN * 0.5 && Math.abs(this.speed) >= THROW_MIN
      this.mode = flung ? THROW : IDLE
      this.clearHand()
      return 0
    }

    // Follow the hand's speed, plus whatever catches up with movement that arrived late...
    let target = slope + (at - this.handLead) / CATCH_UP
    this.handLead += target * dt
    this.lastTarget = target
    // ...averaged over one burst when movement comes in bursts
    const w = this.boxWidth
    if (w > 1) {
      const box = this.box
      this.boxSum += target - box[this.boxAt]
      box[this.boxAt] = target
      this.boxAt = this.boxAt + 1 < w ? this.boxAt + 1 : 0
      target = this.boxSum / w
    }
    return target
  }

  process(inputs, outputs) {
    const out = outputs[0][0]
    if (!this.levels || !out) return true
    const n = out.length
    const end = this.length - 2
    const alpha = this.alpha
    const nyquistGuard = 0.45 * sampleRate
    const blockTime = currentTime
    const dt = 1 / sampleRate

    for (let i = 0; i < n; i++) {
      // 1. The speed: following the hand, running at 1x, or slowing by friction when flung
      if (this.mode === THROW) {
        const s = this.speed
        const decel = (FRICTION + DRAG * (s < 0 ? -s : s)) * dt
        this.speed = s > 0 ? Math.max(0, s - decel) : Math.min(0, s + decel)
        if (this.speed < 0.03 && this.speed > -0.03) this.mode = IDLE
      } else {
        if (this.mode === PLAY && this.pos >= this.stopAt) this.mode = IDLE
        let target = this.mode === PLAY ? 1 : 0
        if (this.mode === HAND && this.lag === this.lag) {
          target = this.handTarget(blockTime + i * dt - this.lag, dt)
        }
        this.speed += alpha * (target - this.speed)
      }

      // 2. Move the playhead. The record has a start and an end; at either it just stops.
      this.pos += this.speed
      if (this.pos < 0) {
        this.pos = 0
        this.speed = 0
        if (this.mode !== HAND) this.mode = IDLE
      } else if (this.pos > end) {
        this.pos = end
        this.speed = 0
        if (this.mode !== HAND) this.mode = IDLE
      }

      // 3. Read the record
      const s = this.speed < 0 ? -this.speed : this.speed
      let x = this.read(this.pos, s)
      if (this.ghostLeft > 0) {
        this.ghostPos = Math.min(end, Math.max(0, this.ghostPos + this.ghostSpeed))
        const g = this.ghostLeft / this.ghostLength
        x = x * (1 - g) + this.read(this.ghostPos, Math.abs(this.ghostSpeed)) * g
        this.ghostLeft--
      }

      // 4. Vinyl character. A slow record sounds darker and a little quieter...
      const sc = s < 1 ? s : 1
      let fc = 220 + 17500 * Math.pow(sc, 1.7)
      if (fc > nyquistGuard) fc = nyquistGuard
      const g = Math.tan((Math.PI * fc) / sampleRate)
      const k = 1.6 // 1/Q: gentle, no resonant peak
      const a1 = 1 / (1 + g * (g + k))
      const a2 = g * a1
      const a3 = g * a2
      const v3 = x - this.ic2
      const v1 = a1 * this.ic1 + a2 * v3
      const v2 = this.ic2 + a2 * this.ic1 + a3 * v3
      this.ic1 = 2 * v1 - this.ic1
      this.ic2 = 2 * v2 - this.ic2
      let y = v2 * (0.4 + 0.6 * (s < 0.5 ? s / 0.5 : 1))

      // ...and a moving stylus hisses and crackles in proportion to how fast it is going
      this.noise += 0.002 * ((s < 4 ? s : 4) - this.noise)
      if (this.noise > 0.001) {
        this.seed ^= this.seed << 13
        this.seed ^= this.seed >>> 17
        this.seed ^= this.seed << 5
        const white = (this.seed >>> 0) / 2147483648 - 1
        this.hissLp += 0.3 * (white - this.hissLp)
        this.hiss = 0.97 * (this.hiss + this.hissLp - this.hissLpPrev)
        this.hissLpPrev = this.hissLp
        const sn = this.noise
        // a few crackles a second at normal speed, more when it moves faster
        if (white > 1 - (0.00001 + 0.00006 * (sn < 3 ? sn : 3)) * 2) {
          this.crackle += 0.5 * (this.seed & 1 ? 1 : -1)
        }
        y += this.hiss * 0.012 * sn + this.crackle * 0.05 * (sn < 2 ? sn : 2)
      }
      this.crackle *= 0.55

      // 5. Block DC: a stopped record sitting mid-waveform must not leave an offset behind
      const dc = y - this.dcX + this.dcR * this.dcY
      this.dcX = y
      this.dcY = dc
      out[i] = dc
    }

    if (++this.blocks >= REPORT_EVERY) {
      this.blocks = 0
      this.port.postMessage({
        t: 'pos',
        pos: this.pos / sampleRate,
        speed: this.speed,
        mode: this.mode,
        time: currentTime,
      })
    }
    return true
  }
}

/** 4-point, 3rd-order Hermite (Catmull-Rom) interpolation. */
function cubic(d, pos, length) {
  const i = pos | 0
  const f = pos - i
  const y0 = d[i > 0 ? i - 1 : 0]
  const y1 = d[i]
  const y2 = d[i + 1]
  const y3 = d[i + 2 < length ? i + 2 : length - 1]
  const c1 = 0.5 * (y2 - y0)
  const c2 = y0 - 2.5 * y1 + 2 * y2 - 0.5 * y3
  const c3 = 0.5 * (y3 - y0) + 1.5 * (y1 - y2)
  return ((c3 * f + c2) * f + c1) * f + y1
}

registerProcessor('scratch-deck', ScratchProcessor)
