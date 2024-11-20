'use client'

import { cn } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

export type HistoryColumn = {
  id: string
  name: string
  amount: string
  status: 'win' | 'lose'
  createdAt: Date
}

export const columns: ColumnDef<HistoryColumn>[] = [
  {
    accessorKey: 'createdAt',
    header: '테이블',
    filterFn: 'dateBetweenFilterFn',
  },
  {
    accessorKey: 'name',
    header: '테이블',
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="flex gap-x-2 cursor-pointer"
        >
          테이블
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: '테이블',
    cell: ({ row }) => {
      return (
        <div
          className={cn(
            'font-semibold',
            row.original.status === 'win' ? 'text-green-500' : 'text-red-500'
          )}
        >
          {row.original.status}
        </div>
      )
    },
    filterFn: 'statusFilterFn',
  },
]
