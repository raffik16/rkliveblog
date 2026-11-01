import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Gapper',
  description:
    'A one-button climbing game built with JavaScript and Canvas: tap or press space to jump, squeeze through the gaps in the rock, and chase your high score as it speeds up.',
  image: '/static/images/og/gapper.jpg',
  path: '/climb',
})

export default function ClimbLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
