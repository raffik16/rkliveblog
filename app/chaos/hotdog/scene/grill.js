// The roller grill: hot dogs spin on the roller grill, DJs spin records. A giant one stands at the edge of the plaza,
// beside the record: eleven chrome rollers all turning one way, ten franks rolling the other way in the grooves
// between them, at the rate that keeps them from slipping (a frank turns at the roller's rate times the ratio of
// their radii). The rollers turn once a bar, so the grill keeps the set's time. Heat glows up between them.
import * as THREE from 'three'
import { selfLit } from './mesher.js'

export const GRILL = {
  az: 3.55, // where it stands round the plaza
  radius: 72,
  rollers: 11,
  rollerR: 1.15,
  spacing: 2.55,
  length: 21,
  frankScale: 100, // a 152 mm frank, about 15 units long
}

/** frank: the frank's geometry (axis along x, coloured per vertex). ground: the city's ground height. */
export function buildGrill(frank, ground) {
  const G = GRILL
  const group = new THREE.Group()
  const rig = new THREE.Group()
  group.add(rig)

  // a stage riser to stand on, the grill's steel body on top
  const steel = new THREE.MeshStandardMaterial({
    color: '#3a3b40',
    roughness: 0.35,
    metalness: 0.9,
    envMapIntensity: 0.6,
  })
  const dark = new THREE.MeshStandardMaterial({ color: '#0d0c12', roughness: 0.7, metalness: 0.3 })
  const depth = G.rollers * G.spacing + 2.4
  const riser = new THREE.Mesh(new THREE.BoxGeometry(G.length + 6, 7, depth + 4), dark)
  riser.position.y = -5.3
  rig.add(riser)
  const body = new THREE.Mesh(new THREE.BoxGeometry(G.length + 3, 2.2, depth), steel)
  body.position.y = -1.6
  rig.add(body)
  // the heat, glowing up between the rollers
  const heat = new THREE.Mesh(
    new THREE.PlaneGeometry(G.length, depth - 1.6),
    new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff5a1a').multiplyScalar(1.6) })
  )
  heat.rotation.x = -Math.PI / 2
  heat.position.y = -0.45
  rig.add(heat)

  // the rollers: chrome, banded so their turning shows
  const rollerGeo = new THREE.CylinderGeometry(G.rollerR, G.rollerR, G.length, 24, 1, false)
  rollerGeo.rotateZ(Math.PI / 2)
  const pos = rollerGeo.attributes.position
  const col = new Float32Array(pos.count * 3)
  for (let i = 0; i < pos.count; i++) {
    const a = Math.atan2(pos.getZ(i), pos.getY(i))
    const k = Math.sin(a * 6) > 0 ? 1 : 0.62
    col.set([k, k, k * 1.02], i * 3)
  }
  rollerGeo.setAttribute('color', new THREE.BufferAttribute(col, 3))
  const chrome = new THREE.MeshStandardMaterial({
    vertexColors: true,
    color: '#d9dce2',
    roughness: 0.28,
    metalness: 1,
    envMapIntensity: 0.8,
  })
  const rollers = []
  const zOf = (i) => (i - (G.rollers - 1) / 2) * G.spacing
  for (let i = 0; i < G.rollers; i++) {
    const m = new THREE.Mesh(rollerGeo, chrome)
    m.position.set(0, 0.8, zOf(i))
    rig.add(m)
    rollers.push(m)
  }

  // the franks, each resting on the two rollers either side of it
  frank.computeBoundingBox()
  const fr = ((frank.boundingBox.max.y - frank.boundingBox.min.y) / 2) * G.frankScale
  const reach = G.rollerR + fr
  const lift = Math.sqrt(Math.max(0, reach * reach - (G.spacing / 2) ** 2))
  const frankMat = selfLit(
    new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.45, envMapIntensity: 0.7 }),
    { value: 0.12 }
  )
  const franks = []
  for (let i = 0; i < G.rollers - 1; i++) {
    const m = new THREE.Mesh(frank, frankMat)
    m.scale.setScalar(G.frankScale)
    m.position.set(0, 0.8 + lift, (zOf(i) + zOf(i + 1)) / 2)
    rig.add(m)
    franks.push(m)
  }
  const ratio = G.rollerR / fr

  // stood at the plaza's edge, rollers across the view from the storm, tipped toward it so every frank shows
  group.position.set(G.radius * Math.cos(G.az), ground + 8.6, G.radius * Math.sin(G.az))
  group.lookAt(0, group.position.y, 0)
  rig.rotation.x = 0.24

  /** beats: the set's beat clock. One turn of the rollers per bar. */
  const update = (beats) => {
    const a = (2 * Math.PI * beats) / 4
    for (const m of rollers) m.rotation.x = a
    for (const m of franks) m.rotation.x = -a * ratio
  }
  update(0)
  return { group, update }
}
