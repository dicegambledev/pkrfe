'use client'

import { CashDataTable } from './cash-data-table'

import { CashColumn, columns } from './columns'

interface CashesClientProps {
  data: CashColumn[]
}

export const CashesClient = ({ data }: CashesClientProps) => {
  return <CashDataTable columns={columns} data={data} />
}
