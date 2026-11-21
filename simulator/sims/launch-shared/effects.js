// Padline's effects, in the toy look: exhaust flames as soft unlit cones, and one instanced cloud of white puffs
// (exhaust steam, the contrail, propellant vapour, thruster puffs, landing dust) that the world rebuilds every frame
// from the clock, so any second renders the same out of order.
//
//   buildFlame({r = 2, len = 16, color = 'booster' | 'vacuum'}) -> {group, set(k, t)}
//       Origin at the nozzle plane, the flame along -y. set(k, t): k = 0 off, 1 full length; t only drives the flicker.
//   createPuffs(scene, max = 480) -> {begin(), puff(x, y, z, r, shade = 0), end(), mesh}
//       Immediate mode: begin(), one puff() per live puff (a white blob of radius r; shade 0..1 greys it toward the
//       lavender shadow colour, for the dust), end(). Unused instances are hidden.
//   PUFF: helpers for the world's emitters: life(age, L) envelope, hash(i, k) stable noise in 0..1.
import * as THREE from 'three'
import { toyMat } from '../airport-shared/style.js'
import { lathe } from './rocket.js'

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
export const hash = (i, k = 0) => {
  const x = Math.sin(i * 127.1 + k * 311.7 + 74.7) * 43758.5453
  return x - Math.floor(x)
}

const FLAME = {
  booster: { outer: '#ffb347', mid: '#ffd77a', core: '#fff6dc' },
  vacuum: { outer: '#ffc76e', mid: '#ffe2a6', core: '#fffaf0' },
}
export function buildFlame({ r = 2, len = 16, color = 'booster' } = {}) {
  const C = FLAME[color]
  const group = new THREE.Group()
  group.name = 'flame'
  const mat = (c, o) =>
    new THREE.MeshBasicMaterial({
      color: c,
      transparent: true,
      opacity: o,
      depthWrite: false,
      toneMapped: false,
    })
  // profiles from the tip (y = -len) up to the nozzle (y = 0): a fat plume that narrows to a soft point
  const shape = (rr, L) =>
    lathe(
      [
        [0.01, -L],
        [rr * 0.35, -L * 0.82],
        [rr * 0.78, -L * 0.5],
        [rr, -L * 0.18],
        [rr * 0.96, -0.02],
        [rr * 0.8, 0],
      ],
      32
    )
  const outer = new THREE.Mesh(shape(r * 1.18, len), mat(C.outer, 0.72))
  const mid = new THREE.Mesh(shape(r * 0.95, len * 0.74), mat(C.mid, 0.85))
  const core = new THREE.Mesh(shape(r * 0.62, len * 0.42), mat(C.core, 0.95))
  outer.renderOrder = 3
  mid.renderOrder = 4
  core.renderOrder = 5
  group.add(outer, mid, core)
  group.visible = false
  return {
    group,
    set(k, t = 0) {
      group.visible = k > 0.01
      if (!group.visible) return
      const f = Math.floor(t * 30)
      const fl = 1 + 0.07 * (hash(f, 3) - 0.5) + 0.04 * Math.sin(t * 41)
      outer.scale.set(1 + 0.04 * (hash(f, 5) - 0.5), k * fl, 1 + 0.04 * (hash(f, 7) - 0.5))
      mid.scale.set(1, k * (2 - fl), 1)
      core.scale.set(1, Math.min(1, k * 1.4) * fl, 1)
    },
  }
}

export function createPuffs(scene, max = 480) {
  const geo = new THREE.IcosahedronGeometry(1, 3)
  const mat = toyMat('#ffffff', { rough: 0.92 })
  // a touch of glow so the undersides stay soft lavender, never grey
  const m = mat.clone()
  m.emissive = new THREE.Color('#dfe6fb')
  m.emissiveIntensity = 0.32
  const mesh = new THREE.InstancedMesh(geo, m, max)
  mesh.castShadow = true
  mesh.receiveShadow = false
  mesh.frustumCulled = false
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  const white = new THREE.Color('#ffffff')
  const dust = new THREE.Color('#c9cfe8')
  const col = new THREE.Color()
  mesh.setColorAt(0, white)
  scene.add(mesh)
  const M = new THREE.Matrix4()
  let n = 0
  return {
    mesh,
    begin() {
      n = 0
    },
    puff(x, y, z, r, shade = 0) {
      if (n >= max || r < 0.02) return
      M.makeScale(r, r * 0.86, r).setPosition(x, y, z)
      mesh.setMatrixAt(n, M)
      mesh.setColorAt(n, col.copy(white).lerp(dust, clamp(shade, 0, 1)))
      n++
    },
    end() {
      mesh.count = n
      mesh.instanceMatrix.needsUpdate = true
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    },
  }
}

/** a puff's size envelope over its life: grows fast, holds, shrinks away in the last quarter */
export const life = (age, L) => {
  if (age <= 0 || age >= L) return 0
  const grow = 1 - Math.exp(-age / (0.18 * L))
  const fade = age > 0.72 * L ? 1 - (age - 0.72 * L) / (0.28 * L) : 1
  return grow * Math.sqrt(Math.max(0, fade))
}
