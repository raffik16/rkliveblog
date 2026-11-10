import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Pocket Synth',
  description:
    'A synthesizer in your browser with knobs, light-up pads, a step sequencer and an arpeggiator, built on the Web Audio API with no audio library.',
  image: '/static/images/og/pocket-synth.jpg',
  path: '/synth',
})

export default function SynthLayout({ children }: { children: React.ReactNode }) {
  // The frame only clears the fixed navbar; the synth lays itself out.
  return <div className="ed-demo-frame">{children}</div>
}
