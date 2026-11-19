import demosData from '@/data/demosData'
import { genPageMetadata } from 'app/seo'
import HarmonyMachine from './HarmonyMachine'
import Explainer from './Explainer'

export const metadata = genPageMetadata({
  title: 'The Harmony Machine',
  description:
    'Pendulums swing a funnel of sand and an LED over a singing Chladni plate. Pick an interval: the light, the sand and the chord all show the same ratio.',
  path: '/harmony',
  image: '/static/images/og/harmony-machine.jpg',
})

// Its number in the Lab's list
const num = String(demosData.findIndex((d) => d.slug === 'harmony') + 1).padStart(2, '0')

export default function HarmonyPage() {
  return (
    <div className="ed-page">
      <HarmonyMachine num={num} />
      <Explainer />
    </div>
  )
}
