import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { useSocket } from '@/providers/socket-provider'
import { PokerActions } from '@/types'
import { useEffect } from 'react'
import { useMedia } from 'react-use'

import { useDebouncedCallback } from 'use-debounce'

type LeaveNextProps = {
  isLeaveNext: boolean
  setIsLeaveNext: (value: boolean) => void
  tableId: string
  playerId: string
}

export const LeaveNext = ({
  isLeaveNext,
  setIsLeaveNext,
  tableId,
  playerId,
}: LeaveNextProps) => {
  const isMobile = useMedia('(max-width: 768px), (max-height: 768px)', false)

  const { socket } = useSocket()

  const onChecked = () => {
    socket.emit(PokerActions.LEAVE_NEXT_MATCH, { tableId, playerId })
  }

  const debouncedCallback = useDebouncedCallback(onChecked, 1000)

  const onToggle = () => {
    setIsLeaveNext(!isLeaveNext)
  }

  useEffect(() => {
    if (!socket) return

    if (isLeaveNext) {
      debouncedCallback()
    }

    return () => {
      debouncedCallback.cancel()
    }
  }, [isLeaveNext])

  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" checked={isLeaveNext} onCheckedChange={onToggle} />
      <label
        htmlFor="terms"
        className={cn(
          'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          isMobile && 'text-xs'
        )}
      >
        나가기예약
      </label>
    </div>
  )
}
