// The cursors over the club while you play, drawn in code as the page loads (like the sounds
// and the club). They are cursor images handed to the browser in CSS, not a sprite the game
// moves around: the system draws its own cursor straight from the mouse, a frame or more ahead
// of anything the page can draw, and on the beat you would feel the difference.
//
//   aim      over nothing: a ring with a dot in the middle
//   pad0-7   over a pad: the ring a size up, in that pad's colour
//   target   over the crossfader and the HUD's buttons: the ring in lime
//   record   over the record: a small ring between an up arrow and a down arrow (drag it). With
//            the keys, anywhere on the club, since a press anywhere takes the record
//   scratch  holding the record: the ring filled in, the arrows still there

import { PADS } from './pads.js'

const SIZE = 32 // CSS pixels: the biggest cursor every browser shows anywhere on the screen
const MID = SIZE / 2 // every cursor's hot spot is its middle
const WHITE = '#f5f1ff'
const LIME = '#d8ff3c'
const FORWARD = '#ff2bd6' // the HUD's colours for pushing the record up and pulling it down
const BACK = '#22e4ff'
const EDGE = 'rgba(7, 5, 12, 0.72)' // a dark edge under everything, to read on the brightest pad

/** The cursors as CSS `cursor` values, by name. */
export function makeCursors() {
  const cursors = {
    aim: make((g) => ring(g, 8, 1.75, WHITE, 0), 'crosshair'),
    target: make((g) => ring(g, 9.5, 2.5, LIME, 4), 'pointer'),
    record: make((g) => {
      ring(g, 5.5, 1.75, WHITE, 0)
      arrows(g)
    }, 'grab'),
    scratch: make((g) => {
      disc(g, 5.5)
      arrows(g)
    }, 'grabbing'),
  }
  PADS.forEach((p, i) => {
    cursors[`pad${i}`] = make((g) => ring(g, 9.5, 2.5, p.color, 4), 'pointer')
  })
  return cursors
}

/**
 * One cursor: drawn at 1x and 2x (crisp on a high-density screen) where the browser takes a
 * set of images for a cursor, at 1x where it doesn't, and the plain cursor `fallback` names if
 * it can't be drawn at all.
 */
function make(draw, fallback) {
  try {
    const one = image(draw, 1)
    const two = image(draw, 2)
    const tail = ` ${MID} ${MID}, ${fallback}`
    for (const set of ['image-set', '-webkit-image-set']) {
      const value = `${set}(${one} 1x, ${two} 2x)${tail}`
      if (CSS.supports('cursor', value)) return value
    }
    return one + tail
  } catch {
    return fallback
  }
}

function image(draw, scale) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = SIZE * scale
  const g = canvas.getContext('2d')
  g.scale(scale, scale)
  draw(g)
  return `url("${canvas.toDataURL('image/png')}")`
}

/** A ring on a dark edge, glowing in its own colour, with a dot in the middle. */
function ring(g, r, width, color, glow) {
  g.beginPath()
  g.arc(MID, MID, r, 0, Math.PI * 2)
  g.lineWidth = width + 2.5
  g.strokeStyle = EDGE
  g.stroke()
  g.shadowColor = color
  g.shadowBlur = glow
  g.lineWidth = width
  g.strokeStyle = color
  g.stroke()
  g.shadowBlur = 0
  g.beginPath()
  g.arc(MID, MID, 2.3, 0, Math.PI * 2)
  g.fillStyle = EDGE
  g.fill()
  g.beginPath()
  g.arc(MID, MID, 1.3, 0, Math.PI * 2)
  g.fillStyle = WHITE
  g.fill()
}

/** The ring filled in: a hand on the record. */
function disc(g, r) {
  g.beginPath()
  g.arc(MID, MID, r, 0, Math.PI * 2)
  g.lineWidth = 2.5
  g.strokeStyle = EDGE
  g.stroke()
  g.fillStyle = WHITE
  g.fill()
}

/** Up (forward) above, down (back) below: the way the record moves. */
function arrows(g) {
  arrow(g, 2.5, 7, FORWARD)
  arrow(g, SIZE - 2.5, SIZE - 7, BACK)
}

function arrow(g, tip, base, color) {
  g.beginPath()
  g.moveTo(MID, tip)
  g.lineTo(MID + 5, base)
  g.lineTo(MID - 5, base)
  g.closePath()
  g.lineJoin = 'round'
  g.lineWidth = 2.5
  g.strokeStyle = EDGE
  g.stroke()
  g.fillStyle = color
  g.fill()
}
