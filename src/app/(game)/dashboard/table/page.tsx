import { TableContent } from './_components/table-content'
import { UserBoard } from '@/components/user-board'

const TablePage = async () => {
  return (
    <div className="boding_main">
      <div className="sidebar_left ">
        <UserBoard />
      </div>
      <TableContent />
    </div>
  )
}

export default TablePage
