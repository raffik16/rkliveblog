export interface Demo {
  slug: string
  title: string
  href: string
  postHref?: string
  description: string
  tech: string[]
}

const demosData: Demo[] = [
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
