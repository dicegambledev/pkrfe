'use client'

import { cn } from '@/lib/utils'
import { useModal } from '@/store/use-modal-store'
import { Match } from '@/types'
import { formattedStringToCards } from '@/utils/formatting'
import Image from 'next/image'
import { useEffect, useState } from 'react'

type Props = {
  match: Match | null
}

export const FullHouseModal = ({ match }: Props) => {
  const { isOpen, onClose, type } = useModal()

  const isModalOpen = isOpen && type === 'fullHouse'

  const [imgSrc, setImgSrc] = useState('/images/quaility/full_house.gif')

  useEffect(() => {
    if (isModalOpen) {
      setImgSrc(`/images/quaility/full_house.gif?${Date.now()}`)

      setTimeout(() => {
        onClose()
      }, 5000)
    }
  }, [isModalOpen, onClose])

  const winMessages = match?.winMessages || []

  const lastWinMessage = winMessages[winMessages.length - 1]

  if (!lastWinMessage) return null

  const bestHandCards = formattedStringToCards(lastWinMessage?.bestHand || `[]`)

  return (
    <div className={cn('status_quaility hidden', isModalOpen && 'show block')}>
      <div className="wrap_innrer">
        <div className="images">
          <Image
            src={imgSrc}
            alt="quality"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-full"
            unoptimized
          />
        </div>
        <div className="status_win">
          <div className="content_top">
            <div className="list">
              {bestHandCards.length &&
                bestHandCards.map((card: any, index) => (
                  <div className="item" key={index}>
                    <div className="wrap">
                      <Image
                        src={`/images/pocker/${card?.rank?.toLowerCase()}_${card?.suit?.toLowerCase()}.png`}
                        alt="pokerOnImage"
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-auto h-full"
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="content">
            <div className="wrap">
              <div className="title fw-500">
                <span className="fw-900">{lastWinMessage.winnerHand}</span>
                {lastWinMessage.content}
              </div>
              <div className="money">
                <span className="color-main">+{lastWinMessage.amount}$</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
