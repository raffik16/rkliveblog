// Agent B's bench: every model of cars.js on the ground under the stage, and a pit stop that checks the fit (a car
// jacked 0.32 on its front and rear jacks, four wheel carts presenting wheels on the hub axes, one wheel slid off).
// {"cam": {"x", "z", "d", "az", "el", "ty"}} in a --config file moves the camera for close-ups.
import * as THREE from 'three';
import {runSim} from 'simulator-kit/runtime.js';
import {TOY, createToyStage, toyMat} from '../pitline-shared/style.js';
import {buildRaceCar, buildWheel, buildWheelCart, buildPitJack, buildPitLight, buildTyreRack, buildTeamTruck} from '../pitline-shared/cars.js';

const D2R = Math.PI / 180;
const PI = Math.PI;
runSim({duration: 10, fps: 60, theme: 'light', hud: {enabled: false, title: 'bench', subtitle: ''}, director: {enabled: false}}, async ({cfg, canvas, capture}) => {
  const app = document.getElementById('app');
  const st = createToyStage(canvas, {fov: 28});
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000).rotateX(-Math.PI / 2), toyMat(TOY.ground, {rough: 0.95}));
  ground.receiveShadow = true;
  st.scene.add(ground);
  const add = (o, x, z, ry = 0, y = 0) => {
    o.position.set(x, y, z);
    o.rotation.y = ry;
    st.scene.add(o);
    return o;
  };

  // ---------------------------------------------------------------- the pit stop at the origin
  const car = buildRaceCar({team: 'halcyon', number: '9', compound: 'soft'});
  add(car.group, 0, 0, 0, 0.32);
  car.group.updateMatrixWorld(true);
  const fj = buildPitJack({end: 'front'});
  add(fj.group, 4.2 + fj.length / 2, 0, PI);
  fj.setLift(0.44);
  const rj = buildPitJack({end: 'rear'});
  add(rj.group, -4.0 - rj.length / 2, 0);
  rj.setLift(0.44);
  // a cart per corner: facing the hub along -n, its origin at hub + n * (0.9 + slotX), cradle at the jacked hub height
  const carts = [];
  for (let i = 0; i < 4; i++) {
    const s = i % 2 ? 1 : -1;
    const h = car.hubWorld(i);
    const cart = buildWheelCart();
    add(cart.group, h.x, h.z + s * (0.9 + cart.slotX), s * PI / 2);
    cart.setCradle(h.y);
    carts.push(cart);
  }
  // FR (1): the car's own wheel slid off into the empty slot a on the centreline; the new wheel waits in slot b
  car.setWheelOff(1, 1);
  carts[1].slots[1].add(buildWheel({compound: 'medium', front: true}).group);
  // FL (0): the old wheel is in slot a, the cart has shifted the new wheel onto the hub axis, the car's wheel is gone
  car.setWheelVisible(0, false);
  car.setWheelOff(0, 1);
  carts[0].slots[0].add(buildWheel({compound: 'soft', front: true}).group);
  carts[0].slots[1].add(buildWheel({compound: 'medium', front: true}).group);
  carts[0].setShift(1);
  // RL (2): half way out; RR (3): still on, slot a waiting
  car.setWheelOff(2, 0.5);
  carts[2].slots[1].add(buildWheel({compound: 'medium'}).group);
  carts[3].slots[1].add(buildWheel({compound: 'medium'}).group);
  const light = buildPitLight();
  add(light.group, 6.4, -2.4);
  light.setLight('red');

  // ---------------------------------------------------------------- the grid of liveries behind it
  const teams = [['halcyon', '6', 'medium'], ['tidewater', '14', 'hard'], ['vela', '27', 'soft'], ['northwind', '3', 'medium'], ['kite', '81', 'hard']];
  teams.forEach(([team, number, compound], k) => {
    const c = buildRaceCar({team, number, compound});
    add(c.group, -24 + k * 12, -14);
    if (team === 'tidewater') c.setDRS(1);
    if (team === 'vela') c.setSteer(0.35);
    c.roll(0.7 * k);
  });
  if (cfg.check) {
    const c = buildRaceCar({});
    c.group.updateMatrixWorld(true);
    const b = new THREE.Box3();
    c.group.traverse((o) => {
      if (o.isMesh && !o.material.transparent) b.expandByObject(o);
    });
    const r = (v) => [v.x, v.y, v.z].map((n) => n.toFixed(3)).join(', ');
    console.error('car box min', r(b.min), 'max', r(b.max));
    const m = buildRaceCar({scale: 0.6});
    console.error('hub(1)', r(m.hub(1)), 'hubWorld(1) at 0.6', r(m.hubWorld(1)), 'length', m.length);
    // the nose underside and the rear crash structure underside on the centreline: cast rays up
    const ray = new THREE.Raycaster();
    for (const x of [4.2, -4.0, 2.6]) {
      ray.set(new THREE.Vector3(x, -1, 0), new THREE.Vector3(0, 1, 0));
      const hit = ray.intersectObject(c.group, true).find((h) => !h.object.material.transparent);
      console.error('underside at x =', x, 'y =', hit && hit.point.y.toFixed(3));
    }
    ray.set(new THREE.Vector3(0.3, 5, 0), new THREE.Vector3(0, -1, 0));
    for (const x of [0.6, -0.3, -3.4]) {
      ray.set(new THREE.Vector3(x, 5, 0), new THREE.Vector3(0, -1, 0));
      const hit = ray.intersectObject(c.group, true).find((h) => !h.object.material.transparent);
      console.error('top at x =', x, 'y =', hit && hit.point.y.toFixed(3));
    }
  }
  const model = buildRaceCar({team: 'halcyon', number: '9', compound: 'medium', scale: 0.6});
  add(model.group, 34, -14);

  // ---------------------------------------------------------------- the equipment in front
  let x = -24;
  for (const c of ['soft', 'medium', 'hard']) {
    add(buildWheel({compound: c}).group, x, 12, 0, 0.62);
    add(buildWheel({compound: c, front: true}).group, x + 1.6, 12, 0, 0.62);
    x += 4;
  }
  for (const c of ['soft', 'medium', 'hard']) {
    add(buildTyreRack({compound: c, n: 4}).group, x + 1.6, 12);
    x += 4.4;
  }
  const j1 = buildPitJack({end: 'front'});
  add(j1.group, x + 1, 12);
  const j2 = buildPitJack({end: 'rear'});
  add(j2.group, x + 1, 14);
  j2.setLift(0.44);
  x += 4;
  const cart = buildWheelCart();
  add(cart.group, x + 1.5, 12.5);
  cart.slots[1].add(buildWheel({compound: 'hard'}).group);
  cart.setShift(0.5);
  cart.setCradle(0.94);
  x += 5;
  const l2 = buildPitLight();
  add(l2.group, x, 12);
  l2.setLight('green');
  const l3 = buildPitLight();
  add(l3.group, x + 1.5, 12);
  l3.setLight('off');

  const truck = buildTeamTruck({team: 'halcyon'});
  add(truck.group, -6, -30);
  const truck2 = buildTeamTruck({team: 'kite'});
  add(truck2.group, 16, -30);
  truck2.setSteer(0.3);

  // the camera: {"cam": {"x": 0, "z": 0, "d": 60, "az": 38, "el": 36, "ty": 1}} in a file passed to capture.mjs
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
