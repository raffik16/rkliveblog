import EdChapterHead from '@/components/edition/EdChapterHead'
import EdNote from '@/components/edition/EdNote'
import {
  INTERVALS,
  OCTAVES_DOWN,
  beatHz,
  centsOff,
  chordHz,
  lissajousPath,
  pendulumLength,
  type Interval,
} from './engine/intervals'
import styles from './explainer.module.css'

// Below the machine: how it works, why the numbers line up, and how to build a real one.
// Server-rendered, so the words are in the page for readers and search engines alike.

const CHAPTERS = {
  rig: { num: '01', label: 'The rig', color: 'var(--ed-cobalt)' },
  ratio: { num: '02', label: 'One ratio', color: 'var(--ed-raspberry)' },
  tuning: { num: '03', label: 'Tuning', color: 'var(--ed-violet)' },
  build: { num: '04', label: 'Build one', color: 'var(--ed-forest)' },
  history: { num: '05', label: 'History', color: 'var(--ed-ember)' },
}

const chapter = (id: keyof typeof CHAPTERS) => ({
  'data-chapter': id,
  'data-chapter-label': CHAPTERS[id].label,
  'data-chapter-num': CHAPTERS[id].num,
  'data-chapter-color': CHAPTERS[id].color,
  'aria-labelledby': `${id}-title`,
})

const SLOWDOWN = Math.pow(2, OCTAVES_DOWN)

const hz = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1))
const metres = (v: number) => `${v.toFixed(2)} m`

const cents = (v: number) => {
  if (Math.abs(v) < 0.005) return '0 cents'
  return `${v > 0 ? '+' : '−'}${Math.abs(v).toFixed(2)} cents`
}

/** How long the equal-tempered figure takes to roll through all its shapes */
const rollover = (beat: number) => {
  if (beat < 1e-6) return 'Never'
  const s = Math.round(SLOWDOWN / beat)
  if (s < 90) return `${s} s`
  return `${Math.floor(s / 60)} min ${s % 60} s`
}

function Figure({ interval }: { interval: Interval }) {
  const id = `harmony-ex-${interval.id}`
  return (
    <svg className={styles.figure} viewBox="0 0 28 28" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={interval.colors[0]} />
          <stop offset="1" stopColor={interval.colors[1]} />
        </linearGradient>
      </defs>
      <path d={lissajousPath(interval, 28, 2.5)} stroke={`url(#${id})`} />
    </svg>
  )
}

function Rig() {
  return (
    <figure className={styles.rig} data-reveal="">
      <div className={styles.rigScroll}>
        <svg
          className={styles.rigArt}
          viewBox="0 0 640 452"
          role="img"
          aria-labelledby="harmony-rig-title"
        >
          <title id="harmony-rig-title">
            The rig from the side: a camera hangs from a beam looking down; two cords from the beam
            meet at a knot, and one cord carries on down to a funnel of sand with an LED on its rim;
            the sand runs onto a steel plate bolted to a wave driver; a speaker beside it plays the
            chord. The funnel hangs 1.35 metres below the beam and 0.60 metres below the knot.
          </title>
          <g className={styles.frameArt}>
            <rect x="80" y="36" width="480" height="8" rx="1" />
            <rect x="88" y="44" width="6" height="380" />
            <rect x="546" y="44" width="6" height="380" />
            <line x1="40" y1="424" x2="600" y2="424" />
          </g>

          {/* camera on the beam, and what it sees */}
          <g className={styles.viewArt}>
            <line x1="320" y1="76" x2="200" y2="362" />
            <line x1="320" y1="76" x2="440" y2="362" />
          </g>
          <g className={styles.partArt}>
            <rect x="302" y="48" width="36" height="20" rx="3" />
            <rect x="312" y="68" width="16" height="8" rx="1" />
          </g>

          {/* the Y: two cords to the knot, one on down to the funnel */}
          <g className={styles.cordArt}>
            <line x1="250" y1="44" x2="320" y2="186" />
            <line x1="390" y1="44" x2="320" y2="186" />
            <line x1="320" y1="186" x2="320" y2="290" />
          </g>
          <circle className={styles.knotArt} cx="320" cy="186" r="3.2" />
          <circle className={styles.knotArt} cx="250" cy="44" r="2.4" />
          <circle className={styles.knotArt} cx="390" cy="44" r="2.4" />

          {/* funnel, LED, and the falling sand */}
          <path className={styles.partArt} d="M302 290 H338 L324 309 V316 H316 V309 Z" />
          <circle className={styles.glowArt} cx="335" cy="287" r="11" />
          <circle className={styles.ledArt} cx="335" cy="287" r="3" />
          <line className={styles.streamArt} x1="320" y1="320" x2="320" y2="358" />

          {/* plate, bolt, driver */}
          <g className={styles.sandArt}>
            <ellipse cx="246" cy="361" rx="9" ry="1.8" />
            <ellipse cx="320" cy="361" rx="6" ry="1.6" />
            <ellipse cx="392" cy="361" rx="10" ry="1.8" />
          </g>
          <rect className={styles.plateArt} x="200" y="362" width="240" height="4" />
          <g className={styles.partArt}>
            <rect x="317" y="366" width="6" height="10" />
            <rect x="296" y="376" width="48" height="30" rx="3" />
            <rect x="286" y="406" width="68" height="18" />
          </g>

          {/* the chord's speaker */}
          <g className={styles.partArt}>
            <rect x="468" y="352" width="44" height="72" rx="3" />
            <circle cx="490" cy="372" r="8" />
            <circle cx="490" cy="401" r="13" />
          </g>
          <g className={styles.waveArt}>
            <path d="M458 374 q-7 12 0 24" />
            <path d="M450 368 q-11 18 0 36" />
          </g>

          {/* the two lengths */}
          <g className={styles.guideArt}>
            <line x1="150" y1="300" x2="300" y2="300" />
            <line x1="180" y1="186" x2="314" y2="186" />
          </g>
          <g className={styles.dimArt}>
            <line x1="150" y1="44" x2="150" y2="300" />
            <line x1="145" y1="44" x2="155" y2="44" />
            <line x1="145" y1="300" x2="155" y2="300" />
            <line x1="180" y1="186" x2="180" y2="300" />
            <line x1="175" y1="186" x2="185" y2="186" />
            <line x1="175" y1="300" x2="185" y2="300" />
          </g>
          <text className={styles.dimText} x="143" y="176" textAnchor="end">
            1.35 m
          </text>
          <text className={styles.dimText} x="187" y="248">
            0.60 m
          </text>

          <text className={styles.labelText} x="320" y="24" textAnchor="middle">
            Camera · one long exposure
          </text>
          <text className={styles.labelText} x="333" y="200">
            Knot · sets the ratio
          </text>
          <text className={styles.labelText} x="352" y="291">
            Funnel of sand + LED
          </text>
          <text className={styles.labelText} x="194" y="367" textAnchor="end">
            Steel plate
          </text>
          <text className={styles.labelText} x="290" y="395" textAnchor="end">
            Wave driver
          </text>
          <text className={styles.labelText} x="490" y="330" textAnchor="middle">
            Speaker
          </text>
          <text className={styles.labelText} x="490" y="342" textAnchor="middle">
            plays the chord
          </text>
        </svg>
      </div>
      <figcaption className={styles.caption}>
        The Y is a Blackburn pendulum: the whole Y swings the funnel one way, the cord below the
        knot swings it the other. Set for a perfect fifth.
      </figcaption>
    </figure>
  )
}

const PARTS = [
  {
    name: 'Pendulums',
    text: 'Two lengths, two frequencies, one looping path. A third pendulum circles at almost the root’s pace and slowly turns the figure; switch it off and the figure holds still.',
  },
  {
    name: 'Sand',
    text: 'The funnel drips a thin, steady stream, so sand heaps up where the swing slows at the turns and thins out where it rushes through the middle.',
  },
  {
    name: 'Light',
    text: 'An LED on the funnel’s rim faces the camera and draws the same path in light, brightest where the swing lingers.',
  },
  {
    name: 'Plate',
    text: 'Where the plate shakes hard it throws the sand about; where it is still, the sand stays. Over a minute the drawing breaks up, slides and gathers on the still lines.',
  },
  {
    name: 'Camera',
    text: 'One exposure, from the first swing to the last. The light adds up; the sand is whatever is left on the plate when the shutter closes.',
  },
]

const LAYERS = [
  {
    name: 'Light',
    text: 'The pendulums swing at 3:2, so the LED draws the 3:2 Lissajous figure: it touches the top and bottom three times for every two times it reaches the sides.',
  },
  {
    name: 'Sand',
    text: 'The funnel lays the same figure down in sand, heaped where the swing slows.',
  },
  {
    name: 'Plate',
    text: 'The plate rings in its (3, 2) mode: three half-waves across and two down, mixed with the same wave turned on its side. Its still lines are where the sand ends up.',
  },
  {
    name: 'Sound',
    text: 'The speaker plays A3 and E4, 220 and 330 Hz. Three to two.',
  },
]

const STEPS = [
  {
    name: 'Hang a Y.',
    text: 'Two hooks in a beam, a cord from each tied together at a knot, and one cord from the knot down to the funnel. For a fifth, make it 1.35 m from the beam to the funnel and 0.60 m from the knot to the funnel. Slide the knot to change the interval.',
  },
  {
    name: 'Fill the funnel.',
    text: 'A plastic funnel or a paper cone with a 2 to 3 mm hole, and fine, dry sand: sieved play sand, or salt. Tape a small battery LED to the rim, facing up.',
  },
  {
    name: 'Ring the plate.',
    text: 'A square of thin steel or aluminium, 25 to 30 cm across, bolted at its centre to a mechanical wave driver run from an amplifier and a tone generator. Sweep the tone until the sand jumps into a figure: each figure is one of the plate’s own notes.',
  },
  {
    name: 'Play the chord.',
    text: 'From a second speaker, so the room hears the interval the pendulums are drawing.',
  },
  {
    name: 'Open the shutter.',
    text: 'Camera on the beam looking straight down, a dark room, a dim lamp off to one side for the sand. Bulb mode, low ISO, a small aperture and a remote release. Open it, let the funnel go, and close it when the swing dies.',
  },
]

const HISTORY = [
  {
    year: '1787',
    text: (
      <>
        Ernst Chladni draws a violin bow along the edge of a plate covered in sand and publishes the
        figures in <cite>Entdeckungen über die Theorie des Klanges</cite> (Discoveries in the Theory
        of Sound).
      </>
    ),
  },
  {
    year: '1844',
    text: 'Hugh Blackburn, a Scottish mathematician, describes the Y-shaped pendulum: the simplest harmonograph.',
  },
  {
    year: '1857',
    text: 'Jules Lissajous fixes mirrors to two tuning forks at right angles and bounces a beam of light off both, throwing the figure their ratio makes onto a screen.',
  },
  {
    year: 'Later',
    text: 'Harmonographs with pens and pendulums become a Victorian parlour favourite: a way to see harmony.',
  },
]

export default function Explainer() {
  return (
    <>
      <section className="ed-chapter" {...chapter('rig')}>
        <div className="ed-shell">
          <EdChapterHead
            num="01"
            kicker="Five parts"
            display="The rig"
            title="Two pendulums, a funnel, a plate and a camera"
            id="rig-title"
          >
            <p>
              Two pendulums tied into one swing a funnel of sand over a steel plate. A speaker under
              the plate makes it ring, and a camera overhead keeps its shutter open for the whole
              swing.
            </p>
          </EdChapterHead>
          <div className="ed-notes">
            <EdNote index={1} label="Try">
              Grab the funnel in the view and throw it: your swing becomes the next exposure.
            </EdNote>
            <EdNote index={2} label="Keys">
              1 to 6 pick an interval, T switches the tuning, Space pauses, R swings again, S sweeps
              the plate, N starts a new exposure and M is the sound.
            </EdNote>
          </div>
          <div className={styles.body}>
            <Rig />
            <ol className={styles.parts} data-reveal-children="">
              {PARTS.map((part, i) => (
                <li key={part.name}>
                  <span className={styles.index}>{String(i + 1).padStart(2, '0')}</span>
                  <h3 className={styles.partName}>{part.name}</h3>
                  <p>{part.text}</p>
                </li>
              ))}
            </ol>
            <p className={styles.prose} data-reveal="">
              You end up with three things: a photograph (<b>Save the photograph</b>), a sand piece
              (<b>Sweep the plate</b> to start again), and the performance itself, which you can
              listen to (<b>Hear the chord</b>).
            </p>
          </div>
        </div>
      </section>

      <section className="ed-chapter" {...chapter('ratio')}>
        <div className="ed-shell">
          <EdChapterHead
            num="02"
            kicker="Four layers"
            display="One ratio"
            title="Every layer shows the same two numbers"
            id="ratio-title"
          >
            <p>
              A musical interval is a ratio of two whole numbers. In a perfect fifth the upper note
              vibrates three times for every two of the lower: 3:2. The machine uses those two
              numbers four times over.
            </p>
          </EdChapterHead>
          <div className="ed-notes">
            <EdNote index={1} label="Why it looks calm">
              Small numbers make figures that close quickly and look simple; bigger ones, like 6:5,
              weave longer, busier paths. The Victorians took that as a picture of consonance.
            </EdNote>
            <EdNote index={2} label="An honest plate">
              The plate here is idealised: interval p:q rings mode (p, q). A real plate only rings
              at its own resonances, which rarely fall on the chord.
            </EdNote>
          </div>
          <div className={styles.body}>
            <ul className={styles.layers} data-reveal-children="">
              {LAYERS.map((layer) => (
                <li key={layer.name}>
                  <span className={styles.layerName}>{layer.name}</span>
                  <p>{layer.text}</p>
                </li>
              ))}
            </ul>
            <p className={styles.prose} data-reveal="">
              The pendulums are the same chord nine octaves down. 220 Hz ÷ 512 is 0.43 Hz, one swing
              every 2.3 seconds, which takes a 1.35 m string; E4 comes down to 0.64 Hz and 0.60 m. A
              pendulum’s length goes as one over its frequency squared, so the two lengths are in
              the ratio 9:4: the interval, squared.
            </p>
            <div className={styles.tableWrap} data-reveal="">
              <table className={styles.table}>
                <caption className={styles.tableCaption}>
                  Every interval on the machine, in just tuning
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Interval</th>
                    <th scope="col">Ratio</th>
                    <th scope="col">Chord</th>
                    <th scope="col">Pendulums</th>
                    <th scope="col">Plate mode</th>
                  </tr>
                </thead>
                <tbody>
                  {INTERVALS.map((iv) => {
                    const [root, upper] = chordHz(iv, 'just')
                    return (
                      <tr key={iv.id}>
                        <th scope="row">
                          <span className={styles.rowName}>
                            <Figure interval={iv} />
                            {iv.name}
                          </span>
                        </th>
                        <td className={styles.num}>
                          {iv.p}:{iv.q}
                        </td>
                        <td>
                          {iv.notes[0]} + {iv.notes[1]}
                          <span className={styles.sub}>
                            {hz(root)} + {hz(upper)} Hz
                          </span>
                        </td>
                        <td className={styles.num}>
                          {metres(pendulumLength(root))} · {metres(pendulumLength(upper))}
                        </td>
                        <td className={styles.num}>
                          ({iv.p}, {iv.q})
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="ed-chapter" {...chapter('tuning')}>
        <div className="ed-shell">
          <EdChapterHead
            num="03"
            kicker="Just or equal"
            display="Tuning"
            title="Why a piano’s fifth slowly turns the figure"
            id="tuning-title"
          >
            <p>
              A piano doesn’t play pure ratios. It splits the octave into twelve equal steps, so
              every interval but the octave is slightly off. Switch the tuning to Equal and you can
              watch the error.
            </p>
          </EdChapterHead>
          <div className="ed-notes">
            <EdNote index={1} label="The octave">
              2:1 is the one interval a piano gets exactly right, so the octave’s figure holds still
              in both tunings.
            </EdNote>
            <EdNote index={2} label="Third pendulum">
              In just tuning the figure still turns, slowly: the third pendulum swings a touch off
              the root on purpose. Switch it off for a figure that holds still.
            </EdNote>
          </div>
          <div className={styles.body}>
            <p className={styles.prose} data-reveal="">
              The piano’s fifth is 1.96 cents flat (a cent is a hundredth of a semitone). The third
              harmonic of A3 and the second harmonic of E4 should both sit on 660 Hz; instead they
              are 0.74 Hz apart, so the chord beats, a slow pulse about three times every four
              seconds. The pendulums carry the same error nine octaves down, so the figure slowly
              rolls through all its shapes, once every 11½ minutes. Turn the time-lapse up to 12× to
              see it in under a minute.
            </p>
            <p className={styles.prose} data-reveal="">
              The thirds and sixths are 14 to 16 cents out. They beat 9 to 12 times a second, the
              faint shimmer in a piano chord, and their figures roll over in under a minute even at
              normal speed.
            </p>
            <div className={styles.tableWrap} data-reveal="">
              <table className={styles.table}>
                <caption className={styles.tableCaption}>The same intervals on a piano</caption>
                <thead>
                  <tr>
                    <th scope="col">Interval</th>
                    <th scope="col">Off by</th>
                    <th scope="col">Chord beats</th>
                    <th scope="col">Figure rolls over every</th>
                  </tr>
                </thead>
                <tbody>
                  {INTERVALS.map((iv) => {
                    const beat = beatHz(iv, 'equal')
                    return (
                      <tr key={iv.id}>
                        <th scope="row">
                          <span className={styles.rowName}>
                            <Figure interval={iv} />
                            {iv.name}
                          </span>
                        </th>
                        <td className={styles.num}>{cents(centsOff(iv))}</td>
                        <td className={styles.num}>
                          {beat < 1e-6 ? 'None' : `${beat.toFixed(2)} Hz`}
                        </td>
                        <td className={styles.num}>{rollover(beat)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="ed-chapter" {...chapter('build')}>
        <div className="ed-shell">
          <EdChapterHead
            num="04"
            kicker="Hobby parts"
            display="Build one"
            title="A real harmony machine, from things people already make"
            id="build-title"
          >
            <p>
              Sand pendulums, Chladni plates and long exposures are all things people already build
              at home. Put together, they make a real harmony machine.
            </p>
          </EdChapterHead>
          <div className="ed-notes">
            <EdNote index={1} label="Lengths">
              Measure to the middle of the sand in the funnel. It rises as the sand runs out, so the
              ratio drifts a little and a real figure never quite closes.
            </EdNote>
            <EdNote index={2} label="Steady">
              Clamp the frame down so it can’t rock: any wobble in the beam shows up in the figure.
            </EdNote>
          </div>
          <div className={styles.body}>
            <ol className={styles.steps} data-reveal-children="">
              {STEPS.map((step, i) => (
                <li key={step.name}>
                  <span className={styles.index}>{String(i + 1).padStart(2, '0')}</span>
                  <p>
                    <b>{step.name}</b> {step.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="ed-chapter" {...chapter('history')}>
        <div className="ed-shell">
          <EdChapterHead
            num="05"
            kicker="1787 to 1857"
            display="Old tricks"
            title="Chladni, Blackburn and Lissajous on one plate"
            id="history-title"
          >
            <p>
              Every layer of the machine is an old experiment. Each one showed a single layer of the
              sound; this page runs all four on one plate.
            </p>
          </EdChapterHead>
          <div className="ed-notes">
            <EdNote index={1} label="Faraday">
              Fine powder does the opposite of sand: air currents carry it to the loudest spots.
              Michael Faraday worked out why in 1831.
            </EdNote>
            <EdNote index={2} label="Bowditch">
              Nathaniel Bowditch had studied the same curves with a pendulum in 1815, which is why
              they are sometimes called Bowditch curves.
            </EdNote>
          </div>
          <div className={styles.body}>
            <ol className={styles.timeline} data-reveal-children="">
              {HISTORY.map((item) => (
                <li key={item.year}>
                  <span className={styles.year}>{item.year}</span>
                  <p>{item.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  )
}
