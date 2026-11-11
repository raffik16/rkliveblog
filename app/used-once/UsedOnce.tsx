'use client'

import NextLink from 'next/link'
import EdChapterHead from '@/components/edition/EdChapterHead'
import EdNote from '@/components/edition/EdNote'
import { cx } from '@/lib/edition/cx'
import { DAYS_PER_YEAR, ITEMS, LIFE_YEARS } from './data'
import { share, tally, tallestBelow, US_AVERAGE } from './model'
import { int, massInWords } from './units'
import { Q, UsedOnceProvider, useUsedOnce } from './context'
import Pile from './Pile'
import Measured from './Measured'
import Stacked from './Stacked'
import Ledger from './Ledger'
import Sources from './Sources'
import styles from './used-once.module.css'

// /used-once: how much toilet paper, paper towel, bottled water and plastic cup one person
// gets through in a lifetime. The opening is always the US average; everything under it is
// worked out from the habits in context.tsx, which start as that average and can be changed.

const AVERAGE = tally(US_AVERAGE)
const PER_DAY = AVERAGE.total.count / (LIFE_YEARS * DAYS_PER_YEAR)

const chapter = (id: string, label: string, num: string, color: string) => ({
  id,
  'data-chapter': id,
  'data-chapter-label': label,
  'data-chapter-num': num,
  'data-chapter-color': color,
})

function Intro() {
  const { total } = AVERAGE
  // To the nearest hundred: the count is an estimate built on estimates
  const about = int(Math.round(total.count / 100) * 100)

  return (
    <section
      className="ed-chapter ed-chapter--first ed-chapter--lead"
      data-chapter="intro"
      data-chapter-color="var(--ed-ink)"
      aria-labelledby="used-once-title"
    >
      <div className="ed-shell">
        <div className="ed-chapter-head--page">
          <EdChapterHead
            num="Lab"
            kicker={`US averages · one life of ${LIFE_YEARS} years`}
            display="Used once"
            title="A lifetime of paper and plastic, counted and drawn to scale"
            as="h1"
            id="used-once-title"
          >
            <p>
              Toilet paper, paper towels, water bottles and plastic cups: four things nobody keeps.
              Each is used one time and thrown away. At today&apos;s average American rates, one{' '}
              {LIFE_YEARS}-year life gets through about {about} of them, weighing{' '}
              <Q v={massInWords(total.kg)} />. That is one every {Math.round(24 / PER_DAY)} hours.
            </p>
            <p>
              Here is that lifetime, drawn to scale. Drag the age to watch it pile up, or set your
              own habits and every figure on the page follows.
            </p>
          </EdChapterHead>
        </div>

        <div className={cx('ed-notes', styles.introNotes)}>
          <EdNote index={1} label="Read this first">
            These are estimates built on estimates. Where each one comes from, and how far to trust
            it, is in the <a href="#sources">sources</a>.
          </EdNote>
        </div>
      </div>
    </section>
  )
}

function Chapters() {
  const { life } = useUsedOnce()
  const plasticCount = share(life.byMaterial.plastic.count, life.total.count)
  const paperWeight = share(life.byMaterial.paper.kg, life.total.kg)
  const cleared = tallestBelow(life.total.stack)

  return (
    <>
      {/* No chapter head here: the drawing is the head. It follows the opening directly, so
          it is the first thing on the page after the sentence that sets it up. */}
      <section
        className={cx('ed-chapter', styles.pileChapter)}
        {...chapter('pile', 'The pile', '01', 'var(--ed-cobalt)')}
        aria-label="The pile, drawn to scale"
      >
        <div className="ed-shell">
          <div className="ed-wide">
            <Pile />
          </div>
        </div>
      </section>

      <section
        className="ed-chapter"
        {...chapter('measured', 'Measured', '02', 'var(--ed-forest)')}
        aria-labelledby="measured-title"
      >
        <div className="ed-shell">
          <EdChapterHead
            num="02"
            kicker="Count, weight, space"
            display="Measured"
            title={
              plasticCount > 0.5 && paperWeight > 0.5
                ? 'Most of the items are plastic. Most of the weight is paper.'
                : 'The same pile, measured three ways'
            }
            id="measured-title"
          >
            <p>
              A water bottle weighs <Q v={{ metric: '9 grams', us: 'a third of an ounce' }} /> and a
              roll of toilet paper <Q v={{ metric: '90', us: 'three ounces' }} />, so which pile is
              bigger depends on what you measure.
            </p>
          </EdChapterHead>
          <Measured />
          <div className="ed-notes">
            <EdNote index={2} label="Not a ranking">
              Weight is not harm. The same weight of plastic and of paper is made, used and thrown
              away very differently.
            </EdNote>
          </div>
        </div>
      </section>

      <section
        className="ed-chapter"
        {...chapter('stacked', 'End to end', '03', 'var(--ed-violet)')}
        aria-labelledby="stacked-title"
      >
        <div className="ed-shell">
          <EdChapterHead
            num="03"
            kicker="One column each"
            display="End to end"
            title={
              cleared
                ? `Stood in one column, a lifetime is taller than ${cleared.text ?? cleared.name}`
                : 'Every roll, bottle and cup, stood in one column'
            }
            id="stacked-title"
          >
            <p>
              Stand each roll, bottle and cup on top of the last and the columns leave the buildings
              behind. The lines across are heights you may know.
            </p>
          </EdChapterHead>
          <Stacked />
        </div>
      </section>

      <section
        className="ed-chapter"
        {...chapter('ledger', 'The ledger', '04', 'var(--ed-raspberry)')}
        aria-labelledby="ledger-title"
      >
        <div className="ed-shell">
          <EdChapterHead
            num="04"
            kicker="All the numbers"
            display="The ledger"
            title="Every number on this page, in one table"
            id="ledger-title"
          >
            <p>
              The figures above are these rows, drawn three ways. Totals are added up before they
              are rounded, so a total can differ from the sum of its rows by one.
            </p>
          </EdChapterHead>
          <div className="ed-wide">
            <Ledger />
          </div>
        </div>
      </section>

      <section
        className="ed-chapter"
        {...chapter('sources', 'Sources', '05', 'var(--ed-ink)')}
        aria-labelledby="sources-title"
      >
        <div className="ed-shell">
          <EdChapterHead
            num="05"
            kicker={`${ITEMS.length} items, 5 starting numbers`}
            display="Sources"
            title="Where the numbers come from, and how far to trust them"
            id="sources-title"
          />
          <Sources />
          <p className={styles.more} data-reveal="">
            More experiments are in the{' '}
            <NextLink href="/lab" className="ed-link">
              lab
            </NextLink>
            .
          </p>
        </div>
      </section>
    </>
  )
}

export default function UsedOnce() {
  return (
    <UsedOnceProvider>
      <div className={cx('ed-page', styles.page)}>
        <Intro />
        <Chapters />
      </div>
    </UsedOnceProvider>
  )
}
