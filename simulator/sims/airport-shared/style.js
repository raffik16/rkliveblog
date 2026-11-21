// The toy airport's shared look: the airport rebuilt as close to the reference video as we can get
//. Toy proportions with a premium finish: chunky bevelled forms, matte paint
// with a soft clearcoat on the vehicles, blue + white on a lavender ground, yellow only on the work machines, green
// lollipop trees. Every builder in airside.js and gse.js takes its colours and materials from here, so the two kits
// read as one world. Colours sampled from the reference frames.
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {createMapStage} from './stage.js';

export const TOY = {
  bg: '#dfe6fa', // beyond the map
  ground: '#d5def7', // the lavender lot
  groundDeep: '#c3cff3', // shaded strips, verges
  road: '#e6eaf8', // roads and the apron, a touch lighter than the lot
  lane: '#ffffff', // lane dashes
  bay: '#f2b33a', // parking and stand lines (the reference's yellow bay outlines)
  blue: '#3166ea', // the brand blue: cabs, frames
  roof: '#4a85f0', // the reference's roofs read lighter than the cabs
  blueDeep: '#2448c8',
  blueLight: '#8fb0f7', // light blue trims, hubs
  wall: '#7fa6f2', // the reference's light-blue warehouse walls
  white: '#f6f8fd',
  panel: '#e9edf8',
  shade: '#c9d1ea', // cool grey-lavender for undersides, fences
  navy: '#1a2440', // tyres, glass, the dark parts
  glass: '#22304f',
  yellow: '#f2b33a', // forklifts and work machines only
  teal: '#21b3a3', // the second livery
  orange: '#ff8a3d', // a third livery dot, sparingly
  green: '#7fdaa0', // tree crowns
  greenDeep: '#4fbf7d',
  trunk: '#b08a6a',
  red: '#e5484d', // beacons
  cardboard: '#e3b07a',
};

const matCache = new Map();
/** a shared matte material; paint = true adds the soft clearcoat the reference's vehicles carry */
export function toyMat(color, {rough = 0.55, metal = 0, paint = false, emissive = null, opacity = 1} = {}) {
  const key = [color, rough, metal, paint, emissive, opacity].join('|');
  if (matCache.has(key)) return matCache.get(key);
  const m = paint
    ? new THREE.MeshPhysicalMaterial({color, roughness: rough, metalness: metal, clearcoat: 0.35, clearcoatRoughness: 0.35})
    : new THREE.MeshStandardMaterial({color, roughness: rough, metalness: metal});
  if (emissive) {
    m.emissive = new THREE.Color(emissive);
    m.emissiveIntensity = 1;
  }
  if (opacity < 1) {
    m.transparent = true;
    m.opacity = opacity;
    m.depthWrite = false;
  }
  matCache.set(key, m);
  return m;
}

const geoCache = new Map();
/** a rounded box, cached by size; r is the bevel radius (keep it generous: the toy look lives in the bevels) */
export function rbox(w, h, d, r = Math.min(w, h, d) * 0.12, segs = 3) {
  const key = [w, h, d, r, segs].map((v) => +v.toFixed(3)).join('|');
  if (!geoCache.has(key)) geoCache.set(key, new RoundedBoxGeometry(w, h, d, segs, Math.min(r, Math.min(w, h, d) / 2 - 1e-3)));
  return geoCache.get(key);
}

/** a mesh that casts and receives shadows */
export function mesh(geo, mat, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.castShadow = m.receiveShadow = true;
  return m;
}

/** text or a logo on a transparent canvas texture, for liveries, signs and dock numbers (Inter, bold) */
export function labelTexture(text, {color = TOY.blue, bg = null, w = 1024, h = 256, font = 'italic 800 150px Inter, system-ui, sans-serif', align = 'center'} = {}) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d');
  if (bg) {
    g.fillStyle = bg;
    g.fillRect(0, 0, w, h);
  }
  g.fillStyle = color;
  g.font = font;
  g.textAlign = align;
  g.textBaseline = 'middle';
  g.fillText(text, align === 'center' ? w / 2 : 24, h / 2);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/** the stage tuned to the reference: neutral tone mapping (ACES greys a pale lavender ground out), lavender all round,
 *  softer sun, wide soft shadows */
export function createToyStage(canvas, {fov = 28} = {}) {
  const st = createMapStage(canvas, {bg: TOY.bg, fov});
  st.scene.fog.near = 700;
  st.scene.fog.far = 1400;
  st.renderer.toneMapping = THREE.NeutralToneMapping;
  st.renderer.toneMappingExposure = 0.93;
  st.scene.traverse((o) => {
    if (o.isHemisphereLight) {
      o.color.set('#f3f6ff');
      o.groundColor.set('#c7d0ee');
      o.intensity = 1.0;
    }
  });
  st.sun.intensity = 2.2;
  st.sun.color.set('#ffffff');
  st.sun.shadow.radius = 6;
  st.gtao.blendIntensity = 0.75;
  return st;
}
