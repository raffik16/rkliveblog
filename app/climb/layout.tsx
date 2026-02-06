import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Climbing Game',
  description:
    'An interactive browser-based climbing game built with React. Test your skills with keyboard controls and physics-based gameplay.',
})

export default function ClimbLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
