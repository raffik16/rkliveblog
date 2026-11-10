import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Pocket Synth',
  description:
    'A synthesizer in your browser with knobs, light-up pads, a step sequencer and an arpeggiator, built on the Web Audio API with no audio library.',
  image: '/static/images/og/pocket-synth.jpg',
  path: '/synth',
})

export default function SynthLayout({ children }: { children: React.ReactNode }) {
  // No frame: the synth sizes itself to the window (see .stage in synth.module.css)
  return children
}
