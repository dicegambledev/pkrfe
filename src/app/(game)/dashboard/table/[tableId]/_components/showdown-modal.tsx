'use client'

import { cn } from '@/lib/utils'
import { Match, Participant } from '@/types'
import { useEffect, useState } from 'react'
import { useAudio } from 'react-use'
import sounds from '@/utils/contants/sound'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useVolume } from '@/store/use-volume'

interface ShowdownModalProps {
  match: Match | null
  participants: Participant[] | null
}

export const ShowdownModal = ({ match, participants }: ShowdownModalProps) => {
  const user = useCurrentUser()
  const { volume } = useVolume()

  const isHaveParticipant = participants?.some(
    participant =>
      participant.player?.userId === user?.id && !participant.isFolded
  )

  const [isShowdown, setIsShowdown] = useState(false)
  const [audio, _, controls] = useAudio({ src: sounds.showdown })

  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null
    if (match?.isShowdown && match?.isAllAllIn && isHaveParticipant) {
      setIsShowdown(true)
      controls.volume(volume)
      controls.play()
      timerId = setTimeout(() => {
        setIsShowdown(false)
      }, 2000)
    } else {
      setIsShowdown(false)
    }

    return () => {
      if (timerId) {
        clearTimeout(timerId)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match?.isShowdown])

  return (
    <div className={cn('showdown', isShowdown && 'show')}>
      {audio}
      <div className="wrap">
        <div className="text-shadow">SHOWDOWN</div>
      </div>
    </div>
  )
}
