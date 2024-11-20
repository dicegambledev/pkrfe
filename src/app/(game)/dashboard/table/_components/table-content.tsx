'use client'

import { Player, PokerActions, TableWithPlayers } from '@/types'
import { TableList } from './list'
import Pagination from './pagination'
import { useSocket } from '@/providers/socket-provider'
import { useEffect, useState } from 'react'
import { LuRefreshCw } from 'react-icons/lu'
import { useRouter, useSearchParams } from 'next/navigation'
import tableApi from '@/services/api/modules/table-api'
import { toast } from 'sonner'
import { useMountedState } from 'react-use'
import { Loader } from 'lucide-react'

interface TableContentProps {}

export const TableContent = ({}: TableContentProps) => {
  const isMounted = useMountedState()

  const [tableList, setTableList] = useState<TableWithPlayers[]>([])
  const [pageCount, setPageCount] = useState(1)
  const { socket } = useSocket()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!socket) return

    socket.on(
      PokerActions.LEAVE_TABLE,
      ({ tableId, playerId }: { tableId: string; playerId: string }) => {
        setTableList(prev =>
          prev.map(table => {
            if (table.id === tableId) {
              return {
                ...table,
                players: table.players.filter(player => player.id !== playerId),
              }
            }
            return table
          })
        )
      }
    )
    socket.on(
      PokerActions.JOIN_TABLE,
      ({ tableId, player }: { tableId: string; player: Player }) => {
        setTableList(prev =>
          prev.map(table => {
            if (table.id === tableId) {
              const updatedPlayers = table.players.filter(
                p => p.id !== player.id
              )

              return {
                ...table,
                players: [...updatedPlayers, player],
              }
            }
            return table
          })
        )
      }
    )

    return () => {
      socket.off(PokerActions.LEAVE_TABLE)
      socket.off(PokerActions.JOIN_TABLE)
    }
  }, [socket])

  useEffect(() => {
    const fetchTables = async () => {
      const { response, error } = await tableApi.getTables({
        page: searchParams?.get('page') || '1',
      })

      if (error) {
        return toast.error("Couldn't fetch tables")
      }

      if (response) {
        setTableList(response?.tables as TableWithPlayers[])
        setPageCount(response?.pageCount as number)
      }
    }
    fetchTables()
  }, [searchParams])

  if (!isMounted) return <TableContentLoading />

  return (
    <div className="content_main">
      <div className="inner">
        <div className="form_custom form_room w-full ">
          <h2 className="ttl_main fz-18">
            <span>
              <strong className="icon sz-24 icon-color-white flex-shrink">
                <i className="icon-room"></i>
              </strong>
              테이블
              <LuRefreshCw
                className="size-4 text-white !block hover:scale-110 transition cursor-pointer"
                onClick={() => router.refresh()}
              />
            </span>
          </h2>
          <div className="row flex flex-center gapy-40">
            <svg>
              <filter id="noiseFilter2">
                <feturbulence
                  type="fractalNoise"
                  baseFrequency="0.6"
                  stitchTiles="stitch"
                ></feturbulence>
              </filter>
              <clipPath id="rounded-clip">
                <rect
                  x="0"
                  y="0"
                  width="300"
                  height="300"
                  rx="20"
                  ry="20"
                ></rect>
              </clipPath>
            </svg>
            <div className="col-12 col-md-8">
              <TableList tables={tableList} />

              {pageCount > 1 && <Pagination pageCount={pageCount} />}
            </div>
            <div className="col-12 col-md-4 py-8">
              <div className="room room_event">
                <p className="text-center">출시 예정</p>
                <br />
                <span className="fz-14">축제방</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const TableContentLoading = () => {
  return (
    <div className="content_main">
      <div className="inner">
        <div className="form_custom form_room w-full ">
          <h2 className="ttl_main fz-18">
            <span>
              <strong className="icon sz-24 icon-color-white flex-shrink">
                <i className="icon-room"></i>
              </strong>
              테이블
            </span>
          </h2>
          <div className="row flex flex-center gapy-40">
            <svg>
              <filter id="noiseFilter2">
                <feturbulence
                  type="fractalNoise"
                  baseFrequency="0.6"
                  stitchTiles="stitch"
                ></feturbulence>
              </filter>
              <clipPath id="rounded-clip">
                <rect
                  x="0"
                  y="0"
                  width="300"
                  height="300"
                  rx="20"
                  ry="20"
                ></rect>
              </clipPath>
            </svg>
            <div className="col-12 col-md-8">
              <div className="flex items-center justify-center">
                <Loader className="size-6 animate-spin text-muted-foreground" />
              </div>
            </div>
            <div className="col-12 col-md-4 py-8">
              <div className="room room_event">
                <p className="text-center">출시 예정</p>
                <br />
                <span className="fz-14">축제방</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
