// Pitline's strategy engine: the call on the pit wall, made for real. When the page loads it races car 9 against car 3
// from lap 31 to the flag a few thousand times for each option (box this lap, box next lap, stay out), with lap-time
// noise, tyre wear with a cliff, a spread of stop times and the odd slow stop, and the fact that a car stuck in dirty
// air can't pass unless it is much faster. It counts how often car 9 finishes ahead. The card shows the odds and how
// many milliseconds the whole thing took on the machine running the page.
//
// Seeded, so the odds are the same on every load; only the time it takes depends on the machine.

const LAPS = [31, 52];
const BASE = 84.0; // seconds a lap on fresh-ish tyres
const FUEL = 0.06; // seconds a lap lighter as the fuel burns
const PIT_LOSS = 12.4; // seconds lost driving through the pit lane, without the stop
const STUCK = 0.25; // a car that can't pass sits this far behind
const PASS = 0.9; // and needs to be this much faster on the lap to get by

// tyre time loss in seconds against a lap's base, by compound and age in laps
function tyre(compound, age) {
  // softs fall off a cliff after 19 laps
  if (compound === 'soft') return 0.08 * age + (age > 19 ? 0.4 * Math.pow(age - 19, 1.3) : 0);
  // mediums: a little slower than new softs, wearing slowly; the out-lap pays to warm them up
  return 0.35 + 0.045 * age + (age === 0 ? 0.5 : 0);
}

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let x = s;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * One race from lap 31 to the flag. box9: the lap car 9 pits on. Car 3 pits on lap 32 (sometimes 33).
 * Both start on 19-lap-old softs, car 9 `gap` seconds behind. Returns true when car 9 finishes ahead.
 */
function race(R, gauss, box9, gap) {
  const box3 = R() < 0.8 ? 32 : 33;
  let t9 = gap;
  let t3 = 0;
  let c9 = 'soft';
  let c3 = 'soft';
  let a9 = 19;
  let a3 = 19;
  for (let lap = LAPS[0]; lap <= LAPS[1]; lap++) {
    const base = BASE - FUEL * (lap - LAPS[0]);
    let l9 = base + tyre(c9, a9) + 0.15 * gauss();
    let l3 = base + tyre(c3, a3) + 0.15 * gauss();
    if (lap === box9) {
      const stop = 2.4 + 0.18 * gauss() + (R() < 0.04 ? 1.2 : 0);
      l9 += PIT_LOSS + stop;
    }
    if (lap === box3) {
      const stop = 2.4 + 0.18 * gauss() + (R() < 0.04 ? 1.2 : 0);
      l3 += PIT_LOSS + stop;
    }
    const was9Behind = t9 > t3;
    const n9 = t9 + l9;
    const n3 = t3 + l3;
    // on track (neither car pitting this lap), the car behind can't get past without a big pace advantage
    const onTrack = lap !== box9 && lap !== box3;
    if (onTrack && was9Behind && n9 < n3 && l3 - l9 < PASS) {
      t9 = n3 + STUCK;
      t3 = n3;
    } else if (onTrack && !was9Behind && n3 < n9 && l9 - l3 < PASS) {
      t3 = n9 + STUCK;
      t9 = n9;
    } else {
      t9 = n9;
      t3 = n3;
    }
    // new tyres after a stop
    if (lap === box9) {
      c9 = 'medium';
      a9 = 0;
    } else a9++;
    if (lap === box3) {
      c3 = 'medium';
      a3 = 0;
    } else a3++;
  }
  return t9 < t3;
}

/** run the options; returns {races, ms, options: [{name, box, ahead (0..1)}], best} */
export function runStrategy({perOption = 4200, gap = 0.85} = {}) {
  const t0 = performance.now();
  const options = [
    {name: 'Box this lap', box: 31},
    {name: 'Box next lap', box: 32},
    {name: 'Stay out', box: 35},
  ];
  for (const [i, o] of options.entries()) {
    const R = rng(746337560 + i);
    // normal deviates, Box-Muller with a spare
    let spare = null;
    const gauss = () => {
      if (spare != null) {
        const s = spare;
        spare = null;
        return s;
      }
      const u = Math.max(1e-12, R());
      const v = R();
      const r = Math.sqrt(-2 * Math.log(u));
      spare = r * Math.sin(2 * Math.PI * v);
      return r * Math.cos(2 * Math.PI * v);
    };
    let n = 0;
    for (let k = 0; k < perOption; k++) if (race(R, gauss, o.box, gap)) n++;
    o.ahead = n / perOption;
  }
  const ms = performance.now() - t0;
  const best = options.reduce((a, b) => (b.ahead > a.ahead ? b : a));
  return {races: perOption * options.length, ms, options, best};
}
