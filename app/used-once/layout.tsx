import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Used Once: A Lifetime of Paper and Plastic',
  description:
    'The toilet paper, paper towels, water bottles and plastic cups one American uses in 79 years, drawn to scale: about 38,600 items and 1.8 tonnes.',
  image: '/static/images/og/used-once.jpg',
  path: '/used-once',
})

export default function UsedOnceLayout({ children }: { children: React.ReactNode }) {
  // No frame: the page is built from the site's own chapters (css/edition.css)
  return children
}
