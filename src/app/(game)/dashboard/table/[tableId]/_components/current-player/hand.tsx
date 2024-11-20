'use client'

import { cn } from '@/lib/utils'
import { Card } from '../card'
import { HighlightCard } from '@/types'
import { useMedia } from 'react-use'
import { useEffect, useState } from 'react'

interface HandProps {
  onClick: () => void
  imageUrlFirst: string
  imageUrlSecond: string
  isHidden?: boolean
  highlightCards?: HighlightCard
  hasFirstHighlight?: boolean
  hasSecondHighlight?: boolean
}

export const Hand = ({
  onClick,
  imageUrlFirst,
  imageUrlSecond,
  isHidden,
  hasFirstHighlight,
  hasSecondHighlight,
}: HandProps) => {
  const [imageUrl, setImageUrl] = useState({
    first: '',
    second: '',
  })

  const hasHighlight = hasFirstHighlight || hasSecondHighlight

  const isMobile = useMedia('(max-width: 768px), (max-height: 768px)', false)

  useEffect(() => {
    if (imageUrlFirst) {
      setImageUrl(prevImageUrl => ({ ...prevImageUrl, first: imageUrlFirst }))
    }
  }, [imageUrlFirst])

  useEffect(() => {
    if (imageUrlSecond) {
      setImageUrl(prevImageUrl => ({ ...prevImageUrl, second: imageUrlSecond }))
    }
  }, [imageUrlSecond])

  useEffect(() => {
    if (isHidden) {
      setImageUrl({ first: '', second: '' })
    }
  }, [isHidden])

  return (
    <div
      className="pocker_list current_poker_list cursor-pointer"
      onClick={() => onClick()}
    >
      <div
        className={cn(
          `item flipped opacity-0 pointer-events-none transition -translate-x-3 -translate-y-3.5`,
          !isHidden && 'opacity-100 pointer-events-auto',
          hasFirstHighlight && 'status_active',
          isMobile && '-translate-x-1.5 -translate-y-1.5',
          !imageUrl.first && 'opacity-0 pointer-events-none'
        )}
      >
        <div className="pocker">
          <Card
            imageUrl={imageUrl.first}
            value={10}
            frontClassName={cn(
              hasHighlight && !hasFirstHighlight && 'brightness-50'
            )}
          />
        </div>
      </div>
      <div
        className={cn(
          `item flipped opacity-0 pointer-events-none transition -translate-x-2 -translate-y-3.5 `,
          !isHidden && 'opacity-100 pointer-events-auto',
          hasSecondHighlight && 'status_active',
          isMobile && 'translate-x-2.5 -translate-y-1.5',
          !imageUrl.second && 'opacity-0 pointer-events-none'
        )}
      >
        <div className="pocker">
          <Card
            imageUrl={imageUrl.second}
            value={10}
            frontClassName={cn(
              hasHighlight && !hasSecondHighlight && 'brightness-50'
            )}
          />
        </div>
      </div>
    </div>
  )
}
