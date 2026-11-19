import { MAX_LIGHTS } from './shader'
import { hex, type Vec3 } from './world'

// The people of a life are lights. You are the warm one that follows the pointer; everyone else
// moves in one of a few ways: hovering near you, circling you, running off when you get close,
// walking towards you from across the room, rising into the sky to become a star, or drifting
// off to the city on the horizon. Positions are in the shader's screen space (see shader.ts).

export type Role = 'you' | 'mother' | 'father' | 'friend' | 'love' | 'kid' | 'grandkid'

type Mode = 'you' | 'hover' | 'orbit' | 'play' | 'approach' | 'rise' | 'star' | 'leave' | 'scatter'

export interface Light {
  role: Role
  /** nth of its role, for the children */
  nth: number
  x: number
  y: number
  vx: number
  vy: number
  r: number
  rT: number
  a: number
  aT: number
  color: Vec3
  mode: Mode
  /** how quickly it follows its target (a spring's natural frequency) */
  pace: number
  orbitR: number
  orbitW: number
  phase: number
  squash: number
  /** where it hovers, rises to or drifts off to */
  ax: number
  ay: number
  seed: number
  // friend's game of chase
  tx: number
  ty: number
  nextWander: number
  cooldown: number
  hurry: boolean
}

const LOOK: Record<Role, { colour: string; r: number }> = {
  you: { colour: '#ffd58f', r: 0.028 },
  mother: { colour: '#ffb3c4', r: 0.09 },
  father: { colour: '#ffcf94', r: 0.06 },
  friend: { colour: '#a6ffd9', r: 0.026 },
  love: { colour: '#b9c4ff', r: 0.03 },
  kid: { colour: '#eaffb0', r: 0.018 },
  grandkid: { colour: '#fff1c6', r: 0.011 },
}
const KID_COLOURS = ['#eaffb0', '#ffd0b8', '#bfe6ff']

export interface Steer {
  /** where you are trying to go */
  x: number
  y: number
  /** how fast you can get there (the spring's frequency) */
  pace: number
  /** 0..1: how tightly the people around you hold on */
  hold: number
  /** dream speed: everything circles slower while you hold on */
  rate: number
  /** how visible the stars are, which is how visible the people who became stars are */
  stars: number
  time: number
}

export class Lights {
  list: Light[] = []
  aspect = 16 / 9
  horizon = -0.12
  /** the friend got away from you again */
  onCatch: ((light: Light) => void) | null = null
  /** someone across the room reached you */
  onMeet: ((light: Light) => void) | null = null
  private random: () => number

  constructor(random: () => number) {
    this.random = random
  }

  get you(): Light | undefined {
    return this.list.find((l) => l.role === 'you')
  }

  find(role: Role, nth = 0): Light | undefined {
    return this.list.find((l) => l.role === role && l.nth === nth && l.mode !== 'scatter')
  }

  all(role: Role): Light[] {
    return this.list.filter((l) => l.role === role)
  }

  spawn(role: Role, x: number, y: number, init: Partial<Light> = {}): Light {
    const look = LOOK[role]
    const nth = this.all(role).length
    const colour = role === 'kid' ? KID_COLOURS[nth % KID_COLOURS.length] : look.colour
    const light: Light = {
      role,
      nth,
      x,
      y,
      vx: 0,
      vy: 0,
      r: look.r * 0.3,
      rT: look.r,
      a: 0,
      aT: 1,
      color: hex(colour),
      mode: role === 'you' ? 'you' : 'hover',
      pace: 2,
      orbitR: 0.12,
      orbitW: 0.8,
      phase: this.random() * Math.PI * 2,
      squash: 0.55,
      ax: x,
      ay: y,
      seed: this.random(),
      tx: x,
      ty: y,
      nextWander: 0,
      cooldown: 0,
      hurry: false,
      ...init,
    }
    this.list.push(light)
    return light
  }

  hover(light: Light | undefined, x: number, y: number, r?: number, a?: number) {
    if (!light) return
    light.mode = 'hover'
    light.ax = x
    light.ay = y
    light.pace = 1.2
    if (r !== undefined) light.rT = r
    if (a !== undefined) light.aT = a
  }

  orbit(light: Light | undefined, radius: number, speed: number, squash = 0.55) {
    if (!light) return
    light.mode = 'orbit'
    light.orbitR = radius
    light.orbitW = speed
    light.squash = squash
    light.pace = 3.2
  }

  play(light: Light | undefined) {
    if (!light) return
    light.mode = 'play'
    light.pace = 2.6
    light.tx = light.x
    light.ty = light.y
  }

  /** Walks towards you from where it is, growing as it comes nearer */
  approach(light: Light | undefined) {
    if (!light) return
    light.mode = 'approach'
    light.hurry = false
  }

  hurry(light: Light | undefined) {
    if (light && light.mode === 'approach') light.hurry = true
  }

  meet(light: Light | undefined) {
    if (!light || light.mode !== 'approach') return
    light.rT = LOOK[light.role].r
    this.orbit(light, 0.11, 0.9, 0.6)
    this.onMeet?.(light)
  }

  /** Up into the sky, where it stays as a star */
  rise(light: Light | undefined, x: number, y: number) {
    if (!light) return
    light.mode = 'rise'
    light.ax = x
    light.ay = y
    light.pace = 0.7
    light.rT = 0.012
    light.aT = 1
  }

  /** Off to the city on the horizon, where it stays as a dim dot */
  leave(light: Light | undefined, x: number) {
    if (!light) return
    light.mode = 'leave'
    light.ax = x
    light.ay = this.horizon + 0.012
    light.pace = 0.6
    light.rT = 0.008
    light.aT = 0.5
  }

  /** Waking: everyone flies apart and fades */
  scatter() {
    for (const l of this.list) {
      if (l.role === 'you') continue
      l.mode = 'scatter'
      const angle = Math.atan2(l.y + 0.1, l.x) + (this.random() - 0.5) * 0.8
      const speed = 0.25 + this.random() * 0.35
      l.vx = Math.cos(angle) * speed
      l.vy = Math.sin(angle) * speed
      l.aT = 0
      l.rT = l.r * 2.5
    }
  }

  update(dt: number, steer: Steer) {
    const you = this.you
    const yx = you ? you.x : 0
    const yy = you ? you.y : -0.4
    const { hold, rate, time } = steer
    const xMax = this.aspect - 0.08

    for (const l of this.list) {
      let tx = l.x
      let ty = l.y
      let pace = l.pace
      let spring = true

      switch (l.mode) {
        case 'you':
          tx = steer.x
          ty = steer.y
          pace = steer.pace
          break
        case 'hover':
          tx = l.ax + 0.05 * Math.sin(time * 0.31 + l.seed * 7)
          ty = l.ay + 0.035 * Math.cos(time * 0.37 + l.seed * 5)
          // holding on draws the people who love you a little closer
          tx += (yx - tx) * 0.25 * hold
          ty += (yy - ty) * 0.25 * hold
          break
        case 'orbit': {
          l.phase += l.orbitW * (1 - 0.55 * hold) * dt * rate
          const radius = l.orbitR * (1 - 0.5 * hold)
          tx = yx + Math.cos(l.phase) * radius
          ty = yy + Math.sin(l.phase) * radius * l.squash
          break
        }
        case 'play': {
          l.cooldown -= dt
          const dx = l.x - yx
          const dy = l.y - yy
          if (Math.hypot(dx, dy) < 0.15 && l.cooldown <= 0) {
            // you nearly had them: off they go, away from you and a little to one side
            l.cooldown = 1.1
            const angle = Math.atan2(dy, dx) + (this.random() - 0.5) * 1.4
            l.tx = clamp(l.x + Math.cos(angle) * 0.55, -xMax, xMax)
            l.ty = clamp(l.y + Math.sin(angle) * 0.4, -0.85, this.horizon + 0.3)
            l.nextWander = time + 1.6
            this.onCatch?.(l)
          } else if (time > l.nextWander) {
            l.nextWander = time + 1.8 + this.random() * 1.6
            l.tx = clamp(yx + (this.random() - 0.5) * 1.2, -xMax, xMax)
            l.ty = clamp(yy + (this.random() - 0.4) * 0.6, -0.85, this.horizon + 0.3)
          }
          tx = l.tx
          ty = l.ty
          break
        }
        case 'approach': {
          const dx = yx - l.x
          const dy = yy - l.y
          const d = Math.hypot(dx, dy)
          if (d < 0.14) {
            this.meet(l)
            break
          }
          const speed = (l.hurry ? 0.55 : 0.075) * rate
          l.x += (dx / d) * speed * dt
          l.y += (dy / d) * speed * dt
          // far away is small
          l.rT = LOOK[l.role].r * (0.3 + 0.7 * clamp(1 - (d - 0.14) / 1.4, 0, 1))
          spring = false
          break
        }
        case 'rise':
          tx = l.ax
          ty = l.ay
          if (Math.hypot(l.x - l.ax, l.y - l.ay) < 0.02) l.mode = 'star'
          break
        case 'star':
          tx = l.ax - 0.02 * yx
          ty = l.ay
          l.aT = (0.35 + 0.65 * steer.stars) * (0.8 + 0.2 * Math.sin(time * 1.3 + l.seed * 9))
          break
        case 'leave':
          tx = l.ax
          ty = l.ay
          break
        case 'scatter':
          l.x += l.vx * dt
          l.y += l.vy * dt
          l.vx *= 1 + dt * 0.8
          l.vy *= 1 + dt * 0.8
          spring = false
          break
      }

      if (spring) {
        // a critically damped spring: gets there without overshooting
        const ax = (tx - l.x) * pace * pace - l.vx * 2 * pace
        const ay = (ty - l.y) * pace * pace - l.vy * 2 * pace
        l.vx += ax * dt
        l.vy += ay * dt
        l.x += l.vx * dt
        l.y += l.vy * dt
      }
      l.r += (l.rT - l.r) * (1 - Math.exp(-dt * 1.4))
      l.a += (l.aT - l.a) * (1 - Math.exp(-dt * (l.mode === 'scatter' ? 2.2 : 1.2)))
    }

    this.list = this.list.filter((l) => !(l.mode === 'scatter' && l.a < 0.004))
  }

  /** Into the shader's arrays; returns how many */
  pack(positions: Float32Array, colours: Float32Array): number {
    let n = 0
    for (const l of this.list) {
      if (l.a < 0.003 || n >= MAX_LIGHTS) continue
      positions[n * 4] = l.x
      positions[n * 4 + 1] = l.y
      positions[n * 4 + 2] = Math.max(l.r, 0.002)
      positions[n * 4 + 3] = l.a
      colours[n * 3] = l.color[0]
      colours[n * 3 + 1] = l.color[1]
      colours[n * 3 + 2] = l.color[2]
      n++
    }
    return n
  }
}

const clamp = (n: number, low: number, high: number) => Math.min(high, Math.max(low, n))
