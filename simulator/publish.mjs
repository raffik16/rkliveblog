#!/usr/bin/env node
// Builds Pitline into one self-contained page and publishes it at public/pitline/index.html.
//
//   SIMULATOR_SKILL=/path/to/simulator node simulator/publish.mjs
//
// The build is the simulator skill's own (sims/build.mjs): it bundles simulator/pitline-film/main.js with three.js,
// inlines the fonts and the kit's CSS, and writes one HTML file that works offline. This script then gives that page
// the blog's metadata (title, description, canonical, share card, icon) and copies it into public/.
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const SKILL = process.env.SIMULATOR_SKILL;
if (!SKILL || !fs.existsSync(path.join(SKILL, 'sims/build.mjs'))) {
  console.error('Set SIMULATOR_SKILL to the folder the simulator skill is installed in (it holds sims/build.mjs).');
  process.exit(1);
}

const out = fs.mkdtempSync(path.join(os.tmpdir(), 'pitline-'));
execFileSync('node', [path.join(SKILL, 'sims/build.mjs'), path.join(HERE, 'pitline-film')], {
  stdio: 'inherit',
  env: {...process.env, SIMULATOR_OUT: out},
});
let html = fs.readFileSync(path.join(out, 'dist', 'pitline-film.html'), 'utf8');

const SITE = 'https://me.raffi.website';
const TITLE = 'Pitline · a race team simulator';
const DESC = 'A toy race circuit that runs itself: live telemetry, a strategy call made in milliseconds, a 2.4 s pit stop, a wind tunnel run and an undercut, in code.';
const ICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Cpath d='M20 3l15 8.5v17L20 37 5 28.5v-17z' fill='%232448c8'/%3E%3Cpath d='M20 3l15 8.5L20 20 5 11.5z' fill='%236f98f7'/%3E%3Cpath d='M20 20l15-8.5v17L20 37z' fill='%233166ea'/%3E%3C/svg%3E";
const head = `<title>${TITLE}</title>
<meta name="description" content="${DESC}">
<link rel="canonical" href="${SITE}/pitline">
<meta name="theme-color" content="#dfe6fa">
<meta property="og:type" content="website">
<meta property="og:title" content="${TITLE}">
<meta property="og:description" content="${DESC}">
<meta property="og:url" content="${SITE}/pitline">
<meta property="og:image" content="${SITE}/static/images/og/pitline.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${ICON}">`;
html = html.replace(/<title>[^<]*<\/title>/, head);
// the kit inlines JetBrains Mono for its film HUD; Pitline's app is all Inter, so the page leaves it out
html = html.replace(/@font-face\{font-family:'JetBrains Mono'[^}]*\}\n?/g, '');
// what the canvas shows, for screen readers and for anyone without JavaScript
html = html.replace(
  '<div id="app"></div>',
  `<h1 style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Pitline: a race team simulator</h1>
<p style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">A 47-second film of a toy race circuit that runs itself, with a race team's app over it. Car 9 gets a strategy call to pit a lap early, changes tyres in 2.4 seconds, and comes out ahead of car 3 when car 3 pits a lap later. On the way the view visits the team's wind tunnel. Space pauses, the arrow keys skip 2 seconds, and keys 1 to 4 jump to the chapters. <a href="/blog/pitline-race-strategy-simulator">Read how it was built</a>.</p>
<noscript><p style="font:16px/1.5 system-ui;padding:24px">Pitline needs JavaScript and WebGL. <a href="/blog/pitline-race-strategy-simulator">Read how it was built</a>.</p></noscript>
<div id="app"></div>`,
);
const dest = path.join(ROOT, 'public', 'pitline');
fs.mkdirSync(dest, {recursive: true});
fs.writeFileSync(path.join(dest, 'index.html'), html);
fs.rmSync(out, {recursive: true, force: true});
console.log(`public/pitline/index.html  ${(html.length / 1024).toFixed(0)} KB`);
