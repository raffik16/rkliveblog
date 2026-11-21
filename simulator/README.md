# Padline

A toy rocket launch site that runs itself, served at [/padline](https://me.raffi.website/padline) and written up in
[the blog post](../data/blog/padline-launch-site-simulator.mdx). It is a fifth system for
[simulator](https://github.com/Nyxera0x/simulator), a Claude Code skill by Nyxera0x and whaleyxbt that rebuilds an
industry as a live toy-scale map with a product UI on top. The kit ships an airport, a car plant, a construction site and
a warehouse network. Padline adds a launch site and a space station on the same look.

## Build

```
node simulator/build.mjs
```

That bundles `sims/launch-page/main.js` and everything it imports, three.js included, into `public/padline/padline.js`
(about 810 KB, 224 KB gzipped). It uses the blog's own `esbuild` and `three` (0.186.1, the version the kit pins), so
nothing else needs installing. `public/padline/index.html`, `inter.woff2` and `poster.jpg` are plain files.

## What is where

| Path                            | What                                                                                    |
| ------------------------------- | --------------------------------------------------------------------------------------- |
| `sims/launch-shared/rocket.js`  | The booster (legs, grid fins), the upper stage, the capsule, the transporter-erector    |
| `sims/launch-shared/complex.js` | The ground: hangar, rails, launch mount, tank farm, towers, LZ-2, the recovery vehicles |
| `sims/launch-shared/orbit.js`   | The space station and the Earth below it, and the colours for the sky in orbit          |
| `sims/launch-shared/effects.js` | Exhaust flames and the instanced puffs (steam, contrail, vapour, thrusters, dust)       |
| `sims/launch-shared/world.js`   | The layout, the timetable `T`, the flight paths and `pose(t)`                           |
| `sims/launch-shared/film.js`    | The camera, the clicks, every card and number in the product UI                         |
| `sims/launch-shared/run.js`     | The page's runtime: the letterboxed frame and the player under it                       |
| `sims/airport-shared/`          | Vendored from the kit (see below)                                                       |

Every model is code. `render(t)` is a pure function of time, so the player's scrubber can jump anywhere and the frame
is the same as playing up to it.

## Vendored files

`sims/airport-shared/` holds seven files from [Nyxera0x/simulator](https://github.com/Nyxera0x/simulator) at commit
`57d562c`: `style.js`, `stage.js`, `ui.js`, `select.js`, `thumbs.js`, `airside.js` and `gse.js`, unchanged. The eighth,
`avatar.js`, is replaced: the kit's operator photo is swapped for initials on a blue disc. They are kept as they are
upstream, so they are left out of the blog's ESLint and Prettier runs. The kit is MIT licensed; its notice is in
[LICENSE](LICENSE).

The page's font is Inter (`public/padline/inter.woff2`, from `@fontsource-variable/inter`), under the SIL Open Font
License 1.1.
