// Pitline's world: the circuit, the pits, the paddock and the aero lab laid out, and the whole race posed as a function
// of time. pose(t) places every car from scratch (layout.js), runs the two pit stops (jacks and wheel machines in place
// of a crew: no people are built in this world), turns the wind tunnel's fan and belt and moves its smoke.
import * as THREE from 'three';
import {TOY, toyMat} from './style.js';
import {buildCircuitSurface, TRACK_HALF} from './track.js';
import {buildRaceCar, buildWheel, buildWheelCart, buildPitJack, buildPitLight, buildTyreRack, buildTeamTruck} from './cars.js';
import {buildPitBuilding, buildPitWall, buildPitWallStand, buildGrandstand, buildStartGantry, buildAeroLab, buildMotorhome, buildMarshalPost, buildToyTrees} from './circuit.js';
import {CARS, carAt, pitOf, track, PIT, TEAMS, GARAGE_X, START_X, DISPLAY, LAP, LAP_TIME, U_IN, U_OUT, DS, lapV} from './layout.js';

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const sm = (x) => {
  const u = clamp(x);
  return u * u * (3 - 2 * u);
};
const ss = (a, b, t) => sm((t - a) / (b - a));
const lerp = (a, b, k) => a + (b - a) * k;
const yawOf = (tx, tz) => Math.atan2(-tz, tx);

// where things stand
export const AERO = {x: -10, z: -158, yaw: 0}; // the aero lab: flow along -x through the test section
export const STAND_Z = -97; // the grandstand behind the back straight

/** the stationary sequence of a stop, in seconds after the car stops: jacks, the four wheels, the drop, the release */
export function stopPlan(still, slow = -1, extra = 0) {
  const W = [0, 1, 2, 3].map((i) => {
    const d = i === slow ? extra : 0;
    const j = [0.0, 0.04, 0.07, 0.02][i];
    return {off: [0.42 + j, 0.78 + j], shift: [0.8 + j, 1.08 + j + d * 0.5], on: [1.1 + j + d * 0.5, 1.48 + j + d], back: [1.52 + j + d, 1.78 + j + d]};
  });
  const done = Math.max(...W.map((w) => w.on[1]));
  return {wheels: W, lift: [0.18, 0.4], drop: [done + 0.06, done + 0.26], green: done + 0.5, still};
}

export function buildWorld() {
  const root = new THREE.Group();
  const objects = {};

  // the ground
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(3000, 3000).rotateX(-Math.PI / 2), toyMat(TOY.ground, {rough: 0.95}));
  ground.receiveShadow = true;
  root.add(ground);
  root.add(buildCircuitSurface());

  // the pit building, its garages centred on GARAGE_X
  const pb = buildPitBuilding({teams: TEAMS, bay: 30});
  const g2 = pb.garages[2].centre;
  pb.group.position.set(GARAGE_X[2] - g2.x, 0, PIT.front - g2.z);
  root.add(pb.group);
  objects.building = pb.group;

  // the pit wall between the fast lane and the track, the teams' stands on it
  const wall = buildPitWall({length: PIT.exitX - PIT.entryX + 20});
  wall.group.position.set(0, 0, PIT.wall);
  wall.group.rotation.y = Math.PI; // its catch fence (local -z) faces the track (+z)
  root.add(wall.group);
  const stands = {};
  TEAMS.forEach((team, i) => {
    const s = buildPitWallStand({team});
    s.group.position.set(GARAGE_X[i] + 6, 0, PIT.wall);
    root.add(s.group);
    stands[team] = s;
  });
  objects.wallStand = stands.halcyon;

  // the start gantry over the line, the grandstand behind the back straight, marshal posts
  const sl = track.at(0);
  const gantry = buildStartGantry({span: 2 * TRACK_HALF + 4});
  gantry.group.position.set(sl.x, 0, sl.z);
  gantry.group.rotation.y = Math.PI / 2; // its beam spans the track (z)
  root.add(gantry.group);
  objects.gantry = gantry;
  const stand = buildGrandstand({length: 90, rows: 8});
  stand.group.position.set(-80, 0, STAND_Z);
  root.add(stand.group);
  const stand2 = buildGrandstand({length: 60, rows: 6});
  stand2.group.position.set(60, 0, STAND_Z + 1);
  root.add(stand2.group);
  for (const [x, z, r] of [[-222, -40, Math.PI / 2], [214, -20, -Math.PI / 2], [150, 44, 0], [-120, 44, 0], [60, -86, Math.PI]]) {
    const m = buildMarshalPost();
    m.group.position.set(x, 0, z);
    m.group.rotation.y = r;
    root.add(m.group);
  }

  // the paddock: a motorhome and a transporter behind each garage
  TEAMS.forEach((team, i) => {
    const mh = buildMotorhome({team});
    mh.group.position.set(GARAGE_X[i], 0, -30);
    root.add(mh.group);
    const tr = buildTeamTruck({team});
    tr.group.position.set(GARAGE_X[i] + 2, 0, -46);
    root.add(tr.group);
  });

  // the aero lab across the road from the circuit
  const lab = buildAeroLab();
  lab.group.position.set(AERO.x, 0, AERO.z);
  lab.group.rotation.y = AERO.yaw;
  root.add(lab.group);
  objects.lab = lab;
  const model = buildRaceCar({team: 'halcyon', number: '9', compound: 'medium', scale: 0.6});
  lab.mount.add(model.group);
  objects.model = model;
  const smoke = buildSmoke(lab.flow, lab.mount.position.clone());
  lab.group.add(smoke.group);
  objects.smoke = smoke;

  // trees round the outside, a few in the paddock
  const trees = [];
  const r = (n) => {
    const x = Math.sin(n * 91.7 + 13.1) * 43758.5453;
    return x - Math.floor(x);
  };
  for (let i = 0; i < 70; i++) {
    const a = (i / 70) * Math.PI * 2;
    const x = 255 * Math.cos(a) + (r(i) - 0.5) * 30;
    const z = -20 + 150 * Math.sin(a) + (r(i + 50) - 0.5) * 24;
    // keep the camera side of the main straight open, and clear of the lab
    if (z > 30 && Math.abs(x) < 200) continue;
    if (Math.abs(x - AERO.x) < 60 && Math.abs(z - AERO.z) < 30) continue;
    trees.push({x, z, size: 0.9 + r(i + 7) * 0.5, kind: r(i + 3) > 0.75 ? 'bush' : 'tree'});
  }
  for (const [x, z] of [[-110, -30], [-104, -40], [100, -26], [108, -38], [-130, -50], [125, -50], [AERO.x - 52, AERO.z + 22], [AERO.x + 52, AERO.z + 22], [AERO.x - 60, AERO.z - 10], [AERO.x + 60, AERO.z - 6]]) trees.push({x, z, size: 1.1});
  root.add(buildToyTrees(trees));

  // the cars
  const cars = CARS.map((c) => {
    const o = buildRaceCar({team: c.team, number: c.number, compound: c.tyre});
    root.add(o.group);
    return {car: c, o};
  });
  for (const k of cars) objects[k.car.id] = k.o;

  // the two pit crews (the hero's at the Halcyon box, the rival's at Tidewater's), and tyre racks at every box
  const crews = {};
  for (const c of CARS.filter((x) => x.stop)) {
    const bx = GARAGE_X[TEAMS.indexOf(c.team)];
    const crew = {
      front: buildPitJack({end: 'front'}),
      rear: buildPitJack({end: 'rear'}),
      carts: [0, 1, 2, 3].map(() => buildWheelCart()),
      light: buildPitLight(),
      old: [0, 1, 2, 3].map((i) => buildWheel({compound: c.tyre, side: i % 2 ? -1 : 1})),
      fresh: [0, 1, 2, 3].map((i) => buildWheel({compound: c.stop.to, side: i % 2 ? -1 : 1})),
      bx,
    };
    for (const m of [crew.front, crew.rear, ...crew.carts]) root.add(m.group);
    crew.carts.forEach((cart, i) => {
      // the wheels ride the cradles with their axles along the cradle's axis (local x): turn them a quarter
      crew.old[i].group.rotation.y = Math.PI / 2;
      crew.fresh[i].group.rotation.y = Math.PI / 2;
      cart.slots[0].add(crew.old[i].group);
      cart.slots[1].add(crew.fresh[i].group);
    });
    crew.light.group.position.set(bx + 7.2, 0, PIT.front + 1.2);
    root.add(crew.light.group);
    crews[c.id] = crew;
  }
  GARAGE_X.forEach((x, i) => {
    for (const [dx, comp] of [[-9, 'medium'], [9, 'hard']]) {
      const rk = buildTyreRack({compound: comp, n: 4});
      rk.group.position.set(x + dx, 0, PIT.front + 1.4);
      root.add(rk.group);
    }
  });
  objects.crew = crews.c9;
  objects.crew3 = crews.c3;

  // ---- timing: race distance, gaps, positions (pure functions of t) ----
  const D = (car, t) => carAt(car, t).D;
  /** film time at which car reached race distance d (searching back up to 40 s) */
  const timeAtD = (car, d, t) => {
    let lo = t - 40;
    let hi = t;
    if (D(car, lo) > d) return null;
    for (let i = 0; i < 34; i++) {
      const m = (lo + hi) / 2;
      if (D(car, m) < d) lo = m;
      else hi = m;
    }
    return hi;
  };
  /** the timing gap from `car` back to the car ahead of it (scene seconds), or null */
  const gapAhead = (car, ahead, t) => {
    const ta = timeAtD(ahead, D(car, t), t);
    return ta == null ? null : t - ta;
  };
  const order = (t) =>
    CARS.map((c) => ({c, d: D(c, t)}))
      .sort((a, b) => b.d - a.d)
      .map((x) => x.c);

  // DRS: two zones, the main straight and the back straight. A car's flap opens in a zone when it crossed that zone's
  // detection line less than 1 s (as displayed) behind the car in front.
  const uOf = (x, z) => track.nearest(x, z) * DS;
  const DRS_ZONES = [
    {detect: uOf(-178, 26), from: uOf(-150, 28), to: uOf(118, 28)}, // the main straight, detection out of the last corner
    {detect: uOf(96, -63), from: uOf(-2, -68), to: uOf(-120, -71)}, // the back straight, detection before the chicane
  ];
  const inZone = (z, u) => (z.from <= z.to ? u >= z.from && u <= z.to : u >= z.from || u <= z.to);
  const drsMemo = new Map();
  const drsOpen = (car, t) => {
    const p = carAt(car, t);
    if (p.pit) return false;
    const zi = DRS_ZONES.findIndex((z) => inZone(z, p.u));
    if (zi < 0) return false;
    // the race distance at which it last crossed this zone's detection line: decided once, so it is remembered
    const det = DRS_ZONES[zi].detect;
    const dDet = Math.floor((p.D - det) / LAP) * LAP + det;
    const key = `${car.id}:${zi}:${dDet.toFixed(1)}`;
    if (drsMemo.has(key)) return drsMemo.get(key);
    const v = drsAt(car, dDet, t);
    drsMemo.set(key, v);
    return v;
  };
  const drsAt = (car, dDet, t) => {
    const tDet = timeAtD(car, dDet, t);
    if (tDet == null) return false;
    const ord = order(tDet);
    const i = ord.indexOf(car);
    if (i <= 0) return false;
    const g = gapAhead(car, ord[i - 1], tDet);
    return g != null && g * DISPLAY.gap < 1.0;
  };
  const drsK = (car, t) => {
    let k = 0;
    for (let i = 0; i < 6; i++) k += drsOpen(car, t - i * 0.05) ? 1 : 0;
    return sm(k / 6);
  };

  // ---- the smoke and the tunnel ----
  const beltSpeed = 22; // m/s of belt, scene

  // ---- the stop: poses of the crew machines for a car stationary at its box ----
  const outward = (i) => (i % 2 === 0 ? 1 : -1); // FL, RL on +z; FR, RR on -z (wheels 0 FL, 1 FR, 2 RL, 3 RR)
  const hubX = (i) => (i < 2 ? 2.6 : -2.6);
  const tmpV = new THREE.Vector3();
  const placeBySlot = (cart, slotIdx, target, yaw) => {
    cart.group.position.set(0, 0, 0);
    cart.group.rotation.set(0, yaw, 0);
    cart.group.updateMatrixWorld(true);
    cart.slots[slotIdx].getWorldPosition(tmpV);
    cart.group.position.set(target.x - tmpV.x, 0, target.z - tmpV.z);
  };
  const crewPose = (crew, car, o, t) => {
    const pc = pitOf(car);
    const plan = stopPlan(car.stop.still, car.id === 'c3' ? 0 : -1, car.id === 'c3' ? 0.5 : 0);
    const tau = t - pc.tStop0;
    const bx = crew.bx;
    const z0 = PIT.box;
    const stopped = tau >= 0 && tau < plan.still;
    // the lift: up over plan.lift, down over plan.drop
    const lift = stopped ? 0.32 * ss(plan.lift[0], plan.lift[1], tau) * (1 - ss(plan.drop[0], plan.drop[1], tau)) : 0;
    // the jacks: waiting in front and to the side behind; in under the car as it stops; away after the drop
    const fl = crew.front.length ?? 2.6;
    const rl = crew.rear.length ?? 2.6;
    const fIn = ss(-0.25, 0.15, tau) * (1 - ss(plan.drop[1], plan.drop[1] + 0.3, tau));
    const fAway = ss(plan.drop[1], plan.drop[1] + 0.3, tau);
    crew.front.group.rotation.y = Math.PI; // faces -x, toward the nose
    crew.front.group.position.set(bx + 4.2 + fl / 2 + 2.2 * (1 - fIn) * (1 - fAway), 0, z0 - 3.8 * fAway);
    crew.front.setLift(lift);
    const rIn = ss(-0.05, 0.3, tau) * (1 - ss(plan.drop[1], plan.drop[1] + 0.35, tau));
    crew.rear.group.rotation.y = 0; // faces +x, toward the tail
    crew.rear.group.position.set(bx - 4.0 - rl / 2 - 3.4 * (1 - rIn), 0, z0 - 3.6 * (1 - rIn));
    crew.rear.setLift(lift);
    // the wheel machines: each waits 1.4 m out from its corner, comes in, swaps, backs off
    for (let i = 0; i < 4; i++) {
      const w = plan.wheels[i];
      const cart = crew.carts[i];
      const side = outward(i);
      const yaw = side > 0 ? Math.PI / 2 : -Math.PI / 2; // face the car
      const inK = ss(-0.15, 0.25, tau) * (1 - ss(w.back[0], w.back[1], tau));
      const shift = ss(w.shift[0], w.shift[1], tau);
      cart.setShift(shift);
      const hubZ = z0 + side * (1.22 + 0.9);
      const target = {x: bx + hubX(i), z: hubZ + side * 1.4 * (1 - inK)};
      // with the cradles shifted, line up whichever slot is at the hub; place by slot a before the shift
      placeBySlot(cart, 0, target, yaw);
      // the shift moves the cradles, not the machine: undo the slide so the machine itself stays put
      if (shift > 0) {
        cart.setShift(0);
        placeBySlot(cart, 0, target, yaw);
        cart.setShift(shift);
      }
      const offK = ss(w.off[0], w.off[1], tau);
      const onK = ss(w.on[0], w.on[1], tau);
      // the old wheel rides the car until it is fully out, then cradle a; the new one rides cradle b until it goes on
      const swapped = tau >= w.off[1];
      const fresh = tau >= w.on[0];
      crew.old[i].group.visible = swapped;
      crew.fresh[i].group.visible = !fresh;
      o.setWheelVisible(i, !swapped || fresh);
      o.setCompound(i, fresh ? car.stop.to : car.tyre);
      o.setWheelOff(i, !swapped ? offK : !fresh ? 1 : 1 - onK);
    }
    crew.light.setLight(tau < plan.green && tau > -2 ? 'red' : tau >= plan.green && tau < plan.still + 1.2 ? 'green' : 'off');
    return {lift, tau, plan};
  };

  const pose = (t) => {
    const S = {t, cars: {}};
    for (const {car, o} of cars) {
      const p = carAt(car, t);
      let lift = 0;
      if (car.stop) {
        const pc = pitOf(car);
        const r = crewPose(crews[car.id], car, o, t);
        lift = r.lift;
        // after the stop the car carries its new tyres
        if (t >= pc.tStop1) for (let i = 0; i < 4; i++) o.setCompound(i, car.stop.to);
        S.cars[car.id + 'Stop'] = r;
      }
      o.group.position.set(p.x, lift, p.z);
      o.group.rotation.y = yawOf(p.tx, p.tz);
      // wheels: distance rolled; steering from the path's curvature
      o.roll(p.pit ? pitOf(car).Din + p.s : p.D);
      o.setSteer(clamp(Math.atan(5.2 * (p.k ?? 0)) * 1.6, -0.45, 0.45));
      o.setDRS(drsK(car, t));
      S.cars[car.id] = p;
    }
    // the start lights: dark during the race
    gantry.setLights(0);
    // the tunnel: the fan spins, the belt runs, the wing sweeps through a run
    lab.setFan(t * 7.5);
    lab.setBelt(t * beltSpeed);
    const sweep = aeroSweep(t);
    model.setDRS(sweep.k);
    model.roll(t * beltSpeed / 0.6);
    smoke.update(t, sweep.k);
    S.aero = sweep;
    return S;
  };

  // ---- anchors for tags and the camera, routes for the selection ribbon ----
  const at = (id, y = 2.4) => () => {
    const o = objects[id];
    return o.group.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, y, 0));
  };
  const anchors = {
    c9: at('c9'),
    c3: at('c3'),
    wall: () => new THREE.Vector3(GARAGE_X[2] + 6, 4.6, PIT.wall),
    box: () => new THREE.Vector3(GARAGE_X[2], 3.2, PIT.box),
    lab: () => lab.mount.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 2.4, 0)),
  };
  /** the route ahead of a car: its next 40 s of path, sampled on the ground */
  const routeAhead = (car, t, span = 9, step = 0.25) => {
    const pts = [];
    for (let k = 0; k <= span; k += step) {
      const p = carAt(car, t + k);
      pts.push(new THREE.Vector3(p.x, 0, p.z));
    }
    return pts;
  };
  const routes = {
    c9: (t) => routeAhead(CARS.find((c) => c.id === 'c9'), t),
    c3: (t) => routeAhead(CARS.find((c) => c.id === 'c3'), t),
  };

  return {root, objects, anchors, routes, pose, order, gapAhead, timeAtD, drsK, carById: (id) => CARS.find((c) => c.id === id), cars, crews, crewPose};
}

/** the wind tunnel's run: the rear flap sweeps from 0 to 1 and back, as a function of film time */
export function aeroSweep(t) {
  // one run of the sweep every 9 s: hold, open, hold, close
  const c = ((t % 9) + 9) % 9;
  const k = ss(1.2, 3.6, c) * (1 - ss(6.0, 8.4, c));
  // the numbers this wing angle gives (a simple aero map: lift and drag coefficients against flap angle)
  const angle = 4 + 26 * k; // degrees of flap
  const cl = 3.05 + 1.35 * k - 0.35 * k * k; // downforce coefficient
  const cd = 0.78 + 0.42 * k * k + 0.08 * k; // drag
  return {k, angle, cl, cd};
}

/** smoke in the tunnel: streamlines through the flow box, bending over the model, with puffs moving along them */
function buildSmoke(flow, mount) {
  const g = new THREE.Group();
  g.name = 'smoke';
  const {x0, x1, y0, y1, z0, z1} = flow;
  // the model sits on the mount, facing +x into the wind: offsets below are from its centre on the belt
  const xc = mount.x;
  const yb = mount.y;
  const zc = mount.z;
  const lines = [];
  const NY = 5;
  const NZ = 7;
  const zHalf = Math.min(2.4, (z1 - z0) / 2 - 0.2);
  const yTop = Math.min(2.2, y1 - yb - 0.2);
  for (let a = 0; a < NY; a++)
    for (let b = 0; b < NZ; b++) {
      const dy = lerp(0.18, yTop, a / (NY - 1));
      const dz = lerp(-zHalf, zHalf, b / (NZ - 1));
      lines.push({dy, dz, near: Math.abs(dz) < 1.0 && dy < 1.2});
    }
  // a streamline's height and sideways drift at x, for a flap setting k: up over the nose and the airbox, and thrown
  // up behind the car by the rear wing (more as the flap closes and the wing works harder)
  const shape = (L, x, k) => {
    const u = (x - xc) / 2.6; // the model is about 5 m long at 60% scale: u in -1..1 over the car
    const prox = Math.exp(-(L.dz * L.dz) / 1.4) * Math.exp(-Math.max(0, L.dy - 0.2) / 1.0);
    const over = 0.5 * Math.exp(-((u - 0.1) ** 2) / 0.45);
    const wake = (0.7 + 0.7 * (1 - k)) * clamp(-u - 0.75, 0, 2.5) * Math.exp(-Math.max(0, -u - 1.4) / 2.0);
    const up = prox * (over + wake * 0.8);
    const side = Math.sign(L.dz || 0.001) * 0.3 * Math.exp(-(u * u) / 0.9) * Math.exp(-(L.dz * L.dz) / 3);
    return [Math.min(yb + L.dy + up, y1 - 0.05), zc + L.dz + side];
  };
  const N = 60;
  const lineMat = new THREE.LineBasicMaterial({color: '#ffffff', transparent: true, opacity: 0.55, depthWrite: false});
  const lineMatNear = new THREE.LineBasicMaterial({color: TOY.blue, transparent: true, opacity: 0.7, depthWrite: false});
  const geos = [];
  for (const L of lines) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(N * 3), 3));
    const ln = new THREE.Line(geo, L.near ? lineMatNear : lineMat);
    ln.renderOrder = 6;
    g.add(ln);
    geos.push(geo);
  }
  // puffs: small soft capsules riding the lines downstream (toward -x)
  const PER = 7;
  const puff = new THREE.InstancedMesh(new THREE.SphereGeometry(0.11, 10, 8), new THREE.MeshBasicMaterial({color: '#ffffff', transparent: true, opacity: 0.9, depthWrite: false}), lines.length * PER);
  puff.renderOrder = 7;
  g.add(puff);
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const sc = new THREE.Vector3();
  const pv = new THREE.Vector3();
  return {
    group: g,
    update(t, k) {
      lines.forEach((L, li) => {
        const arr = geos[li].attributes.position.array;
        for (let i = 0; i < N; i++) {
          const x = lerp(x1, x0, i / (N - 1));
          const [y, z] = shape(L, x, k);
          arr[3 * i] = x;
          arr[3 * i + 1] = y;
          arr[3 * i + 2] = z;
        }
        geos[li].attributes.position.needsUpdate = true;
        for (let j = 0; j < PER; j++) {
          const f = (((t * 0.55 + j / PER + li * 0.137) % 1) + 1) % 1;
          const x = lerp(x1, x0, f);
          const [y, z] = shape(L, x, k);
          pv.set(x, y, z);
          const s = 0.7 + 0.8 * Math.sin(Math.PI * f);
          sc.set(s * 2.2, s, s);
          m4.compose(pv, q, sc);
          puff.setMatrixAt(li * PER + j, m4);
        }
      });
      puff.instanceMatrix.needsUpdate = true;
    },
  };
}

export {CARS, carAt, pitOf, track, PIT, TEAMS, GARAGE_X, START_X, DISPLAY, LAP, LAP_TIME, U_IN, U_OUT, DS, lapV};
