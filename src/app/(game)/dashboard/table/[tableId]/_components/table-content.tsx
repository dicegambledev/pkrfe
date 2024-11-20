'use client'

import { OtherPlayer } from './other-player'
import { CurrentPlayer } from './current-player'
import { Board } from './board'
import { useState, useEffect, useRef, useMemo } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

import {
  CustomToastType,
  HighlightCard,
  HighlightResponse,
  Match,
  Participant,
  Player,
  PlayerHighlightCards,
  PlayerWithUser,
  PokerActions,
} from '@/types'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useSocket } from '@/providers/socket-provider'

import { LeaveButton } from './leave-button'
import { WinDefaultModal } from '@/components/modals/quality/win-default-modal'
import playerApi from '@/services/api/modules/player-api'
import { ShowdownModal } from './showdown-modal'
import { FlushModal } from '@/components/modals/quality/flush-modal'
import { FourCardModal } from '@/components/modals/quality/fourcard-modal'
import { FullHouseModal } from '@/components/modals/quality/full-house-modal'
import { RoyalFlushModal } from '@/components/modals/quality/royal-flush-modal'
import { StraightFlushModal } from '@/components/modals/quality/straight-flush-modal'
import { StraightModal } from '@/components/modals/quality/straight-modal'
import { useModal } from '@/store/use-modal-store'
import ChangeTable from './change-table'
import { useAutoAction } from '@/store/use-auto-action'
import { AutoRebuyToggle } from '@/components/auto-rebuy-toggle'
import { RebuyButton } from '@/components/rebuy-button'
import { useAutoRebuy } from '@/store/use-auto-rebuy'
import { LeaveNext } from './leave-next'
import { useAudio, useMedia } from 'react-use'
import { getPlayerIdByUserId } from '@/app/(game)/dashboard/table/_utils/user'
import { useCustomToast } from '@/hooks/use-custom-toast'
import { CustomToast } from '@/components/custom-toast'
import { Button } from '@/components/ui/button'
import { useTableImage } from '@/store/use-table-image'
import { TableImageSelect } from './table-image-select'
import { useVolume } from '@/store/use-volume'

interface TableContentProps {
  tableId: string
}

export const TableContent = ({ tableId }: TableContentProps) => {
  const user = useCurrentUser()
  const { socket } = useSocket()
  const { onClose } = useModal()
  const { setAutoAction } = useAutoAction()
  const { setAutoRebuy } = useAutoRebuy()
  const { toasts, addToast, removeToast } = useCustomToast()
  const { imageSrc } = useTableImage()
  const { volume } = useVolume()
  const isPortrait = useMedia(
    '(min-width: 320px) and (orientation: portrait)',
    false
  )
  const isLandscape = useMedia(
    '(max-width: 1023px) and (orientation: landscape)',
    false
  )

  const [match, setMatch] = useState<Match | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [players, setPlayers] = useState<PlayerWithUser[]>([])
  const [sortedPlayers, setSortedPlayers] = useState<PlayerWithUser[]>([])

  const [highlightCards, setHighlightCards] = useState<HighlightCard>({
    name: '',
    cards: [],
  })
  const [playersHighlightSet, setPlayersHighlightSet] =
    useState<PlayerHighlightCards>({})
  const [isHandVisible, setHandVisible] = useState(false)
  const [isShuffle, setShuffle] = useState(false)
  const [isChipsAnimation, setChipsAnimation] = useState(false)
  const [isLeaveNext, setIsLeaveNext] = useState(false)
  const [isNextMatchComing, setIsNextMatchComing] = useState<boolean>(false)

  const [audioShuffle, _sh, shuffleControls] = useAudio({
    src: '/sounds/sound_shuffle.mp3',
    autoPlay: false,
  })

  const [audioSlip, _s, slipControls] = useAudio({
    src: '/sounds/sound_slip_3.mp3',
    autoPlay: false,
  })

  const matchRef = useRef<Match | null>(null)
  const participantsRef = useRef<Participant[] | null>(null)
  const playersRef = useRef<PlayerWithUser[] | null>(null)
  const tableRef = useRef<HTMLDivElement | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const dealerRef = useRef<HTMLDivElement | null>(null)
  let timerId: NodeJS.Timeout | null = null

  useGSAP(() => {
    const table = tableRef.current
    const players = wrapperRef.current?.getElementsByClassName('pocker_list')

    if (!table || !players) return

    const bounds = table.getBoundingClientRect()

    const currentPlayerIndex = 0
    const cardWidth = 50
    const cardsHand = 2
    const dealX = bounds.width / 2 - cardWidth / 2
    const dealY = bounds.height
    const stackOffset = 20
    const offsetX = 0
    const offsetY = 5
    const positions = Array.from(players).map(playerPosition)
    const numPlayers = players.length
    const totalCards = numPlayers * cardsHand
    let zIndex = 0

    function playerPosition(element: Element) {
      const rect = element.getBoundingClientRect()
      return {
        x: rect.left - bounds.left + offsetX,
        y: rect.top - bounds.top + offsetY,
      }
    }

    function createCard(i: number) {
      const card = table?.ownerDocument.createElement('div')
      if (card) {
        const isCurrentPlayer = i % numPlayers === currentPlayerIndex
        card.className = isCurrentPlayer
          ? 'player-card current-player-card'
          : 'player-card'

        card.textContent = i.toString()
        table?.appendChild(card)
      }
    }

    function cyclePosition(coord: 'x' | 'y', i: number) {
      const playerIndex = i % numPlayers
      const cardIndex = Math.floor(i / numPlayers)

      if (coord === 'x') {
        const offset = cardIndex * (cardWidth / 2 + 10)
        return positions[playerIndex][coord] + offset
      } else {
        return positions[playerIndex][coord] + offsetY
      }
    }
    function dealCard(i: number) {
      createCard(i + 1)

      if ((i + 1) % numPlayers === 0 && (i + 1) / numPlayers <= cardsHand) {
        slipControls.volume(volume)
        slipControls.play()
      }

      gsap.set('.player-card', {
        x: dealX,
        y: dealY,
      })

      gsap.to('.current-player-card', {
        scale: 1.36,
        zIndex: 100,
      })

      gsap.to('.player-card', {
        duration: 0.5,
        rotation: 360,
        x: (i: number) => cyclePosition('x', i),
        y: (i: number) => cyclePosition('y', i),
        zIndex: (i: number) => zIndex++,
        onComplete: () => {
          timerId = setTimeout(() => {
            setHandVisible(true)
            setShuffle(false)
            const elements = document.querySelectorAll('.player-card')
            elements.forEach(element => {
              element?.parentNode?.removeChild(element)
            })
          }, 2000)
        },
      })
    }

    if (isShuffle) {
      shuffleControls.volume(volume)
      shuffleControls.play()

      if (isPortrait || isLandscape) {
        setTimeout(() => {
          setHandVisible(true)
          setShuffle(false)
        }, 2000)

        return
      }

      let i = 0
      setTimeout(() => {
        let i = 0
        const dealInterval = setInterval(() => {
          dealCard(i)
          i++
          if (i >= totalCards) {
            clearInterval(dealInterval)
          }
        }, 300)
      }, 1000)
    }

    return () => {
      if (timerId) {
        clearTimeout(timerId)
      }
    }
  }, [isShuffle])

  useGSAP(() => {
    const table = tableRef.current
    const chips = wrapperRef.current?.querySelectorAll(
      '.coin_bet_current.unmove'
    )
    const other_chips = wrapperRef.current?.querySelectorAll(
      '.coin_bet_other.unmove'
    )
    const groupNumber = document.querySelector('.group_number')

    if (!table || !chips || !groupNumber || !other_chips) return

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

    const other_originalPositions = Array.from(other_chips).map(c => {
      const originalLeft = c.getBoundingClientRect().left - window.scrollX
      const originalTop = c.getBoundingClientRect().top - window.scrollY

      return {
        left: originalLeft,
        top: originalTop,
      }
    })

    if (isChipsAnimation) {
      Array.from(chips).forEach((chip, index) => {
        const originalPosition = originalPositions[index]
        const deltaX = originalPosition.left / 2.5
        const deltaY = targetY - originalPosition.top

        gsap.to(chip, {
          duration: 0.25,
          x: deltaX,
          y: deltaY,
          ease: 'power3.out',
        })
      })

      Array.from(other_chips).forEach((other_chips, index) => {
        const other_originalPosition = other_originalPositions[index]
        const deltaX = targetX - other_originalPosition.left
        const deltaY = targetY - other_originalPosition.top

        gsap.to(other_chips, {
          duration: 0.25,
          x: deltaX,
          y: deltaY,
          ease: 'power3.out',
          onComplete() {
            setChipsAnimation(false)
          },
        })
      })
    }
  }, [isChipsAnimation])

  useEffect(() => {
    matchRef.current = match
  }, [match])

  useEffect(() => {
    playersRef.current = players
  }, [players])

  useEffect(() => {
    participantsRef.current = participants
  }, [participants])

  useEffect(() => {
    if (socket) {
      let timerMatchId: NodeJS.Timeout | null = null
      let timerHighlightId: NodeJS.Timeout | null = null

      window.addEventListener('unload', removePlayer)
      window.addEventListener('close', removePlayer)

      socket.on(
        PokerActions.MATCH_STARTED,
        ({
          tableId,
          match,
          playerId,
        }: {
          tableId: string
          match: Match
          playerId: string
        }) => {
          setMatch(null)
          setParticipants([])
          setHighlightCards({ name: '', cards: [] })
          setHandVisible(false)
          setAutoRebuy({ canAutoRebuy: false })
          setAutoAction({ isChecked: '', callAmount: 0 })
          onClose()

          if (match) {
            setShuffle(true)

            const delay =
              players.length <= 2 ? 3000 : players.length * 1000 + 1000

            timerMatchId = setTimeout(() => {
              setMatch(match)
              setIsNextMatchComing(false)
              setParticipants(match.participants)
              setPlayers(prev =>
                prev.map(item => {
                  if (item.id === playerId) {
                    return { ...item, isTurn: true }
                  }
                  return { ...item, isTurn: false }
                })
              )
            }, delay)
          }
        }
      )

      socket.on(
        PokerActions.TABLE_MESSAGE,
        ({ message, type }: { message: string; type: CustomToastType }) => {
          message &&
            addToast({
              id: Math.random().toString(),
              messages: message,
              type: type,
            })
        }
      )

      socket.on(
        PokerActions.JOIN_TABLE,
        ({
          tableId: tableSocketId,
          player,
        }: {
          tableId: string
          player: PlayerWithUser
        }) => {
          if (tableSocketId !== tableId) return

          setPlayers(prev => [...prev, player])

          socket.emit(PokerActions.TABLE_JOINED, {
            tableId: tableSocketId,
            player,
          })
        }
      )

      socket.on(
        PokerActions.LEAVE_TABLE,
        ({
          tableId: tableSocketId,
          playerId,
        }: {
          tableId: string
          playerId: string
        }) => {
          if (tableSocketId !== tableId) return

          setPlayers(prev => prev.filter(item => item.id !== playerId))

          socket.emit(PokerActions.TABLE_LEFT, {
            tableId: tableSocketId,
            playerId,
          })
        }
      )

      socket.on(
        PokerActions.CHANGE_TURN,
        ({ matchData, playerId }: { matchData: Match; playerId: string }) => {
          const playersData = playersRef?.current || []

          const currentPlayerData = playersData.find(p => p.userId === user?.id)
          const isHaveWinner = (matchData?.winners?.length ?? 0) > 0

          if (matchData) {
            if (matchData.isShowdown && !matchData.isAllAllIn) {
              setMatch({
                ...matchData,
                isShowdown: true,
                winners: [],
                winMessages: [],
              })

              setTimeout(() => {
                setMatch(matchData)
                setParticipants(matchData.participants)

                if (currentPlayerData?.id === playersData[1]?.id) {
                  socket.emit(PokerActions.START_INIT_MATCH, {
                    tableId,
                    delay: 8000,
                  })
                }
              }, 3000)
            }

            if (matchData.isShowdown && matchData.isAllAllIn) {
              const isFlop = matchRef.current?.isFlop
              const isTurn = matchRef.current?.isTurn
              const isRiver = matchRef.current?.isRiver

              const hasBet =
                participantsRef?.current &&
                participantsRef?.current.some(item => item.bet > 0)
              if (hasBet) {
                setChipsAnimation(true)
              }

              if (!isFlop && !isTurn && !isRiver) {
                setMatch({
                  ...matchData,
                  isAllAllIn: true,
                  isShowdown: true,
                  winners: [],
                  winMessages: [],
                  isFlop: false,
                  isTurn: false,
                  isRiver: false,
                })

                setTimeout(() => {
                  setMatch({
                    ...matchData,
                    winners: [],
                    winMessages: [],
                    isFlop: true,
                    isTurn: false,
                    isRiver: false,
                  })
                }, 3000)

                setTimeout(() => {
                  setMatch({
                    ...matchData,
                    winners: [],
                    winMessages: [],
                    isTurn: true,
                    isRiver: false,
                  })
                }, 5000)

                setTimeout(() => {
                  setMatch({
                    ...matchData,
                    winners: [],
                    winMessages: [],
                    isRiver: true,
                  })
                }, 6000)

                setTimeout(() => {
                  setMatch(matchData)
                  if (currentPlayerData?.id === playersData[1]?.id) {
                    socket.emit(PokerActions.START_INIT_MATCH, {
                      tableId,
                      delay: 8000,
                    })
                  }
                }, 8000)
              }

              if (isFlop && !isTurn && !isRiver) {
                setMatch({
                  ...matchData,
                  isShowdown: true,
                  winners: [],
                  winMessages: [],
                  isFlop: true,
                  isTurn: false,
                  isRiver: false,
                })

                setTimeout(() => {
                  setMatch({
                    ...matchData,
                    winners: [],
                    winMessages: [],
                    isTurn: true,
                    isRiver: false,
                  })
                }, 3000)

                setTimeout(() => {
                  setMatch({
                    ...matchData,
                    winners: [],
                    winMessages: [],
                    isRiver: true,
                  })
                }, 4000)

                setTimeout(() => {
                  setMatch(matchData)
                  if (currentPlayerData?.id === playersData[1]?.id) {
                    socket.emit(PokerActions.START_INIT_MATCH, {
                      tableId,
                      delay: 8000,
                    })
                  }
                }, 5000)
              }

              if (isFlop && isTurn && !isRiver) {
                setMatch({
                  ...matchData,
                  isShowdown: true,
                  winners: [],
                  winMessages: [],
                  isRiver: false,
                })

                setTimeout(() => {
                  setMatch({
                    ...matchData,
                    winners: [],
                    winMessages: [],
                    isRiver: true,
                  })
                }, 3000)

                setTimeout(() => {
                  setMatch(matchData)
                  if (currentPlayerData?.id === playersData[1]?.id) {
                    socket.emit(PokerActions.START_INIT_MATCH, {
                      tableId,
                      delay: 8000,
                    })
                  }
                }, 4000)
              }

              if (isFlop && isTurn && isRiver) {
                setMatch(matchData)
                if (currentPlayerData?.id === playersData[1]?.id) {
                  socket.emit(PokerActions.START_INIT_MATCH, {
                    tableId,
                    delay: 8000,
                  })
                }
              }
            }

            if (!matchData.isShowdown && !matchData.isAllAllIn) {
              const isFlop = matchRef.current?.isFlop
              const isTurn = matchRef.current?.isTurn
              const isRiver = matchRef.current?.isRiver

              const isNextRound =
                isFlop !== matchData.isFlop ||
                isTurn !== matchData.isTurn ||
                isRiver !== matchData.isRiver

              if (isNextRound) {
                const hasBet =
                  participantsRef?.current &&
                  participantsRef?.current.some(item => item.bet > 0)
                if (hasBet) {
                  setChipsAnimation(true)

                  setTimeout(() => {
                    setMatch(matchData)
                    setParticipants(matchData.participants)
                  }, 1000)

                  setTimeout(() => {
                    setPlayers(prev =>
                      prev.map(item => {
                        if (item.id === playerId) {
                          return { ...item, isTurn: true }
                        }
                        return { ...item, isTurn: false }
                      })
                    )
                  }, 2000)
                } else {
                  setMatch(matchData)
                  setParticipants(matchData.participants)

                  setTimeout(() => {
                    setPlayers(prev =>
                      prev.map(item => {
                        if (item.id === playerId) {
                          return { ...item, isTurn: true }
                        }
                        return { ...item, isTurn: false }
                      })
                    )
                  }, 1500)
                }
                setAutoAction({ isChecked: '', callAmount: 0 })
              } else {
                setMatch(matchData)
                setParticipants(matchData.participants)

                setPlayers(prev =>
                  prev.map(item => {
                    if (item.id === playerId) {
                      return { ...item, isTurn: true }
                    }
                    return { ...item, isTurn: false }
                  })
                )
              }
            }

            // end without showdown, all players fold
            if (!matchData.isShowdown && isHaveWinner) {
              if (currentPlayerData?.id === playersData[1]?.id) {
                socket.emit(PokerActions.START_INIT_MATCH, {
                  tableId,
                  delay: 5000,
                })
              }
            }
          }
        }
      )

      socket.on(
        PokerActions.PLAYERS_UPDATED,
        ({
          tableId,
          players,
          match: matchData,
        }: {
          tableId: string
          players: PlayerWithUser[]
          match: Match | null
        }) => {
          setPlayers(prev => {
            const updatedPlayers = prev.map(item => {
              return { ...item, isTurn: false }
            })
            return updatedPlayers
          })

          if (matchData) {
            const isHaveWinner = (matchData.winners?.length ?? 0) > 0

            if (matchData.isShowdown && !matchData.isAllAllIn) {
              setTimeout(() => {
                setPlayers(players)
                setAutoRebuy({ canAutoRebuy: true })
              }, 4000)
            }

            if (matchData.isShowdown && matchData.isAllAllIn) {
              const isFlop = matchRef.current?.isFlop
              const isTurn = matchRef.current?.isTurn
              const isRiver = matchRef.current?.isRiver

              if (!isFlop && !isTurn && !isRiver) {
                setTimeout(() => {
                  setPlayers(players)
                  setAutoRebuy({ canAutoRebuy: true })
                }, 9000)
              }

              if (isFlop && !isTurn && !isRiver) {
                setTimeout(() => {
                  setPlayers(players)
                  setAutoRebuy({ canAutoRebuy: true })
                }, 6000)
              }

              if (isFlop && isTurn && !isRiver) {
                setTimeout(() => {
                  setPlayers(players)
                  setAutoRebuy({ canAutoRebuy: true })
                }, 5000)
              }

              if (isFlop && isTurn && isRiver) {
                setPlayers(players)
                setAutoRebuy({ canAutoRebuy: true })
              }
            }

            if (!matchData.isShowdown && !matchData.isAllAllIn) {
              setPlayers(players)
            }

            // end without showdown, all players fold
            if (!matchData.isShowdown && isHaveWinner) {
              setAutoRebuy({ canAutoRebuy: true })
            }
          }
        }
      )

      socket.on(
        PokerActions.PARTICIPANTS_UPDATED,
        ({
          tableId,
          participant,
        }: {
          tableId: string
          participant: Participant
        }) => {
          setParticipants(prev => {
            const updatedParticipants = prev.map(item => {
              if (item.id === participant.id) {
                return participant
              }
              return item
            })

            return updatedParticipants
          })
        }
      )

      socket.on(
        PokerActions.REBUY,
        ({ tableId, player }: { tableId: string; player: PlayerWithUser }) => {
          setPlayers(prev => {
            const updatedPlayers = prev.map(item => {
              if (item.id === player.id) {
                return player
              }
              return item
            })

            return updatedPlayers
          })

          socket.emit(PokerActions.REBOUGHT, {
            tableId,
            player,
          })
        }
      )

      socket.on(PokerActions.HIGHLIGHT_CARDS, (encoding: string) => {
        const { playerHighlightSet, isAllAllIn } = JSON.parse(
          Buffer.from(encoding, 'base64').toString('utf-8')
        ) as HighlightResponse
        if (playerHighlightSet) {
          const userId = user?.id

          if (!userId || !players) return

          const delay = isAllAllIn
            ? 6000
            : matchRef.current?.isRiver || matchRef.current?.isTurn
              ? 1500
              : 2500

          timerHighlightId = setTimeout(() => {
            setPlayersHighlightSet(playerHighlightSet)
          }, delay)
        }
      })

      socket.on(
        PokerActions.NEXT_MATCH_IS_COMING,
        ({ tableId, isComing }: { tableId: string; isComing: boolean }) => {
          if (isComing) {
            if (playersRef.current && playersRef.current.length <= 1) {
              setIsNextMatchComing(false)
              return
            }
            setIsNextMatchComing(true)
          } else {
            setIsNextMatchComing(false)
          }
        }
      )

      socket.on(
        PokerActions.UPDATE_MISSING_PLAYER_STACK,
        ({ tableId, player }: { tableId: string; player: Player }) => {
          setPlayers(prev => {
            const updatedPlayers = prev.map(item => {
              if (item.id === player.id) {
                return { ...item, stack: player.stack }
              }
              return item
            })

            return updatedPlayers
          })
        }
      )

      return () => {
        if (socket) {
          socket.off(PokerActions.JOIN_TABLE)
          socket.off(PokerActions.TABLE_MESSAGE)
          socket.off(PokerActions.LEAVE_TABLE)
          socket.off(PokerActions.MATCH_STARTED)
          socket.off(PokerActions.CHANGE_TURN)
          socket.off(PokerActions.HIGHLIGHT_CARDS)
          socket.off(PokerActions.REBUY)
          socket.off(PokerActions.PARTICIPANTS_UPDATED)
          socket.off(PokerActions.PLAYERS_UPDATED)
          socket.off(PokerActions.NEXT_MATCH_IS_COMING)
          socket.off(PokerActions.UPDATE_MISSING_PLAYER_STACK)

          if (timerMatchId) {
            clearTimeout(timerMatchId)
          }

          if (timerHighlightId) {
            clearTimeout(timerHighlightId)
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket])

  useEffect(() => {
    window.addEventListener('popstate', e => {
      window.history.go(1)
    })
  }, [])

  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null
    const getPlayers = async () => {
      const { response } = await playerApi.getPlayersByTableId({
        tableId,
      })

      if (!response) {
        setPlayers([])
        return
      }

      const players = response as PlayerWithUser[]
      setPlayers(players)

      const currentPlayer = players.find(p => p.userId === user?.id)

      if (
        !timerId &&
        players.length >= 2 &&
        currentPlayer?.id === players[1]?.id
      ) {
        if (match && !match.table.handOver) return

        timerId = setTimeout(() => {
          socket.emit(PokerActions.START_INIT_MATCH, {
            tableId,
            delay: 0,
          })
        }, 6000)
      }
    }

    getPlayers()
    setAutoRebuy({
      canAutoRebuy: false,
      isAutoRebuy: false,
      autoRebuyAmount: 0,
    })

    return () => {
      if (timerId) {
        clearTimeout(timerId)
      }
    }
  }, [])

  useEffect(() => {
    if (!match) return
    if (match.table?.handOver) return
    setHandVisible(true)
  }, [match])

  useEffect(() => {
    if (playersHighlightSet && Object.keys(playersHighlightSet).length > 0) {
      const userId = user?.id
      if (!userId) return
      const playerId = getPlayerIdByUserId(userId, players)

      if (!playerId) return

      const highlight = playersHighlightSet[playerId]
      if (highlight) {
        setHighlightCards(highlight)
      }
    }
  }, [playersHighlightSet])

  useEffect(() => {
    if (players.length <= 1) {
      setTimeout(() => {
        setParticipants([])
        setHandVisible(false)
      }, 2000)
    }
  }, [players])

  const removePlayer = async () => {
    const currentPlayer = players.find(p => p.userId === user?.id)
    if (!currentPlayer) return
    const { response, error } = await playerApi.removePlayer({
      playerId: currentPlayer?.id,
      tableId: tableId,
    })

    if (error) {
      return
    }
  }

  const currentPlayerIndex = players.findIndex(p => p.userId === user?.id)

  useEffect(() => {
    const newSortedPlayers = [
      ...players.slice(currentPlayerIndex + 1),
      ...players.slice(0, currentPlayerIndex + 1),
    ]
    setSortedPlayers(newSortedPlayers)
  }, [players, currentPlayerIndex])

  const currentPlayer = useMemo(() => {
    return players.find(({ userId }) => userId === user?.id)
  }, [players])

  const currentParticipant = useMemo(() => {
    return participants.find(({ playerId }) => playerId === currentPlayer?.id)
  }, [participants])

  const { isFolded } = currentParticipant || {}
  const { isShowdown, winners } = match || {}

  const canAction =
    !currentPlayer ||
    players.length <= 1 ||
    !currentParticipant ||
    isFolded ||
    (isShowdown && winners?.length)

  return (
    <>
      <div className="toast_mess">
        {toasts.map((toast, _) => (
          <CustomToast
            key={toast.id}
            id={toast.id}
            messages={toast.messages}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
      <div className="wrapper" ref={wrapperRef}>
        {audioShuffle}
        {audioSlip}

        <img src={imageSrc} alt="tableImage" />

        <div className="group_button">
          {canAction && !isNextMatchComing ? (
            <>
              <LeaveButton tableId={tableId} player={currentPlayer} />
              <ChangeTable tableId={tableId} playerId={currentPlayer?.id} />
            </>
          ) : null}
          {!canAction ? (
            <LeaveNext
              isLeaveNext={isLeaveNext}
              setIsLeaveNext={setIsLeaveNext}
              tableId={tableId}
              playerId={currentPlayer?.id}
            />
          ) : null}
          <AutoRebuyToggle
            tableId={tableId}
            player={currentPlayer}
            match={match}
          />
          <TableImageSelect />
        </div>
        {/* <RebuyButton className="btn_cash_chip_sp" tableId={tableId} /> */}

        <div
          className="inner"
          style={{
            backgroundImage:
              isPortrait || isLandscape ? `url("${imageSrc}")` : '',
          }}
        >
          <div className="list_user" ref={tableRef}>
            <div className="dealer" ref={dealerRef}></div>

            <div className="wrap_list">
              {sortedPlayers.map((player, index) => {
                if (player.userId === user?.id) {
                  return
                }

                return (
                  <OtherPlayer
                    match={match}
                    key={index}
                    player={player}
                    participants={participants}
                    isHandVisible={isHandVisible}
                    tableId={tableId}
                    playersHighlightSet={playersHighlightSet}
                  />
                )
              })}
              <ShowdownModal match={match} participants={participants} />
              <WinDefaultModal match={match} />
              <RoyalFlushModal match={match} />
              <FlushModal match={match} />
              <StraightModal match={match} />
              <StraightFlushModal match={match} />
              <FourCardModal match={match} />
              <FullHouseModal match={match} />
            </div>
          </div>
        </div>
        <Board
          match={match}
          isShuffle={isShuffle}
          highlightCards={highlightCards}
        />

        {currentPlayer && (
          <CurrentPlayer
            match={match}
            player={currentPlayer}
            players={players}
            participants={participants}
            isHandVisible={isHandVisible}
            tableId={tableId}
            highlightCards={highlightCards}
            isLeaveNext={isLeaveNext}
            playersHighlightSet={playersHighlightSet}
          />
        )}
      </div>
    </>
  )
}
