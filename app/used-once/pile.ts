import { ITEM_BY_ID, PERSON_HEIGHT, type Item, type ItemId } from './data'
import { columnHeight, columnsOf, lastSleeve, perLayer, perSide, pileHeight } from './model'

/*
  The pile, drawn on a canvas: every roll, bottle and sleeve of cups as its own small picture,
  in a true isometric view (all three axes foreshortened alike, so a roll's width on screen is
  its real width and the heights of the stacks can be compared with the figure beside them).

  Each kind of item is drawn once, at the current scale, onto its own small canvas (a sprite)
  and then stamped into place. Only the items a viewer could see are stamped: the top of each
  stack and its two near faces. A full lifetime is about 38,000 items and about 4,500 stamps.
*/

// Screen distance per metre, as a fraction of the scale: along either ground axis, and upward.
const ISO_X = Math.SQRT1_2
const ISO_Y = 1 / Math.sqrt(6)
const ISO_Z = Math.sqrt(2 / 3)
/** A circle lying on the ground is drawn as an ellipse this much flatter than it is wide */
const FLAT = 1 / Math.sqrt(3)

const LABEL_ABOVE = 24
const LABEL_BELOW = 42
const PAD_X = 22
// Widths in metres: the room kept for the figure, the gap between two stacks, and the wider
// gap between the paper and the plastic.
const PERSON_BAY = 1.15
const GAP = 0.34
const GROUP_GAP = 0.9
const MAX_SCALE = 120

export interface BlockBox {
  id: ItemId
  /** Screen x of the stack's centre line (its back and front corners) */
  x: number
  /** Screen y of its left and right corners: the ground line the figure stands on */
  ground: number
  /** Half its width on screen */
  half: number
  /** How far its back and front corners sit above and below the ground line */
  depth: number
}

export interface PileRow {
  ground: number
  personX: number
  blocks: BlockBox[]
}

export interface PileLayout {
  width: number
  height: number
  /** CSS pixels per metre */
  scale: number
  /** Side of the square each stack stands on, in metres */
  footprint: number
  rows: PileRow[]
}

/** Where everything goes, for a canvas of a given size. `full` is the count at the end of the
    life: the scale is set by the finished pile, so it holds still while the stacks grow. */
export function layoutPile(
  width: number,
  height: number,
  groups: ItemId[][],
  full: Record<ItemId, number>,
  footprint: number
): PileLayout {
  const blockWidth = footprint * 2 * ISO_X
  const depthM = footprint * ISO_Y
  const rowsM = groups.map((ids) => {
    let widthM = PERSON_BAY
    ids.forEach((id, at) => {
      if (at > 0)
        widthM += ITEM_BY_ID[id].material === ITEM_BY_ID[ids[at - 1]].material ? GAP : GROUP_GAP
      widthM += blockWidth
    })
    const tallest = Math.max(
      0.6,
      ...ids.map((id) => pileHeight(ITEM_BY_ID[id], full[id], footprint))
    )
    // Never shorter than the figure, so its head is not cut off beside small stacks
    const riseM = Math.max(tallest * ISO_Z + depthM, PERSON_HEIGHT * ISO_Z)
    return { ids, widthM, riseM }
  })

  const labels = groups.length * (LABEL_ABOVE + LABEL_BELOW)
  const drawnM = rowsM.reduce((sum, row) => sum + row.riseM + depthM, 0)
  const scale = Math.max(
    1,
    Math.min(
      MAX_SCALE,
      (width - PAD_X * 2) / Math.max(...rowsM.map((row) => row.widthM)),
      (height - labels) / drawnM
    )
  )

  let y = Math.max(0, (height - labels - drawnM * scale) / 2)
  const rows = rowsM.map((row) => {
    const ground = y + LABEL_ABOVE + row.riseM * scale
    y = ground + depthM * scale + LABEL_BELOW
    let x = (width - row.widthM * scale) / 2
    const personX = x + (PERSON_BAY * scale) / 2
    x += PERSON_BAY * scale
    const blocks = row.ids.map((id, at) => {
      if (at > 0)
        x +=
          (ITEM_BY_ID[id].material === ITEM_BY_ID[row.ids[at - 1]].material ? GAP : GROUP_GAP) *
          scale
      const half = (blockWidth * scale) / 2
      const box: BlockBox = { id, x: x + half, ground, half, depth: depthM * scale }
      x += half * 2
      return box
    })
    return { ground, personX, blocks }
  })

  return { width, height, scale, footprint, rows }
}

/** How far a stack of this many rises on screen, in pixels */
const riseOf = (box: BlockBox, layout: PileLayout, count: number) =>
  pileHeight(ITEM_BY_ID[box.id], count, layout.footprint) * ISO_Z * layout.scale

/** Screen y of the top of a stack (its back corner), for labels and hit tests */
export const blockTop = (box: BlockBox, layout: PileLayout, count: number) =>
  box.ground - box.depth - riseOf(box, layout, count)

// ------------------------------------------------------------------ sprites
interface Sprite {
  img: HTMLCanvasElement
  /** Size and anchor (the centre of the item's base) in device pixels */
  w: number
  h: number
  ax: number
  ay: number
}

// Paper is a warm white shading towards kraft brown, so the rolls sit in the same family as
// the paper colour of the charts; the cardboard tube is that colour itself.
const PAPER = {
  light: '#fff9ea',
  mid: '#efe2c4',
  shade: '#ad9562',
  top: '#fffdf4',
  rim: 'rgba(122, 88, 12, 0.5)',
  tube: '#c98500',
  hole: '#3d2c07',
}
const BOTTLE = {
  light: '#dcecff',
  mid: '#8fbdf3',
  shade: '#2b6dc6',
  cap: '#f5f9ff',
  capShade: '#aec4e0',
}
const CUP = {
  light: '#79aef2',
  mid: '#3987e5',
  shade: '#1c55a8',
  rim: 'rgba(255, 255, 255, 0.42)',
  lip: '#e2edfc',
  inside: '#0e2c5e',
}

const TAU = Math.PI * 2

function blank(w: number, h: number) {
  const img = document.createElement('canvas')
  img.width = Math.max(1, Math.ceil(w))
  img.height = Math.max(1, Math.ceil(h))
  return img
}

/** Lit from the left: a cylinder's side, light near its left edge and falling off to the right */
function sideShade(
  g: CanvasRenderingContext2D,
  cx: number,
  a: number,
  c: typeof PAPER | typeof CUP
) {
  const shade = g.createLinearGradient(cx - a, 0, cx + a, 0)
  shade.addColorStop(0, c.mid)
  shade.addColorStop(0.3, c.light)
  shade.addColorStop(1, c.shade)
  return shade
}

/** The side of an upright cylinder, from the line through the middle of its top down to the
    front half of its base */
function side(
  g: CanvasRenderingContext2D,
  cx: number,
  a: number,
  b: number,
  top: number,
  base: number
) {
  g.beginPath()
  g.moveTo(cx - a, top)
  g.lineTo(cx - a, base)
  g.ellipse(cx, base, a, b, 0, Math.PI, 0, true)
  g.lineTo(cx + a, top)
  g.closePath()
}

/** A roll of toilet paper or paper towels: a cylinder with a cardboard tube down the middle */
function rollSprite(item: Item, px: number): Sprite {
  const a = (item.diameter / 2) * px
  const b = a * FLAT
  const rise = item.height * ISO_Z * px
  const w = Math.ceil(a * 2) + 2
  const h = Math.ceil(rise + b * 2) + 2
  const img = blank(w, h)
  const g = img.getContext('2d')!
  const cx = w / 2
  const top = 1 + b
  const base = top + rise

  g.fillStyle = sideShade(g, cx, a, PAPER)
  side(g, cx, a, b, top, base)
  g.fill()
  if (a >= 3) {
    // A soft line under each roll, so the layers of a stack can be told apart
    g.strokeStyle = 'rgba(60, 46, 14, 0.28)'
    g.lineWidth = Math.min(1.2, a * 0.1)
    g.beginPath()
    g.ellipse(cx, base, a, b, 0, 0, Math.PI)
    g.stroke()
  }

  g.fillStyle = PAPER.top
  g.beginPath()
  g.ellipse(cx, top, a, b, 0, 0, TAU)
  g.fill()
  if (a >= 3) {
    g.strokeStyle = PAPER.rim
    g.lineWidth = Math.min(1.2, a * 0.1)
    g.stroke()
  }

  const tube = 0.021 * px
  if (tube >= 0.6) {
    g.fillStyle = PAPER.tube
    g.beginPath()
    g.ellipse(cx, top, tube, tube * FLAT, 0, 0, TAU)
    g.fill()
    if (tube >= 1.6) {
      g.fillStyle = PAPER.hole
      g.beginPath()
      g.ellipse(cx, top, tube * 0.76, tube * 0.76 * FLAT, 0, 0, TAU)
      g.fill()
    }
  }
  return { img, w, h, ax: cx, ay: base }
}

/** A half-litre water bottle: a body, a shoulder that narrows, and a white cap */
function bottleSprite(item: Item, px: number): Sprite {
  const a = (item.diameter / 2) * px
  const b = a * FLAT
  const rise = item.height * ISO_Z * px
  const neck = a * 0.44
  const neckFlat = neck * FLAT
  const w = Math.ceil(a * 2) + 2
  const h = Math.ceil(rise + neckFlat + b) + 2
  const img = blank(w, h)
  const g = img.getContext('2d')!
  const cx = w / 2
  const capTop = 1 + neckFlat
  const base = capTop + rise
  const shoulder = base - rise * 0.72
  const neckFoot = shoulder - rise * 0.16

  const body = g.createLinearGradient(cx - a, 0, cx + a, 0)
  body.addColorStop(0, BOTTLE.mid)
  body.addColorStop(0.28, BOTTLE.light)
  body.addColorStop(1, BOTTLE.shade)
  g.fillStyle = body
  side(g, cx, a, b, shoulder, base)
  g.fill()

  // The shoulder, drawn over the top of the body
  g.beginPath()
  g.moveTo(cx - a, shoulder)
  g.quadraticCurveTo(cx - a, neckFoot + (shoulder - neckFoot) * 0.25, cx - neck, neckFoot)
  g.lineTo(cx + neck, neckFoot)
  g.quadraticCurveTo(cx + a, neckFoot + (shoulder - neckFoot) * 0.25, cx + a, shoulder)
  g.ellipse(cx, shoulder, a, b, 0, 0, Math.PI)
  g.closePath()
  g.fill()
  g.fillStyle = 'rgba(255, 255, 255, 0.16)'
  g.fill()

  const cap = g.createLinearGradient(cx - neck, 0, cx + neck, 0)
  cap.addColorStop(0, BOTTLE.cap)
  cap.addColorStop(1, BOTTLE.capShade)
  g.fillStyle = cap
  side(g, cx, neck, neckFlat, capTop, neckFoot)
  g.fill()
  g.fillStyle = BOTTLE.cap
  g.beginPath()
  g.ellipse(cx, capTop, neck, neckFlat, 0, 0, TAU)
  g.fill()
  return { img, w, h, ax: cx, ay: base }
}

/** A sleeve of nested cups standing on its base: the bottom cup tapers, and each cup pushed
    into it adds a rim. Drawn straight onto a canvas so a part-filled sleeve can be any height. */
function drawSleeve(
  g: CanvasRenderingContext2D,
  cx: number,
  base: number,
  item: Item,
  cups: number,
  px: number
) {
  const a = (item.diameter / 2) * px
  const b = a * FLAT
  const foot = a * 0.64
  const pitch = (item.nest?.pitch ?? 0) * ISO_Z * px
  const rim = base - item.height * ISO_Z * px
  const top = rim - (cups - 1) * pitch

  g.fillStyle = sideShade(g, cx, a, CUP)
  g.beginPath()
  g.moveTo(cx - a, rim)
  g.lineTo(cx - foot, base)
  g.ellipse(cx, base, foot, foot * FLAT, 0, Math.PI, 0, true)
  g.lineTo(cx + a, rim)
  g.closePath()
  g.fill()

  if (cups > 1) {
    side(g, cx, a, b, top, rim)
    g.fill()
    if (pitch >= 1.5) {
      g.strokeStyle = CUP.rim
      g.lineWidth = Math.min(1, pitch * 0.3)
      for (let cup = 0; cup < cups - 1; cup++) {
        g.beginPath()
        g.ellipse(cx, rim - cup * pitch, a, b, 0, 0, Math.PI)
        g.stroke()
      }
    }
  }

  g.fillStyle = CUP.lip
  g.beginPath()
  g.ellipse(cx, top, a, b, 0, 0, TAU)
  g.fill()
  g.fillStyle = CUP.inside
  g.beginPath()
  g.ellipse(cx, top + b * 0.1, a * 0.82, b * 0.82, 0, 0, TAU)
  g.fill()
}

function sleeveSprite(item: Item, cups: number, px: number): Sprite {
  const a = (item.diameter / 2) * px
  const b = a * FLAT
  const rise = (item.height + (cups - 1) * (item.nest?.pitch ?? 0)) * ISO_Z * px
  const w = Math.ceil(a * 2) + 2
  const h = Math.ceil(rise + b * 2) + 2
  const img = blank(w, h)
  const base = h - 1 - b * 0.64
  drawSleeve(img.getContext('2d')!, w / 2, base, item, cups, px)
  return { img, w, h, ax: w / 2, ay: base }
}

/** The sprites for one scale. Made on first use, thrown away when the scale changes. */
export class Sprites {
  private made = new Map<string, Sprite>()
  private px = 0

  get(item: Item, px: number, cups = item.nest?.count ?? 1): Sprite {
    if (px !== this.px) {
      this.made.clear()
      this.px = px
    }
    const key = item.nest ? `${item.id}:${cups}` : item.id
    let sprite = this.made.get(key)
    if (!sprite) {
      sprite = item.nest
        ? sleeveSprite(item, cups, px)
        : item.id === 'bottles'
          ? bottleSprite(item, px)
          : rollSprite(item, px)
      this.made.set(key, sprite)
    }
    return sprite
  }
}

// ------------------------------------------------------------------ drawing
export interface PileLabels {
  name: string
  count: string
  height: string
}

export interface PileScene {
  counts: Record<ItemId, number>
  labels: Record<ItemId, PileLabels>
  person: { name: string; height: string }
  /** The stack under the pointer or matching the focused control: the others dim */
  active: ItemId | null
  dpr: number
  font: string
  compact: boolean
}

const INK = 'rgba(255, 255, 255, 0.88)'
const INK_2 = 'rgba(255, 255, 255, 0.6)'

/** One stack. (bx, by) is its back corner on the ground, in CSS pixels. */
function drawBlock(
  g: CanvasRenderingContext2D,
  sprites: Sprites,
  item: Item,
  count: number,
  bx: number,
  by: number,
  scale: number,
  footprint: number,
  dpr: number
) {
  const n = perSide(item, footprint)
  const layer = perLayer(item, footprint)
  const columns = columnsOf(item, count)
  if (columns <= 0) return
  const d = item.diameter
  const inset = (footprint - n * d) / 2
  const rise = columnHeight(item) * ISO_Z * scale
  const layers = Math.ceil(columns / layer)
  const onTop = columns - (layers - 1) * layer
  const px = scale * dpr
  const sprite = sprites.get(item, px)
  // The last sleeve of cups is the one still being filled
  const partial = item.nest ? lastSleeve(item, count) : 0
  const short = item.nest && partial < item.nest.count ? sprites.get(item, px, partial) : undefined

  for (let k = 0; k < layers; k++) {
    const top = k === layers - 1
    const inLayer = top ? onTop : layer
    const below = k === layers - 2
    const lift = k * rise
    for (let at = 0; at < inLayer; at++) {
      const i = at % n
      const j = (at - i) / n
      // Skip what cannot be seen. Under a full layer that is everything not on a near face;
      // under the part-filled top layer, everything with the top layer over it and over the
      // neighbour in front of it.
      if (!top && i < n - 1 && j < n - 1 && (!below || at + n + 1 < onTop)) continue
      const x = inset + (i + 0.5) * d
      const y = inset + (j + 0.5) * d
      const sx = bx + (x - y) * ISO_X * scale
      const sy = by + (x + y) * ISO_Y * scale - lift
      const s = short && top && at === inLayer - 1 ? short : sprite
      g.drawImage(s.img, sx - s.ax / dpr, sy - s.ay / dpr, s.w / dpr, s.h / dpr)
    }
  }
}

/** The square a stack stands on */
function drawFootprint(g: CanvasRenderingContext2D, box: BlockBox) {
  g.beginPath()
  g.moveTo(box.x, box.ground - box.depth)
  g.lineTo(box.x + box.half, box.ground)
  g.lineTo(box.x, box.ground + box.depth)
  g.lineTo(box.x - box.half, box.ground)
  g.closePath()
  g.fillStyle = 'rgba(255, 255, 255, 0.035)'
  g.fill()
  g.strokeStyle = 'rgba(255, 255, 255, 0.24)'
  g.lineWidth = 1
  g.stroke()
}

/** Push a stack back, so the one being pointed at stands out. A wash of the surface colour
    over its outline (a little outside it, to cover the soft edges of the items): drawing the
    items themselves see-through would show every hidden one. */
function dim(g: CanvasRenderingContext2D, box: BlockBox, rise: number) {
  const out = 2
  g.beginPath()
  g.moveTo(box.x, box.ground - box.depth - rise - out)
  g.lineTo(box.x + box.half + out, box.ground - rise - out / 2)
  g.lineTo(box.x + box.half + out, box.ground + out / 2)
  g.lineTo(box.x, box.ground + box.depth + out)
  g.lineTo(box.x - box.half - out, box.ground + out / 2)
  g.lineTo(box.x - box.half - out, box.ground - rise - out / 2)
  g.closePath()
  g.fillStyle = 'rgba(7, 8, 12, 0.7)'
  g.fill()
}

/** A rectangle with rounded corners, squared off where roundRect is missing */
function rounded(
  g: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radii: number[]
) {
  g.beginPath()
  if (g.roundRect) g.roundRect(x, y, w, h, radii)
  else g.rect(x, y, w, h)
  g.fill()
}

/** A plain standing figure, PERSON_HEIGHT tall, feet at (x, ground) */
function drawPerson(g: CanvasRenderingContext2D, x: number, ground: number, scale: number) {
  // Drawn at the scale heights are drawn at, so it can be read against the stacks
  const u = scale * ISO_Z
  const head = 0.115 * u
  const shoulders = 0.23 * u
  const hip = 0.8 * u
  const neck = (PERSON_HEIGHT - 0.25) * u
  const leg = 0.09 * u

  g.fillStyle = 'rgba(0, 0, 0, 0.4)'
  g.beginPath()
  g.ellipse(x, ground, 0.36 * u, 0.36 * u * FLAT, 0, 0, TAU)
  g.fill()

  g.fillStyle = 'rgba(255, 255, 255, 0.94)'
  g.beginPath()
  g.arc(x, ground - PERSON_HEIGHT * u + head, head, 0, TAU)
  g.fill()

  rounded(g, x - shoulders, ground - neck, shoulders * 2, neck - hip + 0.02 * u, [
    0.1 * u,
    0.1 * u,
    0.03 * u,
    0.03 * u,
  ])
  for (const side of [-1, 1])
    rounded(g, x + side * 0.115 * u - leg, ground - hip, leg * 2, hip, [0, 0, 0.05 * u, 0.05 * u])
}

export function drawPile(
  g: CanvasRenderingContext2D,
  layout: PileLayout,
  scene: PileScene,
  sprites: Sprites
) {
  const { dpr } = scene
  g.setTransform(dpr, 0, 0, dpr, 0, 0)
  g.clearRect(0, 0, layout.width, layout.height)
  g.textAlign = 'center'
  g.textBaseline = 'alphabetic'
  const size = scene.compact ? 10 : 11

  for (const row of layout.rows) {
    const labelY = row.ground + (row.blocks[0]?.depth ?? 0) + 17

    drawPerson(g, row.personX, row.ground, layout.scale)
    g.font = `500 ${size}px ${scene.font}`
    g.fillStyle = INK
    g.fillText(scene.person.name, row.personX, labelY)
    g.font = `${size}px ${scene.font}`
    g.fillStyle = INK_2
    g.fillText(scene.person.height, row.personX, labelY + 14)

    for (const box of row.blocks) {
      const item = ITEM_BY_ID[box.id]
      const count = scene.counts[box.id]
      const label = scene.labels[box.id]
      const back = scene.active !== null && scene.active !== box.id

      drawFootprint(g, box)
      drawBlock(
        g,
        sprites,
        item,
        count,
        box.x,
        box.ground - box.depth,
        layout.scale,
        layout.footprint,
        dpr
      )
      if (back) dim(g, box, riseOf(box, layout, count))

      g.globalAlpha = back ? 0.4 : 1
      g.font = `500 ${size}px ${scene.font}`
      g.fillStyle = INK
      g.fillText(label.name, box.x, labelY)
      g.font = `${size}px ${scene.font}`
      g.fillStyle = INK_2
      g.fillText(label.count, box.x, labelY + 14)
      if (count > 0) g.fillText(label.height, box.x, blockTop(box, layout, count) - 9)
      g.globalAlpha = 1
    }
  }
}
