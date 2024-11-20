'use client'

import { cn } from '@/lib/utils'
import { useSidebarMobile } from '@/store/use-sidebar-mobile'

export const FixedSidebar = () => {
  const { sidebarMobile, setSidebarMobile } = useSidebarMobile()

  const onStatisticalClick = () => {
    if (sidebarMobile === 'statistical') {
      setSidebarMobile('none')
      return
    }

    setSidebarMobile('statistical')
  }

  const onRaiseClick = () => {
    if (sidebarMobile === 'raise') {
      setSidebarMobile('none')
      return
    }

    setSidebarMobile('raise')
  }

  return (
    <div className="fixedSidebar fixedSidebarRight">
      <div
        className={cn('item', sidebarMobile === 'statistical' && 'active')}
        onClick={onStatisticalClick}
      >
        <span className="icon sz-20 icon-color-white">
          <i className="icon-win"></i>
        </span>
      </div>
      <div
        className={cn('item', sidebarMobile === 'raise' && 'active')}
        onClick={onRaiseClick}
      >
        <span className="icon sz-20 icon-color-white">
          <i className="icon-capital"></i>
        </span>
      </div>
    </div>
  )
}
