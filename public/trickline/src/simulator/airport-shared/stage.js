// The simulator's stage (a clean, bright isometric world under a product UI). A soft sun with wide PCF shadows over the whole map, a sky-and-ground hemisphere, a studio environment
// for the metal and the paint to catch, GTAO for contact shadows, ACES. The camera is a narrow perspective lens high
// above, framed by target, azimuth, elevation, distance; sx/sy shift the frame in CSS px so the scene centres between
// the UI panels.
import * as THREE from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {GTAOPass} from 'three/addons/postprocessing/GTAOPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';

export function createMapStage(canvas, {bg = '#e6eaf4', fov = 22} = {}) {
  const renderer = new THREE.WebGLRenderer({canvas, antialias: false, preserveDrawingBuffer: true, powerPreference: 'high-performance'});
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(bg);
  scene.fog = new THREE.Fog(bg, 520, 900);
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), 0.03).texture;
  scene.environmentIntensity = 0.38;
  const camera = new THREE.PerspectiveCamera(fov, 16 / 9, 5, 2000);

  scene.add(new THREE.HemisphereLight('#eef2ff', '#b9c0cf', 0.7));
  const sun = new THREE.DirectionalLight('#fff4e6', 3.6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(4096, 4096);
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.6;
  sun.shadow.radius = 4;
  const sc = sun.shadow.camera;
  sc.left = -230;
  sc.right = 230;
  sc.top = 230;
  sc.bottom = -230;
  sc.near = 10;
  sc.far = 900;
  // (an orthographic shadow camera keeps its old box until told: without this the shadows cover 10 m)
  sc.updateProjectionMatrix();
  scene.add(sun, sun.target);
  // from behind and to the left of the camera's usual azimuth, so the shadows fall forward and right into view
  const SUN_DIR = new THREE.Vector3(-0.78, 1, -0.36).normalize();

  const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(1, 1, {type: THREE.HalfFloatType, samples: 4}));
  composer.addPass(new RenderPass(scene, camera));
  const gtao = new GTAOPass(scene, camera, 1, 1);
  gtao.updateGtaoMaterial({radius: 6, distanceExponent: 1.4, thickness: 3, scale: 1.1, samples: 16});
  gtao.blendIntensity = 0.85;
  composer.addPass(gtao);
  composer.addPass(new OutputPass());

  const size = {w: 1600, h: 900, pr: 1};
  const resize = (w, h, pr) => {
    Object.assign(size, {w, h, pr});
    renderer.setPixelRatio(pr);
    renderer.setSize(w, h, false);
    composer.setPixelRatio(pr);
    composer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  // cam: {tx, ty, tz, az (rad, from +z toward +x), el (rad), d, sx, sy (CSS px), fov}
  const frame = (cam) => {
    const {tx, ty, tz, az, el, d} = cam;
    camera.position.set(tx + d * Math.cos(el) * Math.sin(az), ty + d * Math.sin(el), tz + d * Math.cos(el) * Math.cos(az));
    camera.lookAt(tx, ty, tz);
    if (cam.fov && cam.fov !== camera.fov) {
      camera.fov = cam.fov;
      camera.updateProjectionMatrix();
    }
    camera.setViewOffset(size.w, size.h, -(cam.sx ?? 0), -(cam.sy ?? 0), size.w, size.h);
    camera.updateMatrixWorld();
    // the sun's shadow box rides the target, so the shadows stay crisp wherever the camera goes
    sun.target.position.set(tx, 0, tz);
    sun.position.copy(sun.target.position).addScaledVector(SUN_DIR, 420);
    sun.target.updateMatrixWorld();
    composer.render();
  };
  const pv = new THREE.Vector3();
  const project = (p) => {
    pv.copy(p).project(camera);
    if (pv.z > 1) return null;
    return [(pv.x * 0.5 + 0.5) * size.w, (-pv.y * 0.5 + 0.5) * size.h];
  };
  return {renderer, scene, camera, composer, gtao, sun, resize, frame, project, size};
}
