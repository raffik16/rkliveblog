// A small mesh builder for food: every surface is a parametric grid whose normals come from the grid itself, so a
// surface is smooth inside and sharp where it meets the next one (a bun's crust against its crumb, a pickle's skin
// against its flesh). Colours go per vertex, so one draw call carries a whole part.
import * as THREE from 'three'

const sub = (a, b, o) => {
  o[0] = a[0] - b[0]
  o[1] = a[1] - b[1]
  o[2] = a[2] - b[2]
  return o
}

export class Mesher {
  constructor() {
    this.pos = []
    this.nor = []
    this.col = []
    this.idx = []
  }

  get count() {
    return this.pos.length / 3
  }

  /**
   * A (nu + 1) x (nv + 1) grid of vertices from f(u, v) -> {p: [x, y, z], c: THREE.Color}, u and v in 0..1. The
   * face normal is (dP/du x dP/dv). `inside` is a point inside the part: the surface is turned so its normals face
   * away from it, whichever way u and v happen to run. Where the grid pinches to a point (a pole), the vertex takes
   * the average normal of the row next to it.
   */
  grid(nu, nv, f, { inside = [0, 0, 0], wrapU = false, wrapV = false } = {}) {
    const P = []
    const C = []
    for (let i = 0; i <= nu; i++)
      for (let j = 0; j <= nv; j++) {
        const s = f(i / nu, j / nv)
        P.push(s.p)
        C.push(s.c)
      }
    const at = (i, j) => P[i * (nv + 1) + j]
    const N = []
    const du = [0, 0, 0]
    const dv = [0, 0, 0]
    for (let i = 0; i <= nu; i++)
      for (let j = 0; j <= nv; j++) {
        const i0 = i > 0 ? i - 1 : wrapU ? nu - 1 : i
        const i1 = i < nu ? i + 1 : wrapU ? 1 : i
        const j0 = j > 0 ? j - 1 : wrapV ? nv - 1 : j
        const j1 = j < nv ? j + 1 : wrapV ? 1 : j
        sub(at(i1, j), at(i0, j), du)
        sub(at(i, j1), at(i, j0), dv)
        const n = [
          du[1] * dv[2] - du[2] * dv[1],
          du[2] * dv[0] - du[0] * dv[2],
          du[0] * dv[1] - du[1] * dv[0],
        ]
        N.push(n)
      }
    const len = (n) => Math.hypot(n[0], n[1], n[2])
    // poles: borrow the neighbouring row's average
    for (let i = 0; i <= nu; i++) {
      let rowMax = 0
      for (let j = 0; j <= nv; j++) rowMax = Math.max(rowMax, len(N[i * (nv + 1) + j]))
      const scale = rowMax || 1
      for (let j = 0; j <= nv; j++) {
        const n = N[i * (nv + 1) + j]
        if (len(n) > scale * 1e-4 && len(n) > 1e-14) continue
        const k = i === 0 ? 1 : i === nu ? nu - 1 : len(N[(i - 1) * (nv + 1)]) > 0 ? i - 1 : i + 1
        const avg = [0, 0, 0]
        for (let jj = 0; jj <= nv; jj++) {
          const m = N[k * (nv + 1) + jj]
          const l = len(m) || 1
          avg[0] += m[0] / l
          avg[1] += m[1] / l
          avg[2] += m[2] / l
        }
        N[i * (nv + 1) + j] = avg
      }
    }
    let facing = 0
    for (let k = 0; k < P.length; k++) {
      const n = N[k]
      const l = len(n) || 1
      facing +=
        (n[0] * (P[k][0] - inside[0]) +
          n[1] * (P[k][1] - inside[1]) +
          n[2] * (P[k][2] - inside[2])) /
        l
    }
    const flip = facing < 0
    const base = this.count
    const sgn = flip ? -1 : 1
    for (let k = 0; k < P.length; k++) {
      const n = N[k]
      const l = len(n) || 1
      this.pos.push(P[k][0], P[k][1], P[k][2])
      this.nor.push((sgn * n[0]) / l, (sgn * n[1]) / l, (sgn * n[2]) / l)
      this.col.push(C[k].r, C[k].g, C[k].b)
    }
    for (let i = 0; i < nu; i++)
      for (let j = 0; j < nv; j++) {
        const a = base + i * (nv + 1) + j
        const b = a + nv + 1
        const c = b + 1
        const d = a + 1
        if (flip) this.idx.push(a, d, b, b, d, c)
        else this.idx.push(a, b, d, b, c, d)
      }
    return this
  }

  /** Add an existing geometry (position + normal), painted one colour or by f(position, normal) -> THREE.Color. */
  add(geo, paint) {
    const g = geo
    const p = g.attributes.position
    const n = g.attributes.normal
    const base = this.count
    const v = new THREE.Vector3()
    const w = new THREE.Vector3()
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i)
      w.fromBufferAttribute(n, i)
      const c = typeof paint === 'function' ? paint(v, w) : paint
      this.pos.push(v.x, v.y, v.z)
      this.nor.push(w.x, w.y, w.z)
      this.col.push(c.r, c.g, c.b)
    }
    if (g.index) for (let i = 0; i < g.index.count; i++) this.idx.push(base + g.index.getX(i))
    else for (let i = 0; i < p.count; i++) this.idx.push(base + i)
    return this
  }

  /** Add a geometry that already carries its own colours (one built by a Mesher). */
  append(geo) {
    const p = geo.attributes.position
    const n = geo.attributes.normal
    const c = geo.attributes.color
    const base = this.count
    for (let i = 0; i < p.count; i++) {
      this.pos.push(p.getX(i), p.getY(i), p.getZ(i))
      this.nor.push(n.getX(i), n.getY(i), n.getZ(i))
      this.col.push(c.getX(i), c.getY(i), c.getZ(i))
    }
    if (geo.index) for (let i = 0; i < geo.index.count; i++) this.idx.push(base + geo.index.getX(i))
    else for (let i = 0; i < p.count; i++) this.idx.push(base + i)
    return this
  }

  build() {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3))
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nor, 3))
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3))
    g.setIndex(this.idx)
    g.computeBoundingSphere()
    g.computeBoundingBox()
    return g
  }
}

/** Linear-space colour from a hex string, optionally scaled. */
export const col = (hex, k = 1) => new THREE.Color(hex).multiplyScalar(k)
export const mix = (a, b, k) => a.clone().lerp(b, Math.min(1, Math.max(0, k)))

/** A material that also glows in its own vertex colours, by `amount` (a {value} uniform you can change). */
export function selfLit(mat, amount) {
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uSelfLit = amount
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform float uSelfLit;')
      .replace(
        '#include <emissivemap_fragment>',
        '#include <emissivemap_fragment>\n#ifdef USE_COLOR\n totalEmissiveRadiance += vColor.rgb * uSelfLit;\n#endif'
      )
  }
  mat.customProgramCacheKey = () => 'self-lit'
  return mat
}
