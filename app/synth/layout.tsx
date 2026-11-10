import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Pocket Synth',
  description:
    'A polyphonic synthesizer in the browser, built on the Web Audio API: four waveforms, a low-pass filter, an ADSR envelope, echo and a live oscilloscope.',
  image: '/static/images/og/pocket-synth.jpg',
  path: '/synth',
})

export default function SynthLayout({ children }: { children: React.ReactNode }) {
  // The frame only clears the fixed navbar; the synth lays itself out.
  return <div className="ed-demo-frame">{children}</div>
}
