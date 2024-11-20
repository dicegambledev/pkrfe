import { cn } from '@/lib/utils'
import { formatChipsAmount } from '@/utils/formatting'

type CoinBetProps = {
  pot: number
  bet: number
  className?: string
}

export const CoinBet = ({ bet, pot, className }: CoinBetProps) => {
  if (!bet) return null

  const getNumberToRender = (): number => {
    const percentage = (bet / pot) * 100

    if (isNaN(percentage)) return 0

    if (percentage < 25) return 1
    if (percentage >= 25 && percentage < 50) return 2
    else if (percentage >= 50 && percentage < 75) return 3
    else if (percentage >= 75) return 4

    return 1
  }

  const numberToRender = getNumberToRender()

  return (
    <div className={cn('coin_bet', className)}>
      <span className="number">{formatChipsAmount(bet)}$</span>
      <ul className="chip">
        {Array.from({ length: numberToRender }).map((_, index) => (
          <li key={index}>
            <span>{index}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
