import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Alien Spacecraft Command Center',
  description:
    'An interactive spacecraft simulator that runs in the browser: warp speed, velocity gauges, anti-gravity physics, and observability systems, built with the Canvas API and GSAP.',
  image: '/static/images/og/alien-spacecraft-simulator.jpg',
  path: '/alien',
})

export default function AlienLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
