// Fur: real strands on the animatronic dogs' coats, hanging under gravity and blown about by whatever flows through
// them. It is simulated the way film hair is: a grid of guide hairs per coat, each a chain of four points integrated
// on the CPU (Verlet, a fixed 120 Hz step) with gravity, a bending stiffness that holds its lay, air drag against the
// wind, and the skin it grows from as a floor. Thousands of drawn strands then follow the guides round them on the
// GPU, each a tapered ribbon along a cubic through its guides' points, with its own length, colour and curl, and
// drawn in toward its neighbours at the tip, the way a pelt parts into locks.
//
// Nothing pushes the fur but physics: when a dog bounces on the kick, comes apart or swings round, the roots move
// and the strands trail behind them and settle under their own weight; a bun half turned over hangs its fur the
// other way. The wind is what flows through the set: the storm's own turbulence, a puff of air from the subs on
// every kick, the points that burst out of a dog when it comes apart (and rush back in when it reassembles), and the
// flying parts and notes that pass close by.
//
// It is shaded as hair (Kajiya-Kay, with the two shifted highlights of Marschner's model): dark at the roots where
// the undercoat sits in its own shadow, light at the tips, glowing round the edges when a light is behind it. Strands
// thinner than a pixel keep their share of it as coverage (alpha to coverage, on the multisampled target) instead of
// shimmering.
import * as THREE from 'three'
import { rng } from '../../teardown/kit/util.js'

const GU = 18 // guides along a coat
const GV = 8 // guides round it, bottom to top
const NODES = 4 // a guide: its root and three points
const SEG = 7 // segments in a drawn strand
const H = 1 / 120 // the simulation's step, seconds

export const FUR = {
  length: 0.74, // a guide's length, world units (about 14 mm on a dog this size)
  width: 0.0075, // a strand's width at its root, world units
  gravity: 26, // world units / s²
  drag: 5, // how hard the air drags a strand toward the wind's speed, 1/s
  damping: 0.035, // velocity lost per step: air and its own hairs damp fur, so it settles, not rings
  stiff: [0.09, 0.04, 0.02], // how hard each segment holds its lay, per step (root first)
  vMax: 0.97, // fur grows up to here round the coat (1 is the cut edge)
  locks: [60, 16], // locks along a coat and round it
  clump: 0.6, // how far a strand's tip is drawn into its lock
}

const vert = /* glsl */ `
precision highp float;
precision highp sampler2D;
uniform mat4 uCoat[6];
uniform sampler2D uGuides;
uniform float uScale;
uniform float uLen;
uniform float uWidth;
uniform float uClump;
in vec3 aRoot;
in vec3 aLock;
in vec3 aNormal;
in vec2 aUV;
in float aCoat;
in vec4 aRand;
in vec3 aTip;
out vec3 vT;
out vec3 vN;
out vec3 vP;
out vec3 vTip;
out float vS;
out float vSide;
out float vCover;
out float vFar;

// a guide's point k (1..3), relative to its root, per unit of length
vec3 guide(int g, int k) {
  return texelFetch(uGuides, ivec2(g, k - 1), 0).xyz;
}
// the same point, blended from the four guides round this strand
vec3 point(int base, vec2 uv, int k) {
  vec2 f = uv * vec2(${GU - 1}.0, ${GV - 1}.0);
  vec2 i0 = min(floor(f), vec2(${GU - 2}.0, ${GV - 2}.0));
  vec2 w = f - i0;
  int a = base + int(i0.x) * ${GV} + int(i0.y);
  int b = a + ${GV};
  return mix(mix(guide(a, k), guide(a + 1, k), w.y), mix(guide(b, k), guide(b + 1, k), w.y), w.x);
}

void main() {
  int c = int(aCoat + 0.5);
  mat4 M = uCoat[c];
  vec3 root = (M * vec4(aRoot, 1.0)).xyz;
  vec3 nrm = normalize(mat3(M) * aNormal);
  float len = uLen * aRand.x;
  int base = c * ${GU * GV};
  vec3 p1 = root + point(base, aUV, 1) * len;
  vec3 p2 = root + point(base, aUV, 2) * len;
  vec3 p3 = root + point(base, aUV, 3) * len;
  // a cubic from the root through the guides' points
  float s = position.x;
  float u = 1.0 - s;
  vec3 p = u * u * u * root + 3.0 * u * u * s * p1 + 3.0 * u * s * s * p2 + s * s * s * p3;
  vec3 tan = 3.0 * u * u * (p1 - root) + 6.0 * u * s * (p2 - p1) + 3.0 * s * s * (p3 - p2);
  // drawn toward the middle of its lock, more toward the tip
  vec3 lock = mat3(M) * aLock * uClump;
  p += lock * s * s;
  tan = normalize(tan + lock * 2.0 * s + 1e-6);
  // its own curl, growing toward the tip
  vec3 b1 = normalize(cross(tan, abs(tan.y) < 0.9 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
  vec3 b2 = cross(tan, b1);
  float curl = aRand.z * 6.2831853 + s * 5.5;
  p += (b1 * cos(curl) + b2 * sin(curl)) * len * 0.06 * s * s;
  // a ribbon across the line of sight, never thinner than two device pixels: below that its light is coverage. A
  // strand one pixel wide crawls from pixel to pixel as it moves; two wide, the multisampling smooths it
  vec3 view = normalize(cameraPosition - p);
  vec3 side = normalize(cross(tan, view) + 1e-6);
  vec4 mv = viewMatrix * vec4(p, 1.0);
  float depth = max(0.05, -mv.z);
  float w = uWidth * aRand.w * (1.0 - 0.82 * s);
  float px = w * uScale / depth;
  float wide = max(px, 2.0) * depth / uScale;
  p += side * position.y * wide * 0.5;
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
  vT = tan;
  vN = nrm;
  vP = p;
  vTip = aTip;
  vS = s;
  vSide = position.y;
  vCover = min(1.0, px * 0.5) * (1.0 - smoothstep(0.7, 1.0, s));
  // how far below a pixel this strand is: there it blends into the coat instead of standing out from it
  vFar = 1.0 - smoothstep(0.5, 2.0, px);
}`

const frag = /* glsl */ `
precision highp float;
uniform vec3 uLightDir[3];
uniform vec3 uLightCol[3];
uniform vec3 uSky;
uniform vec3 uGround;
uniform vec3 uEnv;
uniform vec3 uFog;
uniform float uFogDensity;
in vec3 vT;
in vec3 vN;
in vec3 vP;
in vec3 vTip;
in float vS;
in float vSide;
in float vCover;
in float vFar;
out vec4 fragColor;

void main() {
  vec3 T = normalize(vT);
  vec3 N = normalize(vN);
  vec3 V = normalize(cameraPosition - vP);
  // darker at the roots, light at the tips; the undercoat sits in its own shade. Kept gentle, and a strand thinner
  // than a pixel takes the coat's average colour, so hairs moving across pixels do not flicker against the skin
  vec3 base = mix(vTip * vec3(0.5, 0.45, 0.4), vTip, smoothstep(0.0, 0.8, vS));
  base = mix(base, vTip * 0.72, vFar * 0.85);
  float occ = mix(0.62, 1.0, smoothstep(0.0, 0.75, vS)) * (1.0 - 0.1 * vSide * vSide);
  float gloss = 1.0 - vFar;
  // light from the room (the hemisphere and the club's reflections), then each light; lights in three's units, so
  // a diffuse surface returns 1/pi of what falls on it
  const float INV_PI = 0.31830989;
  vec3 col = base * occ * (mix(uGround, uSky, 0.5 + 0.5 * N.y) * INV_PI + uEnv);
  for (int i = 0; i < 3; i++) {
    vec3 L = uLightDir[i];
    // the body shades the fur on its far side
    float shade = smoothstep(-0.45, 0.35, dot(N, L));
    float tl = dot(T, L);
    float diff = mix(0.3, 1.0, sqrt(max(0.0, 1.0 - tl * tl)));
    vec3 Hv = normalize(L + V);
    vec3 T1 = normalize(T + N * 0.12);
    vec3 T2 = normalize(T - N * 0.22);
    float h1 = dot(T1, Hv);
    float h2 = dot(T2, Hv);
    // broad highlights: a narrow glint on a hair a pixel wide sparkles from frame to frame
    float s1 = pow(sqrt(max(0.0, 1.0 - h1 * h1)), 36.0);
    float s2 = pow(sqrt(max(0.0, 1.0 - h2 * h2)), 14.0);
    // light from behind glows through the tips
    float back = pow(max(0.0, -dot(V, L)), 3.0) * vS;
    col += uLightCol[i] * INV_PI * (shade * occ * (base * diff + gloss * (0.18 * s1 + base * 0.7 * s2)) + base * back * 0.7);
  }
  // fur is matte: it never reaches the bloom, which would turn any glint into a blinking halo
  col = min(col, vec3(0.92));
  float d = length(vP - cameraPosition);
  col = mix(col, uFog, 1.0 - exp(-uFogDensity * uFogDensity * d * d));
  fragColor = vec4(col, vCover);
}`

/**
 * coats: [{obj, at(u, v, out: {p, n}), tip: THREE.Color, fleck?: THREE.Color, flecks?: 0..1}], up to six: obj is the
 * mesh the fur grows on (its matrixWorld is read every frame), at() a point and outward normal on it in its own frame.
 * strands: per coat. Returns {mesh, update(t, wind, lights), setShare(k)}.
 */
export function buildFur(coats, { strands = 9000, seed = 61, scale = 1 } = {}) {
  const r = rng(seed)
  const nC = coats.length
  const at = { p: new THREE.Vector3(), n: new THREE.Vector3() }
  const pu = { p: new THREE.Vector3(), n: new THREE.Vector3() }
  const pv = { p: new THREE.Vector3(), n: new THREE.Vector3() }
  const du = new THREE.Vector3()
  const dv = new THREE.Vector3()
  // how much surface a little square of (u, v) covers, so roots spread evenly by area
  const area = (c, u, v) => {
    c.at(u, v, at)
    c.at(u + 1e-3, v, pu)
    c.at(u, v + 1e-3, pv)
    return du.subVectors(pu.p, at.p).cross(dv.subVectors(pv.p, at.p)).length()
  }

  // ---------------------------------------------------------------- the guides
  const NG = GU * GV * nC
  const gRoot = [] // per guide, its root and lay in the coat's frame
  const gLay = []
  const gN = []
  for (let c = 0; c < nC; c++)
    for (let i = 0; i < GU; i++)
      for (let j = 0; j < GV; j++) {
        const u = 0.012 + (0.976 * i) / (GU - 1)
        const v = (FUR.vMax * j) / (GV - 1)
        coats[c].at(u, v, at)
        coats[c].at(Math.min(1, u + 1e-3), v, pu)
        coats[c].at(u, Math.min(1, v + 1e-3), pv)
        const tu = du.subVectors(pu.p, at.p).normalize()
        const tv = dv.subVectors(pv.p, at.p).normalize()
        // the lay: out of the skin, combed down the sides and a little toward one end
        const lay = at.n.clone().addScaledVector(tv, -0.8).addScaledVector(tu, -0.45).normalize()
        gRoot.push(at.p.clone())
        gN.push(at.n.clone())
        gLay.push(lay)
      }
  // the state, world space: every guide's four points now and a step ago
  const X = new Float32Array(NG * NODES * 3)
  const P = new Float32Array(NG * NODES * 3)
  // the state one step back: what is drawn is blended between it and X by how far the clock is into the next step,
  // so the fur moves smoothly at any refresh rate (a frame that falls between two steps would otherwise stand still,
  // and the next jump two)
  const XW = new Float32Array(NG * NODES * 3)
  // the roots and lays this frame and last, world space
  const rootNow = new Float32Array(NG * 3)
  const rootWas = new Float32Array(NG * 3)
  const layNow = new Float32Array(NG * 3)
  const nrmNow = new Float32Array(NG * 3)
  const wind = new Float32Array(NG * 3)
  const seg = (FUR.length * scale) / (NODES - 1)

  const tex = new THREE.DataTexture(
    new Float32Array(NG * (NODES - 1) * 4),
    NG,
    NODES - 1,
    THREE.RGBAFormat,
    THREE.FloatType
  )
  tex.minFilter = tex.magFilter = THREE.NearestFilter
  tex.generateMipmaps = false

  // ---------------------------------------------------------------- the strands
  const total = strands * nC
  const aRoot = new Float32Array(total * 3)
  const aLock = new Float32Array(total * 3)
  const aNormal = new Float32Array(total * 3)
  const aUV = new Float32Array(total * 2)
  const aCoat = new Float32Array(total)
  const aRand = new Float32Array(total * 4)
  const aTip = new Float32Array(total * 3)
  // where roots go: each coat cut into little cells, picked in proportion to the skin they cover, so the fur grows
  // evenly by area
  const [CU, CV] = [96, 32]
  const cdf = coats.map((c) => {
    const acc = new Float64Array(CU * CV)
    let sum = 0
    for (let i = 0; i < CU; i++)
      for (let j = 0; j < CV; j++) {
        sum += area(c, (i + 0.5) / CU, ((j + 0.5) / CV) * FUR.vMax)
        acc[i * CV + j] = sum
      }
    return acc.map((x) => x / sum)
  })
  const pick = (acc, x) => {
    let lo = 0
    let hi = acc.length - 1
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if (acc[mid] < x) lo = mid + 1
      else hi = mid
    }
    return lo
  }
  // the middle of each lock, jittered per lock so they do not line up; worked out once
  const [LU, LV] = FUR.locks
  const jit = (a, b, c) => {
    const x = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453
    return x - Math.floor(x) - 0.5
  }
  const locks = new Map()
  const lockOf = (c, iu, iv) => {
    const key = (c * LU + iu) * LV + iv
    if (!locks.has(key)) {
      const o = { p: new THREE.Vector3(), n: new THREE.Vector3() }
      coats[c].at(
        Math.min(1, Math.max(0, (iu + 0.5 + 0.6 * jit(iu, iv, c)) / LU)),
        FUR.vMax * Math.min(1, Math.max(0, (iv + 0.5 + 0.6 * jit(iv, iu, c + 9)) / LV)),
        o
      )
      locks.set(key, o.p)
    }
    return locks.get(key)
  }
  const tint = new THREE.Color()
  // round-robin over the coats, so drawing fewer strands thins every coat alike
  for (let s = 0; s < total; s++) {
    const c = s % nC
    const coat = coats[c]
    const cell = pick(cdf[c], r())
    const u = (Math.floor(cell / CV) + r()) / CU
    const v = (((cell % CV) + r()) / CV) * FUR.vMax
    coat.at(u, v, at)
    aRoot.set([at.p.x, at.p.y, at.p.z], s * 3)
    const lock = lockOf(
      c,
      Math.min(LU - 1, Math.floor(u * LU)),
      Math.min(LV - 1, Math.floor((v / FUR.vMax) * LV))
    )
    aLock.set([lock.x - at.p.x, lock.y - at.p.y, lock.z - at.p.z], s * 3)
    aNormal.set([at.n.x, at.n.y, at.n.z], s * 3)
    aUV.set([Math.min(1, Math.max(0, (u - 0.012) / 0.976)), v / FUR.vMax], s * 2)
    aCoat[s] = c
    aRand.set([0.6 + 0.4 * Math.pow(r(), 0.6), r(), r(), 0.7 + 0.6 * r()], s * 4)
    const fleck = coat.fleck && r() < (coat.flecks || 0)
    tint.copy(fleck ? coat.fleck : coat.tip).multiplyScalar(0.82 + 0.36 * r())
    aTip.set([tint.r, tint.g, tint.b], s * 3)
  }

  // one strand: SEG segments, two vertices across each: position.x runs root (0) to tip (1), position.y is the side
  const geo = new THREE.InstancedBufferGeometry()
  const pos = new Float32Array((SEG + 1) * 2 * 3)
  const idx = []
  for (let k = 0; k <= SEG; k++) {
    pos.set([k / SEG, -1, 0, k / SEG, 1, 0], k * 6)
    if (k < SEG) idx.push(2 * k, 2 * k + 1, 2 * k + 2, 2 * k + 1, 2 * k + 3, 2 * k + 2)
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geo.setIndex(idx)
  geo.setAttribute('aRoot', new THREE.InstancedBufferAttribute(aRoot, 3))
  geo.setAttribute('aLock', new THREE.InstancedBufferAttribute(aLock, 3))
  geo.setAttribute('aNormal', new THREE.InstancedBufferAttribute(aNormal, 3))
  geo.setAttribute('aUV', new THREE.InstancedBufferAttribute(aUV, 2))
  geo.setAttribute('aCoat', new THREE.InstancedBufferAttribute(aCoat, 1))
  geo.setAttribute('aRand', new THREE.InstancedBufferAttribute(aRand, 4))
  geo.setAttribute('aTip', new THREE.InstancedBufferAttribute(aTip, 3))
  geo.instanceCount = total
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e4)

  const uniforms = {
    uCoat: { value: Array.from({ length: 6 }, () => new THREE.Matrix4()) },
    uGuides: { value: tex },
    uScale: { value: 800 },
    uLen: { value: FUR.length * scale },
    uWidth: { value: FUR.width * scale },
    uClump: { value: FUR.clump },
    uLightDir: { value: [0, 1, 2].map(() => new THREE.Vector3(0, 1, 0)) },
    uLightCol: { value: [0, 1, 2].map(() => new THREE.Color(0, 0, 0)) },
    uSky: { value: new THREE.Color() },
    uGround: { value: new THREE.Color() },
    uEnv: { value: new THREE.Color(0.2, 0.17, 0.2) },
    uFog: { value: new THREE.Color() },
    uFogDensity: { value: 0 },
  }
  const material = new THREE.ShaderMaterial({
    glslVersion: THREE.GLSL3,
    vertexShader: vert,
    fragmentShader: frag,
    uniforms,
    side: THREE.DoubleSide,
    alphaToCoverage: true,
  })
  const mesh = new THREE.Mesh(geo, material)
  mesh.frustumCulled = false

  // ---------------------------------------------------------------- the simulation
  const M3 = new THREE.Matrix3()
  const v = new THREE.Vector3()
  /** Roots, lays and skin normals in the world, from each coat's matrix now. */
  const readRoots = () => {
    for (let c = 0; c < nC; c++) {
      const W = coats[c].obj.matrixWorld
      uniforms.uCoat.value[c].copy(W)
      M3.setFromMatrix4(W)
      for (let g = c * GU * GV; g < (c + 1) * GU * GV; g++) {
        v.copy(gRoot[g]).applyMatrix4(W)
        rootNow[g * 3] = v.x
        rootNow[g * 3 + 1] = v.y
        rootNow[g * 3 + 2] = v.z
        v.copy(gLay[g]).applyMatrix3(M3).normalize()
        layNow[g * 3] = v.x
        layNow[g * 3 + 1] = v.y
        layNow[g * 3 + 2] = v.z
        v.copy(gN[g]).applyMatrix3(M3).normalize()
        nrmNow[g * 3] = v.x
        nrmNow[g * 3 + 1] = v.y
        nrmNow[g * 3 + 2] = v.z
      }
    }
  }

  const drag = FUR.drag
  const keep = 1 - FUR.damping
  const g2 = FUR.gravity * H * H
  // one step for every guide, its root a share `a` of the way from where it was to where it is now
  const step = (a) => {
    for (let g = 0; g < NG; g++) {
      const g3 = g * 3
      const rx = rootWas[g3] + (rootNow[g3] - rootWas[g3]) * a
      const ry = rootWas[g3 + 1] + (rootNow[g3 + 1] - rootWas[g3 + 1]) * a
      const rz = rootWas[g3 + 2] + (rootNow[g3 + 2] - rootWas[g3 + 2]) * a
      const lx = layNow[g3]
      const ly = layNow[g3 + 1]
      const lz = layNow[g3 + 2]
      const nx = nrmNow[g3]
      const ny = nrmNow[g3 + 1]
      const nz = nrmNow[g3 + 2]
      const wx = wind[g3]
      const wy = wind[g3 + 1]
      const wz = wind[g3 + 2]
      const o = g * NODES * 3
      X[o] = P[o] = rx
      X[o + 1] = P[o + 1] = ry
      X[o + 2] = P[o + 2] = rz
      // the direction the last segment ran, to bend the next one toward
      let dx = lx
      let dy = ly
      let dz = lz
      for (let k = 1; k < NODES; k++) {
        const i = o + k * 3
        // Verlet: carry on, slowed by the air, dragged toward the wind's speed, pulled down
        let x = X[i]
        let y = X[i + 1]
        let z = X[i + 2]
        const vx = (x - P[i]) * keep
        const vy = (y - P[i + 1]) * keep
        const vz = (z - P[i + 2]) * keep
        P[i] = x
        P[i + 1] = y
        P[i + 2] = z
        x += vx + drag * (wx * H - vx) * H
        y += vy + drag * (wy * H - vy) * H - g2
        z += vz + drag * (wz * H - vz) * H
        // stiffness: toward where this segment would lie, along the lay at the root, then along the strand
        const px = X[i - 3]
        const py = X[i - 2]
        const pz = X[i - 1]
        const bx = k === 1 ? lx : dx * 0.6 + lx * 0.4
        const by = k === 1 ? ly : dy * 0.6 + ly * 0.4
        const bz = k === 1 ? lz : dz * 0.6 + lz * 0.4
        const bl = Math.hypot(bx, by, bz) || 1
        const s = FUR.stiff[k - 1]
        x += (px + (bx / bl) * seg - x) * s
        y += (py + (by / bl) * seg - y) * s
        z += (pz + (bz / bl) * seg - z) * s
        // the skin is a floor: no point sinks below the plane it grows from
        const h = (x - rx) * nx + (y - ry) * ny + (z - rz) * nz
        const floor = seg * 0.18 * k
        if (h < floor) {
          x += nx * (floor - h)
          y += ny * (floor - h)
          z += nz * (floor - h)
        }
        // a hair does not stretch
        let ex = x - px
        let ey = y - py
        let ez = z - pz
        const el = Math.hypot(ex, ey, ez) || 1
        ex /= el
        ey /= el
        ez /= el
        X[i] = px + ex * seg
        X[i + 1] = py + ey * seg
        X[i + 2] = pz + ez * seg
        dx = ex
        dy = ey
        dz = ez
      }
    }
  }

  // every point straight out along its lay, then left to hang
  const settle = (n) => {
    rootWas.set(rootNow)
    for (let g = 0; g < NG; g++)
      for (let k = 0; k < NODES; k++) {
        const i = (g * NODES + k) * 3
        for (let a = 0; a < 3; a++)
          X[i + a] = P[i + a] = rootNow[g * 3 + a] + layNow[g * 3 + a] * seg * k
      }
    for (let i = 0; i < n; i++) step(1)
    XW.set(X)
  }

  // each guide's points relative to its root, a share `a` of the way from the last step back to the latest
  const upload = (a) => {
    const d = tex.image.data
    const L = FUR.length * scale
    for (let g = 0; g < NG; g++) {
      const r = g * NODES * 3
      for (let k = 1; k < NODES; k++) {
        const i = r + k * 3
        const o = ((k - 1) * NG + g) * 4
        for (let c = 0; c < 3; c++) {
          const was = XW[i + c] - XW[r + c]
          d[o + c] = (was + (X[i + c] - X[r + c] - was) * a) / L
        }
      }
    }
    tex.needsUpdate = true
  }

  let last = null
  let acc = 0
  const pt = new THREE.Vector3()
  const w3 = new THREE.Vector3()
  /**
   * t: seconds; windAt(p: Vector3, coat, out: Vector3): the air's velocity at p; lights: {dir: Vector3[3],
   * col: Color[3], sky, ground, fog, fogDensity, scale}. Call after the coats' world matrices are current. A jump in
   * time (a still, or the page coming back) starts the fur over, hung and settled.
   */
  const update = (t, windAt, lights) => {
    readRoots()
    for (let g = 0; g < NG; g++) {
      // the wind at each guide's middle
      const o = (g * NODES + 2) * 3
      pt.set(X[o], X[o + 1], X[o + 2])
      if (last === null) pt.set(rootNow[g * 3], rootNow[g * 3 + 1], rootNow[g * 3 + 2])
      windAt(pt, Math.floor(g / (GU * GV)), w3)
      wind[g * 3] = w3.x
      wind[g * 3 + 1] = w3.y
      wind[g * 3 + 2] = w3.z
    }
    const dt = last === null ? Infinity : t - last
    if (dt < 0 || dt > 0.25) {
      settle(150)
      acc = 0
    } else if (dt > 0) {
      acc += dt
      const n = Math.min(8, Math.floor(acc / H))
      acc = Math.min(acc - n * H, H)
      for (let i = 1; i <= n; i++) {
        if (i === n) XW.set(X)
        step(i / n)
      }
      if (n > 0) rootWas.set(rootNow)
    }
    last = t
    upload(acc / H)

    for (let i = 0; i < 3; i++) {
      uniforms.uLightDir.value[i].copy(lights.dir[i])
      uniforms.uLightCol.value[i].copy(lights.col[i])
    }
    uniforms.uSky.value.copy(lights.sky)
    uniforms.uGround.value.copy(lights.ground)
    uniforms.uFog.value.copy(lights.fog)
    uniforms.uFogDensity.value = lights.fogDensity
    uniforms.uScale.value = lights.scale
  }

  /** The share of strands drawn (the quality tiers thin the fur). */
  const setShare = (k) => {
    geo.instanceCount = Math.max(nC, Math.floor(total * Math.min(1, k)))
  }

  return { mesh, update, setShare, guides: NG, strands: total }
}
