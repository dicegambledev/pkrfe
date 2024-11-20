import { TableWithPlayers } from '@/types'
import { Item } from './item'
import { Loader } from 'lucide-react'

interface TableListProps {
  tables: TableWithPlayers[]
}

export const TableList = ({ tables }: TableListProps) => {
  if (!Array.isArray(tables) || !tables.length) {
    return (
      <div className="flex items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const totalPlayersByMinBuyIn = tables.reduce<{ [key: number]: number }>(
    (acc, table) => {
      const { minBuyIn, players } = table
      acc[minBuyIn] = (acc[minBuyIn] || 0) + players.length
      return acc
    },
    {}
  )

  return (
    <div className="row ">
      {tables.map(table => (
        <div key={table.id} className="col-6 col-md-3 col-xl-3">
          <Item
            table={table}
            totalPlayersByMinBuyIn={totalPlayersByMinBuyIn[table.minBuyIn]}
          />
        </div>
      ))}
    </div>
  )
}
