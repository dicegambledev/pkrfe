'use client'

import { useAutoRebuy } from '@/store/use-auto-rebuy'
import { Switch } from './ui/switch'
import { Match, PlayerWithUser } from '@/types'
import { useEffect } from 'react'
import playerApi from '@/services/api/modules/player-api'
import { useCurrentUser } from '@/hooks/use-current-user'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { useModal } from '@/store/use-modal-store'

type AutoRebuyToggleProps = {
  tableId: string
  player: PlayerWithUser | undefined
  match: Match | null
}

export const AutoRebuyToggle = ({
  tableId,
  player,
  match,
}: AutoRebuyToggleProps) => {
  const { onOpen } = useModal()
  const { isAutoRebuy, setAutoRebuy, autoRebuyAmount, canAutoRebuy } =
    useAutoRebuy()
  const user = useCurrentUser()
  const { update } = useSession()

  const isHaveWinner = (match?.winners?.length ?? 0) > 0

  const canRebuy = isHaveWinner && player?.stack === 0 && canAutoRebuy

  useEffect(() => {
    if (isAutoRebuy && canRebuy) {
      rebuy()
    }
  }, [canRebuy, isAutoRebuy])

  const rebuy = async () => {
    if (!player || !match || !user) return

    const { response, error } = await playerApi.rebuy({
      id: player.id,
      tableId,
      buyIn: autoRebuyAmount,
      userId: user.id,
    })

    if (error) {
      toast.error('Error when rebuying')
      return
    }

    setAutoRebuy({ isAutoRebuy: false, autoRebuyAmount: 0 })
    update()
  }

  const onToggle = () => {
    if (isAutoRebuy) {
      setAutoRebuy({ isAutoRebuy: false })
    } else {
      onOpen('autoRebuy', { tableId })
      setAutoRebuy({ isAutoRebuy: true })
    }
  }

  return (
    <div className="flex items-center gap-x-1">
      <Switch checked={isAutoRebuy} onCheckedChange={onToggle} />
      <p className="text-xs">자동충전</p>
    </div>
  )
}
