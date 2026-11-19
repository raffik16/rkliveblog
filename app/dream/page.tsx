import { genPageMetadata } from 'app/seo'
import Dream from './Dream'

export const metadata = genPageMetadata({
  title: 'Forty Winks',
  description:
    'Close your eyes and live a whole other life, seventy-odd years in about four minutes, until the kettle boils and you have to wake up. Sound on.',
  path: '/dream',
})

export default function DreamPage() {
  return <Dream />
}
