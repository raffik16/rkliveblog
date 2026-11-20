# BACKSPIN

A beat-pad rhythm game with a turntable, for the browser. Notes fly down a tunnel in a 3D club
to eight pads: hit each one's pad as it lands, scratch the record when the round notes come, cut
the crossfader, freestyle for eight bars and keep the crowd going. Play the pads on the keyboard,
on a MIDI pad controller, with the mouse alone, with three keys and the mouse on six pads
(Hybrid) or with your fingers on a touch screen, and practise any part of the song slowed down.

It is plain HTML, CSS and JavaScript modules: no framework and no build step. The one library is
[three.js](https://threejs.org), for the club, kept in this folder as `vendor/three.js`. Every
sound (the drums, the bass, the chords, the horns, the scratch record's "ahh" and the effects) is
synthesized in code when the page loads. There are no audio files.

Play it at [me.raffi.website/backspin](https://me.raffi.website/backspin), and read how it was
made in [the blog post](https://me.raffi.website/blog/backspin-turntable-rhythm-game).

## Running it

Serve this folder over HTTP and open it:

```bash
cd public/backspin
python3 -m http.server 8000
```

Then go to <http://localhost:8000>. It has to be `localhost` or `https`: the scratch engine is an
AudioWorklet, Web MIDI needs a secure page too, and opening `index.html` straight from disk
(`file://`) won't work, because ES modules and worklets are fetched like any other request.

It runs in current Chrome, Edge, Firefox and Safari, with WebGL. Chromium browsers deliver mouse
movement most precisely (`pointerrawupdate`), so scratching feels best there. Safari has no Web
MIDI, so pad controllers need one of the others.

### URL options

| Option                       | What it does                                                                                                                  |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `?mute`                      | Runs everything with the master volume at zero                                                                                |
| `?debug`                     | Shows frame rate, output latency, offset, render size and MIDI state                                                          |
| `?autoplay=easy,medium,hard` | A bot plays the listed levels in a row, for testing                                                                           |
| `&miss=0.2&jitter=0.1`       | With autoplay: skip a fifth of the notes, hit the rest up to 100 ms late                                                      |
| `&practice=verse&speed=75`   | With autoplay: practise a section instead (`&times=2` to loop it)                                                             |
| `?mouse`, `?hybrid`          | Plays with the mouse, or in Hybrid, this time; with autoplay the bot clicks (and in Hybrid presses `A`, `S`, `D` and `Space`) |
| `?poster`                    | Draws one still frame mid-song (used for the share image)                                                                     |

### Rebuilding three.js

`vendor/three.js` is a minified bundle of the parts of three.js the game uses, made from
`vendor/three-entry.js` with esbuild (run from the repository root, where three.js is installed):

```bash
npx esbuild public/backspin/vendor/three-entry.js --bundle --minify --format=esm --outfile=public/backspin/vendor/three.js
```

If `src/scene.js` starts using another part of three.js, add it to the list in
`three-entry.js` first.

## Controls

| Input                                               | Action                                                             |
| --------------------------------------------------- | ------------------------------------------------------------------ |
| `A` `S` `D` `F`                                     | The bottom row of pads: kick, snare, open hat, clap                |
| `Q` `W` `E` `R`                                     | The top row: laser, crash, vox, horn                               |
| `J` `K` `L` `;` and `U` `I` `O` `P`                 | The same eight pads under the right hand                           |
| Hold the mouse button and move up and down          | Scratch: up plays forward, down plays backward                     |
| `Z` / `X` / `C`                                     | Crossfader left / centre / right                                   |
| `Space`                                             | Hype Boost, when the meter is full                                 |
| `1` / `2` / `3`                                     | Switch to loop A / B / C (freestyle and sandbox)                   |
| `4`                                                 | The song's own pad hits on or off (sandbox)                        |
| `Esc`                                               | Pause                                                              |
| A MIDI pad controller                               | Its first eight pads are the game's eight; velocity sets level     |
| Mouse (a choice with the level): click, drag, slide | All of the above on screen, one click at a time                    |
| Hybrid: `A` `S` `D` and the mouse                   | Six pads: kick, snare, clap on the keys; crash, vox, horn by mouse |
| Touch: tap a pad, drag on the record, tap the fader | All of the above on screen, with every finger on its own           |

Playing with the keyboard, hold the mouse button anywhere on the club and move it up and down to
scratch. The cursor stays on screen, with an arrow up and an arrow down, and fills in while you
hold the record. The press is captured, so a stroke can run off the window and keep going.

### Beat pads

The pads are laid out like the 2×4 pads of a controller: the bottom row is the drum kit you
finger-drum the beat on, and the top row is for the bigger moments. VOX plays the scratch
record's "ahh" from its cue, like a hot cue, and HORN plays whatever stab the song has at that
moment.

**MIDI.** Connect a controller in Settings. Web MIDI is only asked for then (the browser shows a
permission prompt), and once it has been allowed the game reconnects by itself on later visits.
Most pad controllers send notes 36 to 43 (C1 to G1) from their first eight pads, bottom row
first, which is the order of the pads on screen; a 4×4 controller's top two rows (44 to 51) play
the same eight again, and other notes wrap around the same way. Any pad can be taught another
note: pick it in Settings and hit the pad you want for it. Velocity sets how loud a hit plays,
and each MIDI message is judged by its own timestamp, like a key press.

### Mouse, Hybrid and touch

**Choosing.** The game starts on whatever suits the device: touch where the main pointer is a
finger (a phone, a tablet), the keyboard on a computer. The choice is with the levels, in
Practice and in Settings, and offers only what the device has: Mouse and Hybrid with a mouse or a
trackpad, Touch with a touch screen (some laptops have both), the keyboard always. Once you pick
one it sticks, on that device.

**Mouse.** Choose Mouse and the mouse plays everything on screen: click a pad to hit it, hold the
record and drag it up and down to scratch, click the crossfader where you want it or slide it, click
the hype meter when it's full to boost, click the loops under the Beat Deck in the freestyle, and ❚❚
pauses. The cursor shows what a click would do: a ring over nothing, the pad's colour over a pad,
lime over the crossfader and the buttons, and up and down arrows over the record, filled in while
you hold it. The cursors are drawn in code as the page loads (`src/cursors.js`) and handed to the
browser in CSS, so the system draws them straight from the mouse, with none of the lag a cursor
drawn by the game would have. Each click that hits something flashes a ring on the HUD where it
landed. One pointer can't be in two places, so each level is thinned once more for it: never two
notes at once, nothing on the pads while the hand is on the record, and at least half a beat to get
from one pad (or the record, or the fader) to another. A note on the same pad can follow straight
on. Scratches and cuts are placed first, then the pads in order of importance. Easy already plays
one thing at a time, so it keeps all 70 notes; Medium goes from 103 to 91 and Hard from 132 to 116.
The song plays the hits this leaves out, and mouse runs keep their own best scores.

**Hybrid.** Six pads in three columns. The other hand plays the bottom row on `A`, `S` and `D`
and boosts with `Space`: the kick and the snare on their keyboard keys, and the clap on `D`, where
the keyboard has the open hat (the hat has two notes in the whole song, the clap four on every
level). The mouse plays the row above, the crash, the vox and the horn (the pads with the most
notes in the charts after the drums), and the record and the crossfader as it does in Mouse. The
hat and the laser sit Hybrid out: their notes come out of the charts, and the song plays its hats
itself. Every kick, snare and clap note stays, and only the mouse's notes are thinned for one
pointer, so Easy has 66 notes, Medium 89 and Hard 115. The layouts are `LAYOUTS` in
`src/pads.js`, and Hybrid runs keep their own best scores too.

**Touch.** On a touch screen the club is the controller the same way: tap the pads, put a finger
on the record and drag it up and down, tap or slide the crossfader, and tap the hype meter, the
loops and ❚❚. Every finger is its own pointer, so you can drum with one hand and scratch with the
other, and the charts are the full ones. Where the screen reports pressure, it sets the velocity.
Each tap that hits something flashes a ring big enough to show around your finger. Hold it either
way up: on a phone or a tablet held upright the club stacks (see Fitting the screen), so the pads
are as big as they are sideways, or bigger. On Android and on an iPad a run goes full screen, so
the browser's bars don't take room and an edge swipe can't scroll the page or go back (an iPhone
doesn't let a page do that). While a run is on, Safari's double-tap zoom, pinch zoom and
magnifier are switched off over the club, and the menus don't wait to see if a tap is a double
tap. On an iPhone the game asks for media playback (`navigator.audioSession`, Safari 17 and
later), so it plays with the silent switch on, the way a video does.

**Fitting the screen.** The rig goes side by side on a wide screen: a deck either side of the pads
and the crossfader under them. On a tall one that leaves the pads tiny, so it stacks instead: the
crossfader under the pads and the two decks under that. `fit()` in `src/scene.js` works out how big
each arrangement could be, leaving room for the HUD round it (a band along the top for the score
and the hype meter, the labels and loop buttons under the decks), takes the one with bigger pads
(side by side unless stacking is clearly better), and sets the camera so the rig fills the space.
On a big screen the side-by-side club keeps its roomy framing; it only fills the screen more
tightly where the pads would otherwise be under 110 pixels. Upright, an iPhone's pads go from 41
to 69 pixels and an iPad's from 82 to 127; held sideways, an iPhone's go from 62 to 75. The menus
lay themselves out flatter on a short screen (a phone held sideways): the title's buttons and the
levels side by side, the practice choices and the results in two columns.

**Hit areas.** A pad answers a click or a tap a little past its edges: halfway across the gap to
the next pad, so neighbours meet but never overlap, and further on the outside of the grid (a
whole gap at the sides, more when stacked, more again above it, half a gap below it), which still
stops short of the record and the crossfader (`measure()` in `src/scene.js`).

## How it plays

- **Every pad is an instrument.** It always sounds when you hit it. The song has its own pad part
  (kicks, snares, claps, open hats and horn stabs in its loops). A pad note in the chart hands one
  of those hits to you, and it sounds only if you play it; the hits the chart doesn't give you,
  the song plays itself. So every level sounds like the whole song when it's played well, and a
  missed note leaves a hole in it. The laser, the crash and the vox are yours alone.
- **Pad notes** are judged on the audio clock: Perfect within ±45 ms, Great ±90 ms, Good ±135
  ms. A hit with no note near it, in the middle of charted play, costs a little hype but never
  breaks the combo.
- **Scratch notes** are round, and fly down their own lane into the record. Move the record the
  way the arrows point for the length of the note. The score is the share of it you spent moving
  the right way, fast enough.
- **Fade notes** are bars that land under the pads, with a marker over the crossfader notch.
  Have the crossfader in that position as the bar lands.
- **Two decks and a crossfader.** The Scratch Deck (left) is silent until you move the record or
  hit VOX. The Beat Deck (right) plays the song. The crossfader is equal-power: in the centre each
  deck is 3 dB down; hard left is only the scratch record, hard right only the beat.
- **Combo** multiplies the score: ×2 at 10, ×3 at 20, ×4 at 30.
- **Hype** (0–100) rises with good hits and long combos and falls on misses. When it's full,
  `Space` (or a click or tap on the meter) doubles your score for eight beats.
- **The freestyle** is eight bars with no notes. The crowd scores it live: hits and scratch moves
  close to the 8th and 16th grid score most (up to two pad hits in a 16th count), each bar pays a
  bonus for variety (the drums, the laser, the vox, the horns, cuts, both ways of scratching and
  loop switches), and every beat of dead air costs points.
- **Results** show score, accuracy, max combo, grade (S ≥ 95%, A ≥ 88%, B ≥ 78%, C ≥ 65%, else
  D), what the crowd thought of you, and your timing: how early or late you were on average, how
  widely your hits spread, and each pad's average.

### Practice

Practice loops one part of the song (the verse, the scratch section, the freestyle, the final
part, or the whole song) at 60, 75, 90 or 100% speed, 1, 2, 4 or 8 times through, on any level.
A slower speed renders the band again at that tempo (once; it's kept for next time), so it's the
same groove slower rather than stretched audio. A bar of count-in clicks starts each run. With
the guide on, your part plays quietly underneath you, every hit shows how many milliseconds early
or late it was, and the results show your timing pad by pad. Practice runs don't count for best
scores.

### Calibration

Every setup hears sound a little late and sends key presses a little late: Bluetooth headphones
by 150 ms or more. Calibrate plays four count-in clicks and eight more; tap along to the eight.
The offset is the median of how far your taps landed from the clicks, and every hit after that is
judged with it taken off. The notes on screen move by the same amount, so they still land as you
hear the sound. You can nudge it by 5 ms in Settings.

The offset, the scratch sensitivity, how you play (once you've picked), the MIDI settings, the
practice settings
and your best score on each level are kept in `localStorage` under `backspin.v2` (the offset and
the sensitivity carry over from `backspin.v1`). If storage is blocked the game still runs with
the defaults.

## The chart format

A chart is JSON, written in beats. `src/charts/track1.json` is the Hard chart for "Low Light";
Medium and Easy are made from it in code.

```json
{
  "title": "Low Light",
  "bpm": 95,
  "lengthBeats": 144,
  "arrangement": ["A", "A", "A", "B", "B", "C", "C", "C", "A"],
  "sections": [
    { "type": "intro", "label": "Intro", "startBeat": 0, "endBeat": 16 },
    { "type": "freestyle", "label": "Freestyle", "startBeat": 80, "endBeat": 112 }
  ],
  "notes": [
    { "type": "pad", "pad": "kick", "beat": 16 },
    { "type": "pad", "pad": "snare", "beat": 17 },
    { "type": "pad", "pad": "horn", "beat": 35.5 },
    { "type": "scratch", "beat": 49, "dir": "up", "len": 1 },
    { "type": "scratch", "beat": 50, "dir": "down", "len": 1 },
    { "type": "fade", "beat": 113, "pos": "L" }
  ]
}
```

- **`arrangement`** lists the 4-bar loop (A, B or C, defined in `src/music.js`) that plays in
  each 16-beat block of the song.
- **`sections`** each have a `type`, a `label` shown on screen and a start and end beat.
  `intro` brings the bass, keys and horns in after eight beats; `outro` thins the beat out and
  ends with a vinyl brake; `freestyle` has no notes and is scored live. Other types (`verse`,
  `scratch`, `final`) are just names, and Practice offers each of them.
- **Note `beat`s** are counted from the first beat of the song, in straight time. The song
  swings its 16ths (the off 16th lands at 55%), and notes on off-16ths are moved to match.
- **Note types:**
  - `pad`: hit `pad` (`kick`, `snare`, `hat`, `clap`, `laser`, `crash`, `vox` or `horn`). For
    the kick, snare, open hat, clap and horns, put the note on a hit the loop already has (see
    `loopEvents` in `src/music.js`): that hit becomes yours. The laser, the crash and the vox are
    only ever played by you.
  - `scratch`: move the record `dir` (`"up"` or `"down"`) for `len` beats
  - `fade`: have the crossfader at `pos` (`"L"`, `"C"` or `"R"`) on the beat

**Thinning** (`src/chart.js`): Medium keeps kicks on whole beats only, no open hats, horns and
vox at least three 16ths apart, scratch chains with at most one change of direction per beat, no
pads during a scratch and no laser within a quarter beat of another note. Easy drops the kicks
and hats, keeps the first horn of each bar, lasers on whole beats and vox on whole beats two
beats apart, turns each scratch chain into a single push, keeps only the first crossfader cut
and its return to centre, and never puts two notes within half a beat of each other. Played with
the mouse or in Hybrid, each level goes through one more pass for one pointer, and Hybrid drops
the notes for the two pads it doesn't have (see Mouse, Hybrid and touch, above).

## How it works

| File                                   | What's in it                                                                                                                       |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `src/music.js`                         | The song as data: tempo, swing, chords, the three loops and their pad parts                                                        |
| `src/synth.js`                         | Renders every sound with `OfflineAudioContext`: drums, bass, keys, horns, the scratch record, the laser and the riser              |
| `src/scratch-worklet.js`               | The Scratch Deck: an AudioWorklet that plays the record from a playhead your hand moves                                            |
| `src/engine.js`                        | The AudioContext, the two decks, the pads, the crossfader, song scheduling and practice tempos                                     |
| `src/clock.js`                         | The master clock: turns an input's timestamp into the audio time being heard                                                       |
| `src/pads.js`                          | The eight pads: names, colours, keys and MIDI notes, and where they sit (all eight, or Hybrid's six)                               |
| `src/input.js`                         | Keys, the mouse (on the record, or playing the picture) and touch                                                                  |
| `src/cursors.js`                       | The cursors for playing with the mouse, drawn in code                                                                              |
| `src/midi.js`                          | MIDI pad controllers through Web MIDI, with MIDI learn                                                                             |
| `src/chart.js`                         | Loads charts, thins them into Medium and Easy (and for one pointer), and builds practice loops                                     |
| `src/game.js`                          | Judging, score, combo, hype, the boost, the freestyle and timing statistics                                                        |
| `src/scene.js`                         | The 3D club in three.js: the tunnel, the pads, the notes, the decks, the crowd and the lights (and why no shader may make a NaN)   |
| `src/hud.js`                           | The 2D layer over it: score, combo, hype, judgements, pad labels, buttons for play without keys, and the flash where a click lands |
| `src/ui.js`, `index.html`, `style.css` | The menus                                                                                                                          |
| `src/calibrate.js`                     | The tap-along calibration                                                                                                          |
| `src/storage.js`                       | Settings and best scores in `localStorage`                                                                                         |
| `src/bot.js`                           | The autoplay bot for testing                                                                                                       |
| `src/main.js`                          | Start-up, screens and the frame loop                                                                                               |
| `vendor/three.js`                      | three.js (MIT), bundled from `vendor/three-entry.js`                                                                               |

**The scratch record.** The worklet keeps a fractional playhead into a one-bar phrase (a
formant-filtered "ahh" and a brass stab) and reads it with cubic interpolation, forwards or
backwards, at whatever speed your hand moves it. There are no recorded scratch sounds: every
noise you make is the record itself. Browsers deliver mouse movement in bursts, often once per
frame, so each movement is sent with the time the mouse reported it, and the worklet replays the
hand's path a few milliseconds behind real time. That keeps the pitch steady instead of
fluttering at the frame rate. The speed is smoothed with a 5 ms one-pole, so grabbing and
releasing never click. Fling the record and let go and it keeps spinning, slowing with friction:
a backspin. Faster playback reads from pre-filtered copies of the record so it doesn't alias, and
vinyl hiss and crackle rise with speed.

**Timing.** Nothing is judged on `performance.now()` or animation frames. The song is scheduled
on the AudioContext's clock. `getOutputTimestamp()` says which context time is coming out of the
speakers at which page time, so a key press's, a MIDI message's or a touch's event timestamp can
be turned into "what the player was hearing" on the audio clock, minus their calibrated offset.

**Drawing.** The camera looks straight down a tunnel at the pads, so the two rows never cover each
other and every note flies straight at its pad. Moving the rig up or down the screen to fit it is a
shift of the lens (`setViewOffset`), not a tilt of the camera, so the lanes still meet in the
middle of the grid. Notes, pad frames, lights, lasers, the crowd and the
sparks are instanced meshes from fixed pools, updated in place, so a frame allocates nothing. The
crowd bounces in a vertex shader, and their arms go up as the hype passes each one's threshold. The
club renders into a HalfFloat target for the bloom, so the neon can go brighter than white without
the dark gradients banding, then FXAA smooths the edges on screens with big pixels. The bloom blurs
the whole frame down to a few pixels and back, so a single pixel that comes out NaN turns the whole
frame black for a frame: a flicker. On Apple's GPUs `pow()` of a negative number is NaN, and
interpolation can push a value a hair past the end of its range, so the shaders clamp before `pow()`
and never divide by something that can be zero. If frames keep coming slowly, it lowers the
resolution (between frames, since a resize wipes the canvas), then turns the glow off. The score,
the combo and the labels are drawn on a 2D canvas over the club, and their text is only rebuilt when
a value changes. The scratch record on screen turns to wherever the playhead really is. With
`prefers-reduced-motion`, the camera doesn't shake, the crowd barely moves and the lights stay
still.
