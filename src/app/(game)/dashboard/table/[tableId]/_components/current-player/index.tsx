'use client'

import Image from 'next/image'
import { Hand } from './hand'
import { CurrentPlayerAction } from './actions'

import { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import {
  Card,
  CustomCard,
  HighlightCard,
  Match,
  Participant,
  PlayerHighlightCards,
  PlayerWithUser,
  PokerActions,
  WinnerHandType,
} from '@/types'
import { useSocket } from '@/providers/socket-provider'
import { cn } from '@/lib/utils'
import { formatChipsAmount, getStarRating } from '@/utils/formatting'
import sounds from '@/utils/contants/sound'
import playerApi from '@/services/api/modules/player-api'
import { useRouter } from 'next/navigation'
import { CoinBet } from '@/components/coin-bet'
import { getGenderFromImageUrl } from '@/utils/sound'
import { useAudio, useMountedState } from 'react-use'
import { useModal } from '@/store/use-modal-store'
import { ReviewStars } from './review-stars'
import { CoinAnimate } from '@/components/coin-animate'
import { RebuyButton } from '@/components/rebuy-button'
import { useAutoRebuy } from '@/store/use-auto-rebuy'
import { calculateWinRate, evaluateHandStrength } from '@/utils/winrate'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useVolume } from '@/store/use-volume'
import userApi from '@/services/api/modules/user-api'
import { logout } from '@/actions/logout'
import { clearStorageToken } from '@/utils/storage'

interface CurrentPlayerProps {
  isShowdown?: boolean
  match: Match | null
  participants: Participant[]
  isHandVisible: boolean
  player: PlayerWithUser | undefined
  players: PlayerWithUser[]
  tableId: string
  highlightCards?: HighlightCard
  isLeaveNext: boolean
  playersHighlightSet: PlayerHighlightCards
}

const COUNTDOWN_SECONDS = 9

export const CurrentPlayer = ({
  match,
  participants,
  isHandVisible,
  player,
  players,
  tableId,
  highlightCards,
  isLeaveNext,
  playersHighlightSet,
}: CurrentPlayerProps) => {
  const { volume } = useVolume()

  const gender = getGenderFromImageUrl(player?.user?.image || '')

  const [foldAudio, _f, foldControls] = useAudio({
    src: gender === 'male' ? sounds.soundFoldBoy : sounds.soundFoldGirl,
  })

  const [straightAudio, _s, straightControls] = useAudio({
    src: sounds.soundStraight,
  })
  const [flushAudio, _fl, flushControls] = useAudio({
    src: sounds.soundFlush,
  })
  const [fourAudio, _fo, fourControls] = useAudio({
    src: sounds.soundFourCards,
  })
  const [fullHouseAudio, _fh, fullHouseControls] = useAudio({
    src: sounds.soundFullHouse,
  })
  const [straightFlushAudio, _sf, straightFlushControls] = useAudio({
    src: sounds.soundStraightFlush,
  })
  const [royalFlushAudio, _rl, royalFlushControls] = useAudio({
    src: sounds.soundRoyalFlush,
  })
  const [twoPairAudio, _tp, twoPairControls] = useAudio({
    src: sounds.soundTwoPair,
  })
  const [highCardAudio, _hc, highCardControls] = useAudio({
    src: sounds.soundHighCard,
  })
  const [pairAudio, _p, pairControls] = useAudio({
    src: sounds.soundPair,
  })
  const [threeCardAudio, _tc, threeCardControls] = useAudio({
    src: sounds.soundThreeCards,
  })
  const [strongCongratsAudio, _sc, strongCongratsControls] = useAudio({
    src: sounds.soundStrongCongrats,
  })
  const [weakCongratsAudio, _wc, weakCongratsControls] = useAudio({
    src: sounds.soundWeakCongrats,
  })

  const { socket } = useSocket()
  const { onOpen } = useModal()
  const { isAutoRebuy, autoRebuyAmount, setAutoRebuy, canAutoRebuy } =
    useAutoRebuy()

  const router = useRouter()
  const [imageUrlFirst, setImageUrlFirst] = useState('')
  const [imageUrlSecond, setImageUrlSecond] = useState('')
  const [isAction, setIsAction] = useState(false)
  const [counter, setCounter] = useState(COUNTDOWN_SECONDS)
  const [bet, setBet] = useState(0)
  const [stars, setStars] = useState(0)
  const [countdownSrcAudio, _, controls, ref] = useAudio({
    src: sounds.soundCountdown,
    autoPlay: false,
  })
  const [isBet, setIsBet] = useState(false)
  const [winnerDelay, setWinnerDelay] = useState(false)
  const [foldCount, setFoldCount] = useState(0)
  const [winRate, setWinRate] = useState(0)
  const [currentStack, setCurrentStack] = useState(0)

  const currentParticipant = participants.find(
    item => item.playerId === player?.id
  )

  const isFolded = currentParticipant?.isFolded
  const isHaveWinner = (match?.winners?.length ?? 0) > 0
  const isWinner = !isFolded && match?.winners?.some(w => w.id === player?.id)
  const isTurn = !isFolded && player?.isTurn
  const isShowdown = match?.isShowdown
  const isUnfoldedParticipant = currentParticipant?.isFolded ? false : true
  const isNotEnoughStack =
    player &&
    match?.minBet &&
    player?.stack - match?.minBet * 2 - match.table.ante < 0
  const isStackEmpty = player && player?.stack <= 0

  const canKick =
    (isLeaveNext && isHaveWinner) ||
    (isHaveWinner &&
      canAutoRebuy &&
      (isStackEmpty || isNotEnoughStack || foldCount >= 2))

  const canShowHand = match && !match.isShowdown && isWinner

  const isWaiting = match && !match?.table.handOver && !currentParticipant

  useEffect(() => {
    const stack = player?.stack || 0
    if (!match?.isShowdown) {
      setCurrentStack(stack)
      return
    }

    const timer = setTimeout(() => {
      setCurrentStack(stack)
      return
    }, 1500)
    return () => clearTimeout(timer)
  }, [match, player])
  const currentBet = currentParticipant?.bet || 0
  const currentPot = match?.pot || 0

  const currentWrapperRef = useRef<HTMLDivElement>(null)

  const calculateWinRateForPlayer = useCallback(() => {
    const getHandStrength = (playerId: string) => {
      const playerCards = playersHighlightSet[playerId]?.cards
      const boardCards = match?.board || []

      if (
        playerCards &&
        playerCards.concat(boardCards).length >= 5 &&
        (match?.isFlop || match?.isRiver)
      ) {
        const hand = hands(playerCards.concat(boardCards))
        return evaluateHandStrength(hand)
      }
      return null
    }

    const playerHandStrength = player?.id ? getHandStrength(player.id) : 0
    const winRate =
      playerHandStrength && !isFolded
        ? calculateWinRate(playerHandStrength?.score)
        : 0

    const combinedWinRate = Object.entries(playersHighlightSet).reduce(
      (totalWinRate, [participantId, highlightSet]) => {
        const combinedCards = highlightSet.cards.concat(match?.board || [])
        if (combinedCards.length >= 5) {
          const handStrength = evaluateHandStrength(hands(combinedCards))
          const participant = participants.find(
            item => item.playerId === participantId
          )
          if (participant?.isFolded) {
            return totalWinRate
          }
          return totalWinRate + calculateWinRate(handStrength?.score)
        }
        return totalWinRate
      },
      0
    )

    return isNaN(winRate / combinedWinRate)
      ? 0
      : (winRate / combinedWinRate) * 100
  }, [playersHighlightSet, match, participants, player?.id, isFolded])

  useEffect(() => {
    setWinRate(calculateWinRateForPlayer())
  }, [calculateWinRateForPlayer, match?.isFlop, match?.isTurn, match?.isRiver])

  useEffect(() => {
    if (
      currentParticipant &&
      currentParticipant.cardOne &&
      currentParticipant.cardTwo
    ) {
      const imageUrlFirst = `/images/pocker/${currentParticipant.cardOne?.rank.toLocaleLowerCase()}_${currentParticipant.cardOne?.suit.toLocaleLowerCase()}.png`
      const imageUrlSecond = `/images/pocker/${currentParticipant.cardTwo?.rank.toLocaleLowerCase()}_${currentParticipant.cardTwo?.suit.toLocaleLowerCase()}.png`

      setImageUrlFirst(imageUrlFirst)
      setImageUrlSecond(imageUrlSecond)
      const stars = getStarRating(
        `${currentParticipant?.cardOne?.rank}_${currentParticipant?.cardOne?.suit}`,
        `${currentParticipant?.cardTwo?.rank}_${currentParticipant?.cardTwo?.suit}`
      )

      setStars(stars)
    } else {
      setImageUrlFirst('')
      setImageUrlSecond('')
      setStars(0)
    }
  }, [currentParticipant])
  // }, [participants, player, currentParticipant])

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    if (isTurn && counter > 0 && !isAction) {
      timer = setInterval(() => {
        setCounter(counter - 1)
      }, 1000)
    }

    return () => {
      if (timer) {
        clearInterval(timer)
      }
    }
  }, [counter, isTurn, isAction])

  useEffect(() => {
    if (!isTurn) {
      setCounter(COUNTDOWN_SECONDS)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTurn])

  useEffect(() => {
    if (isTurn && counter === 5) {
      controls.volume(volume)
      controls.play()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTurn, counter])

  useEffect(() => {
    if (isAction || counter === 2) {
      controls.pause()
      if (ref.current) {
        ref.current.currentTime = 0
      }
    }
    if (isAction) {
      setFoldCount(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAction, counter, ref])

  // Detect user close browser or switch to another tab
  useEffect(() => {
    const visibilityHandler = async () => {
      if (currentParticipant?.playerId) {
        await playerApi.removePlayer({
          tableId,
          playerId: currentParticipant.playerId,
        })
      }
      clearStorageToken()
      await userApi.logout()
      await logout()
    }

    const handleBeforeUnload = (event: any) => {
      var message = 'Are you sure you want to leave?'
      event.returnValue = message
      visibilityHandler()
      return message
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('visibilitychange', visibilityHandler)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('visibilitychange', visibilityHandler)
    }
  }, [])

  useEffect(() => {
    if (counter === 0 && isTurn) {
      fold()
      setFoldCount(prev => prev + 1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter])

  useEffect(() => {
    if (isWinner) {
      const timeoutId = setTimeout(() => {
        setWinnerDelay(true)
      }, 2000)

      return () => clearTimeout(timeoutId)
    } else {
      setWinnerDelay(false)
    }
  }, [isWinner])

  useEffect(() => {
    if (currentParticipant && !currentParticipant.isFolded && isHaveWinner) {
      const timeoutId = setTimeout(() => {
        showModalByHandName()
      }, 2000)

      return () => clearTimeout(timeoutId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHaveWinner])

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (canKick) {
      timer = setTimeout(() => {
        removePlayer()
      }, 3000)
    } else {
      if (timer) {
        clearTimeout(timer)
      }
    }

    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canKick])

  useEffect(() => {
    if (currentBet) {
      setIsBet(true)
    }
  }, [currentBet])

  useGSAP(() => {
    const chips = currentWrapperRef.current?.querySelectorAll(
      '.coin_bet_current.move'
    )

    const groupNumber = document.querySelector('.group_number')

    if (!chips || !groupNumber) return

    const bounds = groupNumber.getBoundingClientRect()

    const targetX = bounds.left + bounds.width
    const targetY = bounds.top - bounds.height * 3

    const originalPositions = Array.from(chips).map(c => {
      const originalLeft = c.getBoundingClientRect().left - window.scrollX
      const originalTop = c.getBoundingClientRect().top - window.scrollY

      return {
        left: originalLeft,
        top: originalTop,
      }
    })

    if (isBet) {
      Array.from(chips).forEach((chip, index) => {
        const originalPosition = originalPositions[index]
        const deltaX = originalPosition.left / 2.5
        const deltaY = targetY - originalPosition.top

        gsap.to(chip, {
          duration: 0.2,
          x: deltaX,
          y: deltaY,
          ease: 'power3.out',
          onComplete: () => {
            setTimeout(() => setIsBet(false), 500)
          },
        })
      })
    }
  }, [isBet])

  const removePlayer = async () => {
    try {
      if (!player) return
      const { response, error } = await playerApi.removePlayer({
        playerId: player?.id,
        tableId: tableId,
      })

      if (error) {
        console.log(error)
      }
      router.push('/dashboard/table')
    } catch (error) {
      console.log(error)
    }
  }

  const fold = () => {
    if (socket) {
      socket.emit(PokerActions.FOLD, {
        tableId,
        participantId: currentParticipant?.id,
      })
      foldControls.play()
    }
  }

  const showHand = useCallback(() => {
    if (socket && canShowHand) {
      socket.emit(PokerActions.SHOW_HAND, {
        tableId,
        playerId: player?.id,
      })
    }
  }, [match?.winners])

  const showModalByHandName = () => {
    const winMessages = match?.winMessages || []

    if (!winMessages.length) return

    const lastWinMessage = winMessages[winMessages.length - 1]

    const handName = lastWinMessage.handName

    // if (!handName) return

    const handleSound = () => {
      if (!isWinner) {
        new Audio(sounds.soundLose).play()
        return
      }

      strongCongratsControls.volume(volume)
      weakCongratsControls.volume(volume)
      straightControls.volume(volume)
      flushControls.volume(volume)
      fullHouseControls.volume(volume)
      fourControls.volume(volume)
      straightFlushControls.volume(volume)
      royalFlushControls.volume(volume)
      twoPairControls.volume(volume)
      highCardControls.volume(volume)
      pairControls.volume(volume)
      threeCardControls.volume(volume)

      switch (handName) {
        case WinnerHandType.Straight:
          straightControls.play()
          strongCongratsControls.play()
          break
        case WinnerHandType.Flush:
          flushControls.play()
          strongCongratsControls.play()
          break
        case WinnerHandType.FullHouse:
          fullHouseControls.play()
          strongCongratsControls.play()
          break
        case WinnerHandType.FourOfAKind:
          fourControls.play()
          strongCongratsControls.play()
          break
        case WinnerHandType.StraightFlush:
          straightFlushControls.play()
          strongCongratsControls.play()
          break
        case WinnerHandType.RoyalFlush:
          royalFlushControls.play()
          strongCongratsControls.play()
          break
        case WinnerHandType.TwoPair:
          twoPairControls.play()
          weakCongratsControls.play()
          break
        case WinnerHandType.HighCard:
          highCardControls.play()
          weakCongratsControls.play()
          break
        case WinnerHandType.Pair:
          pairControls.play()
          weakCongratsControls.play()
          break
        case WinnerHandType.ThreeOfAKind:
          threeCardControls.play()
          weakCongratsControls.play()
          break
        default:
          weakCongratsControls.play()
      }
    }

    handleSound()

    switch (handName) {
      case WinnerHandType.Straight:
        return onOpen('straight')
      case WinnerHandType.Flush:
        return onOpen('flush')
      case WinnerHandType.FullHouse:
        return onOpen('fullHouse')
      case WinnerHandType.FourOfAKind:
        return onOpen('fourCard')
      case WinnerHandType.StraightFlush:
        return onOpen('straightFlush')
      case WinnerHandType.RoyalFlush:
        return onOpen('royalFlush')
      default:
        return onOpen('winDefault')
    }
  }

  const hasFirstHighlight = highlightCards?.cards.some(item => {
    return (
      item.rank === currentParticipant?.cardOne?.rank &&
      item.suit === currentParticipant?.cardOne?.suit
    )
  })

  const hasSecondHighlight = highlightCards?.cards.some(item => {
    return (
      item.rank === currentParticipant?.cardTwo?.rank &&
      item.suit === currentParticipant?.cardTwo?.suit
    )
  })

  const hands = (cards: CustomCard[]): CustomCard[] => {
    return Array.from(
      new Map(cards.map(item => [item.id, item])).values()
    ).slice(0, 5)
  }

  const winRateResult = () => {
    if (isWinner) return '100.00'
    if (!isWinner && isHaveWinner) return '0.00'
    return winRate.toFixed(2)
  }

  const getLastBetParticipant = () => {
    if (!match || !players.length) return null

    let currentPlayerIndex = 0

    currentPlayerIndex = players.findIndex(item => item.id === player?.id)

    if (currentPlayerIndex === -1) {
      return null
    }

    const lastPlayerIndex =
      currentPlayerIndex - 1 < 0 ? players.length - 1 : currentPlayerIndex - 1

    const lastBetParticipant = match.participants.find(
      item => item.playerId === players[lastPlayerIndex].id
    )

    if (!lastBetParticipant) return null

    return lastBetParticipant
  }

  const WinRateList = () => {
    return (
      <div
        className={cn(
          'absolute right-[-40%] bottom-0 lg:right-8 lg:top-[-12%] hidden',
          { block: isFolded || isShowdown || isHaveWinner }
        )}
      >
        <div className="bg-[#0e063a] text-white text-xs lg:text-sm font-bold rounded-sm p-1 lg:p-2 mb-2 opacity-80 border shining-card min-w-20 lg:min-w-32">
          <p className="text-[#ffaa00] text-center">{winRateResult()}%</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'group_tool flex flex-space gap-12 before:border-none relative',
        (isTurn || (winnerDelay && isHaveWinner)) && 'user_active',
        !winnerDelay && isHaveWinner && currentParticipant && 'is-lose'
      )}
      ref={currentWrapperRef}
    >
      {foldAudio}
      {countdownSrcAudio}
      {straightAudio}
      {flushAudio}
      {fourAudio}
      {fullHouseAudio}
      {straightFlushAudio}
      {royalFlushAudio}
      {twoPairAudio}
      {highCardAudio}
      {pairAudio}
      {threeCardAudio}
      {strongCongratsAudio}
      {weakCongratsAudio}
      <WinRateList />
      <div className="group_flush">
        <div className="ttl">
          <span>{highlightCards?.name || ''}</span>
        </div>

        <div className="content flex flex-midle gap-8 flex-center">
          <div className="star" onClick={() => onOpen('feeling')}>
            <ReviewStars stars={stars} />
          </div>
          <div className="btn_detail" onClick={() => onOpen('quality')}>
            족보
          </div>
        </div>
      </div>
      <div className="group_left">
        <div
          className={cn(
            'group_user before:border-none',
            isTurn && 'is-status',
            isWaiting && 'user_waitting',
            isShowdown && isUnfoldedParticipant && 'target_showdown',
            isFolded && 'user_fold'
          )}
        >
          <CoinBet
            className="coin_bet_current unmove"
            bet={currentBet}
            pot={currentPot}
          />
          {isBet && (
            <CoinBet
              className="coin_bet_current move"
              bet={currentBet}
              pot={currentPot}
            />
          )}

          {participants.length > 2 && match?.buttonId === player?.id && (
            <div className="slind slind_dealer">
              <Image
                src={'/images/slind_dealer.png'}
                alt="dealerImage"
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-auto"
              />
            </div>
          )}

          {match?.smallBlindId === player?.id && (
            <div className="slind slind_small">
              <div className="box">
                <span>SB</span>
              </div>
            </div>
          )}

          {match?.bigBlindId === player?.id && (
            <div className="slind slind_big">
              <div className="box">
                <span>BB</span>
              </div>
            </div>
          )}

          <div className="wrap">
            <div className="flex flex-midle">
              <div className="left">
                {isBet && <CoinAnimate />}
                <div className="avatar sz-36">
                  <div className="images">
                    <div className="imgDrop ratio_1_1">
                      <Image
                        src={player?.user?.image || '/images/avt/1.jpg'}
                        alt="image alt"
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-auto h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="right">
                {!isWaiting && (
                  <Hand
                    onClick={showHand}
                    imageUrlFirst={imageUrlFirst}
                    imageUrlSecond={imageUrlSecond}
                    isHidden={!isHandVisible}
                    hasFirstHighlight={hasFirstHighlight}
                    hasSecondHighlight={hasSecondHighlight}
                  />
                )}
                {!isWaiting && isFolded && (
                  <div className="text_fold fw-900">FOLD</div>
                )}
                {isWaiting && (
                  <div className="text_waiting fw-700 text-up">
                    waiting...
                    <div className="spinner space-x-0.5">
                      <div className="rect1"></div>
                      <div className="rect2"></div>
                      <div className="rect3"></div>
                      <div className="rect4"></div>
                      <div className="rect5"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex info_user">
              <div className="left sp_full">
                <div className="name text-center ">{player?.user?.name}</div>
              </div>

              <div className="right sp_full">
                <div className="money fw-700 flex flex-midle flex-center">
                  <div className="icon sz-12 mr-4">
                    <i className="icon-coin"></i>
                  </div>
                  $ {formatChipsAmount(currentStack)}
                </div>
                {/* <RebuyButton tableId={tableId} /> */}
              </div>

              {isFolded && (
                <div className="status">
                  <div className="wrap_status status_fold">
                    <svg viewBox="0 0 200 200">
                      <circle
                        className="circle"
                        cx="100"
                        cy="100"
                        r="95"
                        stroke="#231f20"
                        strokeWidth="8"
                        fillOpacity="0"
                      />
                    </svg>
                    <span className="sub">풀</span>
                  </div>
                </div>
              )}

              {isTurn && (
                <div className="status">
                  <div className="wrap_status status_countdown">
                    <svg viewBox="0 0 200 200">
                      <circle
                        className="circle !animate-[stroke_17s_ease-out_forwards]"
                        cx="100"
                        cy="100"
                        r="95"
                        stroke="#231f20"
                        strokeWidth="8"
                        fillOpacity="0"
                      ></circle>
                    </svg>
                    <span className="sub">
                      {counter - 2 >= 0 ? counter - 2 : 0}s
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <CurrentPlayerAction
        isTurn={isTurn}
        player={player}
        bet={bet}
        setIsAction={setIsAction}
        setBet={setBet}
        match={match}
        tableId={tableId}
        currentParticipant={currentParticipant}
        lastBetParticipant={getLastBetParticipant()}
      />
    </div>
  )
}
