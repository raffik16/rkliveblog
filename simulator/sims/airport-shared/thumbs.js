// Card thumbnails for the toy airport UI: the reference's detail card shows a small 3D render of the selected
// truck. thumb(group) renders a model alone on a transparent square from the reference's angle and returns a data URL; one
// offscreen renderer serves them all.
import * as THREE from 'three';

let R = null;
export function thumb(group, {size = 160, az = 38, el = 26, pad = 1.18} = {}) {
  if (!R) {
    const canvas = document.createElement('canvas');
    const renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: true, preserveDrawingBuffer: true});
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 0.95;
    const scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight('#f3f6ff', '#c7d0ee', 1.3));
    const sun = new THREE.DirectionalLight('#ffffff', 2.2);
    sun.position.set(-4, 8, 5);
    scene.add(sun);
    R = {renderer, scene, camera: new THREE.PerspectiveCamera(24, 1, 0.1, 2000)};
  }
  const {renderer, scene, camera} = R;
  renderer.setSize(size, size, false);
  renderer.setClearColor(0x000000, 0);
  const holder = new THREE.Group();
  holder.add(group);
  scene.add(holder);
  group.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(group);
  const c = box.getCenter(new THREE.Vector3());
  const r = box.getSize(new THREE.Vector3()).length() / 2;
  const d = (r * pad) / Math.sin((camera.fov * Math.PI) / 360);
  const A = (az * Math.PI) / 180;
  const E = (el * Math.PI) / 180;
  camera.position.set(c.x + d * Math.cos(E) * Math.sin(A), c.y + d * Math.sin(E), c.z + d * Math.cos(E) * Math.cos(A));
  camera.lookAt(c);
  renderer.render(scene, camera);
  const url = renderer.domElement.toDataURL('image/png');
  scene.remove(holder);
  return url;
}
