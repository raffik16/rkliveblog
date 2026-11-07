import { ReactNode } from 'react'

// Tables in posts scroll sideways inside a hairline frame instead of widening the page.
const TableWrapper = ({ children }: { children?: ReactNode }) => {
  return (
    <div className="ed-table">
      <table>{children}</table>
    </div>
  )
}

export default TableWrapper
