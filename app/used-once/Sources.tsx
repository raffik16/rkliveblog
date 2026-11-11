import { ITEMS, LIFE_YEARS, SOURCES, type SourceId } from './data'
import { size } from './units'
import { Q } from './context'
import styles from './used-once.module.css'

// Where each starting number comes from, what it was checked against and how far to trust it.
// The page is only as good as these five numbers, so they get as much room as the charts.

const cite = (id: SourceId, text?: string) => (
  <a href={SOURCES[id].href} target="_blank" rel="noopener noreferrer" className="ed-link">
    {text ?? SOURCES[id].org}
  </a>
)

type Grade = 'Solid' | 'Fair' | 'Rough'

function Start({
  name,
  figure,
  grade,
  children,
}: {
  name: string
  figure: string
  /** How far to trust the number; left off where there is no number to trust */
  grade?: Grade
  children: React.ReactNode
}) {
  return (
    <article className={styles.start} data-reveal="">
      <header className={styles.startHead}>
        <h3>{name}</h3>
        {grade && (
          <span className={styles.grade} data-grade={grade}>
            <span className="sr-only">Confidence: </span>
            {grade}
          </span>
        )}
      </header>
      <p className={styles.startFigure}>{figure}</p>
      <div className={styles.startBody}>{children}</div>
    </article>
  )
}

export default function Sources() {
  return (
    <>
      <div className={styles.method} data-reveal="">
        <h3>How a lifetime is counted</h3>
        <p>
          Each yearly average is multiplied by the number of years. That treats every year of a life
          as a year at today&apos;s average, which no real life is: a baby buys no bottled water,
          and almost nobody did in 1970. Read the totals as one lifetime at today&apos;s rates, not
          as a forecast.
        </p>
      </div>

      <div className={styles.startGrid}>
        <Start name="Lifespan" figure={`${LIFE_YEARS.toFixed(1)} years`} grade="Solid">
          <p>
            US life expectancy at birth in 2024, from the {cite('cdc', 'CDC')}&apos;s final
            mortality data for that year.
          </p>
        </Start>

        <Start name="Toilet paper" figure="141 rolls a year" grade="Fair">
          <p>
            {cite('statistaToilet')} put US use at 141 rolls and 12.7 kg per person in 2018, the
            most of any country it compared. That is 90 g a roll, smaller than most rolls on a shelf
            today, so the count is in standard rolls. {cite('nrdc', 'NRDC’s The Issue with Tissue')}{' '}
            repeats both figures.
          </p>
        </Start>

        <Start name="Paper towels" figure="7.5 kg a year, drawn as 32 rolls" grade="Fair">
          <p>
            {cite('statistaHousehold')} puts US household paper (paper towels, kitchen rolls and
            table napkins) at 7.5 kg per person in 2024. It is drawn as 235 g rolls, about a
            supermarket double roll.
          </p>
          <p>
            As a ceiling, the {cite('epa', 'EPA')} counted 3.79 million tons of tissue paper and
            towels in US trash in 2018, toilet paper not included: 10.5 kg per person for towels,
            napkins and tissues together. The often repeated 13 billion pounds of paper towels a
            year would be 18 kg per person, more than that whole category, so it is not used here.
          </p>
        </Start>

        <Start name="Water bottles" figure="259 a year" grade="Solid">
          <p>
            The {cite('cri')} counts about 86 billion plastic water bottles sold in the US in 2021:
            259 for each of 331.9 million people ({cite('census', 'Census Bureau')}). A second route
            lands in the same place: {cite('bmc')} reports 11.6 billion gallons of single-serve
            bottled water in 2024, which is 258 half-liter bottles each.
          </p>
          <p>
            Each is weighed at 9.25 g, the {cite('bottleWeight', 'average for a 16.9 oz bottle')}.
            Caps and labels are not counted.
          </p>
        </Start>

        <Start name="Plastic cups" figure="57 a year" grade="Rough">
          <p>
            {cite('oceanConservancy')} estimates that Americans use 18.6 billion plastic cups a
            year, from 2018 data: 57 each. This is the least certain number on the page.{' '}
            {cite('cleanWater')} counts 38 billion plastic cups, twice as many, and another 26
            billion foam ones.
          </p>
          <p>Each is weighed at 12 g, a 16 oz party cup. Real cups run from about 5 g to 20 g.</p>
        </Start>

        <Start name="Left out" figure="Everything else">
          <p>
            Wrappers, cardboard tubes, bottle caps and labels. Tissues, diapers, bags, straws,
            coffee cups, food containers and the rest of what is thrown away after one use. This is
            four things, not a footprint.
          </p>
        </Start>
      </div>

      <div className={styles.method} data-reveal="">
        <h3>The sizes behind the drawings</h3>
        <ul className={styles.sizes}>
          {ITEMS.map((item) => (
            <li key={item.id}>
              <b>{item.name}</b>
              <span>
                <Q v={size(item.diameter)} /> across, <Q v={size(item.height)} /> tall
                {item.nest && (
                  <>
                    , nested {item.nest.count} to a sleeve{' '}
                    <Q v={size(item.height + (item.nest.count - 1) * item.nest.pitch)} /> tall
                  </>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.method} data-reveal="">
        <h3>Sources</h3>
        <ol className={styles.sourceList}>
          {Object.values(SOURCES).map((source) => (
            <li key={source.href}>
              <a href={source.href} target="_blank" rel="noopener noreferrer" className="ed-link">
                {source.org}, <i>{source.title}</i>
              </a>{' '}
              <span>({source.year})</span>
            </li>
          ))}
        </ol>
        <p className={styles.checked}>Sources last checked in November 2026.</p>
      </div>
    </>
  )
}
