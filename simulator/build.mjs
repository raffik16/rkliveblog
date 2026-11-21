// Builds the Padline page: bundles simulator/sims/launch-page/main.js (the film, its models and the kit files it
// uses) with three.js into public/padline/padline.js. The page itself (public/padline/index.html), its font and its
// poster are plain files next to it.
//
//   node simulator/build.mjs
//
// Uses the blog's own esbuild and three (the versions in package.json), so nothing else needs installing.
import esbuild from 'esbuild'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const outfile = path.join(here, '..', 'public', 'padline', 'padline.js')

const banner = `/*! Padline: a toy launch site that runs itself. https://me.raffi.website/padline
 * Built on the simulator kit by Nyxera0x and whaleyxbt (MIT): https://github.com/Nyxera0x/simulator
 * Source: simulator/ in the blog's repository. three.js is MIT licensed; its notice is at the end. */`

const result = await esbuild.build({
  entryPoints: [path.join(here, 'sims', 'launch-page', 'main.js')],
  bundle: true,
  format: 'esm',
  target: 'es2022',
  minify: true,
  legalComments: 'eof',
  banner: { js: banner },
  outfile,
  metafile: true,
  logLevel: 'warning',
})
const bytes = Object.values(result.metafile.outputs)[0].bytes
console.log(`${path.relative(process.cwd(), outfile)}  ${(bytes / 1024).toFixed(0)} KB`)
