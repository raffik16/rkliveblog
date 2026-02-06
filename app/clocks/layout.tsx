import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Clocks Through Time',
  description:
    'Explore the history of timekeeping through interactive clock visualizations - from ancient Egyptian sundials to modern smart displays.',
})

export default function ClocksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
