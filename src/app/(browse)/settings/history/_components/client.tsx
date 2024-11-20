'use client'

import { HistoryDataTable } from './history-data-table'

import { HistoryColumn, columns } from './columns'

interface HistoriesClientProps {
  data: HistoryColumn[]
}

export const HistoriesClient = ({ data }: HistoriesClientProps) => {
  return <HistoryDataTable searchKey="name" columns={columns} data={data} />
}
