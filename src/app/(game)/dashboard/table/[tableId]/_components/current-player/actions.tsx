'use client'

import { BetSlider } from '@/components/bet-slider'
import { useSocket } from '@/providers/socket-provider'
import { Match, Participant, Player, PokerActions } from '@/types'
import React, { useEffect, useState } from 'react'
import { getGenderFromImageUrl } from '@/utils/sound'
import { ActionItem } from './action-item'
import { useKey } from 'react-use'
import { cn } from '@/lib/utils'
import { FixedRaise } from '@/components/fixed-raise'
import sound from '@/utils/contants/sound'

interface CurrentPlayerActionProps {
  tableId: string
  currentParticipant: Participant | undefined
  lastBetParticipant: Participant | null
  match: Match | null
  bet: number
  setBet: React.Dispatch<React.SetStateAction<number>>
  player: Player | undefined
  isTurn: boolean | undefined
  setIsAction: (isAction: boolean) => void
}

export const CurrentPlayerAction = ({
  isTurn,
  tableId,
  currentParticipant,
  lastBetParticipant,
  match,
  bet,
  setBet,
  player,
  setIsAction,
}: CurrentPlayerActionProps) => {
  const { socket } = useSocket()

  const [isProcessing, setIsProcessing] = useState(false)

  const gender = getGenderFromImageUrl(player?.user?.image || '')

  const fold = () => {
    setIsAction(true)
    if (socket && !isProcessing) {
      setIsProcessing(true)
      socket.emit(PokerActions.FOLD, {
        tableId,
        participantId: currentParticipant?.id,
      })
      setTimeout(() => {
        setIsProcessing(false)
        setIsAction(false)
      }, 2000)
    }
  }

  const check = () => {
    setIsAction(true)
    if (socket && !isProcessing) {
      setIsProcessing(true)
      socket.emit(PokerActions.CHECK, {
        tableId,
        participantId: currentParticipant?.id,
      })
      setTimeout(() => {
        setIsProcessing(false)
        setIsAction(false)
      }, 2000)
    }
  }

  const call = () => {
    setIsAction(true)
    if (socket && !isProcessing) {
      setIsProcessing(true)
      socket.emit(PokerActions.CALL, {
        tableId,
        participantId: currentParticipant?.id,
      })

      setTimeout(() => {
        setIsProcessing(false)
        setIsAction(false)
      }, 2000)
    }
  }

  const raise = (amount: number, type: PokerActions) => {
    setIsAction(true)
    if (socket && !isProcessing) {
      setIsProcessing(true)
      socket.emit(PokerActions.RAISE, {
        tableId,
        participantId: currentParticipant?.id,
        amount,
        type,
      })
      setTimeout(() => {
        setIsProcessing(false)
        setIsAction(false)
      }, 2000)
    }
  }

  const onRaise = () => {
    const trueBetValue = bet > max ? max : bet < min ? min : bet
    raise(trueBetValue + currentBet, PokerActions.RAISE)
  }

  const onQuarter = () => {
    raise(quarter + currentBet, PokerActions.QUARTER)
  }

  const onHalf = () => {
    raise(half + currentBet, PokerActions.HALF)
  }

  const onFull = () => {
    raise(currentPot + currentBet, PokerActions.FULL)
  }

  const onAllIn = () => {
    raise(currentStack + currentBet, PokerActions.ALLIN)
  }

  const onFourKeyPress = () => {
    const value = Math.max(bet - Math.round(0.25 * max), min)

    setBet(value)
  }

  const onFiveKeyPress = () => {
    const value = Math.min(bet + Math.round(0.25 * max), max)

    setBet(value)
  }

  const currentPot = match?.pot || 0
  const currentStack = player?.stack || 0
  const currentBet = currentParticipant?.bet || 0
  const currentCallAmount = match?.callAmount || 0
  const canNotCall = currentCallAmount === 0 || currentBet >= currentCallAmount
  const canNotCheck = currentCallAmount !== currentBet && currentCallAmount > 0

  const quarter = Math.floor(currentPot / 4)
  const half = Math.floor(currentPot / 2)
  const callSize =
    currentBet < currentCallAmount && currentCallAmount <= currentStack
      ? currentCallAmount - currentBet
      : currentStack
  const lastBet = lastBetParticipant?.bet || 0

  const isLastHalfType = lastBetParticipant?.lastAction === PokerActions.HALF
  const isLastFullType = lastBetParticipant?.lastAction === PokerActions.FULL

  const max = Math.min(match?.table?.maxBuyIn || 0, currentStack)
  const min = Math.min(
    Math.max(match?.minBet || 0, currentCallAmount) + lastBet,
    max
  )

  const canQuarter =
    !isLastFullType &&
    !isLastHalfType &&
    quarter >= currentCallAmount &&
    currentStack >= quarter
  const canHalf =
    !isLastFullType && half >= currentCallAmount && currentStack >= half
  const canFull = currentPot >= currentCallAmount && currentStack >= currentPot
  const canRaise = currentStack >= currentCallAmount
  const isShowdown = match?.isShowdown || false

  useEffect(() => {
    setBet(min)
  }, [isTurn])

  //prettier-ignore
  useKey('4', () => {
    if(!isTurn || isProcessing) return 
    
    onFourKeyPress()
  }, {}, [onFourKeyPress])

  //prettier-ignore
  useKey('5', () => {
    if(!isTurn || isProcessing) return 

    onFiveKeyPress()
  }, {}, [onFiveKeyPress])

  return (
    <>
      <div className="toolbar">
        <ActionItem
          type="quarter"
          shortcut="7"
          label="쿼터"
          onClick={onQuarter}
          disabled={!isTurn || isProcessing || !canQuarter || isShowdown}
          amount={quarter}
          match={match}
          isTurn={isTurn}
          audioBoySrc={sound.soundQuarterBoy}
          audioGirlSrc={sound.soundQuarterGirl}
          gender={gender}
        />

        <ActionItem
          type="half"
          shortcut="8"
          label="하프"
          onClick={onHalf}
          disabled={!isTurn || isProcessing || !canHalf || isShowdown}
          isTurn={isTurn}
          match={match}
          amount={half}
          audioBoySrc={sound.soundHalfBoy}
          audioGirlSrc={sound.soundHalfGirl}
          gender={gender}
        />

        <ActionItem
          type="full"
          shortcut="9"
          label="풀"
          onClick={onFull}
          disabled={!isTurn || isProcessing || !canFull || isShowdown}
          match={match}
          isTurn={isTurn}
          amount={currentPot}
          audioBoySrc={sound.soundFullBoy}
          audioGirlSrc={sound.soundFullGirl}
          gender={gender}
        />

        <button
          className={cn('item ', (!isTurn || isProcessing) && 'opacity-80')}
        >
          <span className="number number_left">4</span>
          <span className="number">5</span>
          <BetSlider bet={bet} setBet={setBet} min={min} max={max} />
        </button>

        <ActionItem
          type="raise"
          shortcut="6"
          label="라이즈"
          onClick={onRaise}
          match={match}
          isTurn={isTurn}
          disabled={!isTurn || isProcessing || !canRaise || isShowdown}
          audioBoySrc={sound.soundRaiseBoy}
          audioGirlSrc={sound.soundRaiseGirl}
          gender={gender}
        />

        {!canNotCall ? (
          <ActionItem
            type="call"
            shortcut="1"
            label="콜"
            onClick={call}
            disabled={!isTurn || isProcessing || canNotCall || isShowdown}
            isTurn={isTurn}
            amount={callSize}
            match={match}
            audioBoySrc={sound.soundCallBoy}
            audioGirlSrc={sound.soundCallGirl}
            gender={gender}
          />
        ) : !canNotCheck ? (
          <ActionItem
            type="check"
            shortcut="1"
            label="체크"
            onClick={check}
            match={match}
            isTurn={isTurn}
            disabled={!isTurn || isProcessing || canNotCheck || isShowdown}
            audioBoySrc={sound.soundCheckBoy}
            audioGirlSrc={sound.soundCheckGirl}
            gender={gender}
          />
        ) : (
          <ActionItem
            type="call"
            shortcut="1"
            label="콜"
            onClick={call}
            match={match}
            isTurn={isTurn}
            disabled={!isTurn || isProcessing || canNotCall || isShowdown}
            amount={callSize}
            audioBoySrc={sound.soundCallBoy}
            audioGirlSrc={sound.soundCallGirl}
            gender={gender}
          />
        )}

        <ActionItem
          type="fold"
          shortcut="2"
          label="다이"
          onClick={fold}
          match={match}
          isTurn={isTurn}
          disabled={!isTurn || isProcessing || isShowdown}
          audioBoySrc={sound.soundFoldBoy}
          audioGirlSrc={sound.soundFoldGirl}
          gender={gender}
        />

        <ActionItem
          type="allIn"
          shortcut="3"
          label="올인"
          match={match}
          onClick={onAllIn}
          isTurn={isTurn}
          disabled={!isTurn || isProcessing || isShowdown}
          audioBoySrc={sound.soundAllBoy}
          audioGirlSrc={sound.soundAllGirl}
          gender={gender}
        />
      </div>

      <div className="fixed right-12  bottom-9"></div>
      <FixedRaise bet={bet} setBet={setBet} min={min} max={max} />
    </>
  )
}
