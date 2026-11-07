// The storm: a few hundred thousand particles riding the attractors on the GPU. Every trajectory lives in one float
// texture (16384 samples per attractor, xyz + speed); a particle is just a place on the curve, so the vertex shader
// reads where it is now, where the next attractor would put it, and blends the two with its own delay. Mid-morph
// the particles are loose and a curl of sines carries them. A share of them belongs to a machine: tucked inside it
// while it is whole, flung out into the storm when it comes apart, pulled home when it reassembles.
//
// Each particle is drawn as a streak, a hairline from where it is now back to where it was a moment ago, like a
// long exposure: one device pixel wide at any pixel ratio, so the storm stays sharp on a retina screen instead of
// turning to dust. A third of them also carry a spark, a small crisp point at the head of the streak.
import * as THREE from 'three'
import { L } from './attractors.js'
import { rng } from '../teardown/kit/util.js'

const W = 2048
const ROWS = L / W

export const FLOW = {
  // samples per second along the curve, and the spread of per-particle speeds in 64ths
  rate: 52 / L,
  spread: 11,
  // how far back in time a streak's tail is
  trail: 0.14,
}

// a streak shorter than this (css px) keeps a spark's full brightness per pixel; a longer one spreads it thinner
const LREF = '6.0'

const VERT = /* glsl */ `
precision highp float;
precision highp sampler2D;
uniform sampler2D uTraj;
uniform int uA;
uniform int uB;
// head (now) and tail (FLOW.trail seconds ago)
uniform float uMorph;
uniform float uMorph2;
uniform float uFlowA;
uniform float uFlowB;
uniform float uFlowA2;
uniform float uFlowB2;
uniform float uTime;
uniform float uTime2;
uniform float uRel[3];
uniform float uRel2[3];
uniform float uChaos;
uniform float uSize;
uniform float uScale;
uniform float uBright;
uniform vec2 uRes;
uniform float uPr;
uniform vec3 uMach[3];
uniform float uMachR[3];
uniform vec3 uAcc[3];
uniform vec3 uPalA[3];
uniform vec3 uPalB[3];
// per vertex, three's own position attribute: position.x is 0 at the head, 1 at the tail
// per particle
in vec2 aUN;
in vec3 aJ;
in vec4 aR;
in float aOwner;
out vec3 vCol;
out float vA;

vec4 traj(int k, float u) {
  float f = u * ${L}.0;
  float n0 = floor(f);
  float t = f - n0;
  int i0 = min(int(n0), ${L - 1});
  // no interpolating across the seam back to the first sample
  int i1 = min(i0 + 1, ${L - 1});
  vec4 a = texelFetch(uTraj, ivec2(i0 % ${W}, k * ${ROWS} + i0 / ${W}), 0);
  vec4 b = texelFetch(uTraj, ivec2(i1 % ${W}, k * ${ROWS} + i1 / ${W}), 0);
  return mix(a, b, t);
}
vec3 swirl(vec3 p, float t) {
  return vec3(
    sin(p.y * 0.9 + t * 0.7) + sin(p.z * 1.7 - t * 0.4),
    sin(p.z * 0.8 - t * 0.6) + sin(p.x * 1.5 + t * 0.5),
    sin(p.x * 1.1 + t * 0.5) + sin(p.y * 1.3 - t * 0.3));
}
vec3 pal(vec3 c0, vec3 c1, vec3 c2, float s) {
  return s < 0.5 ? mix(c0, c1, s * 2.0) : mix(c1, c2, s * 2.0 - 1.0);
}
struct Sample {
  vec3 p;
  vec3 col;
  float a;
  float grow;
};
// where a particle is, and how it looks, e of the way from now (0) to FLOW.trail seconds ago (1)
Sample sampleAt(float e) {
  Sample S;
  float u = fract(aUN.x + mix(uFlowA, uFlowA2, e) + aUN.y * mix(uFlowB, uFlowB2, e));
  float morph = mix(uMorph, uMorph2, e);
  float time = mix(uTime, uTime2, e);
  vec4 A = traj(uA, u);
  vec4 B = traj(uB, u);
  float m = clamp((morph - aR.x * 0.45) / 0.55, 0.0, 1.0);
  m = m * m * (3.0 - 2.0 * m);
  float fly = sin(3.14159265 * m);
  vec3 p = mix(A.xyz, B.xyz, m);
  float spd = mix(A.w, B.w, m);
  p += aJ * (1.0 + 3.0 * fly);
  p += swirl(p * 0.45, time) * (fly * uChaos + 0.035);
  vec3 col = mix(pal(uPalA[0], uPalA[1], uPalA[2], spd), pal(uPalB[0], uPalB[1], uPalB[2], spd), m);
  float alpha = 0.5 + 0.8 * spd;
  float grow = 1.0 + 0.8 * fly;
  if (aOwner > 0.5) {
    int k = int(aOwner + 0.5) - 1;
    float r = clamp((mix(uRel[k], uRel2[k], e) - aR.y * 0.45) / 0.55, 0.0, 1.0);
    r = r * r * (3.0 - 2.0 * r);
    vec3 d = normalize(aJ + vec3(1e-4));
    vec3 home = uMach[k] + d * uMachR[k] * 0.3;
    // out on a sphere around the machine, then along the storm
    vec3 burst = uMach[k] + d * uMachR[k] * (1.2 + 2.6 * aR.z);
    float k1 = smoothstep(0.0, 0.5, r);
    float k2 = smoothstep(0.35, 1.0, r);
    p = mix(mix(home, burst, k1), p, k2);
    col = mix(uAcc[k] * 1.8, col, k2);
    alpha *= smoothstep(0.0, 0.12, r) * (1.0 + 1.5 * sin(3.14159265 * r));
    grow *= 1.0 + 0.9 * sin(3.14159265 * r);
  }
  // fade out across the trajectory's seam (written without a reversed smoothstep: ANGLE on Windows returns 0)
  alpha *= smoothstep(0.0, 0.0015, u) * (1.0 - smoothstep(0.9985, 1.0, u));
  S.p = p;
  S.col = col;
  S.a = alpha;
  S.grow = grow;
  return S;
}

void main() {
#ifdef STREAK
  // both ends, in every vertex: the streak's length on screen sets how thinly its light is spread
  Sample head = sampleAt(0.0);
  Sample tail = sampleAt(1.0);
  vec4 ch = projectionMatrix * modelViewMatrix * vec4(head.p, 1.0);
  vec4 ct = projectionMatrix * modelViewMatrix * vec4(tail.p, 1.0);
  bool isTail = position.x > 0.5;
  gl_Position = isTail ? ct : ch;
  // right at the lens, fade so nothing smears the frame
  // (WebGL has no ?: on structs: pick field by field)
  float alpha = (isTail ? tail.a : head.a) * smoothstep(0.25, 1.6, min(ch.w, ct.w));
  // a long exposure: each streak carries about one spark's worth of light, so a slow particle is a bright short
  // dash and a fast one a fainter long thread, and the storm reads the same at any distance
  vec2 d = (ch.xy / max(ch.w, 1e-3) - ct.xy / max(ct.w, 1e-3)) * uRes * 0.5;
  float len = length(d) / uPr;
  alpha *= pow(min(1.0, ${LREF} / max(len, 1e-3)), 0.8);
  // head and tail on opposite sides of the seam would draw a line across the whole attractor
  float uh = fract(aUN.x + uFlowA + aUN.y * uFlowB);
  float ut = fract(aUN.x + uFlowA2 + aUN.y * uFlowB2);
  if (uh < ut) alpha = 0.0;
  // bright at the head, gone at the tail
  alpha *= isTail ? 0.0 : 1.0;
  vCol = isTail ? tail.col : head.col;
  vA = alpha * uBright;
#else
  Sample head = sampleAt(0.0);
  vec4 mv = modelViewMatrix * vec4(head.p, 1.0);
  gl_Position = projectionMatrix * mv;
  float z = max(0.05, -mv.z);
  float alpha = head.a * smoothstep(0.25, 1.6, z);
  float px = uSize * (0.55 + aR.z) * head.grow * uScale / z;
  gl_PointSize = clamp(px, 1.0, 32.0);
  // below a pixel the spark keeps its light, spread as coverage, instead of popping to a full pixel
  alpha *= min(1.0, px * px) * (px > 32.0 ? 32.0 / px : 1.0);
  vCol = head.col;
  vA = alpha * uBright;
#endif
}`

const FRAG = /* glsl */ `
precision highp float;
in vec3 vCol;
in float vA;
out vec4 fragColor;
void main() {
#ifdef STREAK
  fragColor = vec4(vCol * vA, 1.0);
#else
  vec2 q = gl_PointCoord * 2.0 - 1.0;
  float d = dot(q, q);
  if (d > 1.0) discard;
  // a hard bright core with a short falloff: crisp at 2-3 device pixels, not a fuzzy disc
  float g = exp(-d * 7.0) + 0.6 * (1.0 - smoothstep(0.0, 0.18, d));
  fragColor = vec4(vCol * g * vA, 1.0);
#endif
}`

/** attractors from buildAttractors(); count particles; owned: how many belong to each machine. */
export function buildStorm(attractors, { count = 160000, ownedPerMachine = 4200, seed = 11 } = {}) {
  const data = new Float32Array(W * ROWS * attractors.length * 4)
  attractors.forEach((a, k) => {
    for (let n = 0; n < L; n++) {
      const o = (k * L + n) * 4
      data[o] = a.pos[n * 3]
      data[o + 1] = a.pos[n * 3 + 1]
      data[o + 2] = a.pos[n * 3 + 2]
      data[o + 3] = a.spd[n]
    }
  })
  const tex = new THREE.DataTexture(
    data,
    W,
    ROWS * attractors.length,
    THREE.RGBAFormat,
    THREE.FloatType
  )
  tex.minFilter = tex.magFilter = THREE.NearestFilter
  tex.generateMipmaps = false
  tex.needsUpdate = true

  const r = rng(seed)
  const gauss = () => {
    const a = Math.max(1e-9, r())
    return Math.sqrt(-2 * Math.log(a)) * Math.cos(2 * Math.PI * r())
  }
  const aUN = new Float32Array(count * 2)
  const aJ = new Float32Array(count * 3)
  const aR = new Float32Array(count * 4)
  const aOwner = new Float32Array(count)
  const ownShare = (ownedPerMachine * 3) / count
  for (let i = 0; i < count; i++) {
    aUN[i * 2] = r()
    aUN[i * 2 + 1] = Math.round((r() * 2 - 1) * FLOW.spread)
    const owned = r() < ownShare
    // a filament has some thickness; owned particles carry a direction instead, for their burst
    const j = owned ? 1 : 0.04 * Math.pow(r(), 1.5)
    aJ[i * 3] = gauss() * j
    aJ[i * 3 + 1] = gauss() * j
    aJ[i * 3 + 2] = gauss() * j
    aR[i * 4] = r() // morph delay
    aR[i * 4 + 1] = r() // release delay
    aR[i * 4 + 2] = Math.pow(r(), 2.2) // size
    aR[i * 4 + 3] = r()
    aOwner[i] = owned ? 1 + Math.floor(r() * 3) : 0
  }
  // one set of per-particle attributes, shared by the streaks and the sparks (one GPU buffer each)
  const inst = {
    aUN: new THREE.InstancedBufferAttribute(aUN, 2),
    aJ: new THREE.InstancedBufferAttribute(aJ, 3),
    aR: new THREE.InstancedBufferAttribute(aR, 4),
    aOwner: new THREE.InstancedBufferAttribute(aOwner, 1),
  }
  const makeGeo = (ends) => {
    const g = new THREE.InstancedBufferGeometry()
    const pos = new Float32Array(ends.length * 3)
    ends.forEach((e, i) => (pos[i * 3] = e))
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    for (const [k, v] of Object.entries(inst)) g.setAttribute(k, v)
    g.instanceCount = count
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e4)
    return g
  }

  const v3 = () => new THREE.Vector3()
  const col = () => new THREE.Color()
  const shared = {
    uTraj: { value: tex },
    uA: { value: 0 },
    uB: { value: 1 },
    uMorph: { value: 0 },
    uMorph2: { value: 0 },
    uFlowA: { value: 0 },
    uFlowB: { value: 0 },
    uFlowA2: { value: 0 },
    uFlowB2: { value: 0 },
    uTime: { value: 0 },
    uTime2: { value: 0 },
    uRel: { value: [0, 0, 0] },
    uRel2: { value: [0, 0, 0] },
    uChaos: { value: 0 },
    uScale: { value: 800 },
    uRes: { value: new THREE.Vector2(1, 1) },
    uPr: { value: 1 },
    uMach: { value: [v3(), v3(), v3()] },
    uMachR: { value: [1, 1, 1] },
    uAcc: { value: [col(), col(), col()] },
    uPalA: { value: [col(), col(), col()] },
    uPalB: { value: [col(), col(), col()] },
  }
  const material = (streak, bright, size) =>
    new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      defines: streak ? { STREAK: '' } : {},
      vertexShader: VERT,
      fragmentShader: FRAG,
      // shared uniform objects: one update reaches both materials
      uniforms: { ...shared, uBright: { value: bright }, uSize: { value: size } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

  const STREAK_GAIN = 0.036
  const streakMat = material(true, STREAK_GAIN, 0)
  const sparkMat = material(false, 0.07, 0.034)
  const streaks = new THREE.LineSegments(makeGeo([0, 1]), streakMat)
  const sparks = new THREE.Points(makeGeo([0]), sparkMat)
  for (const o of [streaks, sparks]) {
    o.frustumCulled = false
    o.renderOrder = 5
  }
  const group = new THREE.Group()
  group.add(streaks, sparks)

  const SPARK_SHARE = 0.35
  /** Fraction of the particles drawn (the quality tiers thin the storm). */
  const setDensity = (k) => {
    const n = Math.max(1000, Math.floor(count * k))
    streaks.geometry.instanceCount = n
    sparks.geometry.instanceCount = Math.floor(n * SPARK_SHARE)
  }
  /** Drawing-buffer size in device pixels, and the pixel ratio. A line is one device pixel wide at any ratio, so it
   *  covers less of the screen on a denser one: its brightness goes up by the same factor. */
  const setViewport = (w, h, pr) => {
    shared.uRes.value.set(w, h)
    shared.uPr.value = pr
    streakMat.uniforms.uBright.value = STREAK_GAIN * pr
  }

  return { group, uniforms: shared, count, setDensity, setViewport, texture: tex }
}

/** The two flow phases for time t, in double precision on the CPU (the shader only ever sees values in 0..1). */
export function flowPhases(t) {
  const x = FLOW.rate * t
  return [x - Math.floor(x), x / 64 - Math.floor(x / 64)]
}

/** The same curl the vertex shader adds, for anything on the CPU that rides the storm. */
export function swirl(p, t, out) {
  const [x, y, z] = p
  out[0] = Math.sin(y * 0.9 + t * 0.7) + Math.sin(z * 1.7 - t * 0.4)
  out[1] = Math.sin(z * 0.8 - t * 0.6) + Math.sin(x * 1.5 + t * 0.5)
  out[2] = Math.sin(x * 1.1 + t * 0.5) + Math.sin(y * 1.3 - t * 0.3)
  return out
}
