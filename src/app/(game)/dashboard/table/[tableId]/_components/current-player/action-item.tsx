import { cn } from '@/lib/utils'
import { formatChipsAmount } from '@/utils/formatting'
import { useAudio, useKey, useMedia, useMountedState } from 'react-use'
import { Match } from '@/types'
import { useEffect } from 'react'
import { useAutoAction } from '@/store/use-auto-action'
import { useSidebarMobile } from '@/store/use-sidebar-mobile'
import { useVolume } from '@/store/use-volume'

type ActionItemProps = {
  shortcut: string
  label: string
  onClick: () => void
  disabled?: boolean
  className?: string
  amount?: number
  type:
    | 'check'
    | 'fold'
    | 'call'
    | 'raise'
    | 'allIn'
    | 'quarter'
    | 'half'
    | 'full'
  match?: Match | null
  isTurn?: boolean
  audioBoySrc: string
  audioGirlSrc: string
  gender: 'male' | 'female'
}

export const ActionItem = ({
  shortcut,
  label,
  onClick,
  disabled = false,
  className,
  amount,
  type,
  match,
  isTurn,
  audioBoySrc,
  audioGirlSrc,
  gender = 'male',
}: ActionItemProps) => {
  const isMounted = useMountedState()

  const { volume } = useVolume()
  const isMobile = useMedia('(max-width: 768px), (max-height: 768px)', false)
  const [audioBoy, _b, boyControls] = useAudio({ src: audioBoySrc })
  const [audioGirl, _g, girlControls] = useAudio({ src: audioGirlSrc })
  const { isChecked, callAmount, setAutoAction } = useAutoAction()
  const { sidebarMobile, setSidebarMobile } = useSidebarMobile()

  const isShowdown = match?.isShowdown ?? false

  const canAutoAction =
    !isShowdown &&
    isTurn &&
    isChecked === type &&
    callAmount === match?.callAmount
  const isHaveWinner = (match?.winners?.length ?? 0) > 0

  const canCheck = match && !isShowdown && !isHaveWinner && !isTurn

  //prettier-ignore
  useKey(shortcut, () => {
    if (disabled) return
    
    onPlayAudio()
    onClick()
  }, {}, [onClick])

  useEffect(() => {
    if (
      typeof callAmount === 'number' &&
      typeof match?.callAmount === 'number' &&
      callAmount !== match?.callAmount
    ) {
      setAutoAction({ isChecked: '', callAmount: 0 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match?.callAmount])

  useEffect(() => {
    if (canAutoAction) {
      if (type === 'raise' && isMobile) {
        if (sidebarMobile !== 'raise') {
          setSidebarMobile('raise')
        } else {
          onPlayAudio()
          onClick()
        }
        return
      }
      onPlayAudio()
      onClick()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canAutoAction])

  const onToggle = () => {
    if (
      typeof callAmount === 'number' &&
      typeof match?.callAmount === 'number' &&
      callAmount !== match?.callAmount
    ) {
      if (isChecked === type) {
        setAutoAction({ isChecked: '', callAmount: 0 })
      } else {
        setAutoAction({ isChecked: type, callAmount: match?.callAmount })
      }
    } else {
      if (isChecked === type) {
        setAutoAction({ isChecked: '' })
      } else {
        setAutoAction({ isChecked: type })
      }
    }
  }

  const handleClick = () => {
    if (canCheck) {
      onToggle()
      return
    }

    if (disabled) return

    if (type === 'raise' && isMobile) {
      if (sidebarMobile !== 'raise') {
        setSidebarMobile('raise')
      } else {
        onPlayAudio()
        onClick()
      }
      return
    }
    onPlayAudio()
    onClick()
  }

  const onPlayAudio = () => {
    if (gender === 'male') {
      boyControls.volume(volume)
      boyControls.play()
    } else {
      girlControls.volume(volume)
      girlControls.play()
    }
  }

  if (!isMounted) return null

  return (
    <button
      className={cn(
        'item',
        className,
        disabled && 'opacity-80',
        canCheck && 'has_check  before:focus-within:!h-full',
        canCheck && type === isChecked && 'active'
      )}
      onClick={handleClick}
    >
      {audioBoy}
      {audioGirl}
      <span className="number">{shortcut}</span>
      <div className="value">{label}</div>
      {amount !== undefined && (
        <div className="view_money">{formatChipsAmount(amount || 0)}$</div>
      )}
    </button>
  )
}
