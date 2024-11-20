export const formatChipsAmount = (value: number) => {
  if (!value) return 0;
  return value.toLocaleString('vi-VN')
}

export const formattedCards = (rank: string) => {
  const rankMap: { [key: string]: string } = {
    TWO: '2',
    THREE: '3',
    FOUR: '4',
    FIVE: '5',
    SIX: '6',
    SEVEN: '7',
    EIGHT: '8',
    NINE: '9',
    TEN: '10',
    J: 'J',
    Q: 'Q',
    K: 'K',
    A: 'A',
  }

  return {
    rank: rankMap[rank],
  }
}

const rankMap = {
  A: 'A',
  '2': 'TWO',
  '3': 'THREE',
  '4': 'FOUR',
  '5': 'FIVE',
  '6': 'SIX',
  '7': 'SEVEN',
  '8': 'EIGHT',
  '9': 'NINE',
  T: 'TEN',
  J: 'J',
  Q: 'Q',
  K: 'K',
}

const suitMap = {
  H: 'HEARTS',
  D: 'DIAMONDS',
  C: 'CLUBS',
  S: 'SPADES',
}

interface IRankMapReverse {
  [key: string]: string
}

const rankMapReverse: IRankMapReverse = {
  A: 'A',
  TWO: '2',
  THREE: '3',
  FOUR: '4',
  FIVE: '5',
  SIX: '6',
  SEVEN: '7',
  EIGHT: '8',
  NINE: '9',
  TEN: 'T',
  J: 'J',
  Q: 'Q',
  K: 'K',
}

const suitMapReverse: IRankMapReverse = {
  HEARTS: 'H',
  DIAMONDS: 'D',
  CLUBS: 'C',
  SPADES: 'S',
}

type IRankOrder = {
  [key: string]: number
}

const rankOrder: IRankOrder = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
  T: 10,
  '9': 9,
  '8': 8,
  '7': 7,
  '6': 6,
  '5': 5,
  '4': 4,
  '3': 3,
  '2': 2,
}

export const formattedStringToCards = (value: string) => {
  let cards = value.replace(/[\[\] ']/g, '').split(',')

  return cards.map(card => {
    return {
      rank: rankMap[card[0] as keyof typeof rankMap],
      suit: suitMap[card[1] as keyof typeof suitMap],
    }
  })
}

interface IStarRatings {
  [key: string]: number
}
//prettier-ignore
const starRatings:IStarRatings = {
  "AA": 5, "KK": 5, "QQ": 5, "JJ": 5, "AKs": 5,
  "TT": 4.5, "AQs": 4.5, "AJs": 4.5, "AK": 4.5, "KQs": 4.5,
  "ATs": 4, "KJs": 4, "AQ": 4, "99": 4, "QJs": 4, "KTs": 4,
  "88": 3.5, "QTs": 3.5, "A9s": 3.5, "AJ": 3.5, "JTs": 3.5, "KQ": 3.5, "A8s": 3.5, "AT": 3.5,
  "K9s": 3, "A7s": 3, "KJ": 3, "A5s": 3, "Q9s": 3, "T9s": 3, "77": 3, "J9s": 3, "A6s": 3, "QJ": 3, "A4s": 3, "KT": 3, "QT": 3, "A3s": 3, "K8s": 3, "JT": 3, "A2s": 3, "Q8s": 3,
  "T8s": 2.5, "K7s": 2.5, "98s": 2.5, "66": 2.5, "J8s": 2.5, "A9": 2.5, "K6s": 2.5, "K5s": 2.5, "A8": 2.5,
  "87s": 2, "97s": 2, "K4s": 2, "Q7s": 2, "T7s": 2, "K9": 2, "J7s": 2, "T9": 2, "55": 2, "Q6s": 2, "Q9": 2, "K3s": 2, "J9": 2, "A7": 2, "Q5s": 2, "A5": 2, "K2s": 2,
  "Q4s": 1.5, "A6": 1.5, "T6s": 1.5, "J6s": 1.5, "A4": 1.5, "J5s": 1.5, "K8": 1.5, "Q3s": 1.5, "44": 1.5, "T8": 1.5, "A3": 1.5, "J8": 1.5, "Q8": 1.5, "K7": 1.5, "A2": 1.5, "K6": 1.5,
};

export const getStarRating = (card1: string, card2: string): number => {
  if (!card1 || !card2) return 1

  const [rank1, suit1] = card1.split('_')
  const [rank2, suit2] = card2.split('_')
  const sameSuit = suit1 === suit2

  const formattedRank1 = rankMapReverse[rank1]
  const formattedRank2 = rankMapReverse[rank2]

  let cardsString = [formattedRank1, formattedRank2]
    .sort((a, b) => rankOrder[b] - rankOrder[a])
    .join('')
  if (sameSuit) cardsString += 's'

  return starRatings[cardsString] || 1
}
