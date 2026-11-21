// A bench: models on the ground under the stage, for stills. Copy this folder per kit (pitline-bench-cars,
// pitline-bench-circuit) and lay your own models out in it.
import * as THREE from 'three';
import {runSim} from 'simulator-kit/runtime.js';
import {TOY, createToyStage, toyMat, rbox, mesh} from '../pitline-shared/style.js';

const D2R = Math.PI / 180;
runSim({duration: 10, fps: 60, theme: 'light', hud: {enabled: false, title: 'bench', subtitle: ''}, director: {enabled: false}}, async ({cfg, canvas, capture}) => {
  const app = document.getElementById('app');
  const st = createToyStage(canvas, {fov: 28});
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000).rotateX(-Math.PI / 2), toyMat(TOY.ground, {rough: 0.95}));
  ground.receiveShadow = true;
  st.scene.add(ground);
  st.scene.add(mesh(rbox(8, 2, 3, 0.4), toyMat(TOY.blue, {paint: true}), 0, 1, 0));
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
      st.frame({tx: cam.x, ty: cam.ty, tz: cam.z, az: cam.az * D2R, el: cam.el * D2R, d: cam.d, fov: 28});
      return {};
    },
  };
});
