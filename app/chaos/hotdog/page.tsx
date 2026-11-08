import { genPageMetadata } from 'app/seo'
import HotDogStage from './HotDogStage'

export const metadata = genPageMetadata({
  title: 'Chaos Is an Art Form: Roller Grill Sessions',
  description:
    'Hot dogs spin on the roller grill, DJs spin records. A full-screen VJ backdrop with no controls: three animatronic hot dogs, robots in coats of real simulated fur, come apart into exploded views on the downbeat inside strange attractors full of flying notes and hardware, over a neon Hot Dog City where a robot arm plays the record. three.js, 124 bpm.',
  image: '/static/images/og/chaos-hotdog.jpg',
  path: '/chaos/hotdog',
})

export default function HotDogPage() {
  return <HotDogStage />
}
