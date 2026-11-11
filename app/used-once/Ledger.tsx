'use client'

import { MATERIALS, type Material } from './data'
import { pace, trim, type Sum } from './model'
import { altitude, int, mass, volume } from './units'
import { Basis, Q, UnitsToggle, useUsedOnce } from './context'
import styles from './used-once.module.css'

// The table every figure on the page is drawn from, and the way to read all of them without
// seeing a chart: one row per item, then paper, plastic and everything together.

function SumRow({ name, sum, material }: { name: string; sum: Sum; material?: Material }) {
  return (
    <tr className={material ? undefined : styles.ledgerTotal}>
      <th scope="row">
        <span className={styles.ledgerName}>
          {material && <i style={{ background: MATERIALS[material].color }} aria-hidden="true" />}
          {name}
        </span>
      </th>
      <td>{int(sum.count)}</td>
      <td>
        <Q v={mass(sum.kg)} />
      </td>
      <td />
      <td />
      <td>
        <Q v={altitude(sum.stack)} />
      </td>
      <td>
        <Q v={volume(sum.space)} />
      </td>
    </tr>
  )
}

export default function Ledger() {
  const { habits, life } = useUsedOnce()

  return (
    <div className={styles.ledger} data-reveal="">
      <div className={styles.figBar}>
        <span className={styles.figName}>
          <b>Table</b> One life of {habits.years} years
        </span>
        <span className={styles.figTools}>
          <Basis />
          <UnitsToggle />
        </span>
      </div>
      {/* Wider than a phone: it scrolls sideways inside its own frame, the item names staying
          put, with the two columns the page is about (lifetime count and weight) first */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
      <div className={styles.ledgerScroll} tabIndex={0} role="region" aria-label="The ledger">
        <table className={styles.ledgerTable}>
          <thead>
            <tr>
              <th scope="col">Item</th>
              <th scope="col">Lifetime</th>
              <th scope="col">Weight</th>
              <th scope="col">A year</th>
              <th scope="col">Pace</th>
              <th scope="col">End to end</th>
              <th scope="col">Space</th>
            </tr>
          </thead>
          <tbody>
            {life.rows.map((row) => (
              <tr key={row.item.id}>
                <th scope="row">
                  <span className={styles.ledgerName}>
                    <i
                      style={{ background: MATERIALS[row.item.material].color }}
                      aria-hidden="true"
                    />
                    {row.item.name}
                  </span>
                  <span className={styles.ledgerSpec}>
                    <Q v={row.item.spec} />
                  </span>
                </th>
                <td>{int(row.count)}</td>
                <td>
                  <Q v={mass(row.kg)} />
                </td>
                <td>{trim(row.perYear)}</td>
                <td>{pace(row.perYear)}</td>
                <td>
                  <Q v={altitude(row.stack)} />
                </td>
                <td>
                  <Q v={volume(row.space)} />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <SumRow name="Paper" sum={life.byMaterial.paper} material="paper" />
            <SumRow name="Plastic" sum={life.byMaterial.plastic} material="plastic" />
            <SumRow name="All four" sum={life.total} />
          </tfoot>
        </table>
      </div>
    </div>
  )
}
