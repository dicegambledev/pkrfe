'use client'

import { useEffect, useRef, useState } from 'react'
import { Card } from './card'
import { cn } from '@/lib/utils'
import { HighlightCard, Match } from '@/types'
import { formatChipsAmount } from '@/utils/formatting'
import sounds from '@/utils/contants/sound'
import { useAudio } from 'react-use'
import gsap from 'gsap'
import { useVolume } from '@/store/use-volume'

interface BoardProps {
  match: Match | null
  isHidden?: boolean
  isShuffle?: boolean
  highlightCards?: HighlightCard
}

const FlopCard = ({
  card,
  hasHighLight,
  hasFlopHighlight,
  hiddenClass,
}: any) => {
  return (
    <div
      className={cn(
        'item flipped',
        hiddenClass,
        hasFlopHighlight && 'status_active'
      )}
    >
      <div
        className={cn(
          'pocker',
          hasHighLight &&
            !hasFlopHighlight &&
            'before:!inset-0 before:!bg-black/30'
        )}
      >
        <Card
          imageUrl={`/images/pocker/${card.rank.toLowerCase()}_${card.suit.toLowerCase()}.png`}
          value={10}
        />
      </div>
    </div>
  )
}

export const Board = ({ match, highlightCards }: BoardProps) => {
  const { volume } = useVolume()
  const [turnRiverAudio, _t, turnRiverControls] = useAudio({
    src: '/sounds/sound_slip_3.mp3',
    autoPlay: false,
  })

  const [openAudio, _o, openControls] = useAudio({
    src: sounds.soundOpen,
    autoPlay: false,
  })

  const [open2Audio, _o2, open2Controls] = useAudio({
    src: sounds.soundOpen,
    autoPlay: false,
  })

  const [open3Audio, _o3, open3Controls] = useAudio({
    src: sounds.soundOpen,
    autoPlay: false,
  })
  const [flopAudio, _f, flopControls] = useAudio({
    src: '/sounds/sound_slip_2.mp3',
    autoPlay: false,
  })

  const [firstFlopHiddenClass, setFirstFlopHiddenClass] = useState('hide')
  const [secondFlopHiddenClass, setSecondFlopHiddenClass] = useState('hide')
  const [thirdFlopHiddenClass, setThirdFlopHiddenClass] = useState('hide')
  const [turnHiddenClass, setTurnHiddenClass] = useState('hide')
  const [riverHiddenClass, setRiverHiddenClass] = useState('hide')

  const isPreFlop = match?.isPreFlop
  const isFlop = match?.isFlop
  const isTurn = match?.isTurn
  const isRiver = match?.isRiver
  const board = match?.board

  const turnCardRef = useRef(null)
  const riverCardRef = useRef(null)

  useEffect(() => {
    if (isTurn && turnCardRef.current) {
      gsap.from(turnCardRef.current, {
        duration: 0.3,
        x: '-100vw',
        y: '-100vh',
        opacity: 0,
        ease: 'power3.out',
      })

      turnRiverControls.volume(volume)
      turnRiverControls.play()

      const timer = setTimeout(() => {
        // turnRiverControls.volume(0.5)
        openControls.volume(volume)
        openControls.play()
        setTurnHiddenClass('')
      }, 300)

      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTurn])

  useEffect(() => {
    if (isRiver && riverCardRef.current) {
      gsap.from(riverCardRef.current, {
        duration: 0.3,
        x: '-100vw',
        y: '-100vh',
        opacity: 0,
        ease: 'power3.out',
      })

      turnRiverControls.volume(volume)
      turnRiverControls.play()

      setTimeout(() => {
        openControls.volume(volume)
        openControls.play()
      }, 700)

      const timer = setTimeout(() => {
        // turnRiverControls.volume(0.5)
        setRiverHiddenClass('')
      }, 300)

      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRiver])

  useEffect(() => {
    if (isFlop) {
      turnRiverControls.volume(volume)
      turnRiverControls.play()

      setTimeout(() => {
        openControls.volume(volume)
        openControls.play()
        setFirstFlopHiddenClass('')
      }, 200)

      setTimeout(() => {
        open2Controls.volume(volume)
        open2Controls.play()
        setSecondFlopHiddenClass('')
      }, 400)

      setTimeout(() => {
        open3Controls.volume(volume)
        open3Controls.play()
        setThirdFlopHiddenClass('')
      }, 600)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFlop])

  useEffect(() => {
    if (!isPreFlop) {
      setFirstFlopHiddenClass('hide')
      setSecondFlopHiddenClass('hide')
      setThirdFlopHiddenClass('hide')
      setTurnHiddenClass('hide')
      setRiverHiddenClass('hide')
    }
  }, [isPreFlop])

  const hasTurnHighlight = highlightCards?.cards.some(highlightCard => {
    if (!board || !highlightCard) return false
    return (
      highlightCard.rank === board[3].rank &&
      highlightCard.suit === board[3].suit
    )
  })
  const hasRiverHighlight = highlightCards?.cards.some(highlightCard => {
    if (!board) return false
    return (
      highlightCard.rank === board[4].rank &&
      highlightCard.suit === board[4].suit
    )
  })

  const hasHighLight =
    highlightCards && highlightCards.name && highlightCards.cards.length > 0

  const hasFirstFlopHighlight = highlightCards?.cards.some(highlightCard => {
    if (!board) return false
    return (
      highlightCard.rank === board[0].rank &&
      highlightCard.suit === board[0].suit
    )
  })

  const hasSecondFlopHighlight = highlightCards?.cards.some(highlightCard => {
    if (!board) return false
    return (
      highlightCard.rank === board[1].rank &&
      highlightCard.suit === board[1].suit
    )
  })

  const hasThirdFlopHighlight = highlightCards?.cards.some(highlightCard => {
    if (!board) return false
    return (
      highlightCard.rank === board[2].rank &&
      highlightCard.suit === board[2].suit
    )
  })

  return (
    <div className="group_midle">
      {openAudio}
      {open2Audio}
      {open3Audio}
      {flopAudio}
      {turnRiverAudio}
      <div className="group_pocker">
        <div className="list_pocker group_mask">
          <div className="item"></div>
          <div className="item"></div>
          <div className="item"></div>
          <div className="item"></div>
          <div className="item"></div>
        </div>
        <div
          className={cn(
            'list_pocker  pocker_action',
            isPreFlop && !isFlop && 'pocker_hide '
          )}
        >
          {board && board?.length && (
            <>
              <div
                className={cn(
                  'item flipped',
                  firstFlopHiddenClass,
                  hasFirstFlopHighlight && 'status_active'
                )}
              >
                <div className={cn('pocker')}>
                  <Card
                    imageUrl={`/images/pocker/${board[0].rank.toLowerCase()}_${board[0].suit.toLowerCase()}.png`}
                    value={10}
                    frontClassName={cn(
                      hasHighLight && !hasFirstFlopHighlight && 'brightness-50'
                    )}
                  />
                </div>
              </div>

              <div
                className={cn(
                  'item flipped',
                  secondFlopHiddenClass,
                  hasSecondFlopHighlight && 'status_active'
                )}
              >
                <div className={cn('pocker')}>
                  <Card
                    imageUrl={`/images/pocker/${board[1].rank.toLowerCase()}_${board[1].suit.toLowerCase()}.png`}
                    value={10}
                    frontClassName={cn(
                      hasHighLight && !hasSecondFlopHighlight && 'brightness-50'
                    )}
                  />
                </div>
              </div>

              <div
                className={cn(
                  'item flipped',
                  thirdFlopHiddenClass,
                  hasThirdFlopHighlight && 'status_active'
                )}
              >
                <div className={cn('pocker')}>
                  <Card
                    imageUrl={`/images/pocker/${board[2].rank.toLowerCase()}_${board[2].suit.toLowerCase()}.png`}
                    value={10}
                    frontClassName={cn(
                      hasHighLight && !hasThirdFlopHighlight && 'brightness-50'
                    )}
                  />
                </div>
              </div>
            </>
          )}
        </div>
        {board && board?.length && (
          <>
            {isTurn && (
              <div
                ref={turnCardRef}
                className="list_pocker list_pocker_last last1"
              >
                <div
                  className={cn(
                    'item flipped',
                    turnHiddenClass,
                    hasTurnHighlight && 'status_active'
                  )}
                >
                  <div className={cn('pocker')}>
                    <Card
                      imageUrl={`/images/pocker/${board[3].rank.toLowerCase()}_${board[3].suit.toLowerCase()}.png`}
                      value={10}
                      frontClassName={cn(
                        hasHighLight && !hasTurnHighlight && 'brightness-50'
                      )}
                    />
                  </div>
                </div>
              </div>
            )}
            {isRiver && (
              <div
                ref={riverCardRef}
                className="list_pocker list_pocker_last last2"
              >
                <div
                  className={cn(
                    'item flipped is_slow',
                    riverHiddenClass,
                    hasRiverHighlight && 'status_active'
                  )}
                >
                  <div className={cn('pocker')}>
                    <Card
                      imageUrl={`/images/pocker/${board[4].rank.toLowerCase()}_${board[4].suit.toLowerCase()}.png`}
                      value={10}
                      frontClassName={cn(
                        hasHighLight && !hasRiverHighlight && 'brightness-50'
                      )}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <div className="group_number flex flex-midle flex-center gap-24">
        <div className="text">
          Total:
          <span className="fw-900">$ {formatChipsAmount(match?.pot || 0)}</span>
        </div>
        <div className="text">
          Call:
          <span className="fw-900">
            $ {formatChipsAmount(match?.callAmount || 0)}
          </span>
        </div>
      </div>
    </div>
  )
}
