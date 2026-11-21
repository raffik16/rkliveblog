# Trickline

One skater's run through a street plaza, followed like a work item down a factory line. R-07, on
board 0712, pushes along the upper terrace and goes through three stations:

| Station | Spot                                                   | Trick                                                 |
| ------- | ------------------------------------------------------ | ----------------------------------------------------- |
| S1      | A 1.7 m fountain channel across the upper terrace      | Hardflip (a kickflip with a frontside pop shove-it)   |
| S2      | A four-stair down to the middle terrace (0.8 m)        | Laser flip (a heelflip with a 360 frontside shove-it) |
| S3      | A ten-stair handrail down to the lower plaza, at 26.6° | Kickflip into a backside 50-50, popped off the end    |

The page is a 40-second film in the style of a production dashboard: a station switcher, KPI
cards, a run tracker, a table of people, boards and spots, and a card for whatever the cursor
clicks. Each station's card holds a process sheet (OP10 to OP50, or OP60 for the rail) that fills
in as the trick happens. Every number on the page (speeds, heights, angles, air times, grind
length) is read from the 3D scene at that frame. The film slows down four or five times through
each trick.

Watch it at [me.raffi.website/trickline](https://me.raffi.website/trickline), and read how it was
made in [the blog post](https://me.raffi.website/blog/trickline-skate-tricks-production-line).

## Built with the simulator toolkit

The look, the camera rules, the dashboard and the selection marks come from
[Nyxera0x/simulator](https://github.com/Nyxera0x/simulator) (MIT licence). The files Trickline
uses are copied into `src/simulator/airport-shared` from commit `57d562c` (see
`src/simulator/UPSTREAM` and `src/simulator/LICENSE`) and kept as close to upstream as possible.
Every change to them is marked with a comment that starts `Trickline`:

- `select.js`: the route ribbon's widths and the box's padding are options, the ribbon rides the
  height of the ground under it, an object can name its own ground, padding or no glow, the glow
  follows the box's footprint, and the box is kept out of the ambient-occlusion pass.
- `ui.js`: a system can bring its own tracker icons, dropdown title and live-pill text.
- `avatar.js`: a drawn silhouette in place of upstream's generated headshot.

## Files

| File            | What it holds                                                                                 |
| --------------- | --------------------------------------------------------------------------------------------- |
| `src/layout.js` | The numbers everything shares: the board, the rider's body, the plaza. No three.js.           |
| `src/plaza.js`  | The plaza: three terraces, the fountain channel, the stairs, the rail, trees and benches.     |
| `src/rider.js`  | The rider and the board, posed from scratch each frame from world-space joints.               |
| `src/ik.js`     | Two-bone IK for the legs and arms.                                                            |
| `src/motion.js` | The run as a function of time: the timetable solved from the plaza, every pose, every flip.   |
| `src/world.js`  | The scene: R-07, a second rider, the filmer, two people on a bench, the selection proxies.    |
| `src/film.js`   | The film: the camera, the slow-motion clock, the clicks, the cards and every number on them.  |
| `src/main.js`   | The player: fits the 1600 × 900 film to the window, plays, pauses, scrubs, jumps to stations. |
| `src/sweep.js`  | The clearance sweep (below).                                                                  |
| `trickline.js`  | The bundle the page loads, built from `src/main.js`.                                          |

## Building it

`trickline.js` is `src/main.js` bundled with three.js by esbuild. Run this from the repository
root, where three.js is installed:

```bash
npx esbuild public/trickline/src/main.js --bundle --minify --format=esm --outfile=public/trickline/trickline.js
```

Then serve this folder over HTTP and open it (opening `index.html` from disk won't load the
module):

```bash
cd public/trickline
python3 -m http.server 8000
```

## The clearance sweep

`src/sweep.js` checks the motion the way the simulator checks its machines for collisions, scaled
down to a skateboard. Every 2 ms through the run it rebuilds the board's outline and the rider's
legs from the same poses the page draws, and measures how far anything goes into anything else:
the board into the ground, the steps or the rail, the board through a leg while it flips, a sole
through the deck, and a foot the leg can't reach. Run it from the repository root:

```bash
node public/trickline/src/sweep.js
```

It prints the worst case of each check at each station and exits with 1 if any goes past its
tolerance (2 to 6 mm).

## Controls and options

| Input      | Action                      |
| ---------- | --------------------------- |
| Space or K | Play or pause               |
| ← and →    | Back or forward two seconds |
| R          | Play from the start         |
| 1, 2, 3    | Jump to S1, S2 or S3        |

| Option        | What it does                                                                                 |
| ------------- | -------------------------------------------------------------------------------------------- |
| `?still=12.3` | Draws that one moment of the film at 1600 × 900 and sets `<body data-ready>` (for stills)    |
| `?capture`    | Draws at 1600 × 900 with no controls and exposes `window.SIM = {DUR, render(t)}` for capture |

With reduced motion turned on, the film starts paused just before the hardflip.
