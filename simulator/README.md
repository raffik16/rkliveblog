# Pitline

A race team's operations app over a toy race circuit that runs itself, built with the
[simulator](https://github.com/Nyxera0x/simulator) skill for Claude Code. It plays at
[me.raffi.website/pitline](https://me.raffi.website/pitline), and the post about it is
[Pitline: Live Telemetry, Aero and a Strategy Call in Milliseconds](https://me.raffi.website/blog/pitline-race-strategy-simulator).

Car 9 runs fourth, 0.85 s behind car 3. The strategy engine calls it in a lap early, two jacks and four wheel machines
change its tyres in 2.4 s, the view visits the team's wind tunnel, and car 3 pits a lap later and comes out of the pit
lane behind car 9: the undercut. `render(t)` is a pure function of time, as the skill requires, so the 46.7 s film can
be scrubbed to any moment and recorded one frame at a time.

## What is where

| File                                | What it does                                                                                                              |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `BRIEF.md`                          | The brief the two model subagents worked from: the look, the scale contract, the builders each one owed                  |
| `pitline-shared/race.js`            | Paths from control points, speed profiles from curvature, time tables, distance at any time. No three.js, runs in Node   |
| `pitline-shared/layout.js`          | The circuit, the pit lane, the eight cars and their pit stops, `carAt(car, t)`, the maps from scene numbers to the app's |
| `pitline-shared/strategy.js`        | The strategy engine: 12,600 races from lap 31 to the flag, run as the page loads                                         |
| `pitline-shared/track.js`           | The track surface, kerbs, lines, barrier, start line, grid and pit lane                                                   |
| `pitline-shared/cars.js`            | The race car, loose wheels, wheel machines, jacks, release light, tyre racks, transporter (subagent B)                   |
| `pitline-shared/circuit.js`         | The pit building, pit wall and stands, grandstand, start gantry, wind tunnel hall, motorhome, marshal post (subagent A)   |
| `pitline-shared/world.js`           | Everything laid out, and `pose(t)`: the cars, the two pit stops, DRS, the tunnel's fan, belt, flap and smoke            |
| `pitline-shared/film.js`            | The camera, the clicks, the cards, the tracker and the timing table                                                       |
| `pitline-shared/ui.js`              | The product app, from the skill's airport kit, with race cards added                                                     |
| `pitline-shared/runtime.js`         | The page: fits the 1600 × 900 frame to any window, play/pause and a scrub bar; `window.SIM.render(t)` for capture        |
| `pitline-shared/style.js`, `stage.js`, `select.js`, `thumbs.js` | From the skill's airport kit: the palette and materials, the lit stage, selection marks, card thumbnails |
| `pitline-film/main.js`              | The page's entry point                                                                                                    |
| `pitline-collide/sweep.mjs`         | The collision sweep: every pair of cars as oriented boxes, every 0.01 s                                                  |
| `pitline-bench*/`                   | Bench pages for stills of the models and the track                                                                       |
| `publish.mjs`                       | Builds the page with the skill's build script and writes `public/pitline/index.html`                                     |

## Building it

The race, the strategy engine and the sweep need only Node:

```bash
node simulator/pitline-collide/sweep.mjs
```

The page is bundled by the skill's own `sims/build.mjs` (three.js 0.186.1, esbuild and the fonts come from the skill's
`node_modules`):

```bash
npx skills add Nyxera0x/simulator -g -a claude-code   # then `npm install` once in the installed folder
SIMULATOR_SKILL=/path/to/the/installed/skill node simulator/publish.mjs
```

Stills and the film come from the skill's `sims/capture.mjs`, pointed at the bundled page:

```bash
cd /path/to/the/installed/skill
node sims/build.mjs /path/to/rkliveblog/simulator/pitline-film
node sims/capture.mjs pitline-film --size 1600x900 --dpr 1 --stills 2.4,14.6,28.4,42.25 --cols 2 --out sheet.png
node sims/capture.mjs pitline-film --size 1600x900 --dpr 0.8 --fps 24 --crf 23 --out pitline-film.mp4
```

## Licence

The parts copied from the simulator skill (named at the top of each file) are MIT licensed, © the skill's author; the
licence is in `LICENSE-simulator`. The rest is under the blog's licence.
