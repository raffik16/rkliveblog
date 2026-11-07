// The stave: a five-line staff bent into a ring around the whole set, carrying 96 beats of melody. It turns one beat
// width per beat, so the notes march at the set's tempo, and each one lights up as it crosses the playhead, a beam of
// light standing at one fixed point of the ring, like a music box being played.
import * as THREE from 'three'
import { rng } from '../../teardown/kit/util.js'
import { noteGlyphs, noteMaterial, NEON } from './notes.js'

export const STAVE = {
  radius: 25,
  space: 0.38, // one staff space, world units
  beats: 96,
  y: -6.2,
  tilt: [0.13, 0, 0.06],
  playhead: Math.PI * 0.25, // world angle (in the ring's own frame) where notes sound
}

// which glyphs fill a beat slot, and how they are weighted
const RHYTHM = [
  ['quarter', 1, 0.34],
  ['pair', 1, 0.3],
  ['sixteenths', 1, 0.12],
  ['half', 2, 0.16],
  ['whole', 4, 0.08],
]

/** The melody: [{glyph, beat, pos}] where pos is the staff position of the (first) notehead, 0 = bottom line. */
function compose(seed) {
  const r = rng(seed)
  const out = []
  let p = 4
  let b = 0
  while (b < STAVE.beats) {
    if (b % 24 === 0) {
      out.push({ glyph: 'clef', beat: b, pos: 2 })
      b += 1
      continue
    }
    const left = 4 - (b % 4)
    let pick
    for (let tries = 0; tries < 20; tries++) {
      let x = r()
      for (const k of RHYTHM) {
        if ((x -= k[2]) <= 0) {
          pick = k
          break
        }
      }
      pick = pick || RHYTHM[0]
      if (pick[1] <= left && !(pick[0] === 'whole' && b % 4 !== 0)) break
      pick = RHYTHM[0]
    }
    // a pentatonic walk, kept on the staff
    const step = [-2, -1, -1, 1, 1, 2, 0, 3, -3][Math.floor(r() * 9)]
    p = Math.max(-1, Math.min(8, p + step))
    if ((pick[0] === 'quarter' || pick[0] === 'half') && r() < 0.12)
      out.push({ glyph: 'sharp', beat: b - 0.32, pos: p })
    out.push({ glyph: pick[0], beat: b, pos: p, len: pick[1] })
    b += pick[1]
  }
  return out
}

export function buildStave(glow) {
  const S = STAVE
  const group = new THREE.Group()
  group.position.y = S.y
  group.rotation.set(S.tilt[0], S.tilt[1], S.tilt[2])
  const ring = new THREE.Group()
  group.add(ring)

  // five lines; y of staff position p is (p - 4) half-spaces from the middle line
  const yOf = (p) => ((p - 4) * S.space) / 2
  const lineMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.55, 0.6, 0.75) })
  for (let k = 0; k < 5; k++) {
    const g = new THREE.TorusGeometry(S.radius, 0.018, 5, 900)
    g.rotateX(Math.PI / 2)
    const m = new THREE.Mesh(g, lineMat)
    m.position.y = yOf(k * 2)
    ring.add(m)
  }

  const glyphs = noteGlyphs()
  const mat = noteMaterial(glow)
  const melody = compose(41)
  const kinds = {}
  for (const n of melody) (kinds[n.glyph] = kinds[n.glyph] || []).push(n)

  const notes = []
  const M = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const pos = new THREE.Vector3()
  const scl = new THREE.Vector3()
  const basis = new THREE.Matrix4()
  const flipQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI)
  for (const [kind, list] of Object.entries(kinds)) {
    const im = new THREE.InstancedMesh(glyphs[kind].geo, mat, list.length)
    im.frustumCulled = false
    ring.add(im)
    list.forEach((n, i) => {
      // the beat's angle: later beats further round, so the score scrolls the way it reads from inside the ring
      const th = (2 * Math.PI * (n.beat + 0.3)) / S.beats + S.playhead
      const radial = new THREE.Vector3(Math.cos(th), 0, Math.sin(th))
      const tangent = new THREE.Vector3(-Math.sin(th), 0, Math.cos(th))
      const inward = radial.clone().negate()
      basis.makeBasis(tangent, new THREE.Vector3(0, 1, 0), inward)
      q.setFromRotationMatrix(basis)
      // stems go down from the middle line up, as on paper
      const down = n.glyph !== 'clef' && n.glyph !== 'sharp' && n.glyph !== 'whole' && n.pos >= 4
      if (down) q.multiply(flipQ)
      const y = n.glyph === 'clef' ? yOf(2) : yOf(n.pos)
      pos
        .copy(radial)
        .multiplyScalar(S.radius - 0.02)
        .setY(y)
      const s = S.space * (n.glyph === 'clef' ? 0.95 : 1)
      scl.set(s, s, s)
      M.compose(pos, q, scl)
      im.setMatrixAt(i, M)
      const hue = NEON[(Math.round(n.pos) + 7 + (n.glyph === 'clef' ? 3 : 0)) % NEON.length]
      im.setColorAt(i, new THREE.Color(hue))
      notes.push({
        im,
        i,
        beat: n.beat,
        base: new THREE.Color(hue),
        M: M.clone(),
        radial,
        len: n.len || 1,
      })
    })
    im.instanceMatrix.needsUpdate = true
    im.instanceColor.setUsage(THREE.DynamicDrawUsage)
  }

  // bar lines every four beats
  const barGeo = new THREE.BoxGeometry(0.05, S.space * 4 + 0.02, 0.05)
  const bars = new THREE.InstancedMesh(barGeo, lineMat, S.beats / 4)
  for (let k = 0; k < S.beats / 4; k++) {
    const th = (2 * Math.PI * (k * 4 - 0.12)) / S.beats + S.playhead
    pos.set(Math.cos(th) * S.radius, 0, Math.sin(th) * S.radius)
    M.makeRotationY(-th).setPosition(pos)
    bars.setMatrixAt(k, M)
  }
  ring.add(bars)

  // the playhead: a standing beam of light where the notes sound
  const beamMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#ff3df0').multiplyScalar(2.2),
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  const beamGeo = new THREE.CylinderGeometry(0.035, 0.035, S.space * 9, 8, 1, true)
  const beam = new THREE.Mesh(beamGeo, beamMat)
  beam.position.set(Math.cos(S.playhead) * S.radius, 0, Math.sin(S.playhead) * S.radius)
  group.add(beam)

  const meshes = [...new Set(notes.map((n) => n.im))]
  const tmp = new THREE.Color()
  const hop = new THREE.Vector3()
  /** beats: the set's beat clock (continuous). kick: 0..1 envelope of this beat. */
  const update = (beats, kick) => {
    ring.rotation.y = (2 * Math.PI * beats) / S.beats
    for (const n of notes) {
      // beats from the moment this note crosses the playhead (negative: still coming), the short way round the ring
      let d = (beats - n.beat - 0.3) % S.beats
      if (d < 0) d += S.beats
      if (d > S.beats / 2) d -= S.beats
      // it brightens quickly as it arrives and dies away over its own length: a smooth bell, no edges
      const x = d < 0 ? d / 0.3 : d / (0.45 + 0.45 * n.len)
      const ring1 = Math.exp(-x * x)
      const k = 0.55 + 0.2 * kick + 3.2 * ring1
      tmp.copy(n.base).multiplyScalar(k)
      n.im.setColorAt(n.i, tmp)
      // the sounding note hops off the staff toward the middle of the ring
      M.copy(n.M)
      hop.copy(n.radial).multiplyScalar(-0.5 * ring1)
      M.elements[12] += hop.x
      M.elements[13] += 0.12 * ring1
      M.elements[14] += hop.z
      n.im.setMatrixAt(n.i, M)
    }
    for (const im of meshes) {
      im.instanceColor.needsUpdate = true
      im.instanceMatrix.needsUpdate = true
    }
    beamMat.color.setRGB(1, 0.24, 0.94).multiplyScalar(1.4 + 0.8 * kick)
  }

  return { group, update }
}
