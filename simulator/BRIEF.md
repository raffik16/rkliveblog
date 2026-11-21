# The model brief for Pitline

The simulator skill's `docs/BRIEF.md`, filled in for a race circuit. It went to the two subagents that built the
models. The world layout, the race timing, the camera, the UI and the film came afterwards, on top of their kits.

## What this is

We are rebuilding a motor racing circuit, a race team's pit box and its wind tunnel, in the format of the simulator
skill's four films (Rampline, Plantline, Buildline, Stockline). The look must match those films: when we invent our
own look, it comes out weak. Your job is the **3D models only**.

## Study the reference first

`$SCRATCH/frames/plant.png` and `$SCRATCH/frames/wh20.png` are full-size frames of two of the skill's films;
`$SKILL/docs/*.gif` are the films themselves. Open them before writing anything:

- **Toy proportions.** Vehicles big against the buildings, simple chunky rounded forms. Small real details are left
  out; the ones that stay are made bigger.
- **Premium finish.** Generous bevels on every edge, matte paint with a soft sheen, soft contact shadows, crisp dark
  tyres with light hubs, dark glass, neat panel lines, numbers and names printed cleanly. Cheap = flat boxes, sharp
  corners, noisy detail, plastic shine.
- **Few colours.** Blue and white on a lavender ground. Yellow only on the working machines (here: the pit
  equipment). Green only on trees. The other teams' liveries in small amounts.
- **Readable at a glance.** Every object recognisable from its silhouette at thumbnail size, from 36 degrees up.
- **Keep everything low.** The camera sits at 36 degrees: tall things hide the work. Nothing above 10 m.

## The shared look

`simulator/pitline-shared/style.js` holds the palette (`TOY`, including `TOY.livery[team]` and the tyre compound
colours), shared materials (`toyMat`), cached rounded boxes (`rbox`), `mesh`, `labelTexture` for names and numbers,
and the stage. Use it; don't redefine colours. If you need a colour it lacks, say so in your report.
`$SKILL/sims/airport-shared/airside.js` and `gse.js` show the house technique (a `Kit` that merges static parts per
material, `freeze`/`thaw`, `cached`, instancing, rollers for wheels): read them and copy what you need into your file.

## Scale contract

Both kits meet at these numbers. Metres, y up. Every builder returns `{group, ...}`; the group's origin is on the
ground (y = 0).

- **Race car.** Faces **+x**. Origin on the ground under the middle of the wheelbase. 8.4 m long (front wing tip at
  x = +4.6, rear wing trailing edge at x = -3.8), 3.0 m wide over the wheels. Wheelbase 5.2 (front axle x = +2.6,
  rear x = -2.6), wheel centres at z = ±1.22, wheel radius 0.62, tyres 0.55 wide front and 0.70 rear. Floor 0.12 off
  the ground. Halo top y = 1.25, airbox top y = 1.55, rear wing top y = 1.5. Nose 0.45 high at the front axle.
- **Pit box.** The car stops on the box's centre. Front jack pad under the nose at x = +4.2, y = 0.30 when lifting;
  rear jack pad under the crash structure at x = -4.0. A jacked car rises 0.32 m.
- **Pit building.** Front face on its local z = 0, facing +z; 16 m deep (z from -16 to 0); 9 m tall. Garages 30 m
  wide, openings 22 m wide and 5.5 m tall.
- **Pit lane.** 13 m wide in front of the building: the working lane (the boxes) is the 6 m next to the building, the
  fast lane the 7 m beyond. The pit wall stands 1.2 m high on the far side of the fast lane.
- **Track.** 14 m wide. Built by the world (`track.js`), not by you.

## Agent A: the circuit's buildings (`simulator/pitline-shared/circuit.js`)

- `buildPitBuilding({teams, bay = 30})` → `{group, garages: [{team, centre}], length}`. `teams` is a list of the
  livery keys in `TOY.livery` (5 of them); `centre` is the local point on the ground at the middle of each garage's
  opening. Open garage fronts that show the inside (light epoxy floor, tyre racks in blankets, tool chests, a
  timing screen at the back), a team name board above each opening in the team's colours, a roof terrace edge, an end
  block for race control. Low and long.
- `buildPitWall({length})` → `{group}`: a low wall along local x with a short catch fence on the track side (local
  -z).
- `buildPitWallStand({team})` → `{group, anchor}`: the team's pit wall gantry, 8 m long, sitting on the pit wall: a
  bench under a canopy with a row of monitors facing the track. This is the strategists' station; `anchor` is a local
  point above it for the selection tag.
- `buildGrandstand({length = 80, rows = 8})` → `{group}`: 6 m high at most, blue seats, white structure.
- `buildStartGantry({span = 18})` → `{group, setLights(n)}`: two posts and a beam over the track (beam at 6.5 m) with
  5 light pods; `setLights(n)` lights the first n red, n = -1 shows green.
- `buildAeroLab()` → `{group, mount, setFan(angle), setBelt(distance), flow: {x0, x1, y0, y1, z0, z1}, anchor}`: an
  open-top (cutaway) hall about 70 x 30 m, walls 8 m, so the camera sees in. Inside, a closed-circuit wind tunnel laid
  flat: a test section with glass sides along local x, a rolling road (a belt) in its floor, a contraction cone
  upstream, a big fan (blades turn with `setFan`) and the return duct round the loop, a control room with screens.
  Air flows toward **-x** through the test section. `mount` is an Object3D at the belt's surface where a 60% scale
  race car will sit facing +x (its wheels touch the belt). `flow` is the local box the streamlines may fill. A sign
  "AERO LAB · TUNNEL 1".
- `buildMotorhome({team})` → `{group}`: a team's hospitality unit in the paddock, two storeys, 20 m long, team colour
  glass bands.
- `buildMarshalPost()` → `{group}`: a small hut with a flag board.
- Trees: copy `buildToyTrees` (and what it needs) from airside.js.

## Agent B: the cars and the pit equipment (`simulator/pitline-shared/cars.js`)

- `buildRaceCar({team = 'halcyon', number = '9', compound = 'medium', scale = 1})` → `{group, roll(distance),
  setSteer(a), setDRS(k), setWheelOff(i, k), setWheelVisible(i, v), setCompound(i, c), hub(i), length: 8.4}`. A modern
  single-seater, toy-scale: front wing, nose, halo, sidepods, engine cover with a fin, rear wing, floor, four big
  wheels. Wheels i = 0..3 are FL, FR, RL, RR. `setDRS(k)` opens the rear wing's upper flap (k = 0..1, up to 35
  degrees about its leading edge). `setWheelOff(i, k)` slides wheel i outward along its axle, 0.9 m at k = 1.
  `setCompound` recolours the sidewall band ('soft' | 'medium' | 'hard'). `hub(i)` is the local hub centre. The
  number on the nose and the engine cover, the team colours from `TOY.livery`. No driver: a dark cockpit opening and
  a helmet-shaped dark dome are fine, no face, no person.
- `buildWheel({compound = 'medium', side = 1})` → `{group, roll}`: a loose wheel, axle along local z, for the
  wheel carts to carry.
- `buildWheelCart()` → `{group, roll(distance), setShift(k), slots: [a, b]}`: a small yellow machine (a wheel
  changer: think a tiny forklift) that faces +x and presents a wheel to a hub. Two cradles side by side across the
  cart (local z = ±0.8); `setShift(k)` slides the pair so slot a (k = 0) or slot b (k = 1) lines up with the cart's
  centreline. `slots` are Object3Ds at the wheel centre, hub height 0.62 when the car is down (0.94 jacked), wheel axle
  along local x.
- `buildPitJack({end = 'front'})` → `{group, roll(distance), setLift(h), length}`: a low yellow machine that faces
  +x and drives its pad under the car; `setLift(h)` raises the pad from y = 0.18 to y = 0.18 + h (h up to 0.32). The
  pad is at local x = +length/2.
- `buildPitLight()` → `{group, setLight('red' | 'green' | 'off')}`: the box's release light on a short post (3 m).
- `buildTyreRack({compound = 'medium', n = 4})` → `{group}`: a set of wheels in blue tyre blankets on a rack.
- `buildTeamTruck({team})` → `{group, roll, setSteer}`: an articulated race transporter, 16 m, team colours.

## How to work

1. Read the frames, `style.js` and `stage.js`.
2. Copy `simulator/pitline-bench/` to your own bench folder and lay out every model on the ground under the stage.
3. Build and capture (from `$SCRATCH`, with `CHROMIUM` set): `node $SKILL/sims/build.mjs <bench folder>` then
   `node $SKILL/sims/capture.mjs <bench name> --size 1600x900 --dpr 1 --still 1 --out frames/<you>/a.png`, with
   `--config cam.json` (`{"cam": {"x", "z", "d", "az", "el", "ty"}}`) for close-ups.
4. Compare side by side with the reference frames at the same angle and scale. Iterate.
5. Close-up stills of every model plus one whole-scene still.

## Rules

- Touch only your own files.
- No downloads, no new packages. Everything is three.js already in the kit.
- No people built in code: cabs get dark glass.
- Merge static parts per material and instance repeated parts, so a scene with 10 cars and a pit building renders
  fast.
- Report in under 25 lines: what you built, the exported API, the still paths, and anything in `style.js` you would
  change and why.
