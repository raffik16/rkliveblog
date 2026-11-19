// The director runs one dream from the moment you close your eyes to the moment you open them:
//
//   falling   the page under heavy eyelids, the kettle heating, two slow breaths
//   dreaming  a life, chapter by chapter (script.ts), on a clock that slows while you hold on
//   waking    the kettle's whistle gets into the dream; holding on only delays it
//   opening   a blink, and the ordinary page again
//
// Every frame it works out the world (blending the chapters' keys), moves the people, feeds the
// sound and draws. The words and prompts are handed to the page (Dream.tsx) as events.

import { Lights } from './lights'
import { lightBuffers, Renderer, type Frame } from './renderer'
import {
  chapters,
  FALL,
  makeLife,
  seeded,
  WAKE,
  type Chapter,
  type Life,
  type Stage,
} from './script'
import type { DreamSound } from './sound'
import {
  copyKey,
  emptyKey,
  hex,
  makeKey,
  mixColour,
  mixKey,
  ramp,
  smooth,
  type WorldKey,
} from './world'

export type Phase = 'falling' | 'dreaming' | 'waking' | 'opening' | 'done'

export interface Prompt {
  kind: 'hold' | 'move'
  text?: string
}

export interface Summary {
  you: string
  /** how old you were when the kettle boiled */
  age: number
  memories: string[]
  asleepMs: number
  /** false when you opened your eyes before the dream began */
  dreamt: boolean
}

export interface DirectorEvents {
  line(text: string, kind: 'line' | 'name'): void
  prompt(prompt: Prompt | null): void
  holding(on: boolean): void
  phase(phase: Phase): void
  /** as your eyes start to open, so the page can be ready behind the blink */
  woke(summary: Summary): void
}

export interface DirectorOptions {
  canvas: HTMLCanvasElement
  /** blurs the page under the dream while you fall asleep and wake up */
  haze: HTMLElement | null
  /** painted with the dream's colours when there is no WebGL */
  fallback: HTMLElement | null
  /** the dream's layer: marked data-light while waking turns it white, so words on it go dark */
  overlay: HTMLElement | null
  sound: DreamSound | null
  events: DirectorEvents
  reducedMotion: boolean
  seed: number
  /** development: start this many dream-seconds in, and run this many times faster */
  startAt?: number
  speed?: number
}

interface Resolved {
  ch: Chapter
  start: number
  end: number
  from: WorldKey
  to: WorldKey
}

interface Timed {
  at: number
  run: (s: Stage) => void
}

// Seconds over which one chapter's world turns into the next's, and the blink that ends a dream
const BLEND = 7
const OPEN = 3.6

// Days going past in the rain: an overcast day mixed in and out of the night
const DAY_TOP = hex('#7f8fae')
const DAY_HOR = hex('#c4ccd8')
const DAY_FOG = hex('#b6bfce')
const DAY_CLOUD = hex('#9aa6ba')

// Heavy eyelids, [seconds, how shut]: they close, open a little as you fight it, then close
const FALL_LIDS: [number, number][] = [
  [0, 0],
  [3.4, 0],
  [4.4, 0.55],
  [5, 0.35],
  [6.4, 0.8],
  [6.9, 0.62],
  [8.2, 1],
]
// Waking: a quick blink over the white, then the eyes open in two goes
const OPEN_LIDS: [number, number][] = [
  [0, 0],
  [0.22, 1],
  [0.6, 1],
  [1.05, 0.45],
  [1.3, 0.8],
  [2.3, 0],
]
const ASLEEP_AT = 8.3

function curve(keys: [number, number][], x: number) {
  if (x <= keys[0][0]) return keys[0][1]
  for (let i = 1; i < keys.length; i++) {
    const [t1, v1] = keys[i]
    if (x <= t1) {
      const [t0, v0] = keys[i - 1]
      return v0 + (v1 - v0) * smooth((x - t0) / (t1 - t0))
    }
  }
  return keys[keys.length - 1][1]
}

export class Director {
  readonly life: Life
  private o: DirectorOptions
  private renderer: Renderer | null
  private lights: Lights
  private chapters: Resolved[]
  private total: number
  private cues: (Timed & { chapter: number })[] = []
  private nextCue = 0
  private later: Timed[] = []
  private watchers: { until: number; test: (s: Stage) => boolean; run: (s: Stage) => void }[] = []
  private flags = new Set<string>()
  private memories: string[] = []
  private stage: Stage

  private phase: Phase = 'falling'
  private t = -FALL
  private w = 0
  private wakeSpeed = 1
  private fastWake = false
  private openT = 0
  private rate = 1
  private holdK = 0
  private holding = false
  private heldFor = 0
  private flow = 0
  private travel = 0
  private time = 0
  private gazeX = 0
  private gazeY = 0
  private px = 0
  private py = -0.4
  private pointerSeen = false
  private touchHold: ReturnType<typeof setTimeout> | null = null
  private touchFrom: [number, number] | null = null
  private chapterIndex = -1
  private promptUntil = -1
  private promptKind: Prompt['kind'] | null = null
  private wakeLines = new Set<number>()
  private scattered = false
  private openingSound = false
  private hazeAt = ''
  private light = false

  private key: WorldKey = emptyKey()
  private frame: Frame
  private raf = 0
  private last = 0
  private running = false
  private startedAt = performance.now()
  private width = 1
  private height = 1

  constructor(options: DirectorOptions) {
    this.o = options
    const random = seeded(options.seed)
    this.life = makeLife(random)
    this.lights = new Lights(random)
    this.renderer = Renderer.create(options.canvas)
    if (!this.renderer && options.fallback) options.fallback.hidden = false

    let start = 0
    this.chapters = chapters(this.life).map((ch) => {
      const from = makeKey(ch.from)
      const to = makeKey(ch.to || {}, from)
      const resolved = { ch, start, end: start + ch.dur, from, to }
      start += ch.dur
      return resolved
    })
    this.total = start
    this.chapters.forEach((r, chapter) => {
      for (const [at, run] of r.ch.cues) this.cues.push({ at: r.start + at, run, chapter })
    })
    this.cues.sort((a, b) => a.at - b.at)

    const buffers = lightBuffers()
    this.frame = {
      key: this.key,
      time: 0,
      flow: 0,
      travel: 0,
      gazeX: 0,
      gazeY: 0,
      youX: 0,
      youY: -0.4,
      scene: 0,
      white: 0,
      dark: 0,
      phos: 0,
      lid: 0,
      shake: 0,
      grain: 0.035,
      lights: buffers.lights,
      lightColours: buffers.lightColours,
      lightCount: 0,
    }

    this.stage = this.makeStage()
    this.lights.onCatch = () => {
      this.o.sound?.chime('catch')
      if (this.promptKind === 'move') this.clearPrompt()
    }
    this.lights.onMeet = () => this.met()
    this.resize()
  }

  // --------------------------------------------------------------------------------- control

  start() {
    const { startAt, sound } = this.o
    if (startAt !== undefined && startAt > 0) this.skipTo(startAt)
    else sound?.begin()
    if (this.phase === 'falling' && sound) {
      sound.breathe(1.6, 5.5)
      sound.breathe(7.4, 7)
    }
    this.o.events.phase(this.phase)
    window.addEventListener('resize', this.resize)
    this.resume()
  }

  pause() {
    this.running = false
    cancelAnimationFrame(this.raf)
    this.o.sound?.pause()
  }

  resume() {
    if (this.running || this.phase === 'done') return
    this.running = true
    this.last = performance.now()
    this.o.sound?.resume()
    this.raf = requestAnimationFrame(this.tick)
  }

  destroy() {
    this.pause()
    this.phase = 'done'
    window.removeEventListener('resize', this.resize)
    if (this.touchHold) clearTimeout(this.touchHold)
    this.renderer?.dispose()
    this.renderer = null
  }

  /** Where the pointer is, in page pixels */
  pointer(clientX: number, clientY: number) {
    this.px = (2 * clientX - this.width) / this.height
    this.py = (this.height - 2 * clientY) / this.height
    this.pointerSeen = true
    // a finger that moves is dragging, not holding
    if (
      this.touchFrom &&
      Math.hypot(this.px - this.touchFrom[0], this.py - this.touchFrom[1]) > 0.06
    ) {
      if (this.touchHold) clearTimeout(this.touchHold)
      this.touchHold = null
      this.touchFrom = null
    }
  }

  /** Arrow keys */
  nudge(dx: number, dy: number) {
    if (!this.pointerSeen) {
      const you = this.lights.you
      this.px = you ? you.x : 0
      this.py = you ? you.y : -0.4
    }
    this.pointerSeen = true
    this.px += dx * 0.09
    this.py += dy * 0.09
  }

  press(kind: string) {
    if (kind === 'touch') {
      // a finger has to stay put for a moment to hold; otherwise it is dragging your light
      if (this.touchHold) clearTimeout(this.touchHold)
      this.touchFrom = [this.px, this.py]
      this.touchHold = setTimeout(() => {
        this.touchHold = null
        this.setHolding(true)
      }, 280)
      return
    }
    this.setHolding(true)
  }

  release() {
    if (this.touchHold) clearTimeout(this.touchHold)
    this.touchHold = null
    this.touchFrom = null
    this.setHolding(false)
  }

  /** Esc, the wake-up button, or leaving full screen */
  wakeUp() {
    if (this.phase === 'falling') this.startOpening()
    else if (this.phase === 'dreaming') this.startWaking(true)
    else if (this.phase === 'waking') this.wakeSpeed = Math.max(this.wakeSpeed, 3)
  }

  // ------------------------------------------------------------------------------ internals

  private setHolding(on: boolean) {
    if (this.holding === on) return
    this.holding = on
    this.heldFor = 0
    this.o.events.holding(on)
  }

  private resize = () => {
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.lights.aspect = this.width / this.height
    this.renderer?.resize(this.width, this.height)
  }

  private get chapter(): Resolved {
    return this.chapters[Math.max(0, this.chapterIndex)]
  }

  private makeStage(): Stage {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const d = this
    return {
      life: d.life,
      lights: d.lights,
      flags: d.flags,
      get local() {
        return d.t - d.chapter.start
      },
      get holding() {
        return d.holding
      },
      get aspect() {
        return d.lights.aspect
      },
      get horizon() {
        return d.lights.horizon
      },
      say: (text) => {
        if (!d.quiet) d.o.events.line(text, 'line')
      },
      prompt: (kind, text, seconds = 8) => {
        if (d.quiet) return
        d.promptKind = kind
        d.promptUntil = d.t + seconds
        d.o.events.prompt({ kind, text })
      },
      clearPrompt: () => d.clearPrompt(),
      song: (voice, bpm, transpose) => {
        if (!d.quiet) d.o.sound?.song(voice, bpm, transpose)
      },
      chime: (kind) => {
        if (!d.quiet) d.o.sound?.chime(kind)
      },
      remember: (text) => {
        if (!d.memories.includes(text)) d.memories.push(text)
      },
      after: (seconds, run) => {
        d.later.push({ at: d.t + seconds, run })
      },
      watch: (seconds, test, run) => {
        d.watchers.push({ until: d.t + seconds, test, run })
      },
    }
  }

  /** set while catching up to a start point in development, so nothing is said or played */
  private quiet = false

  private clearPrompt() {
    if (this.promptKind === null) return
    this.promptKind = null
    this.promptUntil = -1
    this.o.events.prompt(null)
  }

  private met() {
    const local = this.stage.local
    this.o.sound?.chime('meet')
    this.stage.remember(`You met ${this.life.love}.`)
    if (this.promptKind === 'move') this.clearPrompt()
    if (this.chapter.ch.id !== 'night' || local > 31) return
    this.stage.say(`${this.life.love}.`)
    if (local < 29) this.stage.after(4.5, (s) => s.say('You talk until the birds start.'))
  }

  /** Development: jump into the middle of a life, with everyone where they would be */
  private skipTo(at: number) {
    this.quiet = true
    this.phase = 'dreaming'
    this.t = 0
    while (this.nextCue < this.cues.length && this.cues[this.nextCue].at <= at) {
      const cue = this.cues[this.nextCue++]
      this.t = cue.at
      this.chapterIndex = cue.chapter
      cue.run(this.stage)
      this.runLater()
      for (let i = 0; i < 4; i++) this.lights.update(0.05, this.steer())
    }
    this.t = Math.min(at, this.total - 0.01)
    this.runLater()
    for (let i = 0; i < 60; i++) this.lights.update(0.05, this.steer())
    // so the first frame finds the chapter "new" and starts its music
    this.chapterIndex = -1
    this.quiet = false
    this.o.sound?.begin()
    this.o.sound?.fallAsleep()
  }

  private runLater() {
    if (!this.later.length) return
    const due = this.later.filter((item) => item.at <= this.t)
    if (!due.length) return
    this.later = this.later.filter((item) => item.at > this.t)
    for (const item of due) item.run(this.stage)
  }

  private steer() {
    const ch = this.chapter.ch
    const anchorY = ch.id === 'warm' ? -0.36 : -0.42
    let tx = this.pointerSeen ? this.px : 0
    let ty = this.pointerSeen ? this.py : anchorY
    tx = tx * ch.reach
    ty = anchorY + (ty - anchorY) * ch.reach
    const xMax = this.lights.aspect - 0.06
    return {
      x: Math.max(-xMax, Math.min(xMax, tx)),
      y: Math.max(-0.93, Math.min(0.8, ty)),
      pace: this.phase === 'waking' ? ch.pace * 0.6 : ch.pace,
      hold: this.holdK,
      rate: this.rate,
      stars: this.key.stars,
      time: this.time,
    }
  }

  private startWaking(fast: boolean) {
    this.phase = 'waking'
    this.w = 0
    this.fastWake = fast
    this.wakeSpeed = fast ? 2.4 : 1
    this.clearPrompt()
    this.o.events.phase('waking')
  }

  private startOpening() {
    this.phase = 'opening'
    this.openT = 0
    this.clearPrompt()
    this.setHolding(false)
    this.o.events.phase('opening')
    this.o.events.woke({
      you: this.life.you,
      age: this.ageAt(this.t),
      memories: [...this.memories],
      asleepMs: performance.now() - this.startedAt,
      dreamt: this.t > 2,
    })
  }

  private finish() {
    this.phase = 'done'
    this.running = false
    cancelAnimationFrame(this.raf)
    this.o.events.phase('done')
  }

  private ageAt(t: number) {
    if (t <= 0) return 0
    for (const r of this.chapters) {
      if (t <= r.end) return r.ch.age[0] + (r.ch.age[1] - r.ch.age[0]) * ((t - r.start) / r.ch.dur)
    }
    return this.life.lifespan
  }

  private tick = (now: number) => {
    if (!this.running) return
    const frameMs = now - this.last
    const dt = Math.min(0.05, Math.max(0, frameMs / 1000))
    this.last = now
    this.renderer?.adapt(frameMs)
    this.step(dt)
    if (this.running) this.raf = requestAnimationFrame(this.tick)
  }

  private step(dt: number) {
    const speed = this.o.speed || 1
    const reduced = this.o.reducedMotion
    this.time += dt

    // holding on: eases in and out, and slows the dream's clock
    this.holdK +=
      ((this.holding ? 1 : 0) - this.holdK) * (1 - Math.exp(-dt * (this.holding ? 2.5 : 1.5)))
    if (this.holding) this.heldFor += dt
    const dreamy = this.phase === 'dreaming' || this.phase === 'waking'
    const targetRate = dreamy ? 1 - 0.6 * this.holdK : 1
    this.rate += (targetRate - this.rate) * (1 - Math.exp(-dt * 3))

    // the clocks
    if (this.phase === 'falling') {
      this.t += dt * speed
      if (this.t >= -FALL + ASLEEP_AT && !this.flags.has('asleep')) {
        this.flags.add('asleep')
        this.o.sound?.fallAsleep()
      }
      if (this.t >= 0) {
        this.phase = 'dreaming'
        this.o.events.phase('dreaming')
      }
    } else if (this.phase === 'dreaming') {
      this.t += dt * this.rate * speed
      if (this.t >= this.total) this.startWaking(false)
    } else if (this.phase === 'waking') {
      this.w += dt * (1 - 0.45 * this.holdK) * this.wakeSpeed * speed
      if (this.w >= WAKE) this.startOpening()
    } else if (this.phase === 'opening') {
      this.openT += dt
      if (this.openT >= OPEN) {
        this.finish()
        return
      }
    }
    if (dreamy) {
      this.flow += dt * this.rate
    }

    // the chapter, and what happens in it
    if (this.phase === 'dreaming' || this.phase === 'waking') {
      const t = Math.min(this.t, this.total - 0.001)
      let index = this.chapters.findIndex((r) => t < r.end)
      if (index < 0) index = this.chapters.length - 1
      if (index !== this.chapterIndex) {
        this.chapterIndex = index
        const ch = this.chapters[index].ch
        if (this.phase === 'dreaming') this.o.sound?.scene(ch.music, ch.ambience)
      }
      if (this.phase === 'dreaming') {
        while (this.nextCue < this.cues.length && this.cues[this.nextCue].at <= this.t) {
          this.cues[this.nextCue++].run(this.stage)
        }
        this.runLater()
        if (this.watchers.length) {
          this.watchers = this.watchers.filter((watch) => {
            if (this.t > watch.until) return false
            if (!watch.test(this.stage)) return true
            watch.run(this.stage)
            return false
          })
        }
      }
    }
    if (this.promptKind !== null) {
      // a hold prompt has done its job once you have held on for a moment
      const learnt = this.promptKind === 'hold' && this.heldFor > 1.4
      if (learnt || (this.promptUntil >= 0 && this.t > this.promptUntil)) this.clearPrompt()
    }

    this.paint(dt, reduced)
  }

  private paint(dt: number, reduced: boolean) {
    const f = this.frame
    const k = this.key
    let scene = 1
    let lid = 0
    let dark = 0
    let phos = 0
    let white = 0
    let shake = 0
    let room = 0
    let emerge = 1
    let whistle = 0
    let hazeBlur = 0
    let hazeBright = 1

    if (this.phase === 'falling') {
      const fell = this.t + FALL
      const asleep = fell >= ASLEEP_AT
      scene = asleep ? 1 : 0
      lid = asleep ? 0 : curve(FALL_LIDS, fell)
      dark = asleep ? 1 - ramp(ASLEEP_AT, ASLEEP_AT + 2.5, fell) : 0
      phos = 1
      room = 1 - ramp(ASLEEP_AT, FALL, fell)
      emerge = 0
      hazeBlur = ramp(2, 8, fell) * 7
      hazeBright = 1 - 0.3 * ramp(2, 8, fell)
      this.worldAt(0, 0, reduced)
    } else if (this.phase === 'opening') {
      scene = this.openT < 0.22 ? 1 : 0
      white = 1
      lid = curve(OPEN_LIDS, this.openT)
      const clear = ramp(0.8, 3.4, this.openT)
      hazeBlur = 14 * (1 - clear)
      hazeBright = 1 + 0.7 * (1 - clear)
      if (!this.openingSound) {
        this.openingSound = true
        this.o.sound?.wake()
      }
    } else {
      const t = Math.min(this.t, this.total - 0.001)
      this.worldAt(t, dt, reduced)
      if (this.chapterIndex === 0) {
        phos = 1 - ramp(0, 7, t)
        emerge = ramp(0, 9, t)
      }
      const r = this.chapter
      if (r.ch.id === 'evening') whistle = 0.3 * ramp(29.5, r.ch.dur, t - r.start)
      if (this.phase === 'waking') {
        this.waking()
        const w = this.w
        whistle = 0.3 + 0.7 * ramp(0, WAKE - 1, w)
        white = Math.pow(ramp(4, WAKE - 0.4, w), 1.6) * (1 - 0.35 * this.holdK)
        shake = reduced ? 0 : ramp(8, WAKE, w) * 0.6
        k.warp += (reduced ? 0.3 : 1.1) * ramp(0, WAKE, w)
        k.vignette += (1 - k.vignette) * 0.5 * ramp(0, WAKE, w)
        k.exposure *= 1 + 0.5 * ramp(0, WAKE, w)
      }
    }

    // the people
    if (this.phase !== 'opening') {
      const steer = this.steer()
      const you = this.lights.you
      if (you && this.phase !== 'waking') {
        you.aT = 1 + 0.6 * this.holdK
      }
      this.lights.horizon = k.horizon
      this.lights.update(dt, steer)
      if (you) {
        f.youX = you.x
        f.youY = you.y
      }
    }

    // where you look follows where you are
    const you = this.lights.you
    const gx = you ? (you.x / Math.max(this.lights.aspect, 1)) * 0.5 : 0
    const gy = you ? (you.y + 0.4) * 0.4 : 0
    this.gazeX += (gx - this.gazeX) * (1 - Math.exp(-dt * 1.2))
    this.gazeY += (gy - this.gazeY) * (1 - Math.exp(-dt * 1.2))

    f.time = this.time
    f.flow = this.flow
    f.travel = this.travel
    f.gazeX = reduced ? this.gazeX * 0.4 : this.gazeX
    f.gazeY = reduced ? this.gazeY * 0.4 : this.gazeY
    f.scene = scene
    f.white = white
    f.dark = dark
    f.phos = phos
    f.lid = lid
    f.shake = shake
    f.lightCount = this.phase === 'opening' ? 0 : this.lights.pack(f.lights, f.lightColours)

    if (this.renderer && !this.renderer.lost) this.renderer.render(f)
    else this.paintFallback(scene, white, dark)

    const haze = this.o.haze
    const hazeAt = `${hazeBlur.toFixed(2)}px ${hazeBright.toFixed(3)}`
    if (haze && hazeAt !== this.hazeAt) {
      this.hazeAt = hazeAt
      haze.style.setProperty('--haze-blur', `${hazeBlur.toFixed(2)}px`)
      haze.style.setProperty('--haze-bright', hazeBright.toFixed(3))
    }
    // a little either way, so holding on (which holds back the white) doesn't flicker it
    const light = this.phase === 'waking' && (this.light ? white > 0.3 : white > 0.42)
    if (light !== this.light) {
      this.light = light
      this.o.overlay?.toggleAttribute('data-light', light)
    }

    this.o.sound?.update({
      t: Math.max(0, this.t),
      local: this.t - this.chapter.start,
      rate: this.rate,
      hold: this.holdK,
      dreaming: this.phase === 'dreaming' || this.phase === 'waking',
      waking: this.phase === 'waking' ? Math.min(1, this.w / WAKE) : 0,
      whistle,
      emerge,
      room,
    })
  }

  /** The world at dream time t: the chapter's keys, blended out of the last one */
  private worldAt(t: number, dt: number, reduced: boolean) {
    const k = this.key
    const index = Math.max(0, this.chapterIndex)
    const r = this.chapters[index]
    const local = t - r.start
    const [s0, s1] = r.ch.span || [0, 1]
    mixKey(r.from, r.to, ramp(s0 * r.ch.dur, s1 * r.ch.dur, local), k)
    if (index > 0 && local < BLEND) mixKey(this.chapters[index - 1].to, k, smooth(local / BLEND), k)
    if (this.phase === 'falling') copyKey(r.from, k)

    if (r.ch.dayCycle) {
      const amount = ramp(0, 2, local) * (1 - ramp(r.ch.dur - 3, r.ch.dur, local))
      const day = (reduced ? 0.3 : 0.5 - 0.5 * Math.cos((local * Math.PI * 2) / 4.2)) * amount
      mixColour(k.skyTop, DAY_TOP, day * 0.75)
      mixColour(k.skyHor, DAY_HOR, day * 0.7)
      mixColour(k.fog, DAY_FOG, day * 0.6)
      mixColour(k.cloud, DAY_CLOUD, day * 0.6)
      k.windows *= 1 - 0.65 * day
      k.sunGlow = Math.max(k.sunGlow, 0.35 * day)
    }

    // the sun is placed as a share of half the screen's width, like the people
    k.sunX *= Math.min(this.lights.aspect, 1.9)
    if (reduced) k.warp *= 0.3
    this.travel += k.travel * dt * this.rate * (reduced ? 0.4 : 1)
  }

  /** Waking up: what is said, and everyone scattering */
  private waking() {
    const w = this.w
    const say = (at: number, text: string, kind: 'line' | 'name' = 'line') => {
      if (w < at || this.wakeLines.has(at)) return
      this.wakeLines.add(at)
      this.o.events.line(text, kind)
    }
    if (this.fastWake) {
      say(0.5, this.life.you, 'name')
    } else {
      say(0.3, this.flags.has('bird') ? 'That isn’t a bird.' : 'Something is whistling.')
      say(3.8, 'Not yet.')
      if (w >= 7 && !this.wakeLines.has(7)) {
        say(7, 'Stay.')
        this.promptKind = 'hold'
        this.promptUntil = this.t + 100
        this.o.events.prompt({ kind: 'hold' })
      }
      say(10.5, this.life.you, 'name')
    }
    if (w >= (this.fastWake ? 2 : 9) && !this.scattered) {
      this.scattered = true
      this.lights.scatter()
    }
    const you = this.lights.you
    if (you) you.aT = (1 + 0.6 * this.holdK) * (1 - ramp(WAKE - 6, WAKE - 1, w))
  }

  // Without WebGL the dream is its colours: a gradient of the sky and the land
  private paintFallback(scene: number, white: number, dark: number) {
    const el = this.o.fallback
    if (!el) return
    const k = this.key
    const css = (c: number[]) => {
      const mix = (v: number) => Math.round(255 * Math.min(1, v + (1 - v) * white) * (1 - dark))
      return `rgb(${mix(c[0])}, ${mix(c[1])}, ${mix(c[2])})`
    }
    el.style.opacity = String(scene)
    el.style.background = `linear-gradient(to bottom, ${css(k.skyTop)}, ${css(k.skyHor)} 55%, ${css(k.landNear)})`
  }
}
