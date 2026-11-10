// Fits the pitch programme in kin.js: node teardown/saturn-v/fit.mjs
// Searches the three upper angles for a level arrival near 190 km, then prints the flight the model flies.
import {integrate, makeModel, PITCH, T, DT} from './kin.js';

const idx = (t) => Math.round((t - T.start) / DT);
const score = (P) => {
  const o = integrate(P);
  const a = idx(T.s1oeco);
  const b = idx(T.s4cut);
  const e1 = (o.alt[a] - 66000) / 4000;
  const e2 = (o.alt[b] - 191000) / 3000;
  const e3 = o.vr[b] / 15;
  return e1 * e1 + e2 * e2 + e3 * e3;
};

if (process.argv.includes('--search')) {
  let best = {s: Infinity};
  for (let s1End = 22; s1End <= 27; s1End += 1)
    for (let s1Pow = 0.8; s1Pow <= 0.81; s1Pow += 0.1)
      for (let upStart = 28; upStart <= 52; upStart += 1)
        for (let upEnd = -4; upEnd <= 20; upEnd += 1) {
          const P = {s1End, s1Pow, upStart, upEnd};
          const s = score(P);
          if (s < best.s) best = {s, P};
        }
  // refine
  const base = best.P;
  for (let a = -1; a <= 1; a += 0.25)
    for (let b = -1.5; b <= 1.5; b += 0.25)
      for (let c = -1.5; c <= 1.5; c += 0.25) {
        const P = {s1End: base.s1End + a, s1Pow: base.s1Pow, upStart: base.upStart + b, upEnd: base.upEnd + c};
        const s = score(P);
        if (s < best.s) best = {s, P};
      }
  console.log('best', JSON.stringify(best));
}

const m = makeModel();
const row = (name, t) => {
  const s = m.state(t);
  console.log(
    name.padEnd(22),
    `t=${t.toFixed(1).padStart(6)}`,
    `alt=${(s.alt / 1000).toFixed(1).padStart(6)} km`,
    `v=${s.vSpace.toFixed(0).padStart(5)} m/s`,
    `vEarth=${s.vEarth.toFixed(0).padStart(5)}`,
    `vr=${s.vr.toFixed(0).padStart(5)}`,
    `g=${s.g.toFixed(2)}`,
    `q=${(s.q / 1000).toFixed(1)} kPa`,
    `M=${s.mach.toFixed(2)}`,
    `mass=${(s.mass / 1000).toFixed(0)} t`,
    `F=${(s.thrust / 1e6).toFixed(2)} MN`,
    `range=${(s.range / 1000).toFixed(0)} km`,
  );
};
console.log('pitch', PITCH, 'maxQ', m.maxQ, 'mach1', m.mach1, 'orbitV', m.orbitV.toFixed(0));
row('liftoff', 0.1);
row('tower clear', T.tower);
row('mach 1', m.mach1);
row('max q', m.maxQ.t);
row('S-IC CECO', T.s1ceco - 0.1);
row('S-IC OECO', T.s1oeco - 0.1);
row('S-II ignition', T.s2ign + 0.2);
row('LES jettison', T.les);
row('S-II CECO', T.s2ceco - 0.1);
row('S-II OECO', T.s2oeco - 0.1);
row('S-IVB ignition', T.s4ign + 0.2);
row('S-IVB cutoff', T.s4cut - 0.1);
row('insertion', T.insert);
