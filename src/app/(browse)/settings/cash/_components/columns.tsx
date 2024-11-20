'use client'

import { cn } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

export type CashColumn = {
  id: string
  action: 'RECHARGE' | 'WITHDRAW'
  amount: string
  status: 'PENDING' | 'SUCCESS' | 'FAILED'
  createdAt: string
}

export const columns: ColumnDef<CashColumn>[] = [
  {
    accessorKey: 'createdAt',
    header: '날짜',
    filterFn: 'dateBetweenFilterFn',
  },
  {
    accessorKey: 'action',
    header: '행동',
    cell: ({ row }) => {
      return <div>{row.original.action.toLowerCase()}</div>
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="flex gap-x-2 cursor-pointer"
        >
          (수)량   
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: '상태',
    cell: ({ row }) => {
      return (
        <div
          className={cn(
            'font-semibold',
            row.original.status === 'SUCCESS'
              ? 'text-green-500'
              : row.original.status === 'PENDING'
                ? 'text-yellow-500'
                : 'text-red-500'
          )}
        >
          {row.original.status}
        </div>
      )
    },
    filterFn: 'statusFilterFn',
  },
]
