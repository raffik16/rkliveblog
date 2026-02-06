import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Alien Spacecraft Command Center',
  description:
    'An interactive WebGL spacecraft simulator featuring warp speed visualization, velocity metrics, anti-gravity physics, and real-time observability dashboards.',
})

export default function AlienLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
