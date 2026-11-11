// Everything /used-once counts, in one place: the four items, the US per-person averages they
// start from, the sizes used to draw and stack them, and where each number comes from. The
// figures and the table are all worked out from this file (see model.ts), so a number changed
// here changes everywhere.

export type ItemId = 'toiletPaper' | 'paperTowels' | 'bottles' | 'cups'
export type Material = 'paper' | 'plastic'

export interface Item {
  id: ItemId
  material: Material
  name: string
  /** Short name for tight spots (chart rows on a phone) */
  short: string
  /** What a number of them is called in a sentence: "11,139 rolls of toilet paper" */
  phrase: string
  unit: { one: string; many: string }
  /** US average, per person per year */
  perYear: number
  /** Weight of one, in grams */
  grams: number
  /** What "one" is, for the table, in metric and in US units */
  spec: { metric: string; us: string }
  /** Size of one, in metres: drawn in the pile and used for the stacks and the space */
  diameter: number
  height: number
  /** Cups come nested in sleeves: how many to a sleeve, and how much each adds to its height */
  nest?: { count: number; pitch: number }
  /** How the habit is asked: "rolls a month", "bottles a week" */
  habit: { per: 'month' | 'week'; max: number; step: number }
}

// The order is the order on the page everywhere: paper first, then plastic.
export const ITEMS: Item[] = [
  {
    id: 'toiletPaper',
    material: 'paper',
    name: 'Toilet paper',
    short: 'Toilet paper',
    phrase: 'rolls of toilet paper',
    unit: { one: 'roll', many: 'rolls' },
    // Statista: 141 rolls and 12.7 kg per person, so 90 g a roll
    perYear: 141,
    grams: 90,
    spec: { metric: '90 g roll', us: '3.2 oz roll' },
    diameter: 0.11,
    height: 0.1,
    habit: { per: 'month', max: 30, step: 0.5 },
  },
  {
    id: 'paperTowels',
    material: 'paper',
    name: 'Paper towels',
    short: 'Paper towels',
    phrase: 'rolls of paper towels',
    unit: { one: 'roll', many: 'rolls' },
    // Statista: 7.5 kg per person, drawn as 235 g "double" rolls
    perYear: 32,
    grams: 235,
    spec: { metric: '235 g roll', us: '8.3 oz roll' },
    diameter: 0.14,
    height: 0.279,
    habit: { per: 'month', max: 12, step: 0.25 },
  },
  {
    id: 'bottles',
    material: 'plastic',
    name: 'Water bottles',
    short: 'Bottles',
    phrase: 'water bottles',
    unit: { one: 'bottle', many: 'bottles' },
    // Container Recycling Institute: 86 billion sold in 2021, over 331.9 million people
    perYear: 259,
    grams: 9.25,
    spec: { metric: '500 ml, 9.25 g', us: '16.9 fl oz, 0.33 oz' },
    diameter: 0.064,
    height: 0.203,
    habit: { per: 'week', max: 35, step: 1 },
  },
  {
    id: 'cups',
    material: 'plastic',
    name: 'Plastic cups',
    short: 'Cups',
    phrase: 'plastic cups',
    unit: { one: 'cup', many: 'cups' },
    // Ocean Conservancy: 18.6 billion a year, over 326.7 million people
    perYear: 57,
    grams: 12,
    spec: { metric: '473 ml, 12 g', us: '16 fl oz, 0.42 oz' },
    diameter: 0.098,
    height: 0.12,
    nest: { count: 50, pitch: 0.009 },
    habit: { per: 'week', max: 21, step: 0.5 },
  },
]

export const ITEM_BY_ID = Object.fromEntries(ITEMS.map((item) => [item.id, item])) as Record<
  ItemId,
  Item
>

export const MATERIALS: Record<Material, { name: string; color: string }> = {
  // Two colours for two materials, from the charting palette's dark steps: checked together on
  // the figure surface for colour-blind separation and contrast before they were used.
  paper: { name: 'Paper', color: '#c98500' },
  plastic: { name: 'Plastic', color: '#3987e5' },
}

/** US life expectancy at birth, 2024 (CDC) */
export const LIFE_YEARS = 79
export const LIFE_RANGE = { min: 40, max: 100 }

export const DAYS_PER_YEAR = 365.2425
export const PER_YEAR = { month: 12, week: DAYS_PER_YEAR / 7 }

/** Every stack in the pile stands on a square this wide, in metres */
export const FOOTPRINT = 2.24
/** The tallest a stack is drawn, in metres. A pile that would stand taller is given squares
    of twice the area instead (see footprintFor in model.ts), so it stays a pile to look at
    and does not turn into a row of needles. */
export const PILE_MAX_HEIGHT = 4.2
/** The figure standing next to the pile, in metres */
export const PERSON_HEIGHT = 1.7

export interface Landmark {
  name: string
  /** The name as it reads in a sentence, where that differs: "the Eiffel Tower" */
  text?: string
  m: number
  ft: number
}

// Heights to hold the stacks up against, shortest first. Feet are the published figures, not
// conversions, so both columns read the way people quote them.
export const LANDMARKS: Landmark[] = [
  { name: 'Eiffel Tower', text: 'the Eiffel Tower', m: 330, ft: 1083 },
  { name: 'Empire State Building', text: 'the Empire State Building', m: 443, ft: 1454 },
  { name: 'Burj Khalifa', text: 'the Burj Khalifa', m: 828, ft: 2717 },
  { name: 'Mount Fuji', m: 3776, ft: 12389 },
  { name: 'Mount Whitney', m: 4421, ft: 14505 },
  { name: 'Kilimanjaro', m: 5895, ft: 19341 },
  { name: 'Denali', m: 6190, ft: 20310 },
  { name: 'Mount Everest', m: 8849, ft: 29032 },
  {
    name: 'Airliner cruising altitude',
    text: 'an airliner at cruising altitude',
    m: 10668,
    ft: 35000,
  },
]

export interface Source {
  org: string
  title: string
  year: string
  href: string
}

export const SOURCES = {
  cdc: {
    org: 'CDC National Center for Health Statistics',
    title: 'Mortality in the United States, 2024 (Data Brief 548)',
    year: '2026',
    href: 'https://www.cdc.gov/nchs/products/databriefs/db548.htm',
  },
  statistaToilet: {
    org: 'Statista Consumer Market Outlook',
    title: 'Toilet paper consumption per person, by country',
    year: '2018',
    href: 'https://www.statista.com/chart/15676/cmo-toilet-paper-consumption/',
  },
  nrdc: {
    org: 'Natural Resources Defense Council',
    title: 'The Issue with Tissue',
    year: '2019',
    href: 'https://www.nrdc.org/sites/default/files/issue-tissue-how-americans-are-flushing-forests-down-toilet-report.pdf',
  },
  statistaHousehold: {
    org: 'Statista Market Insights',
    title: 'Household Paper, United States',
    year: '2024',
    href: 'https://www.statista.com/outlook/cmo/tissue-hygiene-paper/household-paper/united-states',
  },
  epa: {
    org: 'US Environmental Protection Agency',
    title: 'Nondurable Goods: Product-Specific Data',
    year: '2018 data',
    href: 'https://www.epa.gov/facts-and-figures-about-materials-waste-and-recycling/nondurable-goods-product-specific-data',
  },
  cri: {
    org: 'Container Recycling Institute',
    title: 'Beverage Container Recycling Fast Facts',
    year: '2021 data',
    href: 'https://www.container-recycling.org/key-facts/',
  },
  bmc: {
    org: 'Beverage Marketing Corporation',
    title: 'US bottled water volume and single-serve share, 2024',
    year: '2025',
    href: 'https://www.beveragemarketing.com/news-detail.asp?id=825',
  },
  bottleWeight: {
    org: 'Recycling Today',
    title: 'Water bottle weight decreases, recycled content increases',
    year: '2014 data',
    href: 'https://www.recyclingtoday.com/news/water-bottle-weight-decreases-recycled-content-increases',
  },
  oceanConservancy: {
    org: 'Ocean Conservancy',
    title: 'Top Ten Plastic Items Found on US Beaches',
    year: '2023',
    href: 'https://oceanconservancy.org/wp-content/uploads/2023/06/DSM-Analysis-Doc_CLEAN.pdf',
  },
  cleanWater: {
    org: 'Clean Water Action',
    title: 'ReThink Disposable: disposable cups',
    year: '2016',
    href: 'https://www.cleanwateraction.org/sites/default/files/CA_ReTh_Infographic_Cups_06.22.16b-1FINAL.pdf',
  },
  census: {
    org: 'US Census Bureau',
    title: 'National population estimates',
    year: '2018 to 2024',
    href: 'https://www.census.gov/programs-surveys/popest.html',
  },
} satisfies Record<string, Source>

export type SourceId = keyof typeof SOURCES
