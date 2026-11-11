export interface Demo {
  slug: string
  title: string
  href: string
  postHref?: string
  description: string
  tech: string[]
  /** Open it from a form with the set's settings (party name and tempo) instead of a plain pill */
  setLauncher?: boolean
}

const demosData: Demo[] = [
  {
    slug: 'roller-grill-sessions',
    title: 'Chaos Is an Art Form: Roller Grill Sessions',
    href: '/chaos/hotdog',
    description:
      'A full-screen VJ backdrop for a DJ set, no controls. Hot dogs spin on the roller grill, DJs spin records: a Chicago dog, a ballpark dog and a New York dog come apart into exploded views on the downbeat inside five strange attractors, over a neon Hot Dog City, the set’s name alternating with the night’s other names on a giant record’s label. 124 bpm by default: type your own tempo and party name below.',
    tech: ['three.js', 'WebGL 2', 'GLSL', 'teardown'],
    setLauncher: true,
  },
  {
    slug: 'chaos',
    title: 'Chaos Is an Art Form',
    href: '/chaos',
    description:
      'Full screen, no controls. A V8, a Strandbeest and a Cessna landing gear from teardown run, come apart and reassemble inside five strange attractors drawn by 200,000 points.',
    tech: ['three.js', 'WebGL 2', 'GLSL', 'teardown'],
  },
  {
    slug: 'used-once',
    title: 'Used Once',
    href: '/used-once',
    description:
      'The toilet paper, paper towels, water bottles and plastic cups one American gets through in a lifetime: about 38,600 items weighing 1.8 tonnes, every one of them drawn to scale next to a person. Drag the age to grow the pile from birth, set your own habits, and see where each number comes from.',
    tech: ['Canvas 2D', 'React', 'TypeScript'],
  },
  {
    slug: 'synth',
    title: 'Pocket Synth',
    href: '/synth',
    postHref: '/blog/pocket-synth-web-audio',
    description:
      'A synthesizer shaped like a piece of hardware, sized to fit one screen on a phone or a desktop: sixteen knobs, pads that light up and bend under a moving finger, a sixteen-step sequencer, an arpeggiator and a screen that draws whatever you are changing. Two oscillators, a filter with its own envelope and LFO, echo and reverb, built on the Web Audio API with no audio library.',
    tech: ['Web Audio', 'Canvas 2D', 'React', 'TypeScript'],
  },
  {
    slug: 'alien',
    title: 'Alien Spacecraft Command Center',
    href: '/alien',
    postHref: '/blog/alien-spacecraft-simulator',
    description:
      'A browser spacecraft simulator with a warp-speed starfield, velocity and G-force gauges, anti-gravity physics and a stealth dashboard, drawn on Canvas and animated with GSAP.',
    tech: ['Canvas 2D', 'GSAP', 'React', 'TypeScript'],
  },
  {
    slug: 'clocks',
    title: 'The Timekeepers',
    href: '/clocks',
    postHref: '/blog/world-clocks-through-time',
    description:
      'Twelve working clocks that tell the real time, each styled after an era of timekeeping, from an Egyptian sundial to a speculative holographic display.',
    tech: ['SVG', 'Framer Motion', 'React'],
  },
  {
    slug: 'gapper',
    title: 'Gapper',
    href: '/climb',
    postHref: '/blog/gapper',
    description:
      'A one-button Canvas game: press space or tap to jump through the gaps, and see how long you last before you hit the rocks.',
    tech: ['Canvas 2D', 'JavaScript', 'React'],
  },
  {
    slug: 'webmcp',
    title: 'WebMCP Toolkit',
    href: '/webmcp',
    postHref: '/blog/webmcp-six-months-later',
    description:
      'Generate declarative HTML or imperative JavaScript tool definitions for WebMCP, then check your own snippet against a list of spec-based rules.',
    tech: ['WebMCP', 'React', 'TypeScript'],
  },
]

export default demosData
