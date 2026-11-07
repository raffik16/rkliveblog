// The debris: the parts a teardown leaves on the bench (spur gears, pistons, con rods, valve springs, nuts, Jansen
// links with their red joint caps, tyres) caught in the storm. Each part rides the same curve as the points, by the
// same formula, on the CPU: a few hundred instanced meshes, every matrix recomposed per frame, a pure function of t.
import * as THREE from 'three'
import { sampleAt } from './attractors.js'
import { FLOW, swirl } from './storm.js'
import { rng } from '../teardown/kit/util.js'

const V3 = THREE.Vector3

function spurGear(teeth, rOut, rRoot, width, holeR) {
  const sh = new THREE.Shape()
  for (let i = 0; i < teeth; i++) {
    const a0 = (i / teeth) * Math.PI * 2
    const da = (Math.PI * 2) / teeth
    const pts = [
      [rRoot, a0],
      [rRoot, a0 + da * 0.2],
      [rOut, a0 + da * 0.33],
      [rOut, a0 + da * 0.62],
      [rRoot, a0 + da * 0.75],
    ]
    pts.forEach(([r, a], k) =>
      i === 0 && k === 0
        ? sh.moveTo(r * Math.cos(a), r * Math.sin(a))
        : sh.lineTo(r * Math.cos(a), r * Math.sin(a))
    )
  }
  sh.closePath()
  const h = new THREE.Path()
  h.absarc(0, 0, holeR, 0, Math.PI * 2, true)
  sh.holes.push(h)
  // lightening holes between hub and rim
  for (let k = 0; k < 5; k++) {
    const a = (k / 5) * Math.PI * 2
    const c = (holeR + rRoot) / 2
    const hp = new THREE.Path()
    hp.absarc(c * Math.cos(a), c * Math.sin(a), (rRoot - holeR) * 0.24, 0, Math.PI * 2, true)
    sh.holes.push(hp)
  }
  const g = new THREE.ExtrudeGeometry(sh, {
    depth: width,
    bevelEnabled: true,
    bevelThickness: width * 0.12,
    bevelSize: width * 0.1,
    bevelSegments: 1,
    curveSegments: 6,
  })
  g.translate(0, 0, -width / 2)
  g.computeVertexNormals()
  return g
}

function piston() {
  // a lathed piston: domed crown, three ring lands, the skirt
  const pts = []
  const R = 0.1
  const prof = [
    [0, 0.142],
    [R * 0.55, 0.14],
    [R * 0.92, 0.132],
    [R, 0.124],
    [R, 0.112],
    [R * 0.95, 0.11],
    [R * 0.95, 0.104],
    [R, 0.102],
    [R, 0.092],
    [R * 0.95, 0.09],
    [R * 0.95, 0.084],
    [R, 0.082],
    [R, 0],
    [R * 0.9, 0],
    [R * 0.9, 0.06],
    [0, 0.07],
  ]
  for (const [x, y] of prof) pts.push(new THREE.Vector2(x, y - 0.07))
  const g = new THREE.LatheGeometry(pts, 40)
  g.computeVertexNormals()
  return g
}

function conRod() {
  const big = 0.075
  const small = 0.042
  const len = 0.36
  const sh = new THREE.Shape()
  sh.absarc(0, 0, big, Math.PI * 0.15, Math.PI * 0.85, true)
  sh.lineTo(-small * 0.8, len)
  sh.absarc(0, len, small, Math.PI, 0, true)
  sh.lineTo(big * Math.cos(Math.PI * 0.15), big * Math.sin(Math.PI * 0.15))
  const h1 = new THREE.Path()
  h1.absarc(0, 0, big * 0.6, 0, Math.PI * 2, true)
  const h2 = new THREE.Path()
  h2.absarc(0, len, small * 0.5, 0, Math.PI * 2, true)
  sh.holes.push(h1, h2)
  const g = new THREE.ExtrudeGeometry(sh, {
    depth: 0.03,
    bevelEnabled: true,
    bevelThickness: 0.008,
    bevelSize: 0.006,
    bevelSegments: 1,
    curveSegments: 16,
  })
  g.translate(0, -len / 2, -0.015)
  g.computeVertexNormals()
  return g
}

function spring() {
  const pts = []
  const turns = 7
  const len = 0.26
  const r = 0.05
  const seg = 160
  for (let i = 0; i <= seg; i++) {
    const u = i / seg
    const a = u * turns * Math.PI * 2
    pts.push(new V3(Math.cos(a) * r, u * len - len / 2, Math.sin(a) * r))
  }
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), seg, 0.008, 6, false)
}

function nut() {
  const sh = new THREE.Shape()
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6
    if (i === 0) sh.moveTo(0.05 * Math.cos(a), 0.05 * Math.sin(a))
    else sh.lineTo(0.05 * Math.cos(a), 0.05 * Math.sin(a))
  }
  sh.closePath()
  const h = new THREE.Path()
  h.absarc(0, 0, 0.024, 0, Math.PI * 2, true)
  sh.holes.push(h)
  const g = new THREE.ExtrudeGeometry(sh, {
    depth: 0.04,
    bevelEnabled: true,
    bevelThickness: 0.006,
    bevelSize: 0.005,
    bevelSegments: 1,
    curveSegments: 12,
  })
  g.translate(0, 0, -0.02)
  g.computeVertexNormals()
  return g
}

function jansenLink() {
  // a white tube with a red joint cap at each end, coloured per vertex so one draw call carries both
  const tube = new THREE.CylinderGeometry(0.016, 0.016, 0.5, 12, 1, true)
  const capA = new THREE.CylinderGeometry(0.03, 0.03, 0.05, 18)
  const capB = capA.clone()
  capA.rotateX(Math.PI / 2)
  capB.rotateX(Math.PI / 2)
  capA.translate(0, 0.25, 0)
  capB.translate(0, -0.25, 0)
  const parts = [
    [tube, '#f4f1eb'],
    [capA, '#d1322a'],
    [capB, '#d1322a'],
  ]
  const geos = parts.map(([g, hex]) => {
    const ng = g.toNonIndexed()
    const c = new THREE.Color(hex)
    const n = ng.attributes.position.count
    const arr = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) c.toArray(arr, i * 3)
    ng.setAttribute('color', new THREE.BufferAttribute(arr, 3))
    ng.deleteAttribute('uv')
    return ng
  })
  // merge by hand: three's BufferGeometryUtils would do it too, this keeps the page to core three
  const count = geos.reduce((s, g) => s + g.attributes.position.count, 0)
  const out = new THREE.BufferGeometry()
  for (const name of ['position', 'normal', 'color']) {
    const arr = new Float32Array(count * 3)
    let o = 0
    for (const g of geos) {
      arr.set(g.attributes[name].array, o)
      o += g.attributes[name].array.length
    }
    out.setAttribute(name, new THREE.BufferAttribute(arr, 3))
  }
  return out
}

function tyre() {
  const g = new THREE.TorusGeometry(0.15, 0.05, 14, 40)
  return g
}

export function buildDebris(attractors, { seed = 29 } = {}) {
  const M = {
    steel: new THREE.MeshStandardMaterial({
      color: '#cfd2d6',
      roughness: 0.5,
      metalness: 1,
      envMapIntensity: 0.45,
    }),
    brass: new THREE.MeshStandardMaterial({
      color: '#b98a55',
      roughness: 0.48,
      metalness: 0.9,
      envMapIntensity: 0.45,
    }),
    alu: new THREE.MeshStandardMaterial({
      color: '#d9dbdf',
      roughness: 0.52,
      metalness: 0.85,
      envMapIntensity: 0.45,
    }),
    black: new THREE.MeshPhysicalMaterial({
      color: '#141518',
      roughness: 0.3,
      metalness: 0.2,
      clearcoat: 0.7,
      clearcoatRoughness: 0.18,
    }),
    link: new THREE.MeshPhysicalMaterial({
      color: '#ffffff',
      vertexColors: true,
      roughness: 0.34,
      clearcoat: 0.4,
    }),
    rubber: new THREE.MeshStandardMaterial({ color: '#1b1c1e', roughness: 0.8, metalness: 0 }),
    orange: new THREE.MeshPhysicalMaterial({
      color: '#e8572a',
      roughness: 0.32,
      metalness: 0.05,
      clearcoat: 0.5,
    }),
  }
  const KINDS = [
    { geo: spurGear(28, 0.22, 0.195, 0.05, 0.04), mat: M.steel, n: 36, size: [0.8, 1.6], spin: 1 },
    { geo: spurGear(14, 0.12, 0.1, 0.06, 0.025), mat: M.brass, n: 36, size: [0.8, 1.4], spin: 2 },
    { geo: piston(), mat: M.alu, n: 24, size: [0.9, 1.3], spin: 0 },
    { geo: conRod(), mat: M.black, n: 24, size: [0.9, 1.3], spin: 0 },
    { geo: spring(), mat: M.steel, n: 26, size: [0.9, 1.4], spin: 0 },
    { geo: nut(), mat: M.steel, n: 40, size: [0.7, 1.4], spin: 0 },
    { geo: jansenLink(), mat: M.link, n: 40, size: [0.8, 1.3], spin: 0 },
    { geo: tyre(), mat: M.rubber, n: 10, size: [0.9, 1.2], spin: 3 },
    { geo: spurGear(10, 0.08, 0.064, 0.05, 0.02), mat: M.orange, n: 20, size: [0.8, 1.2], spin: 2 },
  ]
  const r = rng(seed)
  const group = new THREE.Group()
  const items = []
  for (const kind of KINDS) {
    const mesh = new THREE.InstancedMesh(kind.geo, kind.mat, kind.n)
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    mesh.frustumCulled = false
    group.add(mesh)
    kind.mesh = mesh
    for (let i = 0; i < kind.n; i++) {
      const axis = new V3(r() * 2 - 1, r() * 2 - 1, r() * 2 - 1).normalize()
      const q0 = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(r() * 6.28, r() * 6.28, r() * 6.28)
      )
      items.push({
        mesh,
        i,
        u0: r(),
        // a part rides a touch faster or slower than the points around it
        rate: FLOW.rate * (1 + (r() * 2 - 1) * 0.22),
        delay: r(),
        // parts float beside the filaments, not on them: the light stays readable through the debris
        jit: (() => {
          const d = [r() * 2 - 1, r() * 2 - 1, r() * 2 - 1]
          const k = (0.5 + 2.2 * Math.pow(r(), 0.7)) / (Math.hypot(...d) || 1)
          return d.map((x) => x * k)
        })(),
        size: kind.size[0] + (kind.size[1] - kind.size[0]) * r(),
        axis,
        q0,
        tumble: (0.25 + r() * 0.9) * (r() < 0.5 ? -1 : 1),
        spin: kind.spin ? (1.2 + r() * 2.5) * kind.spin * (r() < 0.5 ? -1 : 1) : 0,
      })
    }
  }

  const pa = [0, 0, 0]
  const pb = [0, 0, 0]
  const sw = [0, 0, 0]
  const pos = new V3()
  const q = new THREE.Quaternion()
  const qs = new THREE.Quaternion()
  const Z = new V3(0, 0, 1)
  const sc = new V3()
  const M4 = new THREE.Matrix4()

  /** t: seconds; a, b: attractor indices; morph 0..1; chaos: turbulence; scale: overall part size. */
  const update = (t, a, b, morph, chaos, scale = 1, density = 1) => {
    const A = attractors[a]
    const B = attractors[b]
    for (const it of items) {
      const x = it.u0 + it.rate * t
      const u = x - Math.floor(x)
      let m = Math.min(1, Math.max(0, (morph - it.delay * 0.45) / 0.55))
      m = m * m * (3 - 2 * m)
      const fly = Math.sin(Math.PI * m)
      sampleAt(A, u, pa)
      sampleAt(B, u, pb)
      for (let k = 0; k < 3; k++) pa[k] = pa[k] + (pb[k] - pa[k]) * m + it.jit[k] * (1 + 2 * fly)
      swirl([pa[0] * 0.45, pa[1] * 0.45, pa[2] * 0.45], t, sw)
      const kSw = fly * chaos + 0.035
      pos.set(pa[0] + sw[0] * kSw, pa[1] + sw[1] * kSw, pa[2] + sw[2] * kSw)
      // shrink away across the seam where the trajectory jumps back to its start
      const seam = Math.min(1, u / 0.004, (1 - u) / 0.004)
      // the thinned tiers drop the same parts every time
      const keep = (it.i + 0.5) / it.mesh.count <= density ? 1 : 0
      const s = it.size * scale * seam * keep
      q.setFromAxisAngle(it.axis, it.tumble * t).multiply(it.q0)
      if (it.spin) q.multiply(qs.setFromAxisAngle(Z, it.spin * t))
      sc.set(s, s, s)
      M4.compose(pos, q, sc)
      it.mesh.setMatrixAt(it.i, M4)
    }
    for (const k of KINDS) k.mesh.instanceMatrix.needsUpdate = true
  }
  const total = KINDS.reduce((s, k) => s + k.n, 0)
  return { group, update, total, materials: Object.values(M) }
}
