import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Chaos Is an Art Form',
  description:
    'A cross-plane V8, a Strandbeest and a Cessna 337 landing gear run, come apart and reassemble inside five strange attractors. Nothing here is random: full screen, no controls, three.js.',
  image: '/static/images/og/chaos.jpg',
  path: '/chaos',
})

export default function ChaosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
