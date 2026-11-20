// The heads-up display: a 2D canvas over the 3D club for everything made of words and numbers.
// The score, the hype meter, the combo, the name and key of each pad, how each hit landed (on
// the pad you hit), the freestyle's calls and the count-in.
//
// The scene says where its gates, decks and fader are on screen (scene.layout), so labels sit on
// the things they label. Text that changes now and then is rebuilt only when its value does.
//
// Played without keys (on a touch screen, with the mouse or in Hybrid), the labels say tap or
// click, and the HUD draws buttons for what the keys would do: pause, the boost (the hype meter
// itself) and the loops (under the Beat Deck). hitTest() finds them, as the key each one stands
// in for (the meter as 'Boost'). Each click or tap that hits something flashes a ring where it
// landed. A pad the layout doesn't have (Hybrid has six) gets no label.

import { BEAT } from './music.js'
import { HYBRID_PADS, PADS, PAD_COUNT } from './pads.js'

const COLORS = {
  magenta: '#ff2bd6',
  cyan: '#22e4ff',
  violet: '#a77bff',
  white: '#f5f1ff',
  dim: '#a99fc4',
  lime: '#d8ff3c',
  red: '#ff4d6d',
}
const GRADE_COLOR = {
  perfect: COLORS.lime,
  great: COLORS.cyan,
  good: COLORS.violet,
  miss: COLORS.red,
}
const GRADE_TEXT = { perfect: 'PERFECT', great: 'GREAT', good: 'GOOD', miss: 'MISS' }
const MULT_TEXT = ['', '', '×2', '×3', '×4', '×5', '×6', '×7', '×8']
const SOON_TEXT = [
  'FREESTYLE',
  'FREESTYLE IN 1',
  'FREESTYLE IN 2',
  'FREESTYLE IN 3',
  'FREESTYLE IN 4',
]
const LOOP_TEXT = ['1 · A', '2 · B', '3 · C']
const LOOP_KEYS = ['Digit1', 'Digit2', 'Digit3']
const FADER_TEXT = { keys: ['Z', 'X', 'C'], other: ['L', 'C', 'R'] }
const BOOST_TEXT = {
  keys: 'SPACE · HYPE BOOST',
  mouse: 'CLICK · HYPE BOOST',
  hybrid: 'SPACE · HYPE BOOST',
  touch: 'TAP · HYPE BOOST',
}
const DECK_TEXT = {
  keys: 'SCRATCH DECK · MOUSE',
  mouse: 'SCRATCH DECK · DRAG',
  hybrid: 'SCRATCH DECK · DRAG',
  touch: 'SCRATCH DECK · DRAG',
}
// The key on each pad: all eight with the keys, three in Hybrid, none otherwise
const PAD_KEYS = {
  keys: PADS.map((p) => p.label),
  hybrid: PADS.map((_, i) => HYBRID_PADS.find((h) => h.pad === i)?.label || ''),
}
const SANDBOX_TEXT = {
  keys: [
    'PADS: A S D F · Q W E R   ·   HOLD THE MOUSE AND MOVE: SCRATCH',
    'Z X C: FADER   ·   1 2 3: LOOPS   ·   ESC: MENU',
  ],
  mouse: [
    'CLICK THE PADS   ·   HOLD THE RECORD AND DRAG: SCRATCH',
    'CLICK OR SLIDE THE FADER   ·   CLICK A LOOP   ·   ❚❚: MENU',
  ],
  hybrid: [
    'A S D: KICK SNARE CLAP   ·   CLICK THE OTHER PADS',
    'HOLD THE RECORD AND DRAG: SCRATCH   ·   CLICK A LOOP   ·   ❚❚: MENU',
  ],
  touch: [
    'TAP THE PADS   ·   DRAG A FINGER ON THE RECORD: SCRATCH',
    'TAP OR SLIDE THE FADER   ·   TAP A LOOP   ·   ❚❚: MENU',
  ],
}
const LOOP_W = 56
const LOOP_H = 40
const LOOP_GAP = 8
const PAUSE_R = 17
const STACKED_BAND = 70 // where the score and the hype meter end, at the top of the screen
const TAP_SECONDS = 0.32 // how long a click's ring takes to burst and fade
const DISPLAY = '"Unbounded", "Arial Black", system-ui, sans-serif'
const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace'

/** Text that changes now and then, rebuilt only when its value changes. */
class Label {
  constructor(format) {
    this.format = format
    this.value = NaN
    this.text = ''
  }

  get(value) {
    if (value !== this.value) {
      this.value = value
      this.text = this.format(value)
    }
    return this.text
  }
}

export class Hud {
  constructor(canvas, { reduced = false } = {}) {
    this.canvas = canvas
    this.g = canvas.getContext('2d')
    this.reduced = reduced
    // How each target was last judged: the eight pads, the record, the fader
    this.marks = []
    for (let i = 0; i < PAD_COUNT + 2; i++) {
      this.marks.push({ grade: null, at: -1e9, error: 0, text: '' })
    }
    this.floaters = []
    for (let i = 0; i < 10; i++)
      this.floaters.push({ text: '', life: 0, x: 0, y: 0, color: '#fff' })
    this.nextFloater = 0
    // Rings bursting from where clicks and taps landed
    this.taps = []
    for (let i = 0; i < 8; i++) this.taps.push({ x: 0, y: 0, color: '#fff', life: 0, big: false })
    this.nextTap = 0
    this.freeSlot = 0
    this.comboPulse = 0
    this.lastGame = null
    // The freestyle's running total, beats left and how to switch loops: v = points * 100 + beats
    const free = (how) =>
      new Label((v) => {
        const left = v % 100
        return `${Math.floor(v / 100)} PTS  ·  ${left} BEAT${left === 1 ? '' : 'S'} LEFT  ·  ${how}`
      })
    this.labels = {
      score: new Label((v) => v.toLocaleString('en-US')),
      combo: new Label((v) => String(v)),
      ms: new Label((v) => `${v > 0 ? '+' : v < 0 ? '−' : '±'}${Math.abs(v)} ms`),
      free: {
        keys: free('1 2 3 SWITCH LOOPS'),
        mouse: free('CLICK A LOOP'),
        hybrid: free('CLICK A LOOP'),
        touch: free('TAP A LOOP'),
      },
      count: new Label((v) => String(v)),
      speed: new Label((v) => `${v >= 0 ? '+' : '−'}${Math.abs(v / 10).toFixed(1)}×`),
    }
    this.sectionText = ''
    this.sectionKey = null

    // The buttons, each standing in for a key. Where they are is set as they're drawn.
    const button = (code) => ({
      code,
      hit: { kind: 'key', code },
      on: false,
      x: 0,
      y: 0,
      w: 0,
      h: 0,
    })
    this.pauseButton = button('Escape')
    this.boostButton = button('Boost')
    this.loopButtons = LOOP_KEYS.map(button)
    this.padsButton = button('Digit4')
    this.buttons = [this.pauseButton, this.boostButton, ...this.loopButtons, this.padsButton]
  }

  /** The button at (x, y) CSS pixels, as the key it stands for ({ kind: 'key', code }), or null. */
  hitTest(x, y) {
    for (const b of this.buttons) {
      if (b.on && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) return b.hit
    }
    return null
  }

  /** The middle of the button for a key, if it's on screen (for the autoplay bot). */
  buttonAt(code) {
    const b = this.buttons.find((x) => x.on && x.code === code)
    return b ? { x: b.x + b.w / 2, y: b.y + b.h / 2 } : null
  }

  place(button, x, y, w, h) {
    button.on = true
    button.x = x
    button.y = y
    button.w = w
    button.h = h
  }

  resize(layout) {
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const { w, h } = layout
    this.canvas.width = Math.round(w * dpr)
    this.canvas.height = Math.round(h * dpr)
    this.canvas.style.width = `${w}px`
    this.canvas.style.height = `${h}px`
    this.dpr = dpr
    const pad = layout.pads[0].half
    const big = clamp(w * 0.026, 18, 30)
    this.big = big
    this.font = {
      key: `800 ${Math.round(clamp(pad * 0.3, 11, 26))}px ${DISPLAY}`,
      padName: `700 ${Math.round(clamp(pad * 0.15, 8, 12))}px ${MONO}`,
      grade: `800 ${Math.round(clamp(pad * 0.24, 11, 20))}px ${DISPLAY}`,
      gradeSmall: `700 ${Math.round(clamp(pad * 0.15, 9, 12))}px ${MONO}`,
      mono: `700 11px ${MONO}`,
      monoSmall: `700 10px ${MONO}`,
      score: `800 ${big}px ${DISPLAY}`,
      mult: `800 ${Math.round(big * 0.8)}px ${DISPLAY}`,
      prompt: `800 12px ${DISPLAY}`,
      combo: `800 ${Math.round(clamp(h * 0.05, 22, 44))}px ${DISPLAY}`,
      banner: `800 ${Math.round(clamp(w * 0.028, 18, 32))}px ${DISPLAY}`,
      floater: `800 ${Math.round(clamp(w * 0.016, 13, 19))}px ${DISPLAY}`,
      count: `900 ${Math.round(clamp(pad * 1.3, 60, 150))}px ${DISPLAY}`,
      arrow: `900 ${Math.round(clamp(layout.decks[0].r * 0.5, 18, 40))}px ${DISPLAY}`,
      loop: `800 16px ${DISPLAY}`,
      loopSmall: `800 12px ${DISPLAY}`,
    }
    this.comboSize = clamp(h * 0.05, 22, 44)
  }

  // ---- Moments ------------------------------------------------------------------------------

  /** A game event: put each judgement on the thing it judged, and float the big calls. */
  event(e, layout) {
    if (e.kind === 'judge') {
      const n = e.note
      const slot = n.type === 'pad' ? n.pad : n.type === 'scratch' ? PAD_COUNT : PAD_COUNT + 1
      const mark = this.marks[slot]
      mark.grade = e.grade
      mark.at = e.at
      mark.error = Math.round(e.error * 1000)
      mark.scratch = n.type === 'scratch'
      if (e.grade !== 'miss') this.comboPulse = 1
    } else if (e.kind === 'boost') {
      this.floater('HYPE BOOST  ×2', COLORS.lime, layout.w / 2, above(layout, 0.62))
    } else if (e.kind === 'free') {
      // Freestyle calls take turns between three spots, so two in a row never overlap. They go
      // above the pads, under the freestyle's banner, where there's room for that; on a short
      // screen they go over the pads instead (the freestyle has no notes to cover).
      const color = e.points < 0 ? COLORS.red : e.label === 'VARIETY!' ? COLORS.lime : COLORS.cyan
      const slot = this.freeSlot++ % 3
      const g = layout.grid
      const x = layout.w / 2 + (slot - 1) * (g.right - g.left) * 0.3
      const roomy = g.top - above(layout, 0) > 150
      const y = roomy
        ? above(layout, 0.78 + 0.08 * (slot % 2))
        : g.top + (g.bottom - g.top) * (0.32 + 0.16 * (slot % 2))
      const sign = e.points > 0 ? '+' : ''
      this.floater(`${e.label}  ${sign}${e.points}`, color, x, y)
    }
  }

  /**
   * A click or a tap that hit something (a pad, the fader, a button): a ring bursts from where it
   * landed, in the pad's colour. A finger's is bigger, to show around the finger.
   */
  tap(x, y, hit, finger) {
    const t = this.taps[this.nextTap]
    this.nextTap = (this.nextTap + 1) % this.taps.length
    t.x = x
    t.y = y
    t.color = hit.kind === 'pad' ? PADS[hit.index].color : COLORS.lime
    t.big = finger
    t.life = 1
  }

  floater(text, color, x, y) {
    const f = this.floaters[this.nextFloater]
    this.nextFloater = (this.nextFloater + 1) % this.floaters.length
    f.text = text
    f.color = color
    f.x = x
    f.y = y
    f.life = 1.1
  }

  // ---- The frame ----------------------------------------------------------------------------

  /**
   * s: { mode, live (a run or the sandbox is on: not paused, not over), controls ('keys',
   *      'mouse' or 'touch'), t, dt, game, deckSpeed, deckHeld, loop, autoPads, practice, midi,
   *      liveScratch, precise (show hit errors in ms) }
   */
  draw(s, layout) {
    const g = this.g
    const dpr = this.dpr
    const dt = Math.min(0.05, s.dt || 0.016)
    const now = performance.now()
    g.setTransform(dpr, 0, 0, dpr, 0, 0)
    g.clearRect(0, 0, layout.w, layout.h)
    const game = s.game
    if (game !== this.lastGame) {
      this.lastGame = game
      this.sectionKey = null
      for (const m of this.marks) m.at = -1e9
    }

    for (const b of this.buttons) b.on = false
    const active = s.mode === 'play' || s.mode === 'sandbox'
    const keys = s.controls === 'keys'
    this.drawPadLabels(layout, active ? 1 : 0.45, PAD_KEYS[s.controls])
    this.drawRig(s, layout, active)
    if (game) {
      this.drawMarks(s, layout, now)
      this.drawScore(s, game, layout, dt, now)
    } else if (s.mode === 'sandbox') {
      this.drawSandbox(s, layout)
    }
    if (s.live && !keys) this.drawPause(layout)
    this.drawFloaters(dt)
    this.drawTaps(dt)
  }

  /**
   * Lines of text (in the current font) no wider than `width`: each line as it is if it fits,
   * or broken into parts at its dots, as many parts to a line as fit.
   */
  wrap(lines, width) {
    const g = this.g
    const key = `${lines.join('|')}@${Math.round(width)}`
    if (this.wrapped && this.wrapped.key === key) return this.wrapped.lines
    const out = []
    for (const line of lines) {
      if (g.measureText(line).width <= width) {
        out.push(line)
        continue
      }
      let now = ''
      for (const part of line.split(/\s+·\s+/)) {
        const next = now ? `${now}  ·  ${part}` : part
        if (now && g.measureText(next).width > width) {
          out.push(now)
          now = part
        } else {
          now = next
        }
      }
      if (now) out.push(now)
    }
    this.wrapped = { key, lines: out }
    return out
  }

  /** Where the things on the top right end: left of the pause button, when there is one. */
  rightEdge(s, W) {
    return W - 18 - (s.controls === 'keys' ? 0 : PAUSE_R * 2 + 12)
  }

  /** Each pad's name, and its key (`keys`: one per pad, '' for none) when it has one. */
  drawPadLabels(L, alpha, keys) {
    const g = this.g
    for (let i = 0; i < PAD_COUNT; i++) {
      const p = L.pads[i]
      if (p.hidden) continue
      const inset = p.half * 0.16
      g.globalAlpha = alpha
      const key = keys ? keys[i] : ''
      if (key) {
        g.font = this.font.key
        g.textAlign = 'left'
        g.textBaseline = 'top'
        g.fillStyle = PADS[i].color
        g.fillText(key, p.x - p.half + inset, p.y - p.half + inset)
      }
      g.font = this.font.padName
      g.textAlign = 'center'
      g.textBaseline = 'bottom'
      g.fillStyle = COLORS.white
      g.globalAlpha = alpha * 0.65
      g.fillText(PADS[i].name, p.x, p.y + p.half - inset * 0.8)
    }
    g.globalAlpha = 1
  }

  /** Under the decks and fader: what they are and the keys for them. */
  drawRig(s, L, active) {
    const g = this.g
    const [left, right] = L.decks
    g.font = this.font.monoSmall
    g.textAlign = 'center'
    g.textBaseline = 'top'
    g.globalAlpha = active ? 0.85 : 0.5
    g.fillStyle = COLORS.magenta
    g.fillText(DECK_TEXT[s.controls] || DECK_TEXT.keys, left.x, left.y + left.r * 1.32)
    g.fillStyle = COLORS.cyan
    g.fillText('BEAT DECK', right.x, right.y + right.r * 1.32)
    if (active && s.deckHeld) {
      const v = Math.round(Math.max(-9.9, Math.min(9.9, s.deckSpeed)) * 10)
      g.fillStyle = COLORS.dim
      g.fillText(this.labels.speed.get(v), left.x, left.y + left.r * 1.32 + 14)
    }
    const f = L.fader
    const marks = s.controls === 'keys' ? FADER_TEXT.keys : FADER_TEXT.other
    g.fillStyle = COLORS.dim
    for (let i = 0; i < 3; i++) {
      const x = f.x0 + (i / 2) * (f.x1 - f.x0)
      g.fillText(marks[i], x, f.y + f.half * 1.5)
    }
    g.globalAlpha = 1

    // A scratch coming or under way: which way to move the record
    const live = s.liveScratch
    const next = live || (s.game ? nextScratch(s.game, s.t) : null)
    if (next) {
      const soon = live ? 1 : Math.max(0, 1 - (next.time - s.t) / (BEAT * 1.5))
      if (soon > 0) {
        g.globalAlpha = live ? 1 : 0.35 + 0.5 * soon
        g.fillStyle = next.dir > 0 ? COLORS.magenta : COLORS.cyan
        g.font = this.font.arrow
        g.textBaseline = 'bottom'
        g.fillText(next.dir > 0 ? '▲' : '▼', left.x, left.y - left.r * 1.3)
        g.font = this.font.monoSmall
        g.textBaseline = 'top'
        g.fillText(next.dir > 0 ? 'UP: FORWARD' : 'DOWN: BACK', left.x, left.y - left.r * 1.28)
        g.globalAlpha = 1
      }
    }
  }

  /** How each pad (and the record, and the fader) was last judged, on top of it. */
  drawMarks(s, L, now) {
    const g = this.g
    g.textAlign = 'center'
    for (let i = 0; i < this.marks.length; i++) {
      const mark = this.marks[i]
      const age = (now - mark.at) / 1000
      if (!mark.grade || age > 0.55) continue
      let x
      let y
      if (i < PAD_COUNT) {
        x = L.pads[i].x
        y = L.pads[i].y
      } else if (i === PAD_COUNT) {
        x = L.decks[0].x
        y = L.decks[0].y
      } else {
        x = L.w / 2
        y = L.fader.y - L.fader.half * 2.4
      }
      const rise = this.reduced ? 0 : age * 26
      g.globalAlpha = Math.min(1, (0.55 - age) * 5)
      g.fillStyle = GRADE_COLOR[mark.grade]
      g.font = this.font.grade
      g.textBaseline = 'middle'
      g.fillText(GRADE_TEXT[mark.grade], x, y - rise)
      if (mark.grade !== 'miss' && !mark.scratch && (s.precise || mark.grade !== 'perfect')) {
        g.font = this.font.gradeSmall
        g.textBaseline = 'top'
        const text = s.precise ? this.labels.ms.get(mark.error) : mark.error < 0 ? 'EARLY' : 'LATE'
        g.fillText(text, x, y - rise + 12)
      }
    }
    g.globalAlpha = 1
  }

  drawScore(s, game, L, dt, now) {
    const g = this.g
    const W = L.w
    const big = this.big
    const labels = this.labels
    const t = s.t

    // Song progress along the very top
    const prog = Math.max(0, Math.min(1, t / game.chart.length))
    g.fillStyle = 'rgba(245, 241, 255, 0.12)'
    g.fillRect(0, 0, W, 3)
    g.fillStyle = COLORS.magenta
    g.fillRect(0, 0, W * prog, 3)

    // Score, section and multiplier
    g.textAlign = 'left'
    g.textBaseline = 'top'
    g.fillStyle = COLORS.white
    g.font = this.font.score
    g.fillText(labels.score.get(Math.round(game.score)), 18, 16)
    g.font = this.font.mono
    g.fillStyle = COLORS.dim
    const sec = game.section
    const ended = !sec && t > 0
    const key = sec || (ended ? 'end' : 'ready')
    if (key !== this.sectionKey) {
      this.sectionKey = key
      const name = sec ? sec.label.toUpperCase() : ended ? 'THAT’S THE SET' : 'GET READY'
      const what = s.practice ? `PRACTICE ${s.practice.speed}%` : game.chart.level.toUpperCase()
      const how = game.chart.controls ? `  ·  ${game.chart.controls.toUpperCase()}` : ''
      this.sectionText = `${name}  ·  ${what}${how}`
    }
    g.fillText(this.sectionText, 18, 20 + big)
    // The combo multiplier counts for notes, so the freestyle shows only the boost's
    const free = game.freestyleAt(t)
    const mult = (free ? 1 : game.multiplier) * (game.boosting ? 2 : 1)
    if (mult > 1) {
      g.fillStyle = game.boosting ? COLORS.lime : COLORS.cyan
      g.font = this.font.mult
      g.fillText(MULT_TEXT[mult], 18, 38 + big)
    }

    // Hype meter, top right. When it's full, the meter is the boost button.
    const right = this.rightEdge(s, W)
    const mw = Math.min(220, W * 0.26)
    const mx = right - mw
    const my = 20
    g.textAlign = 'right'
    g.font = this.font.mono
    g.fillStyle = COLORS.dim
    g.fillText(s.midi ? `HYPE  ·  MIDI ${s.midi}` : 'HYPE', right, my + 14)
    g.fillStyle = 'rgba(245, 241, 255, 0.12)'
    roundRect(g, mx, my, mw, 9, 4.5)
    g.fill()
    const full = game.hype >= 100 && !game.boosting
    g.fillStyle = game.boosting || full ? COLORS.lime : COLORS.magenta
    roundRect(g, mx, my, Math.max(9, (mw * game.hype) / 100), 9, 4.5)
    g.fill()
    if (full || game.boosting) {
      g.globalAlpha = full && !this.reduced ? 0.6 + 0.4 * Math.sin(now / 120) : 1
      g.fillStyle = COLORS.lime
      g.font = this.font.prompt
      g.fillText(full ? BOOST_TEXT[s.controls] || BOOST_TEXT.keys : 'BOOST ×2', right, my + 32)
      g.globalAlpha = 1
    }
    if (full && s.live) this.place(this.boostButton, mx - 12, 2, mw + 16, my + 46)

    // Freestyle coming, or on
    let soon = null
    if (!free) {
      const list = game.chart.freestyle
      for (let i = 0; i < list.length; i++) {
        if (list[i].start > t && list[i].start - t < BEAT * 4) soon = list[i]
      }
    }

    // Combo, above the pads, pulsing on each hit (stacked, the band above the pads only has room
    // for the freestyle's warning while it shows)
    this.comboPulse = Math.max(0, this.comboPulse - dt * 5)
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    if (game.combo >= 4 && !free && !(soon && L.stacked)) {
      const y = above(L, L.stacked ? 0.62 : 0.72)
      const k = this.reduced ? 1 : 1 + 0.12 * this.comboPulse
      g.globalAlpha = 0.92
      g.fillStyle = COLORS.white
      g.font = this.font.combo
      g.save()
      g.translate(W / 2, y)
      g.scale(k, k)
      g.fillText(labels.combo.get(game.combo), 0, 0)
      g.restore()
      g.font = this.font.monoSmall
      g.fillStyle = COLORS.dim
      g.fillText('COMBO', W / 2, y + this.comboSize * 0.62)
      g.globalAlpha = 1
    }

    // The count-in (practice): four beats before the first
    const countIn = game.chart.countIn || 0
    if (countIn && t < 0 && t > -countIn * BEAT) {
      const n = Math.ceil(-t / BEAT)
      const k = 1 - (-t / BEAT - (n - 1))
      g.globalAlpha = Math.min(1, 0.4 + k)
      g.fillStyle = COLORS.white
      g.font = this.font.count
      g.fillText(labels.count.get(n), W / 2, (L.grid.top + L.grid.bottom) / 2)
      g.globalAlpha = 1
    }

    // Freestyle: a warning as it comes, then the banner, the running total and beats left
    if (free || soon) {
      const y = above(L, L.stacked ? 0.4 : 0.42)
      const pulse = this.reduced ? 0 : Math.pow(1 - ((((t / BEAT) % 1) + 1) % 1), 3)
      g.font = this.font.banner
      g.fillStyle = COLORS.lime
      if (free) g.globalAlpha = 0.75 + 0.25 * pulse
      else g.globalAlpha = this.reduced ? 1 : 0.5 + 0.5 * Math.sin(now / 90)
      g.fillText(free ? SOON_TEXT[0] : SOON_TEXT[Math.ceil((soon.start - t) / BEAT)], W / 2, y)
      g.globalAlpha = 1
      if (free) {
        g.font = this.font.mono
        g.fillStyle = COLORS.white
        const left = Math.max(0, Math.min(99, Math.ceil((free.end - t) / BEAT)))
        const label = labels.free[s.controls] || labels.free.keys
        g.fillText(label.get(Math.round(game.free.score) * 100 + left), W / 2, y + 26)
      }
      // The loops, under the Beat Deck: there to switch while the freestyle is on
      const f = free || soon
      this.drawLoops(L, game.freestyleLoop(f), s.controls === 'keys', s.live && !!free)
    }
  }

  drawSandbox(s, L) {
    const g = this.g
    const keys = s.controls === 'keys'
    const text = SANDBOX_TEXT[s.controls] || SANDBOX_TEXT.keys
    g.textAlign = 'left'
    g.textBaseline = 'top'
    g.fillStyle = COLORS.white
    g.font = this.font.score
    g.fillText('SANDBOX', 18, 16)
    g.font = this.font.mono
    g.fillStyle = COLORS.dim
    // On a narrow screen (a phone held upright) each line breaks where it has a dot
    const lines = this.wrap(text, this.rightEdge(s, L.w) - 18)
    for (let i = 0; i < lines.length; i++) g.fillText(lines[i], 18, 22 + this.big + i * 16)
    if (s.midi) {
      g.textAlign = 'right'
      g.font = this.font.monoSmall
      g.fillText(`MIDI ${s.midi}`, this.rightEdge(s, L.w), 22)
    }

    // The loops, and under them the song's own pad hits on or off
    const bottom = this.drawLoops(L, s.loop, keys, s.live)
    const label = s.autoPads ? 'THE SONG PLAYS ITS DRUMS' : 'THE DRUMS ARE ALL YOURS'
    const text4 = keys ? `4 · ${label}` : label
    g.font = this.font.monoSmall
    const d = L.decks[1]
    const w = Math.max(LOOP_W * 3 + LOOP_GAP * 2, g.measureText(text4).width + 28)
    const x = d.x - w / 2
    // Under the loops, or above the deck if the screen ends first (a phone held sideways)
    let y = bottom + 8
    if (y + 30 > L.h - 2) y = d.y - d.r * 1.32 - 38
    roundRect(g, x, y, w, 30, 10)
    g.fillStyle = s.autoPads ? 'rgba(12, 8, 22, 0.55)' : 'rgba(216, 255, 60, 0.16)'
    g.fill()
    g.lineWidth = 1.25
    g.strokeStyle = s.autoPads ? 'rgba(245, 241, 255, 0.3)' : COLORS.lime
    g.stroke()
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.fillStyle = s.autoPads ? COLORS.dim : COLORS.lime
    g.fillText(text4, d.x, y + 15.5)
    if (s.live) this.place(this.padsButton, x, y - 3, w, 36)
  }

  /**
   * The three loops, under the Beat Deck: which one plays, and (when `clickable`) buttons to
   * switch to the others. Returns where the row ends at the bottom.
   */
  drawLoops(L, current, keys, clickable) {
    const g = this.g
    const d = L.decks[1]
    const w = keys ? LOOP_W + 8 : LOOP_W
    const x0 = d.x - (w * 3 + LOOP_GAP * 2) / 2
    const y = d.y + d.r * 1.32 + 18
    g.font = keys ? this.font.loopSmall : this.font.loop
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    for (let i = 0; i < 3; i++) {
      const x = x0 + i * (w + LOOP_GAP)
      const on = current === 'ABC'[i]
      roundRect(g, x, y, w, LOOP_H, 10)
      g.fillStyle = on ? 'rgba(216, 255, 60, 0.16)' : 'rgba(12, 8, 22, 0.55)'
      g.fill()
      g.lineWidth = on ? 2 : 1.25
      g.strokeStyle = on ? COLORS.lime : 'rgba(245, 241, 255, 0.3)'
      g.stroke()
      g.fillStyle = on ? COLORS.lime : COLORS.dim
      g.fillText(keys ? LOOP_TEXT[i] : 'ABC'[i], x + w / 2, y + LOOP_H / 2 + 1)
      if (clickable) {
        this.place(this.loopButtons[i], x - LOOP_GAP / 2, y - 4, w + LOOP_GAP, LOOP_H + 8)
      }
    }
    return y + LOOP_H
  }

  /** Pause, at the top right, for play without keys. */
  drawPause(L) {
    const g = this.g
    const x = L.w - 18 - PAUSE_R
    const y = 12 + PAUSE_R
    g.beginPath()
    g.arc(x, y, PAUSE_R, 0, Math.PI * 2)
    g.fillStyle = 'rgba(12, 8, 22, 0.55)'
    g.fill()
    g.lineWidth = 1.25
    g.strokeStyle = 'rgba(245, 241, 255, 0.45)'
    g.stroke()
    g.fillStyle = COLORS.white
    g.fillRect(x - 5.5, y - 6.5, 4, 13)
    g.fillRect(x + 1.5, y - 6.5, 4, 13)
    const r = PAUSE_R + 8
    this.place(this.pauseButton, x - r, y - r, r * 2, r * 2)
  }

  drawTaps(dt) {
    const g = this.g
    for (const t of this.taps) {
      if (t.life <= 0) continue
      t.life = Math.max(0, t.life - dt / TAP_SECONDS)
      // It starts where the cursor's ring is, and eases out
      const k = 1 - t.life
      const from = t.big ? 16 : 9.5
      const r = this.reduced ? from + 8 : from + (t.big ? 34 : 22) * (1 - (1 - k) * (1 - k))
      g.globalAlpha = t.life
      g.lineWidth = 1 + 2.5 * t.life
      g.strokeStyle = t.color
      g.beginPath()
      g.arc(t.x, t.y, r, 0, Math.PI * 2)
      g.stroke()
    }
    g.globalAlpha = 1
  }

  drawFloaters(dt) {
    const g = this.g
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.font = this.font.floater
    for (let i = 0; i < this.floaters.length; i++) {
      const f = this.floaters[i]
      if (f.life <= 0) continue
      f.life -= dt
      if (!this.reduced) f.y -= dt * 40
      g.globalAlpha = Math.max(0, Math.min(1, f.life * 2))
      g.fillStyle = f.color
      g.fillText(f.text, f.x, f.y)
    }
    g.globalAlpha = 1
  }
}

/**
 * A height in the space above the pads, as a share of it: from the top of the screen, or
 * stacked (a narrow screen held upright, where the score and the hype meter take the width)
 * from under them.
 */
function above(L, share) {
  const from = L.stacked ? STACKED_BAND : 0
  return from + (L.grid.top - from) * share
}

/** The next scratch note still to come (for the arrow by the record). */
function nextScratch(game, t) {
  const notes = game.notes
  for (let i = game.next; i < notes.length; i++) {
    const n = notes[i]
    if (n.time > t + BEAT * 2) return null
    if (n.type === 'scratch' && !n.judged && n.end > t) return n
  }
  return null
}

function clamp(x, lo, hi) {
  return Math.min(hi, Math.max(lo, x))
}

function roundRect(g, x, y, w, h, r) {
  r = Math.max(0, Math.min(r, w / 2, h / 2))
  g.beginPath()
  g.moveTo(x + r, y)
  g.arcTo(x + w, y, x + w, y + h, r)
  g.arcTo(x + w, y + h, x, y + h, r)
  g.arcTo(x, y + h, x, y, r)
  g.arcTo(x, y, x + w, y, r)
  g.closePath()
}
