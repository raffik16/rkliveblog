'use client'

import { type CSSProperties } from 'react'
import { MATERIALS, type Landmark } from './data'
import { tallestBelow } from './model'
import { altitude, distance, height, int, type Dual } from './units'
import { Figure, MaterialKey, Q, useUsedOnce } from './context'
import { useRoving, useTip } from './marks'
import styles from './used-once.module.css'

// Fig. 03: each item stood end to end in one column, then all four on top of each other, with
// a few well-known heights ruled across for scale.

/** The landmark's own height, in the figures people quote for it */
const markHeight = (mark: Landmark): Dual => ({
  metric: `${int(mark.m)} m`,
  us: `${int(mark.ft)} ft`,
})

/** Which heights to rule across the chart: the tallest one each column clears, leaving out any
    that would sit on the baseline or crowd a line already chosen */
function rules(columns: number[], top: number) {
  const chosen: Landmark[] = []
  for (const value of [...columns].sort((a, b) => b - a)) {
    const mark = tallestBelow(value)
    if (!mark || chosen.includes(mark)) continue
    if (mark.m / top < 0.05) continue
    if (chosen.some((other) => Math.abs(other.m - mark.m) / top < 0.07)) continue
    chosen.push(mark)
  }
  return chosen
}

export default function Stacked() {
  const { life, units } = useUsedOnce()
  const { plot, mark, tip } = useTip<HTMLDivElement>()
  const { group, onKeyDown, tabIndex } = useRoving<HTMLOListElement>()

  const total = life.total.stack
  // Room above the tallest column for its label
  const top = Math.max(total, 1) * 1.09
  const lines = rules([...life.rows.map((row) => row.stack), total], top)
  const cleared = tallestBelow(total)
  const cups = life.rows.find((row) => row.item.nest)

  return (
    <Figure
      num="03"
      title="Stood end to end"
      foot={
        <>
          <MaterialKey />
          <p className={styles.figNote}>
            {total > 0 ? (
              <>
                All four in one column: <Q v={distance(total)} />.{' '}
                {cleared && (
                  <>
                    That clears {cleared.text ?? cleared.name} by{' '}
                    <Q v={altitude(total - cleared.m)} />.
                  </>
                )}{' '}
              </>
            ) : (
              'Nothing to stack. '
            )}
            {cups?.item.nest && (
              <>
                Cups are nested the way they come in a sleeve, each adding{' '}
                <Q v={{ metric: '9 mm', us: 'a third of an inch' }} />, so their column barely
                leaves the ground.
              </>
            )}
          </p>
        </>
      }
    >
      <div ref={plot} className={styles.towers}>
        <div className={styles.towerPlot}>
          {lines.map((line) => (
            <div
              key={line.name}
              className={styles.rule}
              style={{ '--at': line.m / top } as CSSProperties}
            >
              <span>
                {line.name}
                <b>
                  <Q v={markHeight(line)} />
                </b>
              </span>
            </div>
          ))}

          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
          <ol ref={group} className={styles.towerRow} onKeyDown={onKeyDown}>
            {life.rows.map((row, at) => {
              const clears = tallestBelow(row.stack)
              return (
                <li key={row.item.id} className={styles.towerCol}>
                  <span
                    className={styles.towerMark}
                    data-mark=""
                    tabIndex={tabIndex(at)}
                    role="img"
                    aria-label={`${row.item.name}: ${int(row.count)} ${row.item.unit.many} end to end, ${altitude(row.stack)[units]}${clears ? `, taller than ${clears.text ?? clears.name}` : ''}`}
                    {...mark({
                      title: row.item.name,
                      color: MATERIALS[row.item.material].color,
                      rows: [
                        ['end to end', altitude(row.stack)[units]],
                        [row.item.unit.many, int(row.count)],
                        [
                          row.item.nest ? 'each, nested' : 'each',
                          row.item.nest
                            ? units === 'us'
                              ? '0.35 in'
                              : '9 mm'
                            : height(row.item.height)[units],
                        ],
                      ],
                    })}
                  >
                    <span className={styles.towerValue} data-anchor="" aria-hidden="true">
                      <Q v={altitude(row.stack)} />
                    </span>
                    <i
                      className={
                        row.item.material === 'paper' ? styles.fillPaper : styles.fillPlastic
                      }
                      style={{ '--v': row.stack / top } as CSSProperties}
                    />
                  </span>
                </li>
              )
            })}

            <li className={styles.towerCol} data-total="">
              <span
                className={styles.towerMark}
                data-mark=""
                tabIndex={tabIndex(life.rows.length)}
                role="img"
                aria-label={`All four end to end: ${altitude(total)[units]}${cleared ? `, taller than ${cleared.text ?? cleared.name}` : ''}`}
                {...mark({
                  title: 'All four',
                  rows: [
                    ['end to end', altitude(total)[units]],
                    ['items', int(life.total.count)],
                  ],
                })}
              >
                <span className={styles.towerValue} data-anchor="" aria-hidden="true">
                  <Q v={altitude(total)} />
                </span>
                {/* The four columns again, one on top of the other, toilet paper at the foot */}
                <span className={styles.towerStack} style={{ '--v': total / top } as CSSProperties}>
                  {life.rows
                    .filter((row) => row.stack > 0)
                    .map((row) => (
                      <i
                        key={row.item.id}
                        className={
                          row.item.material === 'paper' ? styles.fillPaper : styles.fillPlastic
                        }
                        style={{ flexGrow: row.stack }}
                      />
                    ))}
                </span>
              </span>
            </li>
          </ol>
        </div>

        <ol className={styles.towerNames} aria-hidden="true">
          {life.rows.map((row) => (
            <li key={row.item.id}>
              <span className={styles.nameLong}>{row.item.name}</span>
              <span className={styles.nameShort}>{row.item.short}</span>
            </li>
          ))}
          <li data-total="">All four</li>
        </ol>
        {tip}
      </div>
    </Figure>
  )
}
