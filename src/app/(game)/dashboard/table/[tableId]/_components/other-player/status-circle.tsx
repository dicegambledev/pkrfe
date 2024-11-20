import { formatChipsAmount } from '@/utils/formatting'

export type PlayerButtonActionType =
  | 'QUARTER'
  | 'HALF'
  | 'FULL'
  | 'ALLIN'
  | 'FOLD'
  | 'RAISE'
  | 'CHECK'
  | 'CALL'

type StatusCircleProps = {
  amount?: number
  type: PlayerButtonActionType
}

const label = {
  QUARTER: '쿼터',
  HALF: '하프',
  FULL: '풀',
  ALLIN: '올인',
  FOLD: '풀',
  RAISE: '라이즈',
  CHECK: '체크',
  CALL: '콜',
}

export const StatusCircle = ({ amount, type }: StatusCircleProps) => {
  const formmatedType =
    type === 'CHECK' ? 'CALL' : type === 'ALLIN' ? 'ALL' : type

  const canHaveAmout =
    type === 'RAISE' ||
    type === 'FULL' ||
    type === 'HALF' ||
    type === 'QUARTER' ||
    type === 'ALLIN'

  if (!type) return null

  return (
    <div className="status">
      <div className={`wrap_status status_${formmatedType.toLowerCase()}`}>
        {canHaveAmout && amount && (
          <span className="money">{formatChipsAmount(amount)} $</span>
        )}
        <svg viewBox="0 0 200 200">
          <circle
            className="circle"
            cx="100"
            cy="100"
            r="95"
            stroke="#231f20"
            strokeWidth="8"
            fillOpacity="0"
          ></circle>
        </svg>
        <span className="sub">{label[type]}</span>
      </div>
    </div>
  )
}
