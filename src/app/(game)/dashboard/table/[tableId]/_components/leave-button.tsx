'use client'

import { useCurrentUser } from '@/hooks/use-current-user'
import { cn } from '@/lib/utils'
import playerApi from '@/services/api/modules/player-api'
import tableApi from '@/services/api/modules/table-api'
import { useAutoRebuy } from '@/store/use-auto-rebuy'
import { PlayerWithUser } from '@/types'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { toast } from 'sonner'

interface LeaveTableProps {
  tableId: string
  className?: string
  player: PlayerWithUser | undefined
}

export const LeaveButton = ({
  className,
  tableId,
  player,
}: LeaveTableProps) => {
  const user = useCurrentUser()
  const router = useRouter()
  const { update } = useSession()
  const { setAutoRebuy } = useAutoRebuy()

  const [isPending, startTransition] = useTransition()

  const onClick = async () => {
    if (!user || !tableId || !player) {
      router.push('/dashboard/table')
      return
    }

    startTransition(async () => {
      const { response: tableData } = await tableApi.getTableById({
        tableId,
      })

      if (!tableData) {
        toast.error('Error when leaving table')
        router.push('/dashboard/table')
        return
      }

      const currentPlayerOfTable = tableData.players.find(
        (item: any) => item.userId === user.id
      )

      if (!currentPlayerOfTable) {
        toast.error('Error when leaving table')
        router.push('/dashboard/table')
        update()
        return
      }

      const { response, error } = await playerApi.removePlayer({
        tableId,
        playerId: currentPlayerOfTable.id,
      })

      if (error) {
        toast.error('Error when leaving table')
      }

      update()
      router.push('/dashboard/table')
    })
  }

  return (
    <div
      className={cn(
        'btn_action btn_leave',
        className,
        isPending && 'pointer-events-none bg-opacity-50'
      )}
      onClick={onClick}
    >
      나가기
      <span className="sz-16 icon icon-color-white">
        <i className="icon-leave"></i>
      </span>
    </div>
  )
}
