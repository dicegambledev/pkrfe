'use client'

import { useCurrentUser } from '@/hooks/use-current-user'
import { cn } from '@/lib/utils'
import { useSocket } from '@/providers/socket-provider'
import historyApi from '@/services/api/modules/history-api'
import { useSidebarMobile } from '@/store/use-sidebar-mobile'
import { PokerActions } from '@/types'
import { formatChipsAmount } from '@/utils/formatting'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

type StatisticalProps = {
  tableId: string
}

type Statistical = {
  winCount: number
  winAmount: number
  loseCount: number
  loseAmount: number
}

export const Statistical = ({ tableId }: StatisticalProps) => {
  const user = useCurrentUser()
  const { socket } = useSocket()
  const { sidebarMobile, setSidebarMobile } = useSidebarMobile()

  const [statistical, setStatistical] = useState<Statistical>({
    winCount: 0,
    winAmount: 0,
    loseCount: 0,
    loseAmount: 0,
  })

  useEffect(() => {
    if (socket) {
      socket.on(PokerActions.UPDATE_STATISTICAL, (data: Statistical) => {
        if (data) {
          setStatistical(data)
        }
      })
    }
  }, [socket])

  useEffect(() => {
    const getStatisticalByTableId = async () => {
      if (!user) return
      const { response, error } = await historyApi.getStatisticalByTableId({
        userId: user?.id,
        tableId,
      })

      if (error) {
        toast.error('Some thing went wrong!')
        return
      }

      if (response) {
        setStatistical(response)
      }
    }

    getStatisticalByTableId()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onToggle = () => {
    if (sidebarMobile === 'statistical') {
      setSidebarMobile('none')
      return
    }

    setSidebarMobile('statistical')
  }

  const totalWin = statistical.winAmount
  const totalLose = statistical.loseAmount
  const difference = totalWin - totalLose
  const status =
    difference > 0
      ? `${formatChipsAmount(difference)}$ (승)`
      : `${formatChipsAmount(Math.abs(difference))}$ (패)`
  return (
    <div
      className={cn(
        'table_statistical',
        sidebarMobile === 'statistical' && 'active'
      )}
    >
      <div className="close" onClick={onToggle}>
        <span className="sz-16 icon">
          <i className="icon-down"></i>
        </span>
      </div>
      <div className="ttl">
        통계 - <span className="text-white">{status}</span>
      </div>
      <div className="content">
        <dl className="flex flex-midle">
          <dt>승 :</dt>
          <dd>{statistical.winCount} 판</dd>
          <dd className="flex gap-8 flex-midle">
            <span className="icon sz-8 flex-shrink">
              <i className="icon-coin"></i>
            </span>
            {formatChipsAmount(statistical.winAmount || 0)}$
          </dd>
        </dl>
        <dl className="flex flex-midle">
          <dt>패 :</dt>
          <dd>{statistical.loseCount} 판</dd>
          <dd className="flex gap-8 flex-midle">
            <span className="icon sz-8 flex-shrink">
              <i className="icon-coin"></i>
            </span>
            {formatChipsAmount(statistical.loseAmount || 0)}$
          </dd>
        </dl>
      </div>
    </div>
  )
}
