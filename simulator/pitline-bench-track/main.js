// A bench: models on the ground under the stage, for stills. Copy this folder per kit (pitline-bench-cars,
// pitline-bench-circuit) and lay your own models out in it.
import * as THREE from 'three';
import {runSim} from 'simulator-kit/runtime.js';
import {TOY, createToyStage, toyMat, rbox, mesh} from '../pitline-shared/style.js';
import {buildCircuitSurface} from '../pitline-shared/track.js';
import {CARS, carAt} from '../pitline-shared/layout.js';

const D2R = Math.PI / 180;
runSim({duration: 10, fps: 60, theme: 'light', hud: {enabled: false, title: 'bench', subtitle: ''}, director: {enabled: false}}, async ({cfg, canvas, capture}) => {
  const app = document.getElementById('app');
  const st = createToyStage(canvas, {fov: 28});
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000).rotateX(-Math.PI / 2), toyMat(TOY.ground, {rough: 0.95}));
  ground.receiveShadow = true;
  st.scene.add(ground);
  st.scene.add(buildCircuitSurface());
  const boxes = CARS.map((c) => { const m = mesh(rbox(8.4, 1.2, 3, 0.4), toyMat(TOY.livery[c.team].body, {paint: true})); st.scene.add(m); return m; });
  // the camera: {"cam": {"x": 0, "z": 0, "d": 60, "az": 38, "el": 36, "ty": 1}} in a file passed to capture.mjs with
  // --config cam.json moves it for close-ups
  const cam = {x: 0, z: 0, d: 60, az: 38, el: 36, ty: 1, ...(cfg.cam || {})};
  const resize = () => {
    app.style.transform = `scale(${Math.min(innerWidth / 1600, innerHeight / 900)})`;
    st.resize(1600, 900, capture ? devicePixelRatio || 1 : Math.min(devicePixelRatio || 1, 2));
  };
  resize();
  return {
    resize,
    render(t) {
      CARS.forEach((c, i) => { const p = carAt(c, t); boxes[i].position.set(p.x, 0.6, p.z); boxes[i].rotation.y = Math.atan2(-p.tz, p.tx); });
      st.frame({tx: cam.x, ty: cam.ty, tz: cam.z, az: cam.az * D2R, el: cam.el * D2R, d: cam.d, fov: 28});
      return {};
    },
  };
});
