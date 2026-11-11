// Weights, heights and volumes in both systems. Every quantity on /used-once is worked out in
// metric and written in both: the page shows one and hides the other (see Q in context.tsx and
// the [data-unit] rules in used-once.module.css), so switching units never re-renders a figure.

export type Units = 'metric' | 'us'

export interface Dual {
  metric: string
  us: string
}

const LB_PER_KG = 2.2046226218
const FT_PER_M = 3.280839895
const IN_PER_M = 39.37007874
const M_PER_MILE = 1609.344
const CUFT_PER_M3 = 35.3146667

/** A whole number with thousands separators. The locale is fixed so server and browser agree. */
export const int = (value: number) => Math.round(value).toLocaleString('en-US')

const dec = (value: number, digits = 1) =>
  value.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })

// One decimal under ten, where it still says something; none at all for nothing
const small = (value: number) => (value > 0 && value < 10 ? dec(value) : int(value))

/** A weight: "1,003 kg" / "2,210 lb" */
export const mass = (kg: number): Dual => ({
  metric: `${small(kg)} kg`,
  us: `${small(kg * LB_PER_KG)} lb`,
})

/** A weight for a sentence: "1.8 tonnes" / "2.0 tons" once it is big enough */
export function massInWords(kg: number): Dual {
  const lb = kg * LB_PER_KG
  return {
    metric: kg >= 1000 ? `${dec(kg / 1000)} tonnes` : `${int(kg)} kg`,
    us: lb >= 2000 ? `${dec(lb / 2000)} tons` : `${int(lb)} lb`,
  }
}

/** Something you could stand next to: "56 cm", "2.8 m" / "1 ft 10 in", "9 ft 1 in" */
export function height(m: number): Dual {
  const metric = m < 1 ? `${Math.round(m * 100)} cm` : m < 10 ? `${dec(m)} m` : `${int(m)} m`
  if (m >= 10) return { metric, us: `${int(m * FT_PER_M)} ft` }
  const inches = Math.round(m * IN_PER_M)
  const ft = Math.floor(inches / 12)
  const rest = inches - ft * 12
  return { metric, us: ft ? (rest ? `${ft} ft ${rest} in` : `${ft} ft`) : `${rest} in` }
}

/** The size of one item, small enough to hold: "6.4 cm", "28 cm" / "2.5 in", "11 in" */
export function size(m: number): Dual {
  const cm = m * 100
  const inches = m * IN_PER_M
  return {
    metric: `${cm < 10 ? Number(cm.toFixed(1)) : Math.round(cm)} cm`,
    us: inches < 12 ? `${Number(inches.toFixed(1))} in` : height(m).us,
  }
}

/** A height on a chart's scale, always in the base unit: "4,154 m" / "13,627 ft" */
export const altitude = (m: number): Dual => ({
  metric: `${int(m)} m`,
  us: `${int(m * FT_PER_M)} ft`,
})

/** A distance for a sentence: "6.0 km" / "3.7 miles" once it is long enough */
export const distance = (m: number): Dual => ({
  metric: m >= 1000 ? `${dec(m / 1000)} km` : `${int(m)} m`,
  us: m >= M_PER_MILE ? `${dec(m / M_PER_MILE)} miles` : `${int(m * FT_PER_M)} ft`,
})

/** A volume: "13.5 m³" / "476 cu ft" */
export const volume = (m3: number): Dual => ({
  metric: `${m3 > 0 && m3 < 100 ? dec(m3) : int(m3)} m³`,
  us: `${small(m3 * CUFT_PER_M3)} cu ft`,
})

// ---------------------------------------------------------- which to show
// Remembered if the visitor has chosen; otherwise US units for a clock set to a US time zone,
// metric for everyone else.
export const UNITS_KEY = 'used-once:units'
export const UNITS_ATTR = 'data-uo-units'

// The fifty states' zones, under the names browsers report them by (Chrome still says
// America/Indianapolis where the tz database says America/Indiana/Indianapolis).
const US_ZONES =
  '^(America/(New_York|Chicago|Denver|Los_Angeles|Phoenix|Anchorage|Detroit|Boise|Juneau|Sitka|Nome|Adak|Metlakatla|Yakutat|Menominee|Indianapolis|Louisville|Fort_Wayne|Knox_IN|Shiprock|Indiana/|Kentucky/|North_Dakota/)|Pacific/Honolulu|US/)'

export function preferredUnits(): Units {
  try {
    const stored = window.localStorage.getItem(UNITS_KEY)
    if (stored === 'us' || stored === 'metric') return stored
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
    return new RegExp(US_ZONES).test(zone) ? 'us' : 'metric'
  } catch {
    return 'metric'
  }
}

// The same choice, made before the page is first painted so a visitor never sees kilograms
// turn into pounds. It runs from a <script> in the page's HTML (app/used-once/page.tsx); the
// component repeats it after a client-side navigation, where that script does not run.
export const UNITS_SCRIPT = `(function(){try{var u=localStorage.getItem(${JSON.stringify(UNITS_KEY)});if(u!=='us'&&u!=='metric'){u=new RegExp(${JSON.stringify(US_ZONES)}).test(Intl.DateTimeFormat().resolvedOptions().timeZone||'')?'us':'metric'}document.documentElement.setAttribute(${JSON.stringify(UNITS_ATTR)},u)}catch(e){}})()`
