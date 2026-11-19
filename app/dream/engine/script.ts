// A life, in seven parts. Every dream is a different one: the names, the song, the house and a
// few of the lines are drawn at random when you close your eyes (makeLife), and the chapters
// below are written around them.
//
// Each chapter says how its world starts and ends (world.ts), what plays (sound.ts), how far and
// how fast you can move, and a list of cues: things that happen so many dream-seconds in. Dream
// seconds slow down while you hold on, so the lines and the people wait for you.

import type { Lights } from './lights'
import type { Ambience, Music, Voice } from './sound'
import type { KeySpec } from './world'

export interface Life {
  you: string
  friend: string
  love: string
  kids: string[]
  songFrom: string
  house: string
  job: { line: string; memory: string }
  oddity: string
  /** how old you are when the kettle boils */
  lifespan: number
}

/** What a cue can do */
export interface Stage {
  life: Life
  lights: Lights
  /** seconds into the current chapter */
  local: number
  holding: boolean
  /** half the screen's width in screen units (the height is always 2) */
  aspect: number
  horizon: number
  flags: Set<string>
  say(text: string): void
  prompt(kind: 'hold' | 'move', text?: string, seconds?: number): void
  clearPrompt(): void
  song(voice: Voice, bpm: number, transpose?: number): void
  chime(kind: 'catch' | 'meet' | 'born' | 'star'): void
  remember(text: string): void
  /** run something this many dream-seconds from now */
  after(seconds: number, run: (s: Stage) => void): void
  /** run something the first time `test` passes in the next so many dream-seconds */
  watch(seconds: number, test: (s: Stage) => boolean, run: (s: Stage) => void): void
}

export type Cue = [at: number, run: (s: Stage) => void]

export interface Chapter {
  id: string
  /** dream seconds */
  dur: number
  /** how old you are at its start and end */
  age: [number, number]
  /** how far from where you start you can go (0..1) and how quickly */
  reach: number
  pace: number
  /** the world: how it looks at the start and the end; `to` changes only what it names */
  from: KeySpec
  to?: KeySpec
  /** the part of the chapter (0..1) over which from turns into to */
  span?: [number, number]
  /** days and nights going past */
  dayCycle?: boolean
  music: Music
  ambience: Ambience
  cues: Cue[]
}

/** Seconds of falling asleep before the dream starts, and of waking up after it ends */
export const FALL = 12
export const WAKE = 16

// --------------------------------------------------------------------------------- a life

const YOU = [
  'Ilo',
  'Mara',
  'Theo',
  'Noor',
  'Sami',
  'June',
  'Ari',
  'Lena',
  'Oskar',
  'Nell',
  'Kai',
  'Ines',
  'Tomas',
  'Rumi',
  'Esme',
  'Pavel',
  'Yuki',
  'Dara',
  'Luca',
  'Ada',
  'Matteo',
  'Zadie',
  'Bruno',
  'Vera',
  'Emil',
  'Amara',
]
const FRIENDS = [
  'Pip',
  'Bea',
  'Milo',
  'Tess',
  'Otto',
  'Lulu',
  'Finn',
  'Rosa',
  'Bram',
  'Kit',
  'Juno',
  'Moss',
  'Dot',
]
const LOVES = [
  'Sol',
  'Iris',
  'Jonah',
  'Maren',
  'Eli',
  'Anouk',
  'Remy',
  'Talia',
  'Wren',
  'Cass',
  'Idris',
  'Lior',
  'Selma',
  'Nico',
]
const KIDS = [
  'Hazel',
  'Arlo',
  'Pia',
  'Ezra',
  'Lark',
  'Ida',
  'Ravi',
  'Mae',
  'Leo',
  'Clem',
  'Tove',
  'Otis',
  'Elsie',
  'Rafa',
]

const SONG_FROM = [
  'on a night bus',
  'from a car radio, windows down',
  'at a party you nearly skipped',
  'through the wall of a summer flat',
  'on somebody else’s headphones',
]

const HOUSE = [
  'The door sticks in summer.',
  'The third stair sings when you step on it.',
  'The kitchen window never quite closes.',
  'There is always sand in the hall.',
  'The garden gate has to be lifted to open.',
]

const JOBS = [
  {
    line: 'You are very good at something you never chose.',
    memory: 'You were good at something you never chose.',
  },
  {
    line: 'You answer emails in your sleep. You are asleep.',
    memory: 'You answered emails in your sleep.',
  },
  {
    line: 'Somebody calls you a manager. You look behind you.',
    memory: 'Somebody called you a manager.',
  },
  {
    line: 'You have a desk by a window. The window is painted on.',
    memory: 'You had a desk by a painted window.',
  },
]

const ODDITIES = [
  'Your teacher is also the sea. Nobody thinks this is strange.',
  'You can fly a little, but only when nobody is looking.',
  'There is a second moon. Nobody mentions it.',
  'The house has a room you have never noticed.',
  'Every dog in town knows your name.',
]

/** A small, seeded random number generator (mulberry32), so a life can be replayed */
export function seeded(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function makeLife(random: () => number): Life {
  const pick = <T>(list: T[]) => list[Math.floor(random() * list.length)]
  const kidCount = random() < 0.35 ? 1 : random() < 0.7 ? 2 : 3
  const kids: string[] = []
  while (kids.length < kidCount) {
    const name = pick(KIDS)
    if (!kids.includes(name)) kids.push(name)
  }
  return {
    you: pick(YOU),
    friend: pick(FRIENDS),
    love: pick(LOVES),
    kids,
    songFrom: pick(SONG_FROM),
    house: pick(HOUSE),
    job: pick(JOBS),
    oddity: pick(ODDITIES),
    lifespan: 81 + Math.floor(random() * 13),
  }
}

const ONES = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
]
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']

/** 84 → "eighty-four" */
export function words(n: number): string {
  const whole = Math.max(0, Math.min(99, Math.round(n)))
  if (whole < 20) return ONES[whole]
  const tens = TENS[Math.floor(whole / 10)]
  return whole % 10 ? `${tens}-${ONES[whole % 10]}` : tens
}

export const capital = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

const lower = (text: string) => text.charAt(0).toLowerCase() + text.slice(1)

// ------------------------------------------------------------------------------ the chapters

// Chords, as MIDI notes, in D major
const D = [50, 57, 62, 66]
const Dsus = [50, 57, 64, 69]
const GoverD = [50, 55, 59, 67]
const AoverD = [50, 57, 61, 64]
const G = [43, 59, 62, 67]
const Gmaj7 = [43, 54, 59, 62]
const Bm = [47, 54, 62, 66]
const A = [45, 57, 61, 64]
const Em = [40, 55, 59, 64]
const FsharpM = [42, 54, 61, 66]
const DoverFsharp = [42, 57, 62, 66]

export function chapters(life: Life): Chapter[] {
  const L = life
  // across the screen, as a share of half its width (narrow phone or wide monitor alike)
  const X = (s: Stage, share: number) => share * Math.min(s.aspect, 1.9)

  return [
    {
      // before you have words: warm, dark, a heartbeat, someone humming; then the first morning
      id: 'warm',
      dur: 24,
      age: [0, 1],
      reach: 0.1,
      pace: 1.2,
      span: [0.35, 1],
      from: {
        skyTop: '#16040c',
        skyHor: '#4a0c20',
        fog: '#5a1428',
        cloud: '#a8325a',
        clouds: 0.3,
        sun: '#ff8a70',
        sunY: -0.75,
        sunGlow: 0.9,
        landFar: '#1c0610',
        landNear: '#100308',
        warp: 0.75,
        vignette: 0.95,
        horizon: -0.05,
      },
      to: {
        skyTop: '#261a4e',
        skyHor: '#ff9c7c',
        fog: '#ffb490',
        cloud: '#ffc4cc',
        clouds: 0.5,
        sun: '#ffe2b4',
        sunX: 0.03,
        sunY: -0.13,
        sunSize: 0.085,
        sunGlow: 1,
        landFar: '#4e2c5c',
        landNear: '#24152f',
        hills: 0.45,
        warp: 0.35,
        vignette: 0.8,
        horizon: -0.12,
      },
      music: {
        chords: [Dsus, GoverD, D, AoverD],
        chordSec: 6,
        pad: 0.7,
        tone: 0.2,
        voice: 'warm',
        sparkle: 0.12,
        echo: 0.2,
      },
      ambience: { heart: 1, wind: 0.1 },
      cues: [
        [
          0,
          (s) => {
            s.lights.spawn('you', 0, -0.36, { r: 0.004, rT: 0.012 })
            s.lights.spawn('mother', -0.05, 0.14, { aT: 0.9 })
          },
        ],
        [1.5, (s) => s.say('Warm.')],
        [5.5, (s) => s.say('A heartbeat that isn’t yours.')],
        [
          10.5,
          (s) => {
            s.say('Someone is humming, just for you.')
            s.song('warm', 52, -12)
            s.prompt('hold', undefined, 8)
          },
        ],
        [13, (s) => s.lights.spawn('father', X(s, 0.3), 0.02)],
        [
          17.5,
          (s) => {
            s.say(`They call you ${L.you}.`)
            s.remember(`You were ${L.you}.`)
          },
        ],
      ],
    },
    {
      // a summer that lasts forever, in grass taller than you
      id: 'morning',
      dur: 36,
      age: [4, 10],
      reach: 1,
      pace: 5,
      from: {
        skyTop: '#5b7fe0',
        skyHor: '#ffe0b2',
        fog: '#ffe6c6',
        cloud: '#fff4ee',
        clouds: 0.6,
        sun: '#fff3d0',
        sunX: -0.55,
        sunY: 0.5,
        sunSize: 0.075,
        sunGlow: 0.9,
        landFar: '#9cc495',
        landNear: '#4f8f45',
        hills: 0.85,
        grass: 1,
        seeds: 0.8,
        warp: 0.15,
        vignette: 0.55,
        travel: 0.035,
        exposure: 1.05,
      },
      to: {
        skyTop: '#5c5ed8',
        skyHor: '#ffc68c',
        fog: '#ffd2a0',
        cloud: '#ffe2d0',
        clouds: 0.55,
        sun: '#ffd89a',
        sunX: 0.7,
        sunY: 0.2,
        sunSize: 0.08,
        sunGlow: 0.95,
        landFar: '#a8b37a',
        landNear: '#5a7a35',
        seeds: 1,
      },
      music: {
        chords: [D, G, Bm, A],
        chordSec: 4,
        pad: 0.5,
        tone: 0.6,
        voice: 'box',
        sparkle: 1.5,
        echo: 0.25,
      },
      ambience: { birds: 1, wind: 0.3 },
      cues: [
        [
          0,
          (s) => {
            const you = s.lights.you
            if (you) you.rT = 0.026
            s.lights.hover(s.lights.find('mother'), X(s, -0.7), -0.05, 0.05, 0.75)
            s.lights.hover(s.lights.find('father'), X(s, 0.75), 0, 0.04, 0.7)
          },
        ],
        [1, (s) => s.say('You are five, and the grass is taller than you.')],
        [2.5, (s) => s.song('box', 100, 12)],
        [
          8,
          (s) => {
            s.lights.play(s.lights.spawn('friend', X(s, 0.6), -0.3))
            s.say(`${L.friend} lives two doors down.`)
            s.remember(`You chased ${L.friend} through one long summer.`)
          },
        ],
        [10, (s) => s.prompt('move', `Catch ${L.friend}`, 9)],
        [17, (s) => s.say('Summer is a whole country.')],
        [24.5, (s) => s.say(L.oddity)],
        [31, (s) => s.say('You will never be this fast again.')],
        [33, (s) => s.lights.leave(s.lights.find('friend'), X(s, -0.8))],
      ],
    },
    {
      // seventeen, at night, with the city glowing on the horizon
      id: 'night',
      dur: 36,
      age: [16, 21],
      reach: 1,
      pace: 4.2,
      from: {
        skyTop: '#1d1a5c',
        skyHor: '#e0648a',
        fog: '#c45a86',
        cloud: '#7a4aa0',
        clouds: 0.35,
        sun: '#ff9a8a',
        sunX: 0.3,
        sunY: -0.24,
        sunSize: 0.08,
        sunGlow: 0.6,
        stars: 0.35,
        city: 1,
        windows: 0.75,
        hills: 0.65,
        landFar: '#2a1a4a',
        landNear: '#120c24',
        grass: 0.55,
        flies: 0.6,
        travel: 0.02,
        vignette: 0.7,
      },
      to: {
        skyTop: '#05082a',
        skyHor: '#2c1f72',
        fog: '#3a2a7a',
        cloud: '#2a2060',
        clouds: 0.2,
        sunY: -0.6,
        sunGlow: 0,
        stars: 1,
        moon: 1,
        landFar: '#140f30',
        landNear: '#07061a',
        flies: 1,
        windows: 0.9,
      },
      music: {
        chords: [Bm, G, D, A],
        chordSec: 5,
        pad: 0.55,
        tone: 0.45,
        voice: 'synth',
        sparkle: 0.7,
        echo: 0.6,
      },
      ambience: { crickets: 1, wind: 0.2, city: 0.2 },
      cues: [
        [
          0,
          (s) => {
            s.lights.hover(s.lights.find('mother'), X(s, -0.85), 0.22, 0.03, 0.4)
            s.lights.hover(s.lights.find('father'), X(s, 0.88), 0.2, 0.025, 0.35)
          },
        ],
        [1, (s) => s.say('Seventeen. Everything is loud, and nothing has happened yet.')],
        [
          8.5,
          (s) => {
            s.say(`A song ${L.songFrom}. You’ll keep it for the rest of your life.`)
            s.song('synth', 86, 0)
            s.remember(`You heard a song ${L.songFrom} and kept it.`)
          },
        ],
        [
          17,
          (s) => {
            const side = (s.lights.you?.x ?? 0) > 0 ? -1 : 1
            s.lights.approach(s.lights.spawn('love', X(s, 0.7 * side), s.horizon + 0.04))
            s.say('Someone across the room.')
            s.prompt('move', 'Go to them', 10)
          },
        ],
        [26, (s) => s.lights.hurry(s.lights.find('love'))],
        // whoever didn't go to them: they come to you
        [33, (s) => s.lights.meet(s.lights.find('love'))],
      ],
    },
    {
      // the years in the middle, which go past like days
      id: 'rain',
      dur: 30,
      age: [28, 33],
      reach: 1,
      pace: 3.6,
      dayCycle: true,
      from: {
        skyTop: '#0c1430',
        skyHor: '#3a4766',
        fog: '#4a5878',
        cloud: '#55627e',
        clouds: 0.85,
        sun: '#d8e0f0',
        sunX: 0.2,
        sunY: 0.35,
        cityNear: 1,
        city: 0.7,
        windows: 0.85,
        rain: 1,
        landFar: '#1a2238',
        landNear: '#0b1020',
        water: 0.35,
        sea: '#121a2c',
        travel: 0.06,
        warp: 0.1,
        vignette: 0.75,
      },
      to: { rain: 0.85 },
      music: {
        chords: [Bm, G, Em, FsharpM],
        chordSec: 2.5,
        pad: 0.45,
        tone: 0.5,
        voice: 'synth',
        sparkle: 2,
        echo: 0.35,
        tick: 2,
      },
      ambience: { rain: 1, city: 0.8 },
      cues: [
        [0, (s) => s.lights.orbit(s.lights.find('love'), 0.34, 1.7, 0.5)],
        [1, (s) => s.say('Twenty-nine. Monday.')],
        [5, (s) => s.say('Monday.')],
        [8, (s) => s.say('Monday.')],
        [
          11.5,
          (s) => {
            s.say(L.job.line)
            s.remember(L.job.memory)
          },
        ],
        [
          18.5,
          (s) => {
            s.say('Hold on to something.')
            s.prompt('hold', undefined, 9)
            s.watch(
              9,
              (stage) => stage.holding,
              (stage) => {
                stage.flags.add('found')
                stage.say('There you are.')
                stage.lights.orbit(stage.lights.find('love'), 0.1, 0.8, 0.6)
              }
            )
          },
        ],
        [27, (s) => !s.flags.has('found') && s.say('It goes so fast.')],
      ],
    },
    {
      // a house by the water, and the children
      id: 'sea',
      dur: 38,
      age: [34, 46],
      reach: 1,
      pace: 3,
      from: {
        skyTop: '#4a86d8',
        skyHor: '#ffe7c2',
        fog: '#fff0d8',
        cloud: '#ffffff',
        clouds: 0.5,
        sun: '#fff6dc',
        sunX: -0.35,
        sunY: 0.42,
        sunSize: 0.07,
        sunGlow: 0.85,
        water: 1,
        sea: '#1d6f86',
        hills: 0.35,
        landFar: '#7aa08e',
        landNear: '#2f4a3a',
        house: 1,
        windows: 0.2,
        grass: 0.35,
        vignette: 0.55,
      },
      to: {
        skyTop: '#2b3a8c',
        skyHor: '#ffae7a',
        fog: '#ffbc90',
        cloud: '#ffc8b0',
        sun: '#ffbb77',
        sunX: 0.25,
        sunY: -0.02,
        sunSize: 0.085,
        sunGlow: 1,
        sea: '#1b4a66',
        windows: 0.8,
        landFar: '#5a5a7a',
        landNear: '#1e2236',
      },
      music: {
        chords: [D, Gmaj7, Bm, A],
        chordSec: 5,
        pad: 0.55,
        tone: 0.55,
        voice: 'warm',
        sparkle: 0.8,
        echo: 0.3,
      },
      ambience: { sea: 1, wind: 0.2, birds: 0.25 },
      cues: [
        [
          0,
          (s) => {
            s.lights.orbit(s.lights.find('love'), 0.12, 0.7, 0.6)
            s.lights.hover(s.lights.find('mother'), X(s, -0.8), 0.3, 0.028, 0.45)
            s.lights.hover(s.lights.find('father'), X(s, -0.55), 0.38, 0.024, 0.4)
          },
        ],
        [
          1,
          (s) => {
            s.say(`A house by the water. ${L.house}`)
            s.remember(`A house by the water, where ${lower(L.house)}`)
          },
        ],
        [
          9,
          (s) => {
            born(s, 0)
            s.say(`${L.kids[0]} arrives in the spring.`)
            const [first, second, third] = L.kids
            s.remember(
              L.kids.length === 1
                ? `Then ${first}.`
                : L.kids.length === 2
                  ? `Then ${first}, and ${second}.`
                  : `Then ${first}, and ${second} and ${third} at once.`
            )
          },
        ],
        [
          16,
          (s) => {
            if (L.kids.length === 2) {
              born(s, 1)
              s.say(`${L.kids[1]}, three summers later.`)
            } else if (L.kids.length === 3) {
              born(s, 1)
              born(s, 2)
              s.say(`${L.kids[1]} and ${L.kids[2]}, both at once.`)
            }
          },
        ],
        [23, (s) => s.say('Nobody sleeps. Nobody minds.')],
        [
          30,
          (s) => {
            s.say('Every evening the same sea. Never the same sea.')
            s.song('warm', 64, 0)
          },
        ],
      ],
    },
    {
      // the people ahead of you go on ahead; the people after you go out into the world
      id: 'autumn',
      dur: 30,
      age: [56, 66],
      reach: 1,
      pace: 2.4,
      from: {
        skyTop: '#3c2c66',
        skyHor: '#f3a265',
        fog: '#f0b07a',
        cloud: '#e08a6a',
        clouds: 0.65,
        sun: '#ffbe80',
        sunX: -0.45,
        sunY: 0.12,
        sunSize: 0.08,
        sunGlow: 0.9,
        water: 0.85,
        sea: '#2a3c50',
        hills: 0.6,
        landFar: '#9a6a48',
        landNear: '#4a2c1c',
        house: 1,
        windows: 0.5,
        grass: 0.45,
        leaves: 1,
        vignette: 0.65,
      },
      to: {
        skyTop: '#2a1a44',
        skyHor: '#c86244',
        fog: '#b8604a',
        cloud: '#a85a5a',
        sun: '#ff9a66',
        sunX: -0.7,
        sunY: -0.05,
        landFar: '#6a3a30',
        landNear: '#2a1612',
        windows: 0.8,
        leaves: 0.7,
        stars: 0.25,
      },
      music: {
        chords: [Bm, Em, G, D],
        chordSec: 6,
        pad: 0.55,
        tone: 0.4,
        voice: 'bell',
        sparkle: 0.45,
        echo: 0.4,
      },
      ambience: { wind: 0.8, sea: 0.6 },
      cues: [
        [1, (s) => s.say('The leaves come down all at once.')],
        [
          6,
          (s) => {
            s.lights.rise(s.lights.find('mother'), X(s, -0.45), 0.64)
            s.chime('star')
            s.say(
              'Your mother’s light goes up, and stays there, a little brighter than the others.'
            )
            s.remember('Your mother’s light, a little brighter than the others.')
          },
        ],
        [11, (s) => s.lights.rise(s.lights.find('father'), X(s, 0.34), 0.72)],
        [
          15.5,
          (s) => {
            L.kids.forEach((_, i) =>
              s.after(i * 1.6, (later) =>
                later.lights.leave(later.lights.find('kid', i), X(later, -0.55 + i * 0.4))
              )
            )
            s.say(
              L.kids.length === 1
                ? `${L.kids[0]} moves to the city. Calls on Sundays.`
                : `${L.kids[0]} moves to the city. Then ${L.kids[1]}. They call on Sundays.`
            )
          },
        ],
        [23, (s) => s.say('The house gets bigger every year.')],
      ],
    },
    {
      // the long evening: snow, then a sunset over the sea that you would stay in forever
      id: 'evening',
      dur: 38,
      age: [L.lifespan - 4, L.lifespan],
      reach: 1,
      pace: 1.6,
      from: {
        skyTop: '#7d8bab',
        skyHor: '#efe9ef',
        fog: '#f2eef4',
        cloud: '#ffffff',
        clouds: 0.75,
        sun: '#fffaf0',
        sunX: 0.2,
        sunY: 0.32,
        sunSize: 0.06,
        sunGlow: 0.35,
        water: 0.8,
        sea: '#4d5b70',
        hills: 0.6,
        landFar: '#b4bccb',
        landNear: '#dfe3ea',
        house: 1,
        windows: 0.7,
        grass: 0.15,
        snow: 1,
        vignette: 0.6,
      },
      to: {
        skyTop: '#1c1a52',
        skyHor: '#ff9e7e',
        fog: '#ffb090',
        cloud: '#ff9a9a',
        clouds: 0.4,
        sun: '#ffbe86',
        sunX: 0,
        sunY: -0.1,
        sunSize: 0.1,
        sunGlow: 1.1,
        sea: '#2b2c52',
        landFar: '#5a4a6a',
        landNear: '#2a2238',
        stars: 0.55,
        snow: 0,
        windows: 1,
      },
      music: {
        chords: [G, DoverFsharp, Em, D],
        chordSec: 7,
        pad: 0.6,
        tone: 0.35,
        voice: 'low',
        sparkle: 0.3,
        echo: 0.45,
      },
      ambience: { sea: 0.7, wind: 0.3 },
      cues: [
        [0, (s) => s.lights.orbit(s.lights.find('love'), 0.1, 0.45, 0.6)],
        [1, (s) => s.say(`${capital(words(L.lifespan - 3))}. Your hands look like your father’s.`)],
        [
          8,
          (s) => {
            s.say(`${L.love} still hums that song.`)
            s.song('low', 50, -12)
            s.remember(`${L.love}, still humming that song.`)
          },
        ],
        [
          15,
          (s) => {
            s.say('Small lights come home from the city at Christmas.')
            L.kids.forEach((_, i) => {
              const kid = s.lights.find('kid', i)
              s.lights.orbit(kid, 0.3 + i * 0.05, 0.5, 0.5)
              if (kid) kid.rT = 0.018
              if (kid) kid.aT = 1
            })
            const count = Math.min(4, L.kids.length + 1)
            for (let j = 0; j < count; j++) {
              s.after(0.6 + j * 0.7, (later) => {
                const from = later.lights.find('kid', j % L.kids.length)
                const little = later.lights.spawn(
                  'grandkid',
                  from?.x ?? 0,
                  from?.y ?? later.horizon
                )
                later.lights.orbit(little, 0.19 + j * 0.04, 1.5 - j * 0.15, 0.5)
              })
            }
          },
        ],
        [
          23,
          (s) => {
            s.say('This. Stay in this.')
            s.prompt('hold', undefined, 10)
          },
        ],
        [
          29.5,
          (s) => {
            s.say('Far off, a bird is singing one long note.')
            s.flags.add('bird')
          },
        ],
      ],
    },
  ]
}

function born(s: Stage, i: number) {
  const you = s.lights.you
  const love = s.lights.find('love')
  const x = ((you?.x ?? 0) + (love?.x ?? 0)) / 2
  const y = ((you?.y ?? 0) + (love?.y ?? 0)) / 2
  const kid = s.lights.spawn('kid', x, y, { r: 0.004 })
  s.lights.orbit(kid, 0.17 + i * 0.035, 1.3 - i * 0.15, 0.5)
  s.chime('born')
}
