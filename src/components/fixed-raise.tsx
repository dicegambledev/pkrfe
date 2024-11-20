'use client'

import { BetSlider } from '@/components/bet-slider'
import { cn } from '@/lib/utils'
import { useSidebarMobile } from '@/store/use-sidebar-mobile'

type FixedRaiseProps = {
  bet: number
  setBet: React.Dispatch<React.SetStateAction<number>>
  min: number
  max: number
}

export const FixedRaise = ({ bet, setBet, min, max }: FixedRaiseProps) => {
  const { sidebarMobile, setSidebarMobile } = useSidebarMobile()

  const onToggle = () => {
    if (sidebarMobile === 'raise') {
      setSidebarMobile('none')
      return
    }

    setSidebarMobile('raise')
  }

  return (
    <div className={cn('block_raise', sidebarMobile === 'raise' && 'active')}>
      <div className="close" onClick={onToggle}>
        <span className="sz-16 icon">
          <i className="icon-down"></i>
        </span>
      </div>
      <div className="ttl">RAISE RANGE</div>
      <div className="content">
        <div className="slider_range">
          <BetSlider bet={bet} setBet={setBet} min={min} max={max} />
        </div>
      </div>
    </div>
  )
}
