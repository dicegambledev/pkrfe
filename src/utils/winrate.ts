import { CustomCard, HighlightCard } from '@/types'
import { createPokerHand } from 'poker-hand-utils'

const MAX_POKER_VALUES = 7462

const convertToEvaluatorFormat = (cards: CustomCard[]): string => {
  return cards
    .map(card => {
      let rank = card?.rank
      if (rank === 'A') rank = 'A'
      else if (rank === 'K') rank = 'K'
      else if (rank === 'Q') rank = 'Q'
      else if (rank === 'J') rank = 'J'
      else if (rank === 'TEN') rank = 'T'
      else if (rank === 'NINE') rank = '9'
      else if (rank === 'EIGHT') rank = '8'
      else if (rank === 'SEVEN') rank = '7'
      else if (rank === 'SIX') rank = '6'
      else if (rank === 'FIVE') rank = '5'
      else if (rank === 'FOUR') rank = '4'
      else if (rank === 'THREE') rank = '3'
      else if (rank === 'TWO') rank = '2'

      let suit = card?.suit.charAt(0).toUpperCase()

      return `${rank}${suit}`
    })
    .join(' ')
}

export const evaluateHandStrength = (hand: CustomCard[]): any => {
  const handStr = convertToEvaluatorFormat(hand)
  return createPokerHand(handStr)
}

export const calculateWinRate = (score: number): number => {
  if (score < 1 || score > MAX_POKER_VALUES) {
    throw new Error('Invalid score. Score must be between 1 and 7462.')
  }
  const result = (MAX_POKER_VALUES - 1 - score) / MAX_POKER_VALUES
  return result
}
