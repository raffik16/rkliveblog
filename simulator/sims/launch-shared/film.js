// Padline: the launch site film, cut the way the kit's films are cut. One camera at one angle (azimuth 38, elevation
// 36) that pans and zooms; the story moves through clicks and the site switcher's dropdown.
//   0-7.6 s   the erector rolls B1107 out of the hangar to Pad 7 (click: TE-2)
//   7.6-17.4  it stands the rocket up, the farm loads propellant, the strongback leans back (clicks: the stack, the farm)
//   17.4-25.2 ignition, liftoff, the climb; the camera rides it up and pulls back
//   25.2-36.4 separation; the booster turns round, burns back, falls and lands on LZ-2 (click: B1107, its route drawn)
//   36.4-40.9 the recovery crew drives out (click: CR-1); the dropdown jumps to the station
//   40.9-48.7 the capsule closes on the forward port, holds at 20 m, docks (click: SR-19); home over the station
import * as THREE from 'three'
import { TOY, createToyStage } from '../airport-shared/style.js'
import { createToyUI, ICONS } from '../airport-shared/ui.js'
import { createSelection } from '../airport-shared/select.js'
import { thumb } from '../airport-shared/thumbs.js'
import {
  STACK,
  buildToyBooster,
  buildToyUpperStage,
  buildToyCapsule,
  buildToyErector,
} from './rocket.js'
import { buildToyTankFarm, buildToyMobileCrane } from './complex.js'
import { buildToyStation } from './orbit.js'
import { DUR, T, LZ, buildWorld } from './world.js'

const D2R = Math.PI / 180
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x))
const sm = (x) => {
  const u = clamp(x)
  return u * u * u * (u * (u * 6 - 15) + 10)
}
const ss = (a, b, t) => sm((t - a) / (b - a))
const lerp = (a, b, k) => a + (b - a) * k
const fmt = (n, d = 0) =>
  Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })
const p2 = (n) => String(Math.floor(n)).padStart(2, '0')

// glyphs in the kit's language (small solid shapes, three blues)
const ROCKET = `<svg viewBox="0 0 40 40" width="26" height="26"><path d="M20 3c5 4 7 10 7 17v9H13v-9c0-7 2-13 7-17z" fill="#3166ea"/><path d="M20 3c5 4 7 10 7 17v3H20z" fill="#6f98f7"/><path d="M13 22l-5 6v6l5-3zM27 22l5 6v6l-5-3z" fill="#2448c8"/><circle cx="20" cy="16" r="3" fill="#fff"/><path d="M16 31h8l-1 5h-6z" fill="#f2b33a"/></svg>`
const DROP = `<svg viewBox="0 0 40 40" width="26" height="26"><path d="M20 4c7 9 11 15 11 21a11 11 0 01-22 0c0-6 4-12 11-21z" fill="#3166ea"/><path d="M20 4c7 9 11 15 11 21a11 11 0 01-11 11z" fill="#6f98f7"/></svg>`
const CLOUD = `<svg viewBox="0 0 40 40" width="26" height="26"><path d="M11 30a7 7 0 01-1-14 10 10 0 0119-2 8 8 0 012 16z" fill="#3166ea"/><path d="M29 14a8 8 0 012 16H20z" fill="#6f98f7"/></svg>`
const GAUGE = `<svg viewBox="0 0 40 40" width="26" height="26"><path d="M5 28a15 15 0 0130 0z" fill="#3166ea"/><path d="M20 13a15 15 0 0115 15H20z" fill="#6f98f7"/><path d="M20 28l7-9" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>`
Object.assign(ICONS, { rocket: ROCKET, drop: DROP, cloud: CLOUD, gauge: GAUGE, truck: ROCKET })
// the tracker's step glyphs: the kit's plane becomes a rocket, its doc a launch pad's tower
const PLANE_D = 'M3 13l7-1 4-7h2l-1 7 5 1 1-2h2l-1 3 1 3h-2l-1-2-5 1 1 7h-2l-4-7-7-1z'
const ROCKET_D =
  'M12 2c3 2.5 4 6 4 10v5H8v-5c0-4 1-7.5 4-10zM8 13l-3 4v3l3-2M16 13l3 4v3l-3-2M10 20h4l-1 2h-2z'
const paint = (s) => s.split(PLANE_D).join(ROCKET_D)
// the operator: initials on a blue disc (no photo)
const AVATAR =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88 88"><rect width="88" height="88" fill="#3166ea"/><circle cx="66" cy="20" r="30" fill="#4a85f0"/><text x="44" y="56" font-family="Inter,system-ui,sans-serif" font-size="32" font-weight="800" fill="#fff" text-anchor="middle">FD</text></svg>'
  )

export const UI_WORDS = {
  brand: 'Padline',
  search: 'Search pads, vehicles, boosters, missions...',
  user: ['Flight Director', 'Launch Control'],
  avatar: AVATAR,
  kpis: [
    { ic: 'clock', k: 'Countdown', key: 'a', v: 'T−03:00', d: 'GO', s: 'SR-19 · Pad 7' },
    { ic: 'drop', k: 'Propellant', key: 'b', v: '0%', d: 'LOX', s: 'RP-1 · LOX' },
    { ic: 'cloud', k: 'Weather', key: 'c', v: '94%', d: 'GO', s: 'wind 9 kn · Pad 7' },
  ],
}

const CLICKS = [
  { t: 1.5, at: 'te', card: 'te' },
  { t: 8.9, at: 'stack', card: 'stack' },
  { t: 12.4, at: 'farm', card: 'farm' },
  { t: 26.3, at: 'booster', card: 'booster' },
  { t: 37.7, at: 'crane', card: 'crane' },
  { t: 39.9, ui: [1167, 37], drop: 'open' },
  { t: 40.9, ui: [930, 274], card: 'site' },
  { t: 42.6, at: 'capsule', card: 'capsule' },
  { t: 47.1, ui: [1159, 275], tool: 6, card: 'site' },
]
export const FILM_CLICKS = CLICKS.map((c) => c.t)

const AZ = 38
const EL = 36
const SITES = {
  PAD: ['P7', 'Pad 7 · Seawall Point', 'Flight 12 · SR-19'],
  LZ: ['LZ2', 'Landing Zone 2', 'B1107 returning'],
  ISS: ['ISS', 'Space Station', 'SR-19 arriving · fwd port'],
}
const DROP_SITES = (t) => [
  ['P7', 'Pad 7 · Seawall Point', 'Launched · T+00:18:40', 100],
  ['LZ2', 'Landing Zone 2', t < T.touch ? 'B1107 inbound' : 'B1107 landed · safing', 100],
  ['ISS', 'Space Station', 'SR-19 · docking day 2', 62],
  ['P9', 'Pad 9 · North Spit', 'Stand-down · next flight', 18],
]

// clocks: a countdown that runs ten times film speed before liftoff, then mission time at 25x
const missionSec = (t) => (t < T.lift ? (t - T.lift) * 10 : (t - T.lift) * 25)
const tShort = (s) => {
  const a = Math.abs(s)
  return `T${s < 0 ? '−' : '+'}${p2(a / 60)}:${p2(a % 60)}`
}
const tClock = (s) => {
  const a = Math.abs(s)
  return `T${s < 0 ? '−' : '+'}${p2(a / 3600)}:${p2((a / 60) % 60)}:${p2(a % 60)}`
}

export function runToyLaunchFilm({ runSim }) {
  return runSim(
    {
      duration: DUR,
      fps: 60,
      warm: [19.5, 28.2, 36.8, 44.5],
      theme: 'light',
      marks: FILM_CLICKS,
      hud: { enabled: false, title: 'padline', subtitle: '' },
      director: { enabled: false },
      watermark: '',
    },
    async ({ canvas, capture, pixelRatio, cfg }) => {
      const app = document.getElementById('app')
      const st = createToyStage(canvas, { fov: 28 })
      const W = buildWorld()
      st.scene.add(W.root)
      const ui = createToyUI(app, UI_WORDS, { paint })
      // cfg.clean (the stills in the write-up): no dashboard, and the world centred in the whole frame
      const clean = !!cfg?.clean
      if (clean) ui.el.style.display = 'none'
      const sel = createSelection(st.scene, st)
      const kpiLabels = [...ui.el.querySelectorAll('.kpi .k')]
      const kpiIcons = [...ui.el.querySelectorAll('.kpi .ic')]
      const resize = () =>
        st.resize(
          1600,
          900,
          pixelRatio
            ? pixelRatio()
            : capture
              ? devicePixelRatio || 1
              : Math.min(devicePixelRatio || 1, 2)
        )
      resize()

      // ---- the two skies: the toy lavender, and space
      const hemi = st.scene.children.find((o) => o.isHemisphereLight)
      const SKY = {
        ground: {
          bg: st.scene.background.clone(),
          fog: st.scene.fog.color.clone(),
          near: st.scene.fog.near,
          far: st.scene.fog.far,
          sun: st.sun.color.clone(),
          sunI: st.sun.intensity,
          hs: hemi.color.clone(),
          hg: hemi.groundColor.clone(),
          hi: hemi.intensity,
        },
        space: (() => {
          const S = W.SPACE
          return {
            bg: new THREE.Color(S.bg),
            fog: new THREE.Color(S.fog.color),
            near: S.fog.near,
            far: S.fog.far,
            sun: new THREE.Color(S.sun.color),
            sunI: S.sun.intensity,
            hs: new THREE.Color(S.hemi.sky),
            hg: new THREE.Color(S.hemi.ground),
            hi: S.hemi.intensity,
          }
        })(),
      }
      const setSky = (k) => {
        const s = SKY[k]
        st.scene.background.copy(s.bg)
        st.scene.fog.color.copy(s.fog)
        st.scene.fog.near = s.near
        st.scene.fog.far = s.far
        st.sun.color.copy(s.sun)
        st.sun.intensity = s.sunI
        hemi.color.copy(s.hs)
        hemi.groundColor.copy(s.hg)
        hemi.intensity = s.hi
        // in orbit the Earth's limb is 2-2.3 km from the camera: draw further than the ground needs
        const far = k === 'space' ? 3600 : 2000
        if (st.camera.far !== far) {
          st.camera.far = far
          st.camera.updateProjectionMatrix()
        }
      }

      // ---- card thumbnails, rendered from the models
      const TH = (() => {
        const stack = new THREE.Group()
        const b = buildToyBooster()
        const u = buildToyUpperStage()
        u.group.position.y = STACK.upper
        stack.add(b.group, u.group)
        const landed = buildToyBooster()
        landed.setLegs(1)
        landed.setFins(1)
        const te = buildToyErector()
        const cap = buildToyCapsule()
        cap.setNose(1)
        return {
          stack: thumb(stack, { pad: 1.0, el: 18 }),
          booster: thumb(landed.group, { pad: 1.0, el: 18 }),
          te: thumb(te.group, { pad: 1.0 }),
          farm: thumb(buildToyTankFarm().group, { pad: 0.9 }),
          crane: thumb(buildToyMobileCrane().group, { pad: 1.05 }),
          capsule: thumb(cap.group, { pad: 1.2 }),
          station: thumb(buildToyStation().group, { pad: 0.85, el: 30 }),
          pad: thumb(W.objects.mount.group.clone(), { pad: 0.75 }),
          lz: thumb(W.objects.lz.clone(), { pad: 0.8, el: 50 }),
        }
      })()

      // ---- the camera: keyed glides on the ground, riding the rocket in flight, then the station
      const P = (o) => o.getWorldPosition(new THREE.Vector3())
      const KEYS = [
        { t: 0, x: -50, y: 5, z: 4, d: 128 },
        { t: 7.0, x: -24, y: 6, z: 3, d: 120 },
        { t: 9.4, x: -10, y: 13, z: 0, d: 138 },
        { t: 13.4, x: -6, y: 19, z: -4, d: 152 },
        { t: 15.8, x: -8, y: 17, z: -14, d: 170 },
        { t: 17.6, x: -2, y: 18, z: -6, d: 158 },
      ]
      const keyCam = (t) => {
        let i = 0
        while (i < KEYS.length - 2 && KEYS[i + 1].t <= t) i++
        const a = KEYS[i]
        const b = KEYS[i + 1]
        const k = ss(a.t, b.t, t)
        return {
          x: lerp(a.x, b.x, k),
          y: lerp(a.y, b.y, k),
          z: lerp(a.z, b.z, k),
          d: lerp(a.d, b.d, k),
        }
      }
      const flightCam = (t) => {
        const r = W.rocketAt(t)
        const ax = new THREE.Vector3(0, 1, 0).applyQuaternion(r.q)
        const c = r.p.clone().addScaledVector(ax, t < T.sep ? 22 : 15)
        // wide for the climb and the separation, in close for the flip and the burn back, closer still to land
        const d =
          t < T.sep
            ? lerp(158, 300, ss(T.lift, T.sep, t))
            : t < T.boostback[1]
              ? lerp(300, 185, ss(T.sep + 0.8, T.flip[1], t))
              : lerp(185, 150, ss(T.boostback[1], T.touch - 0.6, t))
        return { x: c.x, y: c.y, z: c.z, d }
      }
      const LZCAM = { x: LZ.x + 8, y: 5, z: LZ.z + 30, d: 176 }
      const camAt = (t) => {
        if (t >= T.orbit) {
          const st2 = W.objects.station.group
          const port = st2.localToWorld(W.objects.station.dockPort.pos.clone())
          const cap = P(W.objects.cap2.group)
          const mid = port.clone().lerp(cap, 0.45)
          const k = ss(T.capture + 0.6, T.capture + 2.6, t)
          const home = P(st2)
          return {
            x: lerp(mid.x, home.x, k),
            y: lerp(mid.y, home.y, k),
            z: lerp(mid.z, home.z, k),
            d: lerp(120, 250, k),
          }
        }
        if (t < T.lift) return keyCam(t)
        const f = flightCam(t)
        // ease onto the rocket after liftoff
        const w = ss(T.lift, T.lift + 1.6, t)
        const base = KEYS[KEYS.length - 1]
        let c = {
          x: lerp(base.x, f.x, w),
          y: lerp(base.y, f.y, w),
          z: lerp(base.z, f.z, w),
          d: f.d,
        }
        // after touchdown, settle over LZ-2 and the crew
        const s = ss(T.touch + 0.2, T.touch + 2.4, t)
        if (s > 0)
          c = {
            x: lerp(c.x, LZCAM.x, s),
            y: lerp(c.y, LZCAM.y, s),
            z: lerp(c.z, LZCAM.z, s),
            d: lerp(c.d, LZCAM.d, s),
          }
        return c
      }

      let ST = { fuel: 0 }
      const siteAt = (t) => (t < T.orbit ? (t < T.sep + 2.5 ? 'PAD' : 'LZ') : 'ISS')
      const teState = (t) =>
        t < T.roll[1]
          ? ['Rolling out', 'go']
          : t < T.raise[0]
            ? ['At the pad', 'wait']
            : t < T.raise[1]
              ? ['Raising', 'in']
              : t < T.retract[0]
                ? ['Vertical', 'go']
                : ['Leaned back', 'wait']
      const boosterState = (t) =>
        t < T.flip[0]
          ? ['Coasting', 'in']
          : t < T.boostback[0]
            ? ['Flipping', 'in']
            : t < T.boostback[1]
              ? ['Boostback burn', 'go']
              : t < T.entry[0]
                ? ['Falling · fins out', 'in']
                : t < T.entry[1]
                  ? ['Entry burn', 'go']
                  : t < T.landing[0]
                    ? ['Gliding to LZ-2', 'in']
                    : t < T.touch
                      ? ['Landing burn', 'go']
                      : ['Landed', 'go']
      // flight numbers at real scale: the toy flies 1:150 in height and 12x slower than the real thing
      const flightNums = (t) => {
        if (t < T.lift) return { alt: 0, v: 0 }
        const p = W.rocketAt(t).p
        const p2b = W.rocketAt(t + 0.05).p
        const v = p.distanceTo(p2b) / 0.05
        // heights from the deck (6 m) on the way up, from LZ-2 on the way down
        return {
          alt: Math.max(0, (p.y - (t < T.sep ? 6 : 1.64)) * 0.15),
          v: t > T.touch ? 0 : v * 3.6 * 12,
        }
      }
      const cardAt = (t, kind, t0) => {
        const pop = ss(t0, t0 + 0.35, t)
        if (kind === 'te') {
          const [s, cls] = teState(t)
          const run = 64 * ss(...T.roll, t)
          const ang = 90 * ss(...T.raise, t) - 3.2 * ss(...T.retract, t)
          return {
            pop,
            thumb: TH.te,
            org: 'GROUND SYSTEMS · PAD 7',
            title: 'TE-2',
            sub: 'Transporter erector · strongback',
            stat: s,
            statCls: cls,
            statText:
              t < T.raise[0]
                ? `Hangar → Pad 7 · ${Math.round(run)}/64 m`
                : `Angle ${ang.toFixed(1)}° · Pad 7`,
            prog: t < T.raise[0] ? run / 64 : ang / 90,
            progText: t < T.raise[0] ? `${Math.round(run)} m` : `${ang.toFixed(0)}°`,
            rows: [
              ['Payload', 'B1107 + SR-19', 1],
              ['Angle', `${ang.toFixed(1)}°`],
              [
                'Speed',
                t < T.roll[1]
                  ? `${(0.4 + 1.1 * Math.sin(Math.PI * ss(...T.roll, t))).toFixed(1)} km/h`
                  : '0.0 km/h',
              ],
              ['Rams', `2 × ${Math.round(80 + 150 * ss(...T.raise, t))} bar`],
              ['Crew', 'Pad crew B'],
            ],
          }
        }
        if (kind === 'stack') {
          const fuel = Math.round(100 * ST.fuel)
          const s =
            t < T.raise[1]
              ? ['Going vertical', 'in']
              : t < T.fuel[1]
                ? [`Fuelling ${fuel}%`, 'go']
                : t < T.lift
                  ? ['Terminal count', 'wait']
                  : ['Liftoff', 'go']
          return {
            pop,
            thumb: TH.stack,
            org: 'VEHICLE · FLIGHT 12',
            title: 'B1107 · SR-19',
            sub: 'Reusable two-stage rocket · 70 m',
            stat: s[0],
            statCls: s[1],
            statText: t < T.lift ? `Pad 7 · ${tClock(missionSec(t))}` : 'Climbing · downrange',
            prog: t < T.raise[1] ? ss(...T.raise, t) : ST.fuel,
            progText: t < T.raise[1] ? `${Math.round(90 * ss(...T.raise, t))}°` : `${fuel}%`,
            rows: [
              ['Booster', 'B1107 · 12th flight', 1],
              ['Upper stage', 'S2-214'],
              ['Payload', 'SR-19 · 2,900 kg cargo'],
              ['Destination', 'Space station · fwd port'],
              ['Recovery', 'LZ-2 · return to site'],
            ],
          }
        }
        if (kind === 'farm') {
          const lox = Math.round(100 * ss(T.fuel[0], T.fuel[1] - 0.4, t))
          const rp = Math.round(100 * ss(T.fuel[0] - 0.6, T.fuel[1] - 1.2, t))
          return {
            pop,
            thumb: TH.farm,
            org: 'PROPELLANT · PAD 7',
            title: 'Tank farm',
            sub: 'LOX · RP-1 · helium · nitrogen',
            stat: lox < 100 ? 'Loading' : 'Topping',
            statCls: 'go',
            statText: `B1107 · LOX ${lox}% · RP-1 ${rp}%`,
            prog: (lox + rp) / 200,
            progText: `${Math.round((lox + rp) / 2)}%`,
            rows: [
              ['Liquid oxygen', `${lox}% · −207 °C`],
              ['RP-1 kerosene', `${rp}% · −7 °C`],
              ['Helium', '100% · 340 bar'],
              ['Flow', lox < 100 ? '1.8 t/s' : '0.1 t/s'],
              ['Holds', 'none'],
            ],
          }
        }
        if (kind === 'booster') {
          const [s, cls] = boosterState(t)
          const n = flightNums(t)
          const k = clamp((t - T.sep) / (T.touch - T.sep))
          return {
            pop,
            thumb: TH.booster,
            org: 'BOOSTER · RETURN TO SITE',
            title: 'B1107',
            sub: 'First stage · 12th flight',
            stat: s,
            statCls: cls,
            statText: t < T.touch ? `To LZ-2 · ${fmt(n.alt, 1)} km up` : 'LZ-2 · 0.4 m from centre',
            prog: k,
            progText: t < T.touch ? `${Math.max(0, Math.round(T.touch - t))} s` : 'down',
            rows: [
              ['Altitude', `${fmt(n.alt, 1)} km`],
              ['Speed', `${fmt(n.v)} km/h`],
              ['Grid fins', t < T.fins[0] ? 'Stowed' : 'Out · steering'],
              ['Legs', t < T.legs[0] ? 'Stowed' : t < T.legs[1] ? 'Deploying' : 'Down and locked'],
              ['Propellant', `${Math.round(lerp(9, 2, k))}%`],
            ],
          }
        }
        if (kind === 'crane') {
          const k = ss(T.convoy[0] + 0.35, T.convoy[1] + 0.1, t)
          return {
            pop,
            thumb: TH.crane,
            org: 'RECOVERY · LZ-2',
            title: 'CR-1',
            sub: 'Mobile crane · 220 t',
            stat: k < 1 ? 'En route' : 'On station',
            statCls: k < 1 ? 'in' : 'go',
            statText:
              k < 1 ? `To LZ-2 · ${Math.max(0, Math.round(95 * (1 - k)))} m` : 'LZ-2 · west pad',
            prog: k,
            progText: k < 1 ? `${Math.max(1, Math.round(9 * (1 - k)))} s` : 'there',
            rows: [
              ['Job', 'Lift B1107 onto TT-3', 1],
              ['Convoy', 'Chase-4 · CR-1 · TT-3'],
              ['Booster', 'Safing · vents open'],
              ['Wind', '9 kn · under limit'],
            ],
          }
        }
        if (kind === 'capsule') {
          const g = ST.gap ?? 52
          const s =
            t < T.hold[0]
              ? ['Approach', 'in']
              : t < T.hold[1]
                ? ['Hold · 20 m', 'wait']
                : t < T.capture
                  ? ['Final approach', 'in']
                  : ['Soft capture', 'go']
          return {
            pop,
            thumb: TH.capsule,
            org: 'CARGO CAPSULE · SR-19',
            title: 'SR-19',
            sub: 'Uncrewed cargo · 2,900 kg up',
            stat: s[0],
            statCls: s[1],
            statText: `Forward port · range ${g.toFixed(1)} m`,
            prog: 1 - g / 52,
            progText: `${g.toFixed(1)} m`,
            rows: [
              ['Range', `${g.toFixed(1)} m`],
              [
                'Closing rate',
                t < T.capture
                  ? `${t > T.hold[0] && t < T.hold[1] ? '0.00' : '0.10'} m/s`
                  : '0.00 m/s',
              ],
              ['Mode', 'Autonomous'],
              ['Cargo', '2,900 kg · 41 bags'],
              ['Port', 'Forward · node 2'],
            ],
          }
        }
        const site = siteAt(t)
        const S = {
          PAD: {
            thumb: TH.pad,
            org: 'LAUNCH COMPLEX',
            title: 'Pad 7 · Seawall Point',
            sub: 'Flight 12 · SR-19 to the station',
            stat: t < T.lift ? 'Count running' : 'Launched',
            text:
              t < T.lift ? `${tClock(missionSec(t))} · weather 94% go` : 'B1107 returning to LZ-2',
            stats: [
              ['Propellant', `${Math.round(100 * ST.fuel)}%`, 'loaded', ST.fuel],
              ['Holds', '0', 'today'],
              ['Flights', '12', 'this booster'],
              ['Turnaround', '9.2', 'days'],
            ],
          },
          LZ: {
            thumb: TH.lz,
            org: 'LANDING ZONE',
            title: 'Landing Zone 2',
            sub: 'Return-to-site pad · 36 m',
            stat: t < T.touch ? 'Clear · expecting B1107' : 'B1107 safing',
            text: 'Crew on standby at the gate',
            stats: [
              ['Landings', '41', 'here'],
              ['Last miss', 'none', ''],
              ['Crew', '3', 'vehicles'],
              ['Wind', '9', 'kn'],
            ],
          },
          ISS: {
            thumb: TH.station,
            org: 'ORBIT · 418 KM',
            title: 'Space Station',
            sub: 'Seven aboard · 92 min an orbit',
            stat: t < T.capture ? 'Arrival · SR-19' : 'SR-19 docked',
            text: t < T.capture ? 'Forward port clear · arm ready' : 'Hooks closing · hatch in 2 h',
            stats: [
              ['Visiting', t < T.capture ? '2' : '3', '/ 4 ports', t < T.capture ? 0.5 : 0.75, 1],
              ['Crew', '7', 'aboard'],
              ['Altitude', '418', 'km'],
              ['Power', '92', 'kW'],
            ],
          },
        }[site]
        return {
          pop,
          thumb: S.thumb,
          org: S.org,
          title: S.title,
          sub: S.sub,
          stat: S.stat,
          statCls: 'go',
          statText: S.text,
          prog: 0,
          progText: '',
          stats: S.stats,
          rows: [],
        }
      }
      const selection = (t) => {
        let cur = { kind: 'site', t0: -1 }
        for (const c of CLICKS) if (c.card && t >= c.t) cur = { kind: c.card, t0: c.t }
        return cur
      }
      const SEL_OBJ = (kind, t) =>
        ({
          te: W.objects.te.group,
          stack: t < T.sep ? W.objects.booster.group : null,
          farm: W.objects.farm.group,
          booster: W.objects.booster.group,
          crane: W.objects.crane.group,
          capsule: W.objects.cap2.group,
        })[kind] ?? null
      const SEL_TEXT = (kind, t) =>
        ({
          te: ['TE-2', teState(t)[0]],
          stack: ['B1107', t < T.lift ? 'Pad 7' : 'Climbing'],
          farm: ['Tank farm', 'Loading'],
          booster: ['B1107', boosterState(t)[0]],
          crane: ['CR-1', t < T.convoy[1] ? 'En route' : 'On station'],
          capsule: ['SR-19', `${(ST.gap ?? 52).toFixed(1)} m`],
        })[kind]

      const proj = (v) => st.project(v)
      const targetOf = (c) => (c.ui ? c.ui : (proj(W.anchors[c.at]()) ?? [800, 450]))
      const GLIDE = 1.0
      const cursorAt = (t) => {
        let prev = [1050, 620]
        let hand = true
        for (const c of CLICKS) {
          if (t < c.t - GLIDE) return { p: prev, hand }
          const target = targetOf(c)
          if (t < c.t) {
            const k = sm((t - (c.t - GLIDE)) / GLIDE)
            return {
              p: [
                lerp(prev[0], target[0], k),
                lerp(prev[1], target[1], k) - 16 * Math.sin(Math.PI * k),
              ],
              hand: !c.ui,
            }
          }
          prev = target
          hand = !c.ui
        }
        return { p: prev, hand }
      }
      const clickAt = (t) => {
        let v = 0
        for (const c of CLICKS) if (t >= c.t && t < c.t + 0.7) v = Math.max(v, 1 - (t - c.t) / 0.7)
        return v
      }
      const dropOpen = (t) => ss(39.9, 40.2, t) * (1 - ss(40.95, 41.2, t))
      const kpiFor = (t) => {
        const site = siteAt(t)
        if (site === 'PAD' && t < T.lift)
          return {
            labels: ['Countdown', 'Propellant', 'Weather'],
            ic: ['clock', 'drop', 'cloud'],
            a: [tShort(missionSec(t)), 'GO', t < T.retract[0] ? 'SR-19 · Pad 7' : 'terminal count'],
            b: [`${Math.round(100 * ST.fuel)}%`, ST.fuel < 1 ? 'LOX' : 'FULL', 'RP-1 · LOX'],
            c: ['94%', 'GO', 'wind 9 kn · Pad 7'],
          }
        if (site !== 'ISS') {
          const n = flightNums(t)
          return {
            labels: ['Mission clock', 'Altitude', 'Speed · km/h'],
            ic: ['clock', 'rocket', 'gauge'],
            a: [
              tShort(missionSec(t)),
              t < T.sep ? 'S1' : t < T.touch ? 'RTLS' : 'DOWN',
              'SR-19 · flight 12',
            ],
            b: [
              `${fmt(n.alt, 1)} km`,
              t < T.sep ? 'S1' : 'B1107',
              t < T.sep ? 'stack · downrange' : 'booster · to LZ-2',
            ],
            c: [
              fmt(n.v),
              t < T.sep ? 'MAX' : 'BRAKE',
              t < T.touch ? 'relative to ground' : 'on the pad',
            ],
          }
        }
        const g = ST.gap ?? 52
        const met = 25 * 60 + 21 + (t - T.orbit) * 0.4
        return {
          labels: ['Mission clock', 'Range to port', 'Closing rate'],
          ic: ['clock', 'rocket', 'gauge'],
          a: [`T+${p2(met / 60)}:${p2(met % 60)}`, 'H', 'day 2 · orbit 17'],
          b: [`${g.toFixed(1)} m`, t < T.capture ? 'IN' : 'MATED', 'forward port · node 2'],
          c: [
            t < T.capture ? (t > T.hold[0] && t < T.hold[1] ? '0.00 m/s' : '0.10 m/s') : '0.00 m/s',
            t < T.capture ? 'OK' : 'HOOKS',
            'limit 0.20 m/s',
          ],
        }
      }
      const trackFor = (t) => {
        const st2 = (a, b) => (t < a ? '' : t < b ? 'on' : 'done')
        if (t < T.orbit) {
          const steps = [
            ['Rollout', 'T−3:30:00', 'truck', st2(-9, T.roll[1])],
            ['Vertical', 'T−2:10:00', 'load', st2(T.roll[1], T.raise[1])],
            ['Fuelled', 'T−0:35:00', 'box', st2(T.raise[1], T.fuel[1])],
            ['Liftoff', 'T−0', 'plane', st2(T.fuel[1], T.lift + 0.4)],
            [t < T.touch ? 'Landing' : 'Landed', 'T+0:07:50', 'check', st2(T.lift + 0.4, T.touch)],
          ]
          const fill =
            t < T.roll[1]
              ? 0.1 * ss(-1.6, T.roll[1], t)
              : t < T.raise[1]
                ? 0.1 + 0.2 * ss(...T.raise, t)
                : t < T.fuel[1]
                  ? 0.3 + 0.2 * ss(T.raise[1], T.fuel[1], t)
                  : t < T.lift
                    ? 0.5 + 0.25 * ss(T.fuel[1], T.lift, t)
                    : 0.75 + 0.25 * ss(T.lift, T.touch, t)
          const s =
            t < T.lift
              ? ['On the pad', 'wait', 'Pad 7 · cargo bay sealed']
              : t < T.sep + 0.3
                ? ['Ascent', 'go', 'Stage 1 burning']
                : ['Second stage', 'go', 'Orbit insertion in 6 min']
          return {
            title: 'Mission Timeline',
            meta: 'Flight 12 · SR-19 resupply',
            fill,
            steps,
            ship: {
              thumb: TH.capsule,
              id: '#SR-19',
              to: 'To: Space station · fwd port',
              stat: s[0],
              statCls: s[1],
              meta: s[2],
            },
          }
        }
        const docked = t >= T.capture
        return {
          title: 'Mission Timeline',
          meta: 'SR-19 · orbit 17',
          fill: docked ? 1 : 0.75 + 0.2 * ss(T.orbit, T.capture, t),
          steps: [
            ['Liftoff', 'Day 1 · 09:41', 'plane', 'done'],
            ['Orbit', 'Day 1 · 09:50', 'box', 'done'],
            ['Phasing', '17 burns', 'load', 'done'],
            ['Approach', 'Day 2 · 10:52', 'truck', docked ? 'done' : 'on'],
            ['Docked', 'Day 2 · 11:04', 'check', docked ? 'on' : ''],
          ],
          ship: {
            thumb: TH.capsule,
            id: '#SR-19',
            to: 'To: Space station · fwd port',
            stat: docked ? 'Docked' : 'Approach',
            statCls: docked ? 'go' : 'in',
            meta: docked
              ? 'Hooks closing · 12 of 12'
              : `Range ${(ST.gap ?? 52).toFixed(1)} m · 0.10 m/s`,
          },
        }
      }
      const tableFor = (t) => {
        const site = siteAt(t)
        if (site === 'ISS')
          return {
            tabs: [
              ['Ports', t < T.capture ? '2/4' : '3/4'],
              ['Crew', '7'],
              ['Arm', '1'],
            ],
            active: 0,
            site: 'Space Station',
            rows: [
              {
                id: 'SR-19',
                org: 'Cargo',
                dot: TOY.blue,
                where: 'Forward port · node 2',
                stat: t < T.capture ? 'Approach' : 'Docked',
                cls: t < T.capture ? 'in' : 'go',
                p: t < T.capture ? null : 100,
                pt: t < T.capture ? `${(ST.gap ?? 52).toFixed(0)} m` : 'mated',
              },
              {
                id: 'CR-31',
                org: 'Crew',
                dot: TOY.teal,
                where: 'Zenith port · node 2',
                stat: 'Docked',
                cls: 'go',
                p: null,
                pt: 'day 88',
              },
              {
                id: 'AR-7',
                org: 'Cargo',
                dot: TOY.orange,
                where: 'Aft port · service module',
                stat: 'Docked',
                cls: 'go',
                p: null,
                pt: 'day 40',
              },
              {
                id: 'ARM-2',
                org: 'Robotics',
                dot: TOY.blue,
                where: 'Truss · mobile base',
                stat: t < T.orbit + 3.5 ? 'Moving' : 'Ready',
                cls: t < T.orbit + 3.5 ? 'in' : 'go',
                p: null,
                pt: 'standby',
              },
            ],
          }
        const conv = ss(T.convoy[0], T.convoy[1], t)
        return {
          tabs: [
            ['Vehicles', '6'],
            ['Pads', '2'],
            ['Boosters', '4'],
          ],
          active: 0,
          site: site === 'PAD' ? 'Pad 7' : 'Landing Zone 2',
          rows: [
            {
              id: 'TE-2',
              org: 'Erector',
              dot: TOY.blue,
              where: 'Pad 7',
              stat: teState(t)[0],
              cls: teState(t)[1],
              p:
                t < T.raise[1]
                  ? 100 * (t < T.roll[1] ? ss(...T.roll, t) : ss(...T.raise, t))
                  : null,
              pt: t < T.raise[1] ? (t < T.roll[1] ? 'rollout' : 'raise') : 'done',
            },
            {
              id: 'B1107',
              org: 'Booster',
              dot: TOY.blue,
              where: t < T.lift ? 'Pad 7' : t < T.touch ? 'In flight' : 'LZ-2',
              stat: t < T.lift ? 'Pad' : t < T.touch ? boosterState(t)[0].split(' ·')[0] : 'Landed',
              cls: t < T.lift ? 'wait' : 'go',
              p: null,
              pt: t < T.lift ? '' : t < T.touch ? `${fmt(flightNums(t).alt, 1)} km` : 'safing',
            },
            {
              id: 'CR-1',
              org: 'Crane',
              dot: TOY.yellow,
              where: conv < 1 ? (conv > 0 ? 'To LZ-2' : 'East gate') : 'LZ-2',
              stat: conv > 0 && conv < 1 ? 'En route' : conv >= 1 ? 'On station' : 'Standby',
              cls: conv > 0 ? 'go' : 'wait',
              p: conv > 0 && conv < 1 ? 100 * conv : null,
              pt: conv > 0 && conv < 1 ? 'driving' : '',
            },
            {
              id: 'TT-3',
              org: 'Trailer',
              dot: TOY.teal,
              where: conv < 1 ? 'East gate' : 'LZ-2',
              stat: conv > 0.2 ? 'En route' : 'Standby',
              cls: conv > 0.2 ? 'in' : 'wait',
              p: null,
              pt: '',
            },
          ],
        }
      }
      const underUI = ([x, y]) =>
        (x > 1130 && y < 560) ||
        (x > 1080 && y > 620) ||
        (x < 1000 && y > 720) ||
        (x < 780 && y < 185)
      const pinsAt = (t) => {
        const out = []
        const pin = (v, a = 1) => {
          const s = proj(v)
          if (s && s[0] > 20 && s[0] < 1580 && s[1] > 80 && s[1] < 880 && !underUI(s))
            out.push({ kind: 'pin', x: s[0], y: s[1], a })
        }
        if (t < 8.6) pin(new THREE.Vector3(2, 9, 6))
        if (t > 11 && t < 17) pin(W.anchors.farm())
        if (t > T.sep + 1 && t < T.touch - 2.5) pin(W.anchors.lz())
        return out
      }

      window.PADLINE = { st, W, camAt }
      return {
        resize,
        render(t) {
          ST = W.pose(t)
          setSky(ST.inOrbit ? 'space' : 'ground')
          const s = selection(t)
          const obj = clean ? null : SEL_OBJ(s.kind, t)
          const fadeIn = ss(s.t0, s.t0 + 0.3, t)
          sel.box(obj, fadeIn)
          const rf = clean ? null : W.routes[s.kind]
          sel.route(rf ? rf(t) : null, ss(s.t0, s.t0 + 0.9, t), 1)
          sel.update()
          const c = camAt(t)
          // up in the air the fog draws back, so the site stays in view under the rocket
          if (!ST.inOrbit) {
            st.scene.fog.near = SKY.ground.near + 1.6 * Math.max(0, c.y)
            st.scene.fog.far = SKY.ground.far + 3.0 * Math.max(0, c.y)
          }
          st.frame({
            tx: c.x,
            ty: c.y,
            tz: c.z,
            az: AZ * D2R,
            el: EL * D2R,
            d: c.d,
            fov: 28,
            sx: clean ? 0 : -110,
            sy: clean ? 0 : 26,
          })
          const tags = pinsAt(t)
          if (obj) {
            const a = proj(W.anchors[s.kind]())
            const [txt, sub] = SEL_TEXT(s.kind, t)
            if (a && !underUI(a))
              tags.push({ kind: 'sel', x: a[0], y: a[1], text: txt, sub, a: fadeIn })
          }
          const cur = cursorAt(t)
          let tool = -1
          for (const cl of CLICKS)
            if (cl.tool != null && t >= cl.t && t < cl.t + 0.6) tool = cl.tool
          const k = kpiFor(t)
          k.labels.forEach((l, i) => {
            if (kpiLabels[i].textContent !== l) kpiLabels[i].textContent = l
            const ic = ICONS[k.ic[i]]
            if (kpiIcons[i].dataset.v !== k.ic[i]) {
              kpiIcons[i].innerHTML = ic
              kpiIcons[i].dataset.v = k.ic[i]
            }
          })
          const clock =
            t < T.orbit
              ? 9 * 3600 + 38 * 60 + 12 + t * 10
              : 11 * 3600 + 2 * 60 + 40 + (t - T.orbit) * 8
          ui.update({
            clock: `${p2(clock / 3600)}:${p2((clock / 60) % 60)}:${p2(clock % 60)}`,
            site: SITES[siteAt(t)],
            kpi: { a: k.a, b: k.b, c: k.c },
            card: cardAt(t, s.kind, s.t0),
            track: trackFor(t),
            table: tableFor(t),
            drop: { open: dropOpen(t), sites: DROP_SITES(t), on: t > 40.5 ? 2 : 1 },
            tool,
            tags,
            cursor: cur.p,
            hand: cur.hand,
            click: clickAt(t),
          })
          return { bg: ST.inOrbit ? W.SPACE.bg : TOY.bg }
        },
      }
    }
  )
}
