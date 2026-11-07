// The storm: a few hundred thousand points riding the attractors on the GPU. Every trajectory lives in one float
// texture (16384 samples per attractor, xyz + speed); a point is just a place on the curve, so the vertex shader
// reads where it is now, where the next attractor would put it, and blends the two with its own delay. Mid-morph
// the points are loose and a curl of sines carries them. A share of the points belongs to a machine: tucked inside
// it while it is whole, flung out into the storm when it comes apart, pulled home when it reassembles.
import * as THREE from 'three'
import { L } from './attractors.js'
import { rng } from '../teardown/kit/util.js'

const W = 2048
const ROWS = L / W

export const FLOW = {
  // samples per second along the curve, and the spread of per-point speeds in 64ths
  rate: 52 / L,
  spread: 11,
}

const VERT = /* glsl */ `
precision highp float;
precision highp sampler2D;
uniform sampler2D uTraj;
uniform int uA;
uniform int uB;
uniform float uMorph;
uniform float uFlowA;
uniform float uFlowB;
uniform float uTime;
uniform float uChaos;
uniform float uSize;
uniform float uScale;
uniform float uBright;
uniform vec3 uMach[3];
uniform float uRel[3];
uniform float uMachR[3];
uniform vec3 uAcc[3];
uniform vec3 uPalA[3];
uniform vec3 uPalB[3];
in float aU;
in float aN;
in vec3 aJ;
in vec4 aR;
in float aOwner;
out vec3 vCol;
out float vA;

vec4 traj(int k, float u) {
  float f = u * ${L}.0;
  float n0 = floor(f);
  float t = f - n0;
  int i0 = int(n0) % ${L};
  int i1 = (i0 + 1) % ${L};
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
void main() {
  float u = fract(aU + uFlowA + aN * uFlowB);
  vec4 A = traj(uA, u);
  vec4 B = traj(uB, u);
  float m = clamp((uMorph - aR.x * 0.45) / 0.55, 0.0, 1.0);
  m = m * m * (3.0 - 2.0 * m);
  float fly = sin(3.14159265 * m);
  vec3 p = mix(A.xyz, B.xyz, m);
  float spd = mix(A.w, B.w, m);
  p += aJ * (1.0 + 3.0 * fly);
  p += swirl(p * 0.45, uTime) * (fly * uChaos + 0.035);
  vec3 col = mix(pal(uPalA[0], uPalA[1], uPalA[2], spd), pal(uPalB[0], uPalB[1], uPalB[2], spd), m);
  float alpha = 0.5 + 0.8 * spd;
  float grow = 1.0 + 0.8 * fly;

  if (aOwner > 0.5) {
    int k = int(aOwner + 0.5) - 1;
    float r = clamp((uRel[k] - aR.y * 0.45) / 0.55, 0.0, 1.0);
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

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float z = max(0.05, -mv.z);
  float px = uSize * (0.55 + aR.z) * grow * uScale / z;
  gl_PointSize = clamp(px, 1.0, 40.0);
  // below a pixel, dim instead of shrinking; right at the lens, fade so nothing smears the frame
  alpha *= clamp(px / 1.4, 0.0, 1.0) * smoothstep(0.25, 1.6, z) * (px > 40.0 ? 40.0 / px : 1.0);
  vCol = col;
  vA = alpha * uBright;
}`

const FRAG = /* glsl */ `
precision highp float;
in vec3 vCol;
in float vA;
out vec4 fragColor;
void main() {
  vec2 q = gl_PointCoord * 2.0 - 1.0;
  float d = dot(q, q);
  if (d > 1.0) discard;
  float g = exp(-d * 3.5) - 0.03;
  fragColor = vec4(vCol * max(g, 0.0) * vA, 1.0);
}`

/** attractors from buildAttractors(); count points; owners: the share bound to each machine. */
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
  const aU = new Float32Array(count)
  const aN = new Float32Array(count)
  const aJ = new Float32Array(count * 3)
  const aR = new Float32Array(count * 4)
  const aOwner = new Float32Array(count)
  const ownShare = (ownedPerMachine * 3) / count
  for (let i = 0; i < count; i++) {
    aU[i] = r()
    aN[i] = Math.round((r() * 2 - 1) * FLOW.spread)
    const owned = r() < ownShare
    // a filament has some thickness; owned points carry a direction instead, for their burst
    const j = owned ? 1 : 0.05 * Math.pow(r(), 1.5)
    aJ[i * 3] = gauss() * j
    aJ[i * 3 + 1] = gauss() * j
    aJ[i * 3 + 2] = gauss() * j
    aR[i * 4] = r() // morph delay
    aR[i * 4 + 1] = r() // release delay
    aR[i * 4 + 2] = Math.pow(r(), 2.2) // size
    aR[i * 4 + 3] = r()
    aOwner[i] = owned ? 1 + Math.floor(r() * 3) : 0
  }
  const geo = new THREE.BufferGeometry()
  // positions are computed in the shader; three still wants one attribute named position for the count
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3))
  geo.setAttribute('aU', new THREE.BufferAttribute(aU, 1))
  geo.setAttribute('aN', new THREE.BufferAttribute(aN, 1))
  geo.setAttribute('aJ', new THREE.BufferAttribute(aJ, 3))
  geo.setAttribute('aR', new THREE.BufferAttribute(aR, 4))
  geo.setAttribute('aOwner', new THREE.BufferAttribute(aOwner, 1))
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e4)

  const v3 = () => new THREE.Vector3()
  const col = () => new THREE.Color()
  const uniforms = {
    uTraj: { value: tex },
    uA: { value: 0 },
    uB: { value: 1 },
    uMorph: { value: 0 },
    uFlowA: { value: 0 },
    uFlowB: { value: 0 },
    uTime: { value: 0 },
    uChaos: { value: 0 },
    uSize: { value: 0.05 },
    uScale: { value: 800 },
    uBright: { value: 0.085 },
    uMach: { value: [v3(), v3(), v3()] },
    uRel: { value: [0, 0, 0] },
    uMachR: { value: [1, 1, 1] },
    uAcc: { value: [col(), col(), col()] },
    uPalA: { value: [col(), col(), col()] },
    uPalB: { value: [col(), col(), col()] },
  }
  const mat = new THREE.ShaderMaterial({
    glslVersion: THREE.GLSL3,
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const points = new THREE.Points(geo, mat)
  points.frustumCulled = false
  points.renderOrder = 5

  /** Fraction of the points drawn (the quality tiers thin the storm). */
  const setDensity = (k) => geo.setDrawRange(0, Math.max(1000, Math.floor(count * k)))

  return { points, uniforms, count, setDensity, texture: tex }
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
