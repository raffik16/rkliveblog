'use client'

import { type CSSProperties } from 'react'
import { MATERIALS } from './data'
import { share, trim, type Row, type Sum } from './model'
import { int, mass, volume, type Dual, type Units } from './units'
import { Figure, MaterialKey, Q, useUsedOnce } from './context'
import { useRoving, useTip, type TipContent } from './marks'
import styles from './used-once.module.css'

// Fig. 02: the same lifetime measured three ways. Each panel splits its total into paper and
// plastic, then ranks the four items on one scale. The rows keep the same order in all three,
// so an item can be followed across: bottles lead the count, toilet paper leads the weight.

const same = (text: string): Dual => ({ metric: text, us: text })

interface Measure {
  key: keyof Sum
  name: string
  /** As in "29% of the ..." */
  whole: string
  format: (value: number) => Dual
  /** Lines for the tooltip of one item's bar */
  detail: (row: Row, units: Units) => TipContent['rows']
}

const MEASURES: Measure[] = [
  {
    key: 'count',
    name: 'Count',
    whole: 'items',
    format: (value) => same(int(value)),
    detail: (row) => [
      [`${row.item.unit.many} in a lifetime`, int(row.count)],
      ['a year', trim(row.perYear)],
    ],
  },
  {
    key: 'kg',
    name: 'Weight',
    whole: 'weight',
    format: mass,
    detail: (row, units) => [
      ['in a lifetime', mass(row.kg)[units]],
      ['a year', mass((row.perYear * row.item.grams) / 1000)[units]],
    ],
  },
  {
    key: 'space',
    name: 'Space',
    whole: 'space',
    format: volume,
    detail: (row, units) => [['packed upright', volume(row.space)[units]]],
  },
]

function Panel({ measure }: { measure: Measure }) {
  const { life, units } = useUsedOnce()
  const { plot, mark, tip } = useTip<HTMLDivElement>()
  const { group, onKeyDown, tabIndex } = useRoving<HTMLOListElement>()
  const { key } = measure

  const total = life.total[key]
  const most = Math.max(...life.rows.map((row) => row[key]))
  // Whole percentages that add up to 100
  const paper = Math.round(share(life.byMaterial.paper[key], total) * 100)
  const plastic = total > 0 ? 100 - paper : 0
  const unit = measure.key === 'count' ? 'items' : ''

  return (
    <section className={styles.measure} aria-label={measure.name}>
      <h3 className={styles.measureHead}>
        <span>{measure.name}</span>
        <b>
          <Q v={measure.format(total)} />
          {unit && <small>{unit}</small>}
        </b>
      </h3>

      <div
        className={styles.split}
        role="img"
        aria-label={`Paper ${paper}% of the ${measure.whole}, plastic ${plastic}%`}
      >
        {paper > 0 && <i className={styles.fillPaper} style={{ flexGrow: paper }} />}
        {plastic > 0 && <i className={styles.fillPlastic} style={{ flexGrow: plastic }} />}
      </div>
      <p className={styles.splitText} aria-hidden="true">
        <span>
          Paper <b>{paper}%</b>
        </span>
        <span>
          Plastic <b>{plastic}%</b>
        </span>
      </p>

      <div ref={plot} className={styles.plot}>
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
        <ol ref={group} className={styles.bars} onKeyDown={onKeyDown}>
          {life.rows.map((row, at) => {
            const value = row[key]
            const pct = Math.round(share(value, total) * 100)
            const text = measure.format(value)
            return (
              <li key={row.item.id} className={styles.barRow}>
                <span className={styles.barName}>{row.item.short}</span>
                <span
                  className={styles.barTrack}
                  data-mark=""
                  tabIndex={tabIndex(at)}
                  role="img"
                  aria-label={`${row.item.name}: ${text[units]}${unit && ` ${unit}`}, ${pct}% of the ${measure.whole}`}
                  {...mark({
                    title: row.item.name,
                    color: MATERIALS[row.item.material].color,
                    rows: [...measure.detail(row, units), [`of the ${measure.whole}`, `${pct}%`]],
                  })}
                >
                  <i
                    data-anchor=""
                    className={
                      row.item.material === 'paper' ? styles.fillPaper : styles.fillPlastic
                    }
                    style={{ '--v': most > 0 ? value / most : 0 } as CSSProperties}
                  />
                  <span className={styles.barValue} aria-hidden="true">
                    <Q v={text} />
                  </span>
                </span>
              </li>
            )
          })}
        </ol>
        {tip}
      </div>
    </section>
  )
}

export default function Measured() {
  return (
    <Figure
      num="02"
      title="One lifetime, three measures"
      foot={
        <MaterialKey>
          <span className={styles.keyNote}>
            Bars in each panel share that panel&apos;s scale. Space is the room the items take
            packed upright, side by side.
          </span>
        </MaterialKey>
      }
    >
      <div className={styles.measures}>
        {MEASURES.map((measure) => (
          <Panel key={measure.key} measure={measure} />
        ))}
      </div>
    </Figure>
  )
}
