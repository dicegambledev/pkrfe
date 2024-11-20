import { TableContent } from './_components/table-content'

interface TableIdPageProps {
  params: {
    tableId: string
  }
}

const TableIdPage = async ({ params }: TableIdPageProps) => {
  const { tableId } = params

  if (!tableId) return null

  return <TableContent tableId={tableId} />
}

export default TableIdPage
