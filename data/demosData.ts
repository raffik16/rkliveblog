export interface Demo {
  slug: string
  title: string
  href: string
  postHref?: string
  /** The day the demo went up (YYYY-MM-DD). Demos are listed newest first. */
  date: string
  description: string
  tech: string[]
  /** Open it from a form with the set's settings (party name and tempo) instead of a plain pill */
  setLauncher?: boolean
}

// Shown newest first by date. The sort below puts a new demo in its place wherever it goes in
// this list, and demos from the same day keep the order they're written in.
const demos: Demo[] = [
  {
    slug: 'trickline',
    title: 'Trickline',
    href: '/trickline',
    postHref: '/blog/trickline-skate-tricks-production-line',
    date: '2026-11-21',
    description:
      'One skater’s run through a street plaza, followed like a work item down a factory line. R-07 hardflips a fountain channel, laser flips a four-stair and kickflips into a backside 50-50 down a ten-stair handrail. Each spot is a station with its own process sheet, filled in as the trick happens: pop, flip, catch, lock, grind and landing, with every speed, angle and air time read from the 3D scene, in slow motion through each trick.',
    tech: ['three.js', 'simulator', 'two-bone IK', 'esbuild'],
  },
  {
    slug: 'backspin',
    title: 'BACKSPIN',
    href: '/backspin',
    postHref: '/blog/backspin-turntable-rhythm-game',
    date: '2026-11-18',
    description:
      'A beat-pad rhythm game with a turntable, in a 3D club. Notes fly down a tunnel to eight pads: play them on the keyboard, with the mouse or both at once, on a MIDI pad controller or on a touch screen, scratch the record when the round notes come, cut the crossfader and freestyle for eight bars. Practise any part of the song slowed down, with every hit timed to the millisecond. Every sound is synthesized in code as the page loads.',
    tech: ['three.js', 'Web Audio', 'AudioWorklet', 'Web MIDI'],
  },
  {
    slug: 'forty-winks',
    title: 'Forty Winks',
    href: '/dream',
    date: '2026-11-18',
    description:
      'Put the kettle on, close your eyes and live a whole other life before it boils: a new name, a best friend, a first love, children, a house by the sea, seventy-odd years in about four minutes. Move to wander through it and hold on to slow it down, until the kettle whistles and you have to wake up. Every dream is a different life, painted by one shader and scored live with Web Audio.',
    tech: ['WebGL 2', 'GLSL', 'Web Audio', 'React'],
  },
  {
    slug: 'harmony',
    title: 'The Harmony Machine',
    href: '/harmony',
    date: '2026-11-18',
    description:
      'Pendulums swing a funnel of sand and an LED over a steel plate that a speaker sets ringing, under a camera taking one long exposure. Pick a musical interval and the glowing loops, the Chladni lines in the sand and the chord you hear all show the same ratio. Hundreds of thousands of grains, simulated on the GPU.',
    tech: ['WebGL 2', 'GLSL', 'Web Audio', 'React'],
  },
  {
    slug: 'synth',
    title: 'Pocket Synth',
    href: '/synth',
    postHref: '/blog/pocket-synth-web-audio',
    date: '2026-11-10',
    description:
      'A synthesizer shaped like a piece of hardware, sized to fit one screen on a phone or a desktop: sixteen knobs, pads that light up and bend under a moving finger, a sixteen-step sequencer, an arpeggiator and a screen that draws whatever you are changing. Two oscillators, a filter with its own envelope and LFO, echo and reverb, built on the Web Audio API with no audio library.',
    tech: ['Web Audio', 'Canvas 2D', 'React', 'TypeScript'],
  },
  {
    slug: 'roller-grill-sessions',
    title: 'Chaos Is an Art Form: Roller Grill Sessions',
    href: '/chaos/hotdog',
    date: '2026-11-07',
    description:
      'A full-screen VJ backdrop for a DJ set, no controls. Hot dogs spin on the roller grill, DJs spin records: a Chicago dog, a ballpark dog and a New York dog come apart into exploded views on the downbeat inside five strange attractors, over a neon Hot Dog City, the set’s name alternating with the night’s other names on a giant record’s label. 124 bpm by default: type your own tempo and party name below.',
    tech: ['three.js', 'WebGL 2', 'GLSL', 'teardown'],
    setLauncher: true,
  },
  {
    slug: 'chaos',
    title: 'Chaos Is an Art Form',
    href: '/chaos',
    date: '2026-11-07',
    description:
      'Full screen, no controls. A V8, a Strandbeest and a Cessna landing gear from teardown run, come apart and reassemble inside five strange attractors drawn by 200,000 points.',
    tech: ['three.js', 'WebGL 2', 'GLSL', 'teardown'],
  },
  {
    slug: 'webmcp',
    title: 'WebMCP Toolkit',
    href: '/webmcp',
    postHref: '/blog/webmcp-six-months-later',
    date: '2026-05-19',
    description:
      'Generate declarative HTML or imperative JavaScript tool definitions for WebMCP, then check your own snippet against a list of spec-based rules.',
    tech: ['WebMCP', 'React', 'TypeScript'],
  },
  {
    slug: 'gapper',
    title: 'Gapper',
    href: '/climb',
    postHref: '/blog/gapper',
    date: '2026-01-25',
    description:
      'A one-button Canvas game: press space or tap to jump through the gaps, and see how long you last before you hit the rocks.',
    tech: ['Canvas 2D', 'JavaScript', 'React'],
  },
  {
    slug: 'clocks',
    title: 'The Timekeepers',
    href: '/clocks',
    postHref: '/blog/world-clocks-through-time',
    date: '2025-12-30',
    description:
      'Twelve working clocks that tell the real time, each styled after an era of timekeeping, from an Egyptian sundial to a speculative holographic display.',
    tech: ['SVG', 'Framer Motion', 'React'],
  },
  {
    slug: 'alien',
    title: 'Alien Spacecraft Command Center',
    href: '/alien',
    postHref: '/blog/alien-spacecraft-simulator',
    date: '2025-11-22',
    description:
      'A browser spacecraft simulator with a warp-speed starfield, velocity and G-force gauges, anti-gravity physics and a stealth dashboard, drawn on Canvas and animated with GSAP.',
    tech: ['Canvas 2D', 'GSAP', 'React', 'TypeScript'],
  },
]

const demosData = [...demos].sort((a, b) => b.date.localeCompare(a.date))

export default demosData
