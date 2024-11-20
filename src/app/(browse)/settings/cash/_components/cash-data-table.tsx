'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  PaginationState,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Button } from '@/components/ui/button'
import { DateRange } from 'react-day-picker'
import { addDays } from 'date-fns'
import { DateRangePicker } from '@/components/date-range-picker'
import { dateBetweenFilterFn, statusFilterFn } from '@/utils/filters'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface CashDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function CashDataTable<TData, TValue>({
  columns,
  data,
}: CashDataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2023, 0, 20),
    to: addDays(new Date(), 20),
  })
  const [status, setStatus] = useState<string | undefined>(undefined)
  const [sorting, setSorting] = useState<SortingState>([])

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
      pagination,
      sorting,
    },
    filterFns: {
      dateBetweenFilterFn: dateBetweenFilterFn,
      statusFilterFn: statusFilterFn,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    pageCount: Math.ceil(data.length / pageSize),
  })

  useEffect(() => {
    const dateColumn = table.getColumn('createdAt')
    dateColumn?.setFilterValue(date)
  }, [date, table])

  useEffect(() => {
    const statusColumn = table.getColumn('status')
    statusColumn?.setFilterValue(status)
  }, [status, table])

  const handleSelectedStatus = (value: string) => {
    setStatus(value)
  }

  return (
    <div>
      <div className="flex justify-end items-center py-4 gap-x-2">
        <div className="max-w-sm">
          <Select onValueChange={handleSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="상태" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SUCCESS">성공</SelectItem>
              <SelectItem value="PENDING">대기 중</SelectItem>
              <SelectItem value="FAILED">실패</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="max-w-sm">
          <DateRangePicker date={date} setDate={setDate} />
        </div>
      </div>
      <div className="rounded-md border-none">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={index % 2 !== 0 ? 'bg-white/5' : ''}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <nav className="pagination mt-16 flex flex-end ">
        <ul className="page-numbers nav-pagination links text-center">
          <Button
            className="size-[30px] p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="prev page-number">
              <span className="icon sz-16 icon-color-white">
                <i className="icon-arr_left"></i>
              </span>
            </span>
          </Button>
          {Array.from({ length: table.getPageCount() }).map((_, index) => {
            // Always show the first two and last two pages
            if (index < 2 || index > table.getPageCount() - 3) {
              return (
                <li
                  key={index}
                  className="page-number"
                  onClick={() => table.setPageIndex(index)}
                >
                  <span className={`${pageIndex === index && 'current'}`}>
                    {index + 1}
                  </span>
                </li>
              )
            } else if (index >= pageIndex - 2 && index <= pageIndex + 2) {
              return (
                <li
                  key={index}
                  className="page-number"
                  onClick={() => table.setPageIndex(index)}
                >
                  <span className={`${pageIndex === index && 'current'}`}>
                    {index + 1}
                  </span>
                </li>
              )
            }
            // Show ellipsis if the page is not the first after the first two pages or the last before the last two pages
            else if (index === 2 || index === table.getPageCount() - 3) {
              return (
                <li
                  key={index}
                  className="page-number dots hover:no-underline cursor-default"
                >
                  <span>...</span>
                </li>
              )
            }
          })}
          <Button
            className="size-[30px] p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="next page-number icon-color-white">
              <span className="icon sz-16">
                <i className="icon-arr_right"></i>
              </span>
            </span>
          </Button>
        </ul>
      </nav>
    </div>
  )
}
