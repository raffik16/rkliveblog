#!/usr/bin/env node
// Pitline's collision sweep, the simulator skill's step 7 for a race: every 0.01 s of the film, every pair of cars as
// oriented boxes (8.4 m by 3.0 m, the scale contract's car) from layout.js, tested with the separating axis theorem.
// Prints the closest approach and any overlap. Runs in Node: layout.js has no three.js and no DOM.
//
//   node simulator/pitline-collide/sweep.mjs
import {CARS, carAt} from '../pitline-shared/layout.js';

const DUR = 46.7;
const STEP = 0.01;
const HALF = [4.2, 1.5];

const corners = (p) => {
  const [hx, hz] = HALF;
  const ax = [p.tx, p.tz];
  const az = [-p.tz, p.tx];
  return [
    [1, 1],
    [1, -1],
    [-1, -1],
    [-1, 1],
  ].map(([a, b]) => [p.x + ax[0] * hx * a + az[0] * hz * b, p.z + ax[1] * hx * a + az[1] * hz * b]);
};
// the gap between two oriented boxes along the axis that separates them best (negative: they overlap)
const gap = (A, B) => {
  let best = -Infinity;
  for (const P of [A, B]) {
    for (let i = 0; i < 4; i++) {
      const [x0, z0] = P[i];
      const [x1, z1] = P[(i + 1) % 4];
      const l = Math.hypot(x1 - x0, z1 - z0);
      const n = [-(z1 - z0) / l, (x1 - x0) / l];
      const proj = (Q) => Q.map(([x, z]) => x * n[0] + z * n[1]);
      const a = proj(A);
      const b = proj(B);
      const g = Math.max(Math.min(...b) - Math.max(...a), Math.min(...a) - Math.max(...b));
      best = Math.max(best, g);
    }
  }
  return best;
};

let worst = {g: Infinity};
let hits = 0;
for (let t = 0; t <= DUR + 1e-9; t += STEP) {
  const P = CARS.map((c) => ({c, box: corners(carAt(c, t))}));
  for (let i = 0; i < P.length; i++)
    for (let j = i + 1; j < P.length; j++) {
      const g = gap(P[i].box, P[j].box);
      if (g < worst.g) worst = {g, t, a: P[i].c.id, b: P[j].c.id};
      if (g < 0) {
        hits++;
        if (hits < 20) console.log(`overlap at ${t.toFixed(2)} s: ${P[i].c.id} and ${P[j].c.id} (${g.toFixed(2)} m)`);
      }
    }
}
console.log(`${Math.round(DUR / STEP) + 1} instants, ${(CARS.length * (CARS.length - 1)) / 2} pairs each`);
console.log(`closest: ${worst.a} and ${worst.b} at ${worst.t.toFixed(2)} s, ${worst.g.toFixed(2)} m apart`);
console.log(hits ? `${hits} overlaps` : 'no overlaps');
process.exit(hits ? 1 : 0);
