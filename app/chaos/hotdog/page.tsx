import { genPageMetadata } from 'app/seo'
import HotDogStage from './HotDogStage'

export const metadata = genPageMetadata({
  title: 'Chaos Is an Art Form: The Hot Dog Set',
  description:
    'A full-screen VJ backdrop with no controls: a Chicago dog, a ballpark dog and a New York dog come apart into exploded views on the downbeat, inside strange attractors full of flying notes, over a neon Hot Dog City. three.js, 124 bpm.',
  image: '/static/images/og/chaos-hotdog.jpg',
  path: '/chaos/hotdog',
})

export default function HotDogPage() {
  return <HotDogStage />
}
