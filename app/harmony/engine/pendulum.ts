// The swinging part of the machine: a harmonograph that carries the funnel.
//
// Three pendulums are linked to the one weight. X swings along the plate at the root, Y swings
// across it at the upper note, and a third, rotary pendulum circles at almost the root. Each
// loses a little of its swing every second (air, friction, and sand pouring out of the funnel),
// so the loops shrink as they repeat, which is what turns a closed figure into a spiral.
//
// Each pendulum is advanced exactly rather than integrated: for a frequency w, a step of h
// seconds turns its (position, velocity) by the angle w·h and shrinks it by exp(-h / tau).
// That is the true motion of a lightly damped pendulum, so the figure never picks up error no
// matter how long it runs, and a pendulum can be retuned mid-swing without a jump.

interface Axis {
  /** Position, plate units (the plate runs from -1 to 1) */
  x: number
  /** Velocity, plate units per second */
  v: number
  /** Angular frequency, rad/s */
  w: number
  /** Seconds for the swing to fall to 1/e of its size */
  tau: number
}

const axis = (w: number, tau: number): Axis => ({ x: 0, v: 0, w, tau })

function advance(a: Axis, h: number) {
  const c = Math.cos(a.w * h)
  const s = Math.sin(a.w * h)
  const d = Math.exp(-h / a.tau)
  const x = a.x * c + (a.v / a.w) * s
  const v = -a.x * a.w * s + a.v * c
  a.x = x * d
  a.v = v * d
}

/** The size of an axis's swing, whatever point of it the pendulum is at */
const reach = (a: Axis) => Math.hypot(a.x, a.v / a.w)

/** The funnel never travels further than this from the centre on its own */
const MAX_REACH = 0.94

export class Harmonograph {
  private X = axis(1, 75)
  private Y = axis(1.5, 62)
  private RX = axis(1, 95)
  private RY = axis(1, 95)

  /** Size of the swing when it was let go, so progress() can say how far it has run down */
  private startReach = 1
  /** Whether the next swing gets the rotary pendulum */
  thirdOn = true

  /** A hand on the funnel: it follows the pointer on a stiff spring */
  private held = false
  private hand = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 }

  /**
   * Root, upper and rotary angular frequencies. A pendulum already swinging keeps the size and
   * point of its swing: retuning one is like sliding the knot of a Y-shaped pendulum mid-swing.
   */
  tune(wRoot: number, wUpper: number, wRotary: number) {
    const retune = (a: Axis, w: number) => {
      a.v *= w / a.w
      a.w = w
    }
    retune(this.X, wRoot)
    retune(this.Y, wUpper)
    retune(this.RX, wRotary)
    retune(this.RY, wRotary)
  }

  /** Pull the funnel out to a new start and let it go, with a fresh push */
  release(rand: () => number) {
    this.held = false
    const ax = 0.6 + rand() * 0.06
    const ay = 0.58 + rand() * 0.08
    const px = rand() * Math.PI * 2
    const py = rand() * Math.PI * 2
    this.X.x = ax * Math.sin(px)
    this.X.v = ax * this.X.w * Math.cos(px)
    this.Y.x = ay * Math.sin(py)
    this.Y.v = ay * this.Y.w * Math.cos(py)

    // The rotary pendulum circles one way or the other, in a slightly squashed loop
    const ar = this.thirdOn ? 0.17 + rand() * 0.07 : 0
    const pr = rand() * Math.PI * 2
    const dir = rand() < 0.5 ? -1 : 1
    const w = this.RX.w
    this.RX.x = ar * Math.cos(pr)
    this.RX.v = -ar * w * dir * Math.sin(pr)
    this.RY.x = ar * 0.86 * Math.sin(pr)
    this.RY.v = ar * 0.86 * w * dir * Math.cos(pr)

    this.fit()
    this.startReach = this.reach()
  }

  /** Stop the swing dead (a hand on the weight) */
  still() {
    for (const a of [this.X, this.Y, this.RX, this.RY]) {
      a.x = 0
      a.v = 0
    }
    this.startReach = 1
  }

  /** The rotary pendulum's swing dies away over a couple of seconds */
  quietThird() {
    this.RX.tau = this.RY.tau = 1.2
  }

  setDamping(tauRoot: number, tauUpper: number, tauRotary: number) {
    this.X.tau = tauRoot
    this.Y.tau = tauUpper
    this.RX.tau = this.RY.tau = tauRotary
  }

  step(h: number) {
    if (this.held) {
      // Critically damped spring towards the pointer: smooth, no overshoot, about 0.12 s to arrive
      const k = 2600
      const c = 2 * Math.sqrt(k)
      const hand = this.hand
      const ax = k * (hand.tx - hand.x) - c * hand.vx
      const ay = k * (hand.ty - hand.y) - c * hand.vy
      hand.vx += ax * h
      hand.vy += ay * h
      hand.x += hand.vx * h
      hand.y += hand.vy * h
      return
    }
    advance(this.X, h)
    advance(this.Y, h)
    advance(this.RX, h)
    advance(this.RY, h)
  }

  /** Where the funnel is now, plate units */
  get x() {
    return this.held ? this.hand.x : this.X.x + this.RX.x
  }

  get y() {
    return this.held ? this.hand.y : this.Y.x + this.RY.x
  }

  /** Funnel speed, plate units per second */
  get speed() {
    if (this.held) return Math.hypot(this.hand.vx, this.hand.vy)
    return Math.hypot(this.X.v + this.RX.v, this.Y.v + this.RY.v)
  }

  /** The combined size of every swing */
  reach() {
    return reach(this.X) + reach(this.Y) + reach(this.RX) + reach(this.RY)
  }

  /** 0 when just let go, 1 when the swing has died away */
  progress() {
    if (this.held) return 0
    return Math.min(1, Math.max(0, 1 - this.reach() / Math.max(this.startReach, 1e-6)))
  }

  /** True once the funnel has all but stopped */
  get resting() {
    return !this.held && this.reach() < 0.035
  }

  get holding() {
    return this.held
  }

  grab(x: number, y: number) {
    if (!this.held) {
      this.hand.x = this.x
      this.hand.y = this.y
      this.hand.vx = this.X.v + this.RX.v
      this.hand.vy = this.Y.v + this.RY.v
    }
    this.held = true
    this.moveHand(x, y)
  }

  moveHand(x: number, y: number) {
    const r = Math.hypot(x, y)
    const k = r > MAX_REACH ? MAX_REACH / r : 1
    this.hand.tx = x * k
    this.hand.ty = y * k
  }

  /** Let go: the pendulums carry on from wherever the hand left the funnel, at its speed */
  letGo() {
    if (!this.held) return
    this.held = false
    const { x, y, vx, vy } = this.hand
    const share = this.thirdOn ? 0.25 : 0
    this.RX.x = x * share
    this.RX.v = vx * share
    this.RY.x = y * share
    this.RY.v = vy * share
    this.X.x = x - this.RX.x
    this.X.v = vx - this.RX.v
    this.Y.x = y - this.RY.x
    this.Y.v = vy - this.RY.v
    this.fit()
    this.startReach = Math.max(this.reach(), 0.2)
  }

  /** A hard throw can't send the funnel off the plate: shrink the whole swing to fit */
  private fit() {
    const total = reach(this.X) + reach(this.RX)
    const totalY = reach(this.Y) + reach(this.RY)
    const k = Math.min(1, MAX_REACH / Math.max(total, totalY, 1e-6))
    if (k < 1) {
      for (const a of [this.X, this.Y, this.RX, this.RY]) {
        a.x *= k
        a.v *= k
      }
    }
  }
}
