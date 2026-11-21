// Copied unchanged from the simulator skill's airport kit (sims/airport-shared/select.js, MIT, Nyxera0x/simulator).
// the reference's selection marks for the toy airport: a thin blue wireframe box round the
// selected vehicle, a soft blue glow on the ground under it, and a route drawn on the ground from it to where it is
// going. All screen-space lines (2 px whatever the zoom), all driven per frame, all a pure function of what is set.
//
//   const sel = createSelection(scene, stage);
//   sel.box(object3d | null, k)       the box round an object (its local bounds, rides its transform), k = 0..1 fade
//   sel.route(points | null, k, a)    a ground route through [Vector3], drawn to k (0..1), alpha a
//   sel.update()                      call once per frame after the scene is posed (keeps the line resolution)
import * as THREE from 'three';
import {LineMaterial} from 'three/addons/lines/LineMaterial.js';
import {LineSegments2} from 'three/addons/lines/LineSegments2.js';
import {LineSegmentsGeometry} from 'three/addons/lines/LineSegmentsGeometry.js';

const BLUE = '#3f6ff0';

function glowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(128, 128, 10, 128, 128, 128);
  gr.addColorStop(0, 'rgba(72,118,245,0.55)');
  gr.addColorStop(0.55, 'rgba(72,118,245,0.22)');
  gr.addColorStop(1, 'rgba(72,118,245,0)');
  g.fillStyle = gr;
  g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function createSelection(scene, stage) {
  const lm = new LineMaterial({color: BLUE, linewidth: 1.6, transparent: true, opacity: 0.95, depthTest: true});
  const boxLines = new LineSegments2(new LineSegmentsGeometry(), lm);
  boxLines.renderOrder = 5;
  boxLines.visible = false;
  scene.add(boxLines);
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({map: glowTexture(), transparent: true, depthWrite: false}));
  glow.renderOrder = 1;
  glow.visible = false;
  scene.add(glow);

  // the route: a flat ribbon on the ground, a soft halo under a solid core
  const routeCore = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial({color: BLUE, transparent: true, depthWrite: false}));
  const routeHalo = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial({color: '#7da0f6', transparent: true, opacity: 0.35, depthWrite: false}));
  routeCore.renderOrder = routeHalo.renderOrder = 2;
  routeCore.visible = routeHalo.visible = false;
  scene.add(routeHalo, routeCore);

  const box3 = new THREE.Box3();
  let boxFor = null;
  let boxGeoKey = '';
  const edges = (b) => {
    const {min: a, max: c} = b;
    const P = [
      [a.x, a.y, a.z], [c.x, a.y, a.z], [c.x, a.y, c.z], [a.x, a.y, c.z],
      [a.x, c.y, a.z], [c.x, c.y, a.z], [c.x, c.y, c.z], [a.x, c.y, c.z],
    ];
    const E = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
    const out = [];
    for (const [i, j] of E) out.push(...P[i], ...P[j]);
    return out;
  };

  const ribbon = (pts, w, k) => {
    // cumulative length, cut at k of the total
    const L = [0];
    for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + pts[i].distanceTo(pts[i - 1]));
    const cut = L[L.length - 1] * k;
    const P = [];
    for (let i = 0; i < pts.length; i++) {
      if (L[i] <= cut) P.push(pts[i]);
      else {
        const u = (cut - L[i - 1]) / (L[i] - L[i - 1] || 1);
        P.push(pts[i - 1].clone().lerp(pts[i], u));
        break;
      }
    }
    if (P.length < 2) return null;
    const pos = [];
    const idx = [];
    for (let i = 0; i < P.length; i++) {
      const a = P[Math.max(0, i - 1)];
      const b = P[Math.min(P.length - 1, i + 1)];
      const d = new THREE.Vector3().subVectors(b, a).setY(0).normalize();
      const n = new THREE.Vector3(-d.z, 0, d.x).multiplyScalar(w / 2);
      pos.push(P[i].x + n.x, 0.06, P[i].z + n.z, P[i].x - n.x, 0.06, P[i].z - n.z);
      if (i) idx.push(2 * i - 2, 2 * i - 1, 2 * i, 2 * i - 1, 2 * i + 1, 2 * i);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    return g;
  };

  return {
    box(obj, k = 1) {
      boxFor = obj && k > 0.001 ? obj : null;
      boxLines.visible = glow.visible = !!boxFor;
      if (!boxFor) return;
      lm.opacity = 0.95 * k;
      glow.material.opacity = k;
      // local bounds once per object, then the lines ride the object's world matrix
      const key = boxFor.uuid;
      if (key !== boxGeoKey) {
        boxGeoKey = key;
        boxFor.updateMatrixWorld(true);
        const inv = new THREE.Matrix4().copy(boxFor.matrixWorld).invert();
        box3.makeEmpty();
        boxFor.traverse((o) => {
          if (!o.isMesh || !o.geometry) return;
          if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
          box3.union(o.geometry.boundingBox.clone().applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld)));
        });
        box3.expandByScalar(0.25);
        boxLines.geometry.dispose();
        boxLines.geometry = new LineSegmentsGeometry().setPositions(edges(box3));
        boxLines.userData.size = box3.getSize(new THREE.Vector3());
        boxLines.userData.center = box3.getCenter(new THREE.Vector3());
      }
    },
    route(pts, k = 1, a = 1) {
      routeCore.visible = routeHalo.visible = !!pts && k > 0.001 && a > 0.001;
      if (!routeCore.visible) return;
      const core = ribbon(pts, 0.9, k);
      const halo = ribbon(pts, 3.2, k);
      if (!core) {
        routeCore.visible = routeHalo.visible = false;
        return;
      }
      routeCore.geometry.dispose();
      routeHalo.geometry.dispose();
      routeCore.geometry = core;
      routeHalo.geometry = halo;
      routeCore.material.opacity = 0.9 * a;
      routeHalo.material.opacity = 0.32 * a;
    },
    update() {
      lm.resolution.set(stage.size.w, stage.size.h);
      if (boxFor) {
        boxFor.updateMatrixWorld(true);
        boxLines.matrixAutoUpdate = false;
        boxLines.matrix.copy(boxFor.matrixWorld);
        boxLines.matrixWorldNeedsUpdate = true;
        const s = boxLines.userData.size;
        const c = boxLines.userData.center.clone().applyMatrix4(boxFor.matrixWorld);
        glow.position.set(c.x, 0.05, c.z);
        glow.scale.set(Math.max(s.x, s.z) * 1.9, 1, Math.max(s.x, s.z) * 1.9);
      }
    },
  };
}
