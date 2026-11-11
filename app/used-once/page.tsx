import UsedOnce from './UsedOnce'
import { UNITS_SCRIPT } from './units'

export default function UsedOncePage() {
  return (
    <>
      {/* Chooses kilograms or pounds before the page is first painted (see units.ts) */}
      <script dangerouslySetInnerHTML={{ __html: UNITS_SCRIPT }} />
      <UsedOnce />
    </>
  )
}
