// Records the Pocket Synth to WAV files, one take at a time, and mixes the takes together.
//
//   node scripts/pocket-synth/record.mjs scripts/pocket-synth/made-it-home.mjs out/
//
// A score (the first argument) default-exports
//
//   { name, seconds, fadeOut?, tracks: [{ name, gain, origin, take }] }
//
// where each take is what tape.ts plays, `origin` is how many seconds into its take the song
// starts, and `gain` is its level in the mix. The synth has one sound at a time, so a song is
// recorded the way one is on a four-track: a take per part, then the takes added together.
// Nothing else is done to the sound; the mix is turned up or down as a whole so that its
// loudest moment sits 1 dB under full scale.
//
// It needs a Chromium that Playwright can drive (`npx playwright install chromium`). Playwright
// is not one of the site's dependencies, so it is looked up wherever Node can find it.

import { build } from 'esbuild'
import { mkdirSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SAMPLE_RATE = 48000
const PEAK = Math.pow(10, -1 / 20)
// How much sound is fetched from the browser per call
const CHUNK = 15 * SAMPLE_RATE

const here = path.dirname(fileURLToPath(import.meta.url))
const [scoreFile, outDir = '.'] = process.argv.slice(2)
if (!scoreFile) {
  console.error('Usage: node scripts/pocket-synth/record.mjs <score> [out-dir]')
  process.exit(1)
}

// A score borrows the synth's own presets, which are TypeScript, so it is bundled before it
// is loaded
const bundled = (entry, options) =>
  build({ entryPoints: [entry], bundle: true, write: false, ...options }).then(
    (result) => result.outputFiles[0].text
  )
const scoreModule = await bundled(path.resolve(scoreFile), { format: 'esm', platform: 'node' })
const { default: score } = await import(
  `data:text/javascript;base64,${Buffer.from(scoreModule).toString('base64')}`
)

// 24-bit PCM. The engine's soft clipper keeps every take inside full scale, and the mix is
// scaled before it gets here, so nothing is clipped on the way to the file.
function wav(channels) {
  const frames = channels[0].length
  const bytesPerFrame = channels.length * 3
  const out = Buffer.alloc(44 + frames * bytesPerFrame)
  out.write('RIFF', 0)
  out.writeUInt32LE(36 + frames * bytesPerFrame, 4)
  out.write('WAVEfmt ', 8)
  out.writeUInt32LE(16, 16)
  out.writeUInt16LE(1, 20)
  out.writeUInt16LE(channels.length, 22)
  out.writeUInt32LE(SAMPLE_RATE, 24)
  out.writeUInt32LE(SAMPLE_RATE * bytesPerFrame, 28)
  out.writeUInt16LE(bytesPerFrame, 32)
  out.writeUInt16LE(24, 34)
  out.write('data', 36)
  out.writeUInt32LE(frames * bytesPerFrame, 40)
  let at = 44
  for (let i = 0; i < frames; i++) {
    for (const channel of channels) {
      const sample = Math.max(-1, Math.min(1, channel[i]))
      out.writeIntLE(Math.round(sample * 0x7fffff), at, 3)
      at += 3
    }
  }
  return out
}

const peakOf = (channels) =>
  channels.reduce((peak, channel) => channel.reduce((p, s) => Math.max(p, Math.abs(s)), peak), 0)

const decibels = (level) => `${(20 * Math.log10(Math.max(level, 1e-9))).toFixed(1)} dB`

const recorder = await bundled(path.join(here, 'tape.ts'), { format: 'iife', target: 'es2022' })

const { chromium } = createRequire(import.meta.url)('playwright')
const browser = await chromium.launch()

try {
  const page = await browser.newPage()
  page.on('pageerror', (error) => console.error(`In the browser: ${error.message}`))
  await page.addScriptTag({ content: recorder })

  const frames = Math.round(score.seconds * SAMPLE_RATE)
  const mix = [new Float32Array(frames), new Float32Array(frames)]
  mkdirSync(outDir, { recursive: true })

  for (const track of score.tracks) {
    const started = Date.now()
    const length = await page.evaluate(
      ([take, sampleRate]) => window.pocketSynthRecorder.record(take, sampleRate),
      [track.take, SAMPLE_RATE]
    )

    const channels = []
    for (let channel = 0; channel < 2; channel++) {
      const samples = new Float32Array(length)
      for (let from = 0; from < length; from += CHUNK) {
        const text = await page.evaluate(
          ([c, a, b]) => window.pocketSynthRecorder.read(c, a, b),
          [channel, from, from + CHUNK]
        )
        const bytes = Buffer.from(text, 'base64')
        samples.set(new Float32Array(bytes.buffer, bytes.byteOffset, bytes.length / 4), from)
      }
      channels.push(samples)
    }

    // Line the take up with the song, and keep the part of it the song covers as its stem
    const shift = Math.round(track.origin * SAMPLE_RATE)
    const stem = channels.map((samples) => {
      const aligned = new Float32Array(frames)
      const from = Math.max(0, -shift)
      const to = Math.min(frames, length - shift)
      if (to > from) aligned.set(samples.subarray(from + shift, to + shift), from)
      return aligned
    })
    stem.forEach((samples, c) => samples.forEach((s, i) => (mix[c][i] += s * track.gain)))

    writeFileSync(path.join(outDir, `${score.name}.${track.name}.wav`), wav(stem))
    const took = ((Date.now() - started) / 1000).toFixed(1)
    console.log(
      `${track.name.padEnd(8)} ${track.take.actions.length} actions, ` +
        `peak ${decibels(peakOf(stem))}, recorded in ${took} s`
    )
  }

  const fade = Math.round((score.fadeOut ?? 0) * SAMPLE_RATE)
  const level = PEAK / peakOf(mix)
  for (const channel of mix) {
    for (let i = 0; i < frames; i++) {
      channel[i] *= level * (i < frames - fade ? 1 : (frames - i) / fade)
    }
  }
  const file = path.join(outDir, `${score.name}.wav`)
  writeFileSync(file, wav(mix))
  console.log(`${file}: ${score.seconds} s, mix moved by ${decibels(level)}`)
} finally {
  await browser.close()
}
