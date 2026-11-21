// Pitline's circuit and race: the layout, the pace, the eight cars and their pit stops, all as pure functions of time.
// No three.js here (world.js builds the scene from it; the collision sweep and the checks in Node read it directly).
//
// Harbour Park, lap 31 of 52. Car 9 (Halcyon, the hero) runs P4, 0.3 s behind car 3 (Tidewater). The strategy call
// boxes car 9 a lap early: the undercut. It stops in front of the Halcyon garage, takes mediums and rejoins. Car 3
// stays out a lap on worn softs, pits a lap later, loses a little more in a slower stop, and comes out of the pit lane
// just behind car 9.
//
// Scene units are metres and seconds. The circuit is a toy: about 0.9 km a lap and 18.4 s round, so the numbers the UI
// shows are read from the scene through fixed maps (DISPLAY below), the same way the other films print km/h and ETAs.

import {catmull, makePath, profile, timeTable, sAt, tAt, DS} from './race.js';

export {DS};

// the cars' pace on the toy circuit
export const PACE = {vtop: 78, alat: 40, acc: 13, brk: 32, pit: 30};

// what the UI prints, read from the scene
export const DISPLAY = {
  // km/h from m/s: the pit limiter reads 80, the top of the main straight about 320
  kmh: (v) => (v <= PACE.pit ? (v * 80) / PACE.pit : 80 + ((v - PACE.pit) * (322 - 80)) / (PACE.vtop - PACE.pit)),
  gap: 1.7, // timing gaps: scene seconds x 1.7
  lap: 4.55, // lap times: scene seconds x 4.55 (an 18.4 s lap reads 1:23.9)
  km: 5.69, // distances: the 915 m toy lap reads 5.21 km
};

// The circuit, in driving order from the start line: the main straight runs +x along z = 28 in front of the pits.
export const START_X = -60;
const CIRCUIT = [
  [-150, 28], [-60, 28], [40, 28], [128, 28],
  [172, 22], [196, 2], [198, -26], [178, -50],
  [128, -62], [78, -64],
  [52, -63], [36, -55], [20, -55], [4, -66],
  [-50, -72], [-112, -72],
  [-158, -66], [-190, -46], [-205, -14], [-198, 14], [-178, 26],
];

// the pit lane: the fast lane at z = 14.5, the boxes at z = 5.5 in front of the garages (the building's front at z = 0)
export const PIT = {front: 0, box: 5.5, fast: 14.5, wall: 18.8, entryX: -120, exitX: 120};
export const TEAMS = ['vela', 'northwind', 'halcyon', 'tidewater', 'kite'];
export const GARAGE_X = [-60, -30, 0, 30, 60];
export const boxX = (team) => GARAGE_X[TEAMS.indexOf(team)];

// the pit lane's own points between leaving the track and joining it again
const PIT_IN = [[-188, -4], [-172, 9], [-150, 14.5], [-120, 14.5]];
const PIT_OUT = [[120, 14.5], [146, 13], [166, 2], [178, -16]];

export const track = makePath(catmull(CIRCUIT, true, 40), true);
// the start line is s = 0: rotate the samples so they start at x = START_X on the main straight
{
  const i0 = track.nearest(START_X, 28);
  const rot = (A) => {
    const B = A.slice();
    for (let i = 0; i < A.length; i++) B[i] = A[(i + i0) % A.length];
    return B;
  };
  for (const k of ['X', 'Z', 'TX', 'TZ', 'K']) track[k].set(rot(track[k]));
}
export const LAP = track.L;
export const lapV = profile(track, PACE);
export const lapT = timeTable(lapV, true);
export const LAP_TIME = lapT[lapT.length - 1];

// where the pit lane leaves and joins the track
const uNear = (x, z) => track.nearest(x, z) * DS;
export const U_IN = uNear(-197, -24);
export const U_OUT = uNear(186, -42);

/** a car's pit path: the track up to U_IN, the pit lane with a detour into its box, the track again from U_OUT */
function pitPath(team) {
  const bx = boxX(team);
  const pre = [-24, -12, 0].map((d) => {
    const p = track.at(U_IN + d);
    return [p.x, p.z];
  });
  const post = [0, 12, 24].map((d) => {
    const p = track.at(U_OUT + d);
    return [p.x, p.z];
  });
  const lane = [];
  for (let x = PIT.entryX + 30; x <= PIT.exitX - 30; x += 30) {
    if (Math.abs(x - bx) < 30) continue;
    lane.push([x, PIT.fast]);
  }
  const box = [[bx - 26, PIT.fast], [bx - 13, PIT.box + 3.6], [bx, PIT.box], [bx + 13, PIT.box + 3.6], [bx + 26, PIT.fast]];
  const mid = [...lane.filter((p) => p[0] < bx - 26), ...box, ...lane.filter((p) => p[0] > bx + 26)];
  const pts = [...pre, ...PIT_IN, ...mid, ...PIT_OUT, ...post];
  const dense = catmull(pts, false, 30);
  const full = makePath(dense, false);
  // trim to the stretch between the first and the last track point we joined at
  const a = full.nearest(pre[2][0], pre[2][1], 0, Math.floor(full.n / 3));
  const b = full.nearest(post[0][0], post[0][1], Math.floor((2 * full.n) / 3), full.n);
  const trimmed = [];
  for (let i = a; i <= b; i++) trimmed.push([full.X[i], full.Z[i]]);
  const path = makePath(trimmed, false);
  const sBox = path.nearest(bx, PIT.box) * DS;
  // the limiter from the entry line to the exit line, a stop on the box
  const sEntry = path.nearest(PIT.entryX, PIT.fast) * DS;
  const sExit = path.nearest(PIT.exitX, PIT.fast) * DS;
  const vIn = lapV[Math.round(U_IN / DS) % track.n];
  const vOut = lapV[Math.round(U_OUT / DS) % track.n];
  const limit = (s) => (s >= sEntry - 2 && s <= sExit ? PACE.pit : Infinity);
  // two halves: into the box (ending at 0) and out of it (starting at 0)
  const nBox = Math.round(sBox / DS);
  const v = profile(path, {...PACE, limit, v0: vIn, v1: vOut});
  // brake to a stop at the box: a backward pass from 0 at nBox
  v[nBox] = 0;
  for (let i = nBox - 1; i >= 0; i--) v[i] = Math.min(v[i], Math.sqrt(v[i + 1] ** 2 + 2 * PACE.brk * 0.55 * DS));
  for (let i = nBox + 1; i < v.length; i++) v[i] = Math.min(v[i], Math.sqrt(v[i - 1] ** 2 + 2 * PACE.acc * 0.9 * DS));
  const T = timeTable(v, false);
  return {path, v, T, sBox, nBox, tBox: T[nBox], sEntry, sExit, bx};
}

// The cars. offset: seconds behind the leader on the road at the same pace; stop: the hero and the rival pit.
export const CARS = [
  {id: 'c8', team: 'vela', number: '8', offset: 0, tyre: 'hard', f: 1.0015},
  {id: 'c21', team: 'northwind', number: '21', offset: 1.7, tyre: 'hard', f: 1.0008},
  {id: 'c3', team: 'tidewater', number: '3', offset: 4.0, tyre: 'soft', stop: {lap: 2, still: 2.9, to: 'medium', worn: 0.985}},
  {id: 'c9', team: 'halcyon', number: '9', offset: 4.5, tyre: 'soft', hero: true, stop: {lap: 1, still: 2.4, to: 'medium', fresh: 1.012}},
  {id: 'c5', team: 'kite', number: '5', offset: 6.9, tyre: 'medium', f: 0.9994},
  {id: 'c18', team: 'vela', number: '18', offset: 9.2, tyre: 'medium', f: 0.9988},
  {id: 'c6', team: 'halcyon', number: '6', offset: 11.2, tyre: 'hard', f: 1.0003},
  {id: 'c31', team: 'tidewater', number: '31', offset: 15.6, tyre: 'hard', f: 0.9991},
];

// The race clock: at film time 0 the leader is PHASE seconds into its lap.
export const PHASE = 13.2;
export const RACE_LAP = 31; // the leader's lap at film time 0 (the lap it is on)

/**
 * Each car's progress as a schedule of pieces: on the track at a pace factor, or in its pit path. Built once.
 * A track piece maps film time to "lap time" w (seconds on the base lap, unwrapped); the car is at U(w).
 */
function schedule(car) {
  const w0 = PHASE - car.offset; // its lap time at film time 0
  const pieces = [];
  if (!car.stop) {
    // each car's own pace, a few hundredths a lap either side of the base lap
    pieces.push({kind: 'track', t0: -1e9, t1: 1e9, w0, f: car.f ?? 1});
    return pieces;
  }
  const P = pitPath(car.team);
  const wIn = tAt(lapT, U_IN); // the lap time at the pit entry on the base lap
  // the first lap of the film on which the car reaches U_IN: lapIdx counts from its current lap
  let k = Math.floor(w0 / LAP_TIME);
  if (((w0 % LAP_TIME) + LAP_TIME) % LAP_TIME > wIn) k += 1;
  k += car.stop.lap - 1;
  // until the pit entry the rival's tyres fade from the hero's stop on (worn): approximated as one pace factor on the
  // lap before its stop, which starts when the hero's in-lap ends
  const f1 = 1;
  let tIn = (k * LAP_TIME + wIn - w0) / f1;
  if (car.stop.worn) {
    // the lap before the stop runs at the worn pace: the time to the entry stretches by 1 / worn over the last lap
    const tLap = tIn - LAP_TIME; // when it starts that lap
    pieces.push({kind: 'track', t0: -1e9, t1: tLap, w0, f: 1});
    const wl = w0 + tLap;
    tIn = tLap + LAP_TIME / car.stop.worn;
    pieces.push({kind: 'track', t0: tLap, t1: tIn, w0: wl - tLap * car.stop.worn, f: car.stop.worn});
  } else pieces.push({kind: 'track', t0: -1e9, t1: tIn, w0, f: 1});
  // the pit path, with the stationary time spliced in at the box
  const tStop0 = tIn + P.tBox;
  const tStop1 = tStop0 + car.stop.still;
  const tOut = tStop1 + (P.T[P.T.length - 1] - P.tBox);
  pieces.push({kind: 'pit', t0: tIn, t1: tOut, P, tStop0, tStop1, Din: k * LAP + U_IN});
  // back on track from U_OUT at the fresh pace
  const f = car.stop.fresh ?? 1;
  const wOut = (k + (U_OUT < U_IN ? 1 : 0)) * LAP_TIME + tAt(lapT, U_OUT);
  pieces.push({kind: 'track', t0: tOut, t1: 1e9, w0: wOut - tOut * f, f});
  return pieces;
}
for (const c of CARS) c.pieces = schedule(c);

/** where a car is at film time t: {x, z, tx, tz, v (m/s), a, pit (bool), u (track distance), D (race distance)} */
export function carAt(car, t) {
  const pc = car.pieces.find((p) => t >= p.t0 && t < p.t1) ?? car.pieces[car.pieces.length - 1];
  if (pc.kind === 'track') {
    const w = pc.w0 + pc.f * t;
    const lap = Math.floor(w / LAP_TIME);
    const r = sAt(lapT, lapV, w - lap * LAP_TIME);
    const p = track.at(r.s);
    return {...p, v: r.v * pc.f, a: r.a * pc.f * pc.f, pit: false, u: r.s, D: lap * LAP + r.s, lap};
  }
  const {P} = pc;
  let tt;
  if (t < pc.tStop0) tt = t - pc.t0;
  else if (t < pc.tStop1) tt = P.tBox;
  else tt = P.tBox + (t - pc.tStop1);
  const r = t >= pc.tStop0 && t < pc.tStop1 ? {s: P.sBox, v: 0, a: 0} : sAt(P.T, P.v, tt);
  const p = P.path.at(r.s);
  // race distance: the pit path mapped linearly onto the stretch of track it bypasses
  const span = (U_OUT - U_IN + LAP) % LAP;
  const D = pc.Din + (r.s / P.path.L) * span;
  return {...p, v: r.v, a: r.a, pit: true, u: null, D, s: r.s, piece: pc, lap: Math.floor(D / LAP)};
}

/** the pit piece of a car that stops (its path, entry, box and exit times) */
export const pitOf = (car) => car.pieces.find((p) => p.kind === 'pit');
