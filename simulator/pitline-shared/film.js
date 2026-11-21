// Pitline, the film: a race team's operations app over a toy circuit, cut the way the simulator skill's films are cut.
// One camera at one angle (azimuth 38, elevation 36) that only pans and zooms; the story moves through clicks and the
// site switcher's dropdown. Every number on screen is read from the scene.
//
//  0-5.8   Harbour Park, lap 31. Car 9 on the back straight, 0.5 s behind car 3. Click car 9: live telemetry. Click the
//          Halcyon pit wall: the strategy engine (strategy.js) has raced the rest of the race 12,600 times as the
//          page loaded, in a few tens of milliseconds, and calls BOX. Car 9 dives into the pits.
//  5.8-24  The camera rides car 9 down the pit lane. Click the box: four wheel machines and two jacks change the tyres
//          in 2.4 s. Car 9 rejoins in P7 on mediums.
//  21-31   The dropdown jumps to the aero lab: the 60% model on the rolling road, the rear flap sweeping, smoke over it.
//  31-43   Back to the pits: car 3 stops a lap later, loses 2.9 s with a slow front-left, and comes out of the pit lane
//          0.5 s behind car 9. The undercut worked.
//  43-46.7 Home: the whole circuit.
import * as THREE from 'three';
import {runFilm} from './runtime.js';
import {TOY, createToyStage} from './style.js';
import {createToyUI} from './ui.js';
import {createSelection} from './select.js';
import {thumb} from './thumbs.js';
import {buildRaceCar, buildPitJack} from './cars.js';
import {buildPitWallStand} from './circuit.js';
import {buildWorld, aeroSweep, AERO, stopPlan} from './world.js';
import {CARS, carAt, pitOf, DISPLAY, LAP, LAP_TIME, U_IN, U_OUT, lapT, RACE_LAP, PIT} from './layout.js';
import {tAt} from './race.js';
import {runStrategy} from './strategy.js';

export const DUR = 46.7;
const D2R = Math.PI / 180;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const sm = (x) => {
  const u = clamp(x);
  return u * u * u * (u * (u * 6 - 15) + 10);
};
const ss = (a, b, t) => sm((t - a) / (b - a));
const lerp = (a, b, k) => a + (b - a) * k;
const f2 = (n) => n.toFixed(2);
const lapStr = (s) => `${Math.floor(s / 60)}:${(s % 60).toFixed(3).padStart(6, '0')}`;
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const TYRE = {soft: TOY.soft, medium: TOY.medium, hard: '#c9d1ea'};

// the strategist in the top bar: initials, not a face
const AVATAR = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88 88"><rect width="88" height="88" fill="#3166ea"/><circle cx="44" cy="44" r="40" fill="#2448c8"/><text x="44" y="56" font-family="Inter,system-ui,sans-serif" font-size="32" font-weight="800" fill="#fff" text-anchor="middle">NH</text></svg>')}`;

export const UI_WORDS = {
  brand: 'Pitline',
  search: 'Search cars, laps, stints, sectors, runs...',
  user: ['Noor Haddad', 'Head of Strategy'],
  avatar: AVATAR,
  trackIcon: 'flag',
  dropTitle: 'RACE WEEKEND',
  kpis: [
    {ic: 'flag', k: 'Race lap', key: 'a', v: '31/52', d: '21 to go', s: 'Harbour Park'},
    {ic: 'gap', k: 'Car 9 to car 3', key: 'b', v: '0.85 s', d: 'behind', s: 'interval at the line'},
    {ic: 'tyre', k: 'Car 9 tyre life', key: 'c', v: '18%', d: 'Softs', s: '19 laps old'},
  ],
};

// the clicks: at an anchor in the scene, or at a point on the UI
const CLICKS = [
  {t: 1.0, at: 'c9', card: 'c9'},
  {t: 2.9, at: 'wall', card: 'strat'},
  {t: 6.5, at: 'c9', card: 'c9'},
  {t: 11.6, at: 'box', card: 'box'},
  {t: 18.6, at: 'c9', card: 'c9'},
  {t: 21.4, ui: [1167, 37], drop: 'open'},
  {t: 22.3, ui: [930, 186], card: 'aero', site: 'AERO'},
  {t: 25.6, at: 'lab', card: 'aero'},
  {t: 29.9, ui: [1167, 37], drop: 'open'},
  {t: 30.8, ui: [930, 140], card: 'box3', site: 'RACE'},
  {t: 36.9, at: 'c3', card: 'c3'},
  {t: 41.7, at: 'c9', card: 'c9'},
  {t: 43.3, ui: [1159, 275], tool: 6, card: 'c9'},
];
export const FILM_CLICKS = CLICKS.map((c) => c.t);
export const CHAPTERS = [
  [0, 'Box call'],
  [10.5, 'Pit stop'],
  [21.4, 'Aero lab'],
  [30.8, 'Undercut'],
];

const AZ = 38;
const EL = 36;
const KEYS = [
  {t: 0, x: 18, z: -24, d: 205},
  {t: 3.4, x: 4, z: -28, d: 198},
  {t: 11.0, x: -14, z: 10, d: 112},
  {t: 12.5, x: 0, z: 6, d: 64},
  {t: 15.9, x: 0, z: 6, d: 62},
  {t: 16.6, x: 18, z: 10, d: 96},
  {t: 22.4, x: 150, z: -56, d: 130},
  {t: 24.6, x: AERO.x, z: AERO.z, d: 78},
  {t: 30.6, x: AERO.x, z: AERO.z, d: 76},
  {t: 32.5, x: 30, z: 6, d: 70},
  {t: 35.7, x: 30, z: 6, d: 68},
  {t: 40.3, x: 176, z: -28, d: 118},
  {t: 43.3, x: 176, z: -30, d: 124},
  {t: DUR, x: -8, z: -40, d: 560},
];
// the camera rides a car: [car, t in (start, full), t out (start, end), distance]
const RIDES = [
  ['c9', 3.6, 4.7, 10.6, 11.6, 112],
  ['c9', 16.0, 17.0, 21.6, 22.6, 100],
  ['c3', 35.8, 36.6, 39.4, 40.4, 104],
];

const SITES = {
  RACE: ['R18', 'Harbour Park · Race', 'Lap 31/52 · 8 cars'],
  AERO: ['AERO', 'Aero lab · Tunnel 1', 'Run 214 · wing sweep'],
};
const DROP = [
  ['R18', 'Harbour Park · Race', 'Lap 31/52 · live', 60],
  ['AERO', 'Aero lab · Tunnel 1', 'Run 214 · 60% model', 72],
  ['SIM', 'Driver-in-loop simulator', 'Idle · next run 16:00', 12],
  ['HQ', 'Halcyon Technical Centre', '41 parts in build', 45],
];

export function runPitlineFilm() {
  return runFilm({duration: DUR, fps: 60, chapters: CHAPTERS, post: '/blog/pitline-race-strategy-simulator', title: 'Pitline · a race team simulator'}, async ({frame, canvas, capture}) => {
    const st = createToyStage(canvas, {fov: 28});
    const W = buildWorld();
    st.scene.add(W.root);
    const ui = createToyUI(frame, UI_WORDS);
    const sel = createSelection(st.scene, st);
    const resize = (pr) => st.resize(1600, 900, pr);

    const TH = {
      c9: thumb(buildRaceCar({team: 'halcyon', number: '9', compound: 'medium'}).group),
      c3: thumb(buildRaceCar({team: 'tidewater', number: '3', compound: 'medium'}).group),
      stand: thumb(buildPitWallStand({team: 'halcyon'}).group, {pad: 1.0}),
      jack: thumb(buildPitJack({end: 'front'}).group, {pad: 1.1}),
      model: thumb(buildRaceCar({team: 'halcyon', number: '9', compound: 'medium'}).group, {az: 70, el: 14}),
    };

    // the strategy engine runs once, as the page loads: the odds are seeded, the milliseconds are this machine's
    const STRAT = runStrategy({gap: (W.carById('c9').offset - W.carById('c3').offset) * DISPLAY.gap});
    const hero = W.carById('c9');
    const rival = W.carById('c3');
    const PH = pitOf(hero);
    const PR = pitOf(rival);
    const P = (id) => W.objects[id].group.getWorldPosition(new THREE.Vector3());

    // ---- the race, read from the scene ----
    // pit loss: the pit path's time minus the track's time over the stretch it bypasses (scene s, shown x DISPLAY.gap)
    const trackSpan = (tAt(lapT, U_OUT) - tAt(lapT, U_IN) + LAP_TIME) % LAP_TIME;
    const pitLoss = PH.t1 - PH.t0 - trackSpan;
    // the undercut: how far car 9 is ahead of car 3 when car 3 rejoins
    let heroAtExit = PR.t1;
    for (let t = PH.t1 + 5; t < PR.t1 + 3; t += 0.004) {
      const a = carAt(hero, t);
      if (!a.pit && ((a.u - U_OUT + LAP) % LAP) < 0.5) {
        heroAtExit = t;
        break;
      }
    }
    // margin: car 9's lead over car 3 as car 3 rejoins; gain: what the stops won it (it started 0.5 s behind)
    const margin = (PR.t1 - heroAtExit) * DISPLAY.gap;
    const undercut = margin + (hero.offset - rival.offset) * DISPLAY.gap;

    // the interval from car a back to car b (positive: a is behind b), scene seconds
    const interval = (a, b, t) => {
      const da = carAt(a, t).D;
      const db = carAt(b, t).D;
      if (da <= db) return t - (W.timeAtD(b, da, t) ?? t);
      return -(t - (W.timeAtD(a, db, t) ?? t));
    };
    const lastLap = (car, t) => {
      const d = carAt(car, t).D;
      const k = Math.floor(d / LAP);
      const t1 = W.timeAtD(car, k * LAP, t);
      const t0 = W.timeAtD(car, (k - 1) * LAP, t);
      return t1 != null && t0 != null ? (t1 - t0) * DISPLAY.lap : null;
    };
    const leaderLap = (t) => {
      const d = Math.max(...CARS.map((c) => carAt(c, t).D));
      const d0 = Math.max(...CARS.map((c) => carAt(c, 0).D));
      return RACE_LAP + Math.floor(d / LAP) - Math.floor(d0 / LAP);
    };
    const tyreOf = (car, t) => {
      const pc = pitOf(car);
      return pc && t >= pc.tStop0 + 1.2 ? car.stop.to : car.tyre;
    };
    const ageOf = (car, t) => {
      const pc = pitOf(car);
      if (pc && t >= pc.tStop0 + 1.2) return Math.max(0, leaderLap(t) - leaderLap(pc.tStop0));
      return {soft: 19, medium: 24, hard: 31}[car.tyre] + (leaderLap(t) - RACE_LAP);
    };

    // telemetry from a car's speed and acceleration
    const tele = (car, t) => {
      const p = carAt(car, t);
      const kmh = DISPLAY.kmh(p.v);
      const gear = p.v < 0.5 ? 'N' : String(clamp(1 + Math.floor((kmh - 30) / 42), 1, 8));
      const limiter = p.pit && p.v <= 30.5 && p.v > 0.5;
      const brake = p.a < -3 ? clamp(-p.a / 32) : 0;
      const throttle = p.v < 0.5 ? 0 : limiter ? 0.22 : brake > 0 ? 0 : p.a > 1 ? clamp(0.75 + p.a / 52) : p.v >= 77.5 ? 1 : 0.55;
      // the speed trace over the last 12 s
      const N = 72;
      let pts = '';
      for (let i = 0; i < N; i++) {
        const tt = t - 12 + (12 * i) / (N - 1);
        const v = DISPLAY.kmh(carAt(car, tt).v);
        pts += `${((320 * i) / (N - 1)).toFixed(1)},${(52 - (v / 340) * 48).toFixed(1)} `;
      }
      const trace = `<polyline points="${pts}" fill="none" stroke="#3166ea" stroke-width="2.2" stroke-linejoin="round"/><line x1="0" x2="320" y1="${(52 - (80 / 340) * 48).toFixed(1)}" y2="${(52 - (80 / 340) * 48).toFixed(1)}" stroke="#c9d1ea" stroke-dasharray="4 4"/>`;
      const drs = W.drsK(car, t) > 0.5;
      const pc = pitOf(car);
      const boxCall = car === hero && t > 3.5 && t < PH.t0 + 0.4;
      const chips = [
        ...(boxCall ? [['BOX BOX', 'warn']] : []),
        ...(limiter ? [['PIT LIMITER', 'on']] : []),
        ['DRS', drs ? 'on' : ''],
        [throttle >= 0.99 ? 'ERS deploy' : brake > 0.2 ? 'ERS harvest' : 'ERS balanced', ''],
      ];
      const comp = tyreOf(car, t);
      const fresh = pc && t >= pc.tStop1;
      const warm = fresh ? 70 + 24 * (1 - Math.exp(-(t - pc.tStop1) / 7)) : 0;
      const base = comp === 'soft' ? [105, 103, 99, 100] : [96, 95, 93, 94];
      const temps = base.map((b, i) => Math.round(fresh ? warm + [1.5, 0.5, -1, 0][i] : b + 1.5 * Math.sin(t * 0.9 + i)));
      const tyres = ['FL', 'FR', 'RL', 'RR'].map((k, i) => [k, `${temps[i]}°`, TYRE[comp]]);
      return {p, kmh, speed: Math.round(kmh), gear, throttle, brake, trace, traceLabel: 'last 12 s', chips, tyres, drs, limiter};
    };

    const order = (t) => W.order(t);
    const posOf = (car, t) => order(t).indexOf(car) + 1;

    const heroState = (t) => {
      if (t < 3.5) return ['Racing', `P${posOf(hero, t)} · DRS train behind car 3`, 'go'];
      if (t < PH.t0) return ['Box this lap', 'In-lap · pit entry in ' + Math.max(0, PH.t0 - t).toFixed(1) + ' s', 'wait'];
      if (t < PH.tStop0) return ['Pit lane', 'Limiter 80 km/h · to box 3', 'in'];
      if (t < PH.tStop1) return ['In box', 'Softs off · mediums on', 'wait'];
      if (t < PH.t1) return ['Pit lane', 'Released · pit exit ahead', 'in'];
      return ['Racing', `Out-lap on mediums · P${posOf(hero, t)}`, 'go'];
    };
    const stopClock = (pc, t) => clamp(t - pc.tStop0, 0, pc.tStop1 - pc.tStop0);

    const cardAt = (t, kind, t0) => {
      const pop = ss(t0, t0 + 0.35, t);
      if (kind === 'c9' || kind === 'c3') {
        const car = kind === 'c9' ? hero : rival;
        const T = tele(car, t);
        const [s, txt, cls] = car === hero ? heroState(t) : ['Racing', 'P' + posOf(rival, t), 'go'];
        const ord = order(t);
        const i = ord.indexOf(car);
        const ahead = ord[i - 1];
        const g = ahead ? interval(car, ahead, t) * DISPLAY.gap : 0;
        const ll = lastLap(car, t);
        return {
          pop, thumb: TH[kind], org: `${cap(car.team).toUpperCase()} · CAR ${car.number}`, title: `Car ${car.number}`,
          sub: `${cap(tyreOf(car, t))}s · ${ageOf(car, t)} laps · P${i + 1}`, stat: s, statCls: cls, statText: txt,
          prog: (carAt(car, t).D % LAP) / LAP, progText: `${Math.round((100 * (carAt(car, t).D % LAP)) / LAP)}%`,
          rows: [['Gap ahead', ahead ? `+${f2(Math.max(0, g))} s · car ${ahead.number}` : 'Leader'], ['Last lap', ll ? lapStr(ll) : '—']],
          tele: T,
        };
      }
      if (kind === 'strat') {
        // the card plays the run back: the count and the clock climb to the engine's real figures in half a second
        const k = clamp((t - t0) / 0.55);
        const ms = Math.round(STRAT.ms * k);
        const races = Math.round(STRAT.races * k);
        const done = k >= 1;
        const best = STRAT.best;
        return {
          pop, thumb: TH.stand, org: 'STRATEGY ENGINE · PIT WALL', title: 'Undercut on car 3', sub: 'Halcyon · car 9 · lap 31',
          stat: done ? best.name : 'Simulating', statCls: done ? 'go' : 'in', statText: done ? 'Window open for one lap' : `${races.toLocaleString('en-US')} races`,
          prog: k, progText: `${ms} ms`,
          rows: [['Pit loss', `${f2(pitLoss * DISPLAY.gap)} s`], ['Car 3 softs', '19 laps · cliff next lap']],
          strat: {
            ms: `${ms} ms`,
            runText: `<em>${races.toLocaleString('en-US')}</em> races to the flag, run in this page as it loaded`,
            options: STRAT.options.map((o) => [o.name, o.ahead >= 0.5 ? 'P3' : 'P4', o.ahead * k, o === best]),
            call: done ? 'BOX  BOX  ·  CAR 9' : 'COMPUTING…',
            callOn: done,
          },
        };
      }
      if (kind === 'box' || kind === 'box3') {
        const car = kind === 'box' ? hero : rival;
        const pc = pitOf(car);
        const plan = stopPlan(car.stop.still, car === rival ? 0 : -1, car === rival ? 0.5 : 0);
        const tau = t - pc.tStop0;
        const clk = stopClock(pc, t);
        const corners = ['FL', 'FR', 'RL', 'RR'].map((k, i) => [k, tau >= plan.wheels[i].on[1] ? cap(car.stop.to) : tau >= plan.wheels[i].off[0] ? 'Changing' : cap(car.tyre), tau >= plan.wheels[i].on[1]]);
        const nDone = corners.filter((c) => c[2]).length;
        const st = tau < 0 ? ['Car coming in', 'wait'] : tau < plan.still ? [tau >= plan.green ? 'Released' : 'In box', tau >= plan.green ? 'go' : 'wait'] : ['Released', 'go'];
        return {
          pop, thumb: TH.jack, org: `PIT BOX · ${car.team.toUpperCase()}`, title: `Box ${car === hero ? 3 : 4} · car ${car.number}`,
          sub: '2 jacks · 4 wheel machines', stat: st[0], statCls: st[1],
          statText: tau < 0 ? `Car ${car.number} arrives in ${Math.max(0, -tau).toFixed(1)} s` : `${cap(car.tyre)}s off · ${car.stop.to}s on`,
          prog: nDone / 4, progText: `${nDone}/4`,
          rows: [['Release', tau >= plan.green ? `Green at ${f2(plan.green)} s` : 'Red'], ['Lift', `${(carAt(car, t).pit && tau >= 0 && tau < plan.still ? 32 * ss(plan.lift[0], plan.lift[1], tau) * (1 - ss(plan.drop[0], plan.drop[1], tau)) : 0).toFixed(0)} cm`]],
          stop: {clock: `${f2(clk)} s`, clockText: tau >= plan.still ? 'stationary · released' : 'stationary', corners},
        };
      }
      // the wind tunnel
      const A = aeroSweep(t);
      const df = 450 * A.cl;
      const drag = 450 * A.cd;
      const run = ((t % 9) + 9) % 9 / 9;
      let path1 = '';
      let path2 = '';
      for (let i = 0; i <= 40; i++) {
        const k = i / 40;
        const cl = 3.05 + 1.35 * k - 0.35 * k * k;
        const cd = 0.78 + 0.42 * k * k + 0.08 * k;
        const x = (320 * i) / 40;
        path1 += `${x.toFixed(1)},${(66 - ((cl - 2.9) / 1.2) * 58).toFixed(1)} `;
        path2 += `${x.toFixed(1)},${(66 - ((cd - 0.7) / 0.62) * 58).toFixed(1)} `;
      }
      const mx = 320 * A.k;
      const chart = `<polyline points="${path1}" fill="none" stroke="#3166ea" stroke-width="2.4"/><polyline points="${path2}" fill="none" stroke="#ff8a3d" stroke-width="2.4"/><line x1="${mx.toFixed(1)}" x2="${mx.toFixed(1)}" y1="2" y2="68" stroke="#0f1730" stroke-width="1.4" stroke-dasharray="3 3"/><circle cx="${mx.toFixed(1)}" cy="${(66 - ((A.cl - 2.9) / 1.2) * 58).toFixed(1)}" r="4.5" fill="#3166ea" stroke="#fff" stroke-width="2"/><circle cx="${mx.toFixed(1)}" cy="${(66 - ((A.cd - 0.7) / 0.62) * 58).toFixed(1)}" r="4.5" fill="#ff8a3d" stroke="#fff" stroke-width="2"/>`;
      return {
        pop, thumb: TH.model, org: 'AERO LAB · TUNNEL 1', title: 'Run 214 · 60% model', sub: 'Rear wing sweep · 50 m/s · rolling road',
        stat: 'Running', statCls: 'go', statText: `Flap ${A.angle.toFixed(1)}° · yaw 0° · ride 30 mm`, prog: run, progText: `step ${1 + Math.floor(run * 6)}/6`,
        stats: [['Downforce', `${Math.round(df).toLocaleString('en-US')} kg`, 'at 250 km/h', A.cl / 4.2], ['Drag', `${Math.round(drag)} kg`, 'at 250 km/h', A.cd / 1.4, 1], ['Efficiency', (A.cl / A.cd).toFixed(2), 'L/D'], ['Balance', `${(41.8 + 2.6 * A.k).toFixed(1)}%`, 'front']],
        aero: {chart, chartLabel: 'flap 4° → 30°'},
        rows: [],
      };
    };

    const selection = (t) => {
      let cur = {kind: 'c9', t0: -1};
      for (const c of CLICKS) if (c.card && t >= c.t) cur = {kind: c.card, t0: c.t};
      return cur;
    };
    const siteAt = (t) => {
      let s = 'RACE';
      for (const c of CLICKS) if (c.site && t >= c.t) s = c.site;
      return s;
    };
    const SEL_OBJ = {c9: () => W.objects.c9.group, c3: () => W.objects.c3.group, strat: () => W.objects.wallStand.group, box: () => W.objects.c9.group, box3: () => W.objects.c3.group, aero: () => W.objects.model.group};
    const SEL_TEXT = (kind, t) => {
      if (kind === 'c9' || kind === 'c3') {
        const car = kind === 'c9' ? hero : rival;
        return [`Car ${car.number}`, `${Math.round(DISPLAY.kmh(carAt(car, t).v))} km/h`];
      }
      if (kind === 'strat') return ['Pit wall', 'Strategy'];
      if (kind === 'box') return ['Box 3', `${f2(stopClock(PH, t))} s`];
      if (kind === 'box3') return ['Box 4', `${f2(stopClock(PR, t))} s`];
      return ['Run 214', `Flap ${aeroSweep(t).angle.toFixed(0)}°`];
    };
    const ANCHOR = {c9: 'c9', c3: 'c3', strat: 'wall', box: 'box', box3: 'c3', aero: 'lab'};
    const ROUTE = {c9: (t) => W.routes.c9(t), c3: (t) => W.routes.c3(t)};

    const keyCam = (t) => {
      let i = 0;
      while (i < KEYS.length - 2 && KEYS[i + 1].t <= t) i++;
      const a = KEYS[i];
      const b = KEYS[i + 1];
      const k = ss(a.t, b.t, t);
      const far = Math.hypot(b.x - a.x, b.z - a.z);
      const arc = far > 80 ? 0.45 * Math.sin(Math.PI * k) : 0;
      return {x: lerp(a.x, b.x, k), z: lerp(a.z, b.z, k), d: lerp(a.d, b.d, k) * (1 + arc)};
    };
    const camAt = (t) => {
      const c = keyCam(t);
      for (const [id, i0, i1, o0, o1, d] of RIDES) {
        const w = ss(i0, i1, t) * (1 - ss(o0, o1, t));
        if (w <= 0) continue;
        const p = carAt(W.carById(id), t);
        c.x = lerp(c.x, p.x + 2, w);
        c.z = lerp(c.z, p.z + 2, w);
        c.d = lerp(c.d, d, w);
      }
      return c;
    };

    const proj = (v) => st.project(v);
    const targetOf = (c) => (c.ui ? c.ui : proj(W.anchors[c.at]()) ?? [800, 450]);
    const GLIDE = 0.9;
    // where the cursor rests after the clicks up to t: on a UI point, or riding the scene object it clicked
    const restAt = (t) => {
      let last = null;
      for (const c of CLICKS) if (t >= c.t) last = c;
      if (!last) return {p: [1050, 620], hand: true};
      if (last.ui) return {p: last.ui, hand: false};
      const p = proj(W.anchors[last.at]());
      return {p: p ? [p[0] + 6, p[1] + 26] : [800, 450], hand: true};
    };
    const cursorAt = (t) => {
      const next = CLICKS.find((c) => c.t > t);
      if (next && t > next.t - GLIDE) {
        const from = restAt(next.t - GLIDE).p;
        const to = targetOf(next);
        const k = sm((t - (next.t - GLIDE)) / GLIDE);
        return {p: [lerp(from[0], to[0], k), lerp(from[1], to[1], k) - 16 * Math.sin(Math.PI * k)], hand: !next.ui};
      }
      return restAt(t);
    };
    const clickAt = (t) => {
      let v = 0;
      for (const c of CLICKS) if (t >= c.t && t < c.t + 0.7) v = Math.max(v, 1 - (t - c.t) / 0.7);
      return v;
    };
    const dropOpen = (t) => {
      let o = 0;
      for (let i = 0; i < CLICKS.length; i++) {
        const c = CLICKS[i];
        if (c.drop !== 'open') continue;
        const close = CLICKS[i + 1]?.t ?? c.t + 1;
        o = Math.max(o, ss(c.t, c.t + 0.3, t) * (1 - ss(close + 0.05, close + 0.3, t)));
      }
      return o;
    };

    const kpiFor = (t) => {
      const lap = leaderLap(t);
      const g = interval(hero, rival, t) * DISPLAY.gap;
      const behind = g > 0;
      const pc = PH;
      const fresh = t >= pc.tStop0 + 1.2;
      const life = fresh ? Math.max(92, 100 - Math.round((t - pc.tStop1) * 0.25)) : Math.max(9, Math.round(18 - t * 0.35));
      return {
        a: [`${lap}/52`, `${52 - lap} to go`, `Harbour Park · ${((LAP * DISPLAY.km) / 1000).toFixed(2)} km`, 'flat'],
        b: [`${f2(Math.abs(g))} s`, behind ? 'behind' : 'ahead', t > PR.t1 ? 'undercut complete' : t > PH.t0 ? 'through the stops' : 'interval at the line', behind ? 'down' : 'up'],
        c: [`${life}%`, fresh ? 'Mediums' : 'Softs', fresh ? 'new set' : `${ageOf(hero, t)} laps old`, fresh ? 'up' : 'down'],
      };
    };
    const STEPS = [
      ['Box call', 'radio'],
      ['Pit entry', 'entry'],
      ['Stationary', 'wrench'],
      ['Pit exit', 'exit'],
      ['Undercut', 'flag'],
    ];
    const trackFor = (t) => {
      const ev = [3.5, PH.t0, PH.tStop0, PH.t1, PR.t1];
      const ends = [PH.t0, PH.tStop0, PH.tStop1, PH.t1 + 0.6, PR.t1 + 0.6];
      const stt = (i) => (t >= ends[i] ? 'done' : t >= ev[i] ? 'on' : '');
      const sub = [
        t >= 3.5 ? `Lap 31 · ${Math.round(STRAT.ms)} ms` : 'waiting',
        `${t >= PH.t0 ? '80 km/h' : 'end of lap 31'}`,
        t >= PH.tStop0 ? `${f2(stopClock(PH, t))} s` : '2.40 s plan',
        t >= PH.t1 ? `rejoined P${posOf(hero, PH.t1 + 0.05)}` : 'rejoin P7',
        t >= PR.t1 ? `+${f2(margin)} s on car 3` : 'car 3 pits lap 32',
      ];
      let fill = 0;
      for (let i = 0; i < 5; i++) if (t >= ev[i]) fill = i / 4 + 0.25 * clamp((t - ev[i]) / (ends[i] - ev[i]));
      const [s, txt, cls] = heroState(t);
      return {
        title: 'Pit Stop Tracking',
        meta: 'Car 9 · Halcyon',
        fill: clamp(fill),
        steps: STEPS.map(([n, ic], i) => [n, sub[i], ic, stt(i)]),
        ship: {thumb: TH.c9, id: 'Car 9 · Halcyon', to: 'Softs → mediums · undercut on car 3', stat: s, statCls: cls, meta: txt},
      };
    };
    const tableFor = (t) => {
      const ord = order(t);
      const h = ord.indexOf(hero);
      const from = clamp(h - 1, 0, ord.length - 4);
      const rows = ord.slice(from, from + 4).map((car, j) => {
        const i = from + j;
        const p = carAt(car, t);
        const ahead = ord[i - 1];
        const g = ahead ? interval(car, ahead, t) * DISPLAY.gap : 0;
        const ll = lastLap(car, t);
        return {
          id: `P${i + 1} · #${car.number}`,
          org: cap(car.team),
          dot: TYRE[tyreOf(car, t)],
          where: p.pit ? 'Pit lane' : `${cap(tyreOf(car, t))} · ${ageOf(car, t)} laps`,
          stat: p.pit ? 'PIT' : ahead ? `+${f2(Math.max(0, g))}` : 'Leader',
          cls: p.pit ? 'wait' : car === hero ? 'go' : 'in',
          p: null,
          pt: ll ? lapStr(ll).slice(0, 8) : '',
        };
      });
      const stops = CARS.filter((c) => pitOf(c) && t >= pitOf(c).t0).length;
      return {tabs: [['Timing', String(CARS.length)], ['Tyres', '3'], ['Pits', String(stops)]], active: 0, site: `Lap ${leaderLap(t)}/52`, rows};
    };
    const underUI = ([x, y]) => (x > 1130 && y < 560) || (x > 1080 && y > 620) || (x < 1000 && y > 720) || (x < 780 && y < 185);
    const pinsAt = (t, kind) => {
      const out = [];
      const pin = (v, a = 1) => {
        const s = proj(v);
        if (s && s[0] > 20 && s[0] < 1580 && s[1] > 80 && s[1] < 880 && !underUI(s)) out.push({kind: 'pin', x: s[0], y: s[1], a});
      };
      if (t < 10.6 && kind !== 'box') pin(new THREE.Vector3(0, 3.5, PIT.box));
      if (t > 26 && t < 30.8) pin(new THREE.Vector3(30, 3.5, PIT.box));
      return out;
    };

    window.PITLINE = {st, W, camAt, CLICKS, pitLoss, undercut, heroAtExit, STRAT};
    return {
      resize,
      render(t) {
        W.pose(t);
        const s = selection(t);
        const site = siteAt(t);
        const obj = SEL_OBJ[s.kind]?.();
        const fadeIn = ss(s.t0, s.t0 + 0.3, t);
        sel.box(obj ?? null, fadeIn);
        const rf = ROUTE[s.kind];
        sel.route(rf ? rf(t) : null, ss(s.t0, s.t0 + 0.9, t), 1);
        sel.update();
        const c = camAt(t);
        st.frame({tx: c.x, ty: 1.0, tz: c.z, az: AZ * D2R, el: EL * D2R, d: c.d, fov: 28, sx: -110, sy: 26});
        const tags = pinsAt(t, s.kind);
        if (obj) {
          const a = proj(W.anchors[ANCHOR[s.kind]]());
          const [txt, sub] = SEL_TEXT(s.kind, t);
          if (a && !underUI(a)) tags.push({kind: 'sel', x: a[0], y: a[1], text: txt, sub, a: fadeIn});
        }
        const cur = cursorAt(t);
        let tool = -1;
        for (const cl of CLICKS) if (cl.tool != null && t >= cl.t && t < cl.t + 0.6) tool = cl.tool;
        const hh = 14 + Math.floor((31 + t / 6) / 60);
        const mm = Math.floor(31 + t / 6) % 60;
        ui.update({
          clock: `${hh}:${String(mm).padStart(2, '0')}`,
          site: SITES[site],
          kpi: kpiFor(t),
          card: cardAt(t, s.kind, s.t0),
          track: trackFor(t),
          table: tableFor(t),
          drop: {open: dropOpen(t), sites: DROP, on: t > 22.0 && t < 30.9 ? 1 : 0},
          tool,
          tags,
          cursor: cur.p,
          hand: cur.hand,
          click: clickAt(t),
        });
        return {};
      },
    };
  });
}
