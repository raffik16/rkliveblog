import {
  DAYS_PER_YEAR,
  FOOTPRINT,
  ITEMS,
  LANDMARKS,
  LIFE_YEARS,
  PER_YEAR,
  PILE_MAX_HEIGHT,
  type Item,
  type ItemId,
  type Landmark,
  type Material,
} from './data'

// The arithmetic behind every figure on /used-once. A lifetime is a per-year rate held for a
// number of years: nothing here is cleverer than that, on purpose.

export interface Habits {
  /** Each item's rate, per person per year */
  perYear: Record<ItemId, number>
  years: number
}

export const US_AVERAGE: Habits = {
  perYear: Object.fromEntries(ITEMS.map((item) => [item.id, item.perYear])) as Record<
    ItemId,
    number
  >,
  years: LIFE_YEARS,
}

export const isAverage = (habits: Habits) =>
  habits.years === LIFE_YEARS && ITEMS.every((item) => habits.perYear[item.id] === item.perYear)

/** How many have been used by a given age */
export const countAt = (perYear: number, age: number) => Math.max(0, Math.round(perYear * age))

/** A rate in the unit the habit is asked in: rolls a month, bottles a week */
export const toHabit = (item: Item, perYear: number) => perYear / PER_YEAR[item.habit.per]
export const fromHabit = (item: Item, value: number) => value * PER_YEAR[item.habit.per]

/** Height of one drawn column: a full sleeve of nested cups, or a single roll or bottle */
export const columnHeight = (item: Item) =>
  item.nest ? item.height + (item.nest.count - 1) * item.nest.pitch : item.height

/** All of them stood on top of each other. Cups nest; everything else stands end to end. */
export const stackHeight = (item: Item, count: number) =>
  count <= 0 ? 0 : item.nest ? item.height + (count - 1) * item.nest.pitch : count * item.height

/** The room they take packed upright in a square grid, in cubic metres */
export const spaceOf = (item: Item, count: number) =>
  (item.nest ? count / item.nest.count : count) * item.diameter ** 2 * columnHeight(item)

// ------------------------------------------------------------------ the pile
// In the drawing every stack stands on a square of the same size, filled a layer at a time, so
// a stack's height is its volume.

/** How many fit along one side of the square */
export const perSide = (item: Item, footprint = FOOTPRINT) =>
  Math.max(1, Math.round(footprint / item.diameter))
export const perLayer = (item: Item, footprint = FOOTPRINT) => perSide(item, footprint) ** 2
/** Columns to draw: sleeves for cups, single items for the rest */
export const columnsOf = (item: Item, count: number) =>
  item.nest ? Math.ceil(count / item.nest.count) : count

/** How many cups are in the last, part-filled sleeve (a full sleeve's worth if none is) */
export const lastSleeve = (item: Item, count: number) =>
  item.nest ? count % item.nest.count || item.nest.count : 1

/** How tall the stack stands in the pile, in metres */
export function pileHeight(item: Item, count: number, footprint = FOOTPRINT) {
  const columns = columnsOf(item, count)
  if (columns <= 0) return 0
  const layer = perLayer(item, footprint)
  const layers = Math.ceil(columns / layer)
  const full = columnHeight(item)
  if (!item.nest) return layers * full
  // The top layer is as tall as its tallest sleeve: a full one unless the only sleeve up
  // there is the part-filled last one.
  const onTop = columns - (layers - 1) * layer
  const partial = lastSleeve(item, count)
  const top =
    onTop > 1 || partial === item.nest.count ? full : item.height + (partial - 1) * item.nest.pitch
  return (layers - 1) * full + top
}

/** The side of the square every stack stands on, for a whole life's counts: the usual one,
    doubled in area until no stack is taller than PILE_MAX_HEIGHT */
export function footprintFor(counts: Record<ItemId, number>) {
  let side = FOOTPRINT
  for (let doubling = 0; doubling < 16; doubling++) {
    if (ITEMS.every((item) => pileHeight(item, counts[item.id], side) <= PILE_MAX_HEIGHT)) break
    side *= Math.SQRT2
  }
  return side
}

// --------------------------------------------------------------------- tally
export interface Row {
  item: Item
  perYear: number
  count: number
  kg: number
  /** Stood end to end, in metres */
  stack: number
  /** Packed upright, in cubic metres */
  space: number
}

export interface Sum {
  count: number
  kg: number
  stack: number
  space: number
}

export interface Tally {
  rows: Row[]
  total: Sum
  byMaterial: Record<Material, Sum>
}

const ZERO: Sum = { count: 0, kg: 0, stack: 0, space: 0 }
const add = (sum: Sum, row: Row): Sum => ({
  count: sum.count + row.count,
  kg: sum.kg + row.kg,
  stack: sum.stack + row.stack,
  space: sum.space + row.space,
})

/** Everything used by a given age (the whole life, unless an age is given) */
export function tally(habits: Habits, age = habits.years): Tally {
  const rows = ITEMS.map((item) => {
    const perYear = habits.perYear[item.id]
    const count = countAt(perYear, age)
    return {
      item,
      perYear,
      count,
      kg: (count * item.grams) / 1000,
      stack: stackHeight(item, count),
      space: spaceOf(item, count),
    }
  })
  return {
    rows,
    total: rows.reduce(add, ZERO),
    byMaterial: {
      paper: rows.filter((row) => row.item.material === 'paper').reduce(add, ZERO),
      plastic: rows.filter((row) => row.item.material === 'plastic').reduce(add, ZERO),
    },
  }
}

/** A share of a whole as a 0 to 1 fraction, 0 when the whole is empty */
export const share = (part: number, whole: number) => (whole > 0 ? part / whole : 0)

/** The tallest landmark a stack clears, if any */
export const tallestBelow = (metres: number): Landmark | undefined =>
  LANDMARKS.filter((mark) => mark.m <= metres).pop()

/** How often one is used, in words: "one every 2.6 days" */
export function pace(perYear: number) {
  if (perYear <= 0) return 'none'
  const perDay = perYear / DAYS_PER_YEAR
  if (perDay >= 1.5) return `${trim(perDay)} a day`
  const days = 1 / perDay
  if (days < 2) return `one every ${Math.round(days * 24)} hours`
  if (days < 10) return `one every ${trim(days)} days`
  if (days < 45) return `one every ${Math.round(days)} days`
  if (days < 120) return `one every ${Math.round(days / 7)} weeks`
  return `one every ${Math.round(days / (DAYS_PER_YEAR / 12))} months`
}

/** One decimal, without a trailing ".0" */
export const trim = (value: number) => String(Number(value.toFixed(1)))
