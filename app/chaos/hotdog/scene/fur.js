// Fur: real strands on the animatronic dogs' coats, hanging under gravity and blown about by whatever flows through
// them. It is simulated the way film hair is. A grid of guide hairs per coat, each a chain of points integrated on
// the CPU (Verlet, a fixed 120 Hz step): gravity; a bending stiffness that holds the coat's lay at the root and gives
// way toward the tip, so a hair droops in a curve that grows along it as a real one does; air drag against the wind;
// and the bun itself as a solid, so a hair that falls across it drapes over its curve, lofted a little off the skin
// the way a pelt keeps its volume. Every guide also feels its own gusts, so neighbouring locks never move as one.
//
// Thousands of drawn strands follow the guides round them on the GPU, along a smooth curve through the guides'
// points. The pelt has two layers: a dense undercoat, short, soft and wavy, and long guard hairs lying over it,
// glossier, banded light near the tip. A short hair takes only the root end of its guide's curve, so it stands
// stiffer than a long one, as it would. Each strand has its own length, thickness, colour, waviness and a little
// fan-out of its own, and is drawn in toward its neighbours at the tip, the way a pelt parts into locks.
//
// Nothing pushes the fur but physics: when a dog thumps on the kick, comes apart or swings round, the roots move and
// the strands trail behind them and settle under their own weight; a bun half turned over hangs its fur the other
// way. The wind is what flows through the set: the storm's turbulence, the bass from inside the dog out through its
// coat, the points that burst out of a dog when it comes apart (and rush back in when it reassembles), and the
// flying parts and notes that pass close by.
//
// Shaded as hair (Kajiya-Kay, with the two shifted highlights of Marschner's model): the undercoat in the coat's own
// shade, guard hairs catching the light, backlit tips glowing. Strands are at least two device pixels wide so the
// multisampling smooths them as they move; a strand thinner than that keeps its share of the light as coverage and
// takes the coat's average colour, so moving hairs do not flicker against the skin.
import * as THREE from 'three'
import { rng } from '../../teardown/kit/util.js'

const H = 1 / 120 // the simulation's step, seconds

export const FUR = {
  length: 0.95, // a guide's length, world units (about 18 mm on a dog this size): the longest guard hair
  width: 0.0068, // a strand's width at its root, world units
  gravity: 26, // world units / s²
  drag: 5, // how hard the air drags a strand toward the wind's speed, 1/s
  damping: 0.022, // velocity lost per step: enough to settle, not so much a hit cannot shake it
  stiff: 0.15, // how hard the root segment holds its lay, per step; it gives way toward the tip
  limp: 0.82, // how much of that stiffness the tip segment has lost
  follow: 0.62, // how much a segment bends toward the one before it rather than toward the lay
  loft: [0.0005, 0.0009], // metres off the skin a hair's points keep: at the root, and more per point along it
  bend: [75, 40], // the most a segment turns from the one before it, degrees: at the root (from the lay), then on
  gusts: 0.55, // each guide's own gusts, as a share of the storm's turbulence
  vMax: 0.97, // fur grows up to here round the coat (1 is the cut edge)
  locks: [72, 20], // locks along a coat and round it
  guard: 0.22, // the share of strands that are guard hairs
}

const vert = (NS) => /* glsl */ `
precision highp float;
precision highp sampler2D;
uniform mat4 uCoat[6];
uniform sampler2D uGuides;
uniform vec2 uGrid;
uniform float uScale;
uniform float uLen;
uniform float uWidth;
in vec3 aRoot;
in vec3 aLock;
in vec3 aNormal;
in vec2 aUV;
in float aCoat;
in vec4 aRand;
in vec4 aShape;
in vec3 aTip;
out vec3 vT;
out vec3 vN;
out vec3 vP;
out vec3 vTip;
out float vS;
out float vSide;
out float vCover;
out float vFar;
out float vGuard;

// point k (1..${NS}) of guide g, from its root, world units
vec3 guide(int g, int k) {
  return texelFetch(uGuides, ivec2(g, k - 1), 0).xyz;
}
// point k of this strand's guide, blended from the four guides round it; the root is the origin, and the curve runs
// on past either end in a straight line
int ga;
int gb;
vec2 gw;
vec3 node(int k) {
  if (k <= 0) return vec3(0.0);
  return mix(mix(guide(ga, k), guide(ga + 1, k), gw.y), mix(guide(gb, k), guide(gb + 1, k), gw.y), gw.x);
}

void main() {
  int c = int(aCoat + 0.5);
  mat4 M = uCoat[c];
  vec3 root = (M * vec4(aRoot, 1.0)).xyz;
  vec3 nrm = normalize(mat3(M) * aNormal);
  vec2 f = aUV * (uGrid - 1.0);
  vec2 i0 = min(floor(f), uGrid - 2.0);
  gw = f - i0;
  ga = c * int(uGrid.x * uGrid.y) + int(i0.x) * int(uGrid.y) + int(i0.y);
  gb = ga + int(uGrid.y);

  // where along its guide this point of the strand falls: a short hair is the root end of the curve
  float s = position.x;
  float share = aRand.x;
  float len = uLen * share;
  float u = s * share * ${NS}.0;
  int i = min(int(u), ${NS - 1});
  float t = u - float(i);
  vec3 P1 = node(i);
  vec3 P2 = node(i + 1);
  vec3 P0 = i == 0 ? -P2 : node(i - 1);
  vec3 P3 = i + 2 > ${NS} ? 2.0 * P2 - P1 : node(i + 2);
  // Catmull-Rom through the guide's points, and its slope
  vec3 a3 = -P0 + 3.0 * P1 - 3.0 * P2 + P3;
  vec3 a2 = 2.0 * P0 - 5.0 * P1 + 4.0 * P2 - P3;
  vec3 a1 = -P0 + P2;
  vec3 p = root + 0.5 * (2.0 * P1 + a1 * t + a2 * t * t + a3 * t * t * t);
  vec3 tan = 0.5 * (a1 + 2.0 * a2 * t + 3.0 * a3 * t * t) * share * ${NS}.0;

  // a frame round the root: this strand fans out a little from its guide, its own way
  vec3 e1 = normalize(cross(nrm, abs(nrm.y) < 0.9 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
  vec3 e2 = cross(nrm, e1);
  float spread = 0.06 + 0.14 * fract(aRand.y * 7.31);
  vec3 fan = (e1 * cos(aShape.w) + e2 * sin(aShape.w)) * spread * len;
  p += fan * s;
  tan += fan;
  // drawn toward the middle of its lock, more toward the tip
  vec3 lock = mat3(M) * aLock * (0.35 + 0.45 * fract(aRand.y * 13.7));
  p += lock * s * s;
  tan += lock * 2.0 * s;
  tan = tan * inversesqrt(max(dot(tan, tan), 1e-12));
  // its own waves across the strand, growing from the root
  vec3 b1 = normalize(cross(tan, abs(tan.y) < 0.9 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
  vec3 b2 = cross(tan, b1);
  float ph = 6.2831853 * aShape.y * s + aRand.z * 6.2831853;
  float amp = aShape.z * len * pow(s, 1.1);
  p += (b1 * sin(ph) + b2 * 0.55 * sin(ph * 1.7 + 2.1)) * amp;

  // a ribbon across the line of sight, never thinner than two device pixels: below that its light is coverage. A
  // strand one pixel wide crawls from pixel to pixel as it moves; two wide, the multisampling smooths it
  vec3 view = normalize(cameraPosition - p);
  vec3 side = normalize(cross(tan, view) + 1e-6);
  vec4 mv = viewMatrix * vec4(p, 1.0);
  float depth = max(0.05, -mv.z);
  float w = uWidth * aRand.w * (1.0 - 0.86 * pow(s, 1.4));
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
  vGuard = aShape.x;
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
in float vGuard;
out vec4 fragColor;

void main() {
  // normalised safely: a strand folded back on itself can interpolate its tangent to nothing
  vec3 T = vT * inversesqrt(max(dot(vT, vT), 1e-12));
  vec3 N = vN * inversesqrt(max(dot(vN, vN), 1e-12));
  vec3 V = normalize(cameraPosition - vP);
  // the undercoat: soft, a little grey, in the coat's own shade. Guard hairs: darker at the root, a light band
  // near the tip and a darker point, as an animal's are. Kept gentle, and a strand thinner than a pixel takes the
  // coat's average colour, so hairs moving across pixels do not flicker against the skin
  float g = vGuard;
  vec3 under = mix(vTip * vec3(0.52, 0.48, 0.45), vTip * 0.86, smoothstep(0.0, 1.0, vS));
  under = mix(under, vec3(dot(under, vec3(0.3, 0.55, 0.15))), 0.18);
  float band = smoothstep(0.55, 0.72, vS) * (1.0 - smoothstep(0.8, 0.95, vS));
  vec3 guard = mix(vTip * vec3(0.5, 0.45, 0.4), vTip, smoothstep(0.0, 0.6, vS));
  guard *= 1.0 + 0.22 * band - 0.3 * smoothstep(0.88, 1.0, vS);
  vec3 base = mix(under, guard, g);
  base = mix(base, vTip * 0.72, vFar * 0.85);
  float occ = mix(mix(0.5, 0.9, smoothstep(0.0, 1.0, vS)), mix(0.66, 1.0, smoothstep(0.0, 0.7, vS)), g);
  occ *= 1.0 - 0.1 * vSide * vSide;
  float gloss = (1.0 - vFar) * mix(0.35, 1.0, g);
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
    float back = pow(max(0.0, -dot(V, L)), 3.0) * vS * mix(0.6, 1.0, g);
    col += uLightCol[i] * INV_PI * (shade * occ * (base * diff + gloss * (0.2 * s1 + base * 0.7 * s2)) + base * back * 0.7);
  }
  // fur is matte: it never reaches the bloom, which would turn any glint into a blinking halo
  col = min(col, vec3(0.92));
  float d = length(vP - cameraPosition);
  col = mix(col, uFog, 1.0 - exp(-uFogDensity * uFogDensity * d * d));
  // anything not a number goes black here, not into the bloom
  if (any(equal(floatBitsToUint(col) & 0x7f800000u, uvec3(0x7f800000u)))) col = vec3(0.0);
  fragColor = vec4(col, vCover);
}`

/**
 * coats: up to six of {obj, at(u, v, out: {p, n}), body(p, margin), tip: THREE.Color, fleck?: THREE.Color,
 * flecks?: 0..1}: obj is the mesh the fur grows on (its matrixWorld is read every frame), at() a point and outward
 * normal on it in its own frame, body() pushes a point in its frame out of it (coatBody). strands: per coat; guides:
 * [along, round] per coat; nodes: points per guide, root included; segments: per drawn strand; coverage: thin strands
 * fade by alpha to coverage (else they are opaque). Returns {mesh, update(t, wind, lights), setShare(k)}.
 */
export function buildFur(
  coats,
  {
    strands = 8000,
    seed = 61,
    scale = 1,
    guides = [26, 10],
    nodes = 6,
    segments = 12,
    coverage = true,
  } = {}
) {
  const [GU, GV] = guides
  const NODES = nodes
  const NS = NODES - 1
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
  const gRoot = [] // per guide, its root, lay and skin normal in the coat's frame
  const gLay = []
  const gN = []
  const gGust = new Float32Array(NG * 6) // per guide, its own gusts: three frequencies, three phases
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
  for (let g = 0; g < NG; g++) {
    for (let k = 0; k < 3; k++) gGust[g * 6 + k] = 0.7 + 1.6 * r()
    for (let k = 3; k < 6; k++) gGust[g * 6 + k] = r() * 6.2832
  }
  // the state, world space: every guide's points now and a step ago
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
  const wind = new Float32Array(NG * 3)
  const seg = (FUR.length * scale) / NS
  // stiffness per segment, root first: it gives way along the hair
  const stiff = Array.from(
    { length: NS },
    (_, k) => FUR.stiff * Math.pow(1 - FUR.limp * (k / Math.max(1, NS - 1)), 1.3)
  )
  // a hair bends, it does not fold: the cosine and sine of the most each segment may turn from the one before
  const bendCos = Array.from({ length: NODES }, (_, k) =>
    Math.cos(((k <= 1 ? FUR.bend[0] : FUR.bend[1]) * Math.PI) / 180)
  )
  const bendSin = bendCos.map((c) => Math.sqrt(1 - c * c))
  // how far off the skin each point keeps (metres, in the coat's own frame)
  const loft = Array.from({ length: NODES }, (_, k) => FUR.loft[0] + FUR.loft[1] * k)

  const tex = new THREE.DataTexture(
    new Float32Array(NG * NS * 4),
    NG,
    NS,
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
  const aShape = new Float32Array(total * 4)
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
  // the middle of each lock, jittered per lock so they do not line up, and each lock's own shade; worked out once
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
      locks.set(key, { p: o.p, shade: 0.88 + 0.24 * (jit(iu, iv, c + 31) + 0.5) })
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
    aLock.set([lock.p.x - at.p.x, lock.p.y - at.p.y, lock.p.z - at.p.z], s * 3)
    aNormal.set([at.n.x, at.n.y, at.n.z], s * 3)
    aUV.set([Math.min(1, Math.max(0, (u - 0.012) / 0.976)), v / FUR.vMax], s * 2)
    aCoat[s] = c
    // guard hairs: long, thicker, straighter; the undercoat: short, fine, wavy, and a few frizzy ones
    const guard = r() < FUR.guard
    const frizz = !guard && r() < 0.05
    aRand.set(
      [
        guard ? 0.84 + 0.16 * r() : 0.36 + 0.36 * Math.pow(r(), 0.8),
        r(),
        r(),
        guard ? 1.15 + 0.4 * r() : 0.65 + 0.35 * r(),
      ],
      s * 4
    )
    aShape.set(
      [
        guard ? 1 : 0,
        guard ? 0.5 + 0.7 * r() : 1.2 + 1.8 * r(),
        guard ? 0.012 + 0.02 * r() : frizz ? 0.14 : 0.03 + 0.05 * r(),
        r() * 6.2832,
      ],
      s * 4
    )
    const fleck = coat.fleck && r() < (coat.flecks || 0)
    tint
      .copy(fleck ? coat.fleck : coat.tip)
      .multiplyScalar(lock.shade * (0.88 + 0.24 * r()) * (guard ? 1 : 0.95))
    aTip.set([tint.r, tint.g, tint.b], s * 3)
  }

  // one strand: `segments` long, two vertices across each: position.x runs root (0) to tip (1), position.y is the side
  const geo = new THREE.InstancedBufferGeometry()
  const pos = new Float32Array((segments + 1) * 2 * 3)
  const idx = []
  for (let k = 0; k <= segments; k++) {
    pos.set([k / segments, -1, 0, k / segments, 1, 0], k * 6)
    if (k < segments) idx.push(2 * k, 2 * k + 1, 2 * k + 2, 2 * k + 1, 2 * k + 3, 2 * k + 2)
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geo.setIndex(idx)
  geo.setAttribute('aRoot', new THREE.InstancedBufferAttribute(aRoot, 3))
  geo.setAttribute('aLock', new THREE.InstancedBufferAttribute(aLock, 3))
  geo.setAttribute('aNormal', new THREE.InstancedBufferAttribute(aNormal, 3))
  geo.setAttribute('aUV', new THREE.InstancedBufferAttribute(aUV, 2))
  geo.setAttribute('aCoat', new THREE.InstancedBufferAttribute(aCoat, 1))
  geo.setAttribute('aRand', new THREE.InstancedBufferAttribute(aRand, 4))
  geo.setAttribute('aShape', new THREE.InstancedBufferAttribute(aShape, 4))
  geo.setAttribute('aTip', new THREE.InstancedBufferAttribute(aTip, 3))
  geo.instanceCount = total
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e4)

  const uniforms = {
    uCoat: { value: Array.from({ length: 6 }, () => new THREE.Matrix4()) },
    uGuides: { value: tex },
    uGrid: { value: new THREE.Vector2(GU, GV) },
    uScale: { value: 800 },
    uLen: { value: FUR.length * scale },
    uWidth: { value: FUR.width * scale },
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
    vertexShader: vert(NS),
    fragmentShader: frag,
    uniforms,
    side: THREE.DoubleSide,
    alphaToCoverage: coverage,
  })
  const mesh = new THREE.Mesh(geo, material)
  mesh.frustumCulled = false

  // ---------------------------------------------------------------- the simulation
  const M3 = new THREE.Matrix3()
  const v = new THREE.Vector3()
  // each coat's matrix and its inverse, this frame (the bun is a solid in its own frame)
  const toWorld = coats.map(() => new Float64Array(16))
  const toLocal = coats.map(() => new Float64Array(16))
  const inv = new THREE.Matrix4()
  /** Roots, lays and the coats' frames, from each coat's matrix now. */
  const readRoots = () => {
    for (let c = 0; c < nC; c++) {
      const W = coats[c].obj.matrixWorld
      uniforms.uCoat.value[c].copy(W)
      toWorld[c].set(W.elements)
      toLocal[c].set(inv.copy(W).invert().elements)
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
      }
    }
  }

  const drag = FUR.drag
  const keep = 1 - FUR.damping
  const g2 = FUR.gravity * H * H
  const follow = FUR.follow
  const lp = new THREE.Vector3()
  // one step for every guide, its root a share `a` of the way from where it was to where it is now
  const step = (a) => {
    for (let g = 0; g < NG; g++) {
      const c = Math.floor(g / (GU * GV))
      const Lm = toLocal[c]
      const Wm = toWorld[c]
      const body = coats[c].body
      const g3 = g * 3
      const rx = rootWas[g3] + (rootNow[g3] - rootWas[g3]) * a
      const ry = rootWas[g3 + 1] + (rootNow[g3 + 1] - rootWas[g3 + 1]) * a
      const rz = rootWas[g3 + 2] + (rootNow[g3 + 2] - rootWas[g3 + 2]) * a
      const lx = layNow[g3]
      const ly = layNow[g3 + 1]
      const lz = layNow[g3 + 2]
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
        // stiffness: toward where this segment would lie, along the lay at the root, then more and more along the
        // hair itself, so it bends in a curve
        const px = X[i - 3]
        const py = X[i - 2]
        const pz = X[i - 1]
        const bx = k === 1 ? lx : dx * follow + lx * (1 - follow)
        const by = k === 1 ? ly : dy * follow + ly * (1 - follow)
        const bz = k === 1 ? lz : dz * follow + lz * (1 - follow)
        const bl = Math.sqrt(bx * bx + by * by + bz * bz) || 1
        const s = stiff[k - 1]
        x += (px + (bx / bl) * seg - x) * s
        y += (py + (by / bl) * seg - y) * s
        z += (pz + (bz / bl) * seg - z) * s
        // a hair does not stretch
        let ex = x - px
        let ey = y - py
        let ez = z - pz
        let el = Math.sqrt(ex * ex + ey * ey + ez * ez) || 1
        ex /= el
        ey /= el
        ez /= el
        // nor fold: if this segment turns further from the last than a hair can bend, it turns only that far
        const cb = ex * dx + ey * dy + ez * dz
        if (cb < bendCos[k]) {
          let qx = ex - dx * cb
          let qy = ey - dy * cb
          let qz = ez - dz * cb
          const ql = Math.sqrt(qx * qx + qy * qy + qz * qz) || 1
          qx /= ql
          qy /= ql
          qz /= ql
          ex = dx * bendCos[k] + qx * bendSin[k]
          ey = dy * bendCos[k] + qy * bendSin[k]
          ez = dz * bendCos[k] + qz * bendSin[k]
        }
        x = px + ex * seg
        y = py + ey * seg
        z = pz + ez * seg
        // nor pass through the bun: out to its loft above the crust, in the bun's own frame
        lp.set(
          Lm[0] * x + Lm[4] * y + Lm[8] * z + Lm[12],
          Lm[1] * x + Lm[5] * y + Lm[9] * z + Lm[13],
          Lm[2] * x + Lm[6] * y + Lm[10] * z + Lm[14]
        )
        if (body(lp, loft[k])) {
          x = Wm[0] * lp.x + Wm[4] * lp.y + Wm[8] * lp.z + Wm[12]
          y = Wm[1] * lp.x + Wm[5] * lp.y + Wm[9] * lp.z + Wm[13]
          z = Wm[2] * lp.x + Wm[6] * lp.y + Wm[10] * lp.z + Wm[14]
        }
        X[i] = x
        X[i + 1] = y
        X[i + 2] = z
        ex = x - px
        ey = y - py
        ez = z - pz
        el = Math.sqrt(ex * ex + ey * ey + ez * ez) || 1
        dx = ex / el
        dy = ey / el
        dz = ez / el
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

  // each guide's points from its root (world units), a share `a` of the way from the last step back to the latest
  const upload = (a) => {
    const d = tex.image.data
    for (let g = 0; g < NG; g++) {
      const r0 = g * NODES * 3
      for (let k = 1; k < NODES; k++) {
        const i = r0 + k * 3
        const o = ((k - 1) * NG + g) * 4
        for (let c = 0; c < 3; c++) {
          const was = XW[i + c] - XW[r0 + c]
          d[o + c] = was + (X[i + c] - X[r0 + c] - was) * a
        }
      }
    }
    tex.needsUpdate = true
  }

  let last = null
  let acc = 0
  const pt = new THREE.Vector3()
  const w3 = new THREE.Vector3()
  const mid = Math.floor(NODES / 2)
  /**
   * t: seconds; windAt(p: Vector3, coat, out: Vector3): the air's velocity at p; lights: {dir: Vector3[3],
   * col: Color[3], sky, ground, fog, fogDensity, scale, gust}. Call after the coats' world matrices are current. A
   * jump in time (a still, or the page coming back) starts the fur over, hung and settled.
   */
  const update = (t, windAt, lights) => {
    readRoots()
    const gust = FUR.gusts * (lights.gust || 1)
    for (let g = 0; g < NG; g++) {
      // the wind at each guide's middle, and its own gusts on top
      const o = (g * NODES + mid) * 3
      pt.set(X[o], X[o + 1], X[o + 2])
      if (last === null) pt.set(rootNow[g * 3], rootNow[g * 3 + 1], rootNow[g * 3 + 2])
      windAt(pt, Math.floor(g / (GU * GV)), w3)
      const q = g * 6
      wind[g * 3] = w3.x + gust * Math.sin(t * gGust[q] + gGust[q + 3])
      wind[g * 3 + 1] = w3.y + gust * 0.6 * Math.sin(t * gGust[q + 1] + gGust[q + 4])
      wind[g * 3 + 2] = w3.z + gust * Math.sin(t * gGust[q + 2] + gGust[q + 5])
    }
    const dt = last === null ? Infinity : t - last
    if (dt < 0 || dt > 0.25) {
      settle(200)
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
