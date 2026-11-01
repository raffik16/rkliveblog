import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'The Timekeepers',
  description:
    'Twelve interactive clocks spanning 5,000 years of timekeeping, from an Egyptian sundial and a medieval cathedral clock to Art Deco, digital LED, a smartwatch, and a holographic concept.',
  image: '/static/images/og/world-clocks-through-time.jpg',
  path: '/clocks',
})

export default function ClocksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
