// The circuit kit's bench: every model in circuit.js on the ground under the stage, for stills. Copied from
// pitline-bench. Config (capture.mjs --config f.json):
//   {"cam": {"x", "z", "d", "az", "el", "ty"}, "show": "all" | "pit" | "wall" | "stand" | "grand" | "gantry" | "aero" |
//    "motor" | "marshal", "lights": n, "fan": rad, "belt": m}
// "all" lays the kit out roughly as the world does (pits facing +z, the track beyond the pit wall, the paddock and the
// aero lab behind); any other value puts that one model alone at the origin.
import * as THREE from 'three';
import {runSim} from 'simulator-kit/runtime.js';
import {TOY, createToyStage, toyMat, rbox, mesh} from '../pitline-shared/style.js';
import {buildPitBuilding, buildPitWall, buildPitWallStand, buildGrandstand, buildStartGantry, buildAeroLab, buildMotorhome, buildMarshalPost, buildToyTrees} from '../pitline-shared/circuit.js';

const D2R = Math.PI / 180;
const TEAMS = ['vela', 'northwind', 'halcyon', 'tidewater', 'kite'];

/** a stand-in for the 60% model in the tunnel (the real car is cars.js): wheels on the belt, nose to +x */
function placeholderCar(s = 0.6) {
  const g = new THREE.Group();
  const body = toyMat(TOY.blue, {paint: true});
  const dark = toyMat(TOY.navy, {rough: 0.8});
  g.add(mesh(rbox(7.6 * s, 0.5 * s, 1.0 * s, 0.2 * s), body, 0.2 * s, 0.55 * s, 0));
  g.add(mesh(rbox(1.2 * s, 0.12 * s, 2.6 * s, 0.05 * s), body, 4.0 * s, 0.25 * s, 0));
  g.add(mesh(rbox(0.8 * s, 0.4 * s, 2.0 * s, 0.05 * s), body, -3.4 * s, 1.3 * s, 0));
  g.add(mesh(rbox(1.0 * s, 0.6 * s, 0.6 * s, 0.2 * s), body, -0.6 * s, 1.25 * s, 0));
  for (const x of [2.6, -2.6])
    for (const z of [1.22, -1.22]) {
      const w = mesh(new THREE.CylinderGeometry(0.62 * s, 0.62 * s, 0.6 * s, 24).rotateX(Math.PI / 2), dark, x * s, 0.62 * s, z * s);
      g.add(w);
    }
  return g;
}

runSim({duration: 10, fps: 60, theme: 'light', hud: {enabled: false, title: 'bench', subtitle: ''}, director: {enabled: false}}, async ({cfg, canvas, capture}) => {
  const app = document.getElementById('app');
  const st = createToyStage(canvas, {fov: 28});
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(3000, 3000).rotateX(-Math.PI / 2), toyMat(TOY.ground, {rough: 0.95}));
  ground.receiveShadow = true;
  st.scene.add(ground);
  const show = cfg.show || 'all';
  const strip = (w, d, x, z, color) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d).rotateX(-Math.PI / 2), toyMat(color, {rough: 0.9}));
    m.position.set(x, 0.01, z);
    m.receiveShadow = true;
    st.scene.add(m);
  };
  const place = (o, x = 0, z = 0, ry = 0) => {
    o.position.set(x, 0, z);
    o.rotation.y = ry;
    st.scene.add(o);
    return o;
  };
  let lab = null;
  let gantry = null;
  if (show === 'all') {
    strip(400, 19, 0, 9.5, TOY.asphaltPit);
    strip(400, 14, 0, 28, TOY.asphalt);
    const pb = buildPitBuilding({teams: TEAMS, bay: 30});
    const g2 = pb.garages[2].centre;
    place(pb.group, -g2.x, 0);
    place(buildPitWall({length: 260}).group, 0, 18.8, Math.PI);
    pb.garages.forEach((g, i) => place(buildPitWallStand({team: g.team}).group, g.centre.x - g2.x + 6, 18.8));
    gantry = buildStartGantry({span: 18});
    place(gantry.group, -60, 28, Math.PI / 2);
    place(buildGrandstand({length: 90, rows: 8}).group, -40, 46);
    place(buildMarshalPost().group, 110, 38);
    TEAMS.forEach((t, i) => place(buildMotorhome({team: t}).group, -60 + 30 * i, -30));
    lab = buildAeroLab();
    place(lab.group, -10, -80);
    st.scene.add(buildToyTrees([[-100, -28], [-106, -40], [96, -26], [104, -38], [-60, -100], [40, -100], [30, -64], [-48, -60], [140, 46], [150, 40]].map(([x, z], i) => ({x, z, size: 1.1, kind: i % 4 === 3 ? 'bush' : 'tree'}))));
  } else if (show === 'pit') {
    strip(220, 19, 0, 9.5, TOY.asphaltPit);
    const pb = buildPitBuilding({teams: TEAMS, bay: 30});
    place(pb.group);
    // a box marker at each garage centre
    for (const g of pb.garages) st.scene.add(mesh(rbox(0.6, 0.06, 0.6, 0.02), toyMat(TOY.red), g.centre.x, 0.03, g.centre.z + 5.5));
  } else if (show === 'wall') {
    strip(60, 8, 0, -4, TOY.asphalt);
    place(buildPitWall({length: 40}).group);
    place(buildPitWallStand({team: 'halcyon'}).group, -8, 0, Math.PI);
    place(buildPitWallStand({team: 'kite'}).group, 6, 0, Math.PI);
  } else if (show === 'stand') {
    place(buildPitWall({length: 30}).group, 0, 0, Math.PI);
    place(buildPitWallStand({team: 'halcyon'}).group, -5, 0);
    place(buildPitWallStand({team: 'vela'}).group, 5, 0);
  } else if (show === 'grand') {
    place(buildGrandstand({length: 80, rows: 8}).group);
  } else if (show === 'gantry') {
    strip(18, 60, 0, 0, TOY.asphalt);
    gantry = buildStartGantry({span: 18});
    place(gantry.group);
  } else if (show === 'aero') {
    lab = buildAeroLab();
    place(lab.group);
  } else if (show === 'motor') {
    TEAMS.forEach((t, i) => place(buildMotorhome({team: t}).group, -50 + 25 * i, 0));
  } else if (show === 'marshal') {
    place(buildMarshalPost().group);
  }
  if (lab) {
    lab.mount.add(placeholderCar(0.6));
    lab.setFan(cfg.fan ?? 0.3);
    lab.setBelt(cfg.belt ?? 0);
  }
  if (gantry) gantry.setLights(cfg.lights ?? 3);
  // --config {"stats": true}: draw calls and triangles per top-level model, printed through console.error
  if (cfg.stats) {
    const rows = [];
    for (const o of st.scene.children) {
      let calls = 0;
      let tris = 0;
      o.traverse((m) => {
        if (!m.isMesh || !m.visible) return;
        calls++;
        const g = m.geometry;
        const n = (g.index ? g.index.count : g.attributes.position.count) / 3;
        tris += n * (m.isInstancedMesh ? m.count : 1);
      });
      if (calls) rows.push(`${o.name || o.type}: ${calls} calls, ${Math.round(tris / 1000)}k tris`);
    }
    console.error('stats\n' + rows.join('\n'));
  }
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
