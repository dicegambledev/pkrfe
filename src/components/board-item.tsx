'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Props = {
  label: string
  icon?: React.ReactNode
  iconSrc?: string
  href: string
  onClick?: () => void
}

export const BoardItem = ({ label, icon, iconSrc, href, onClick }: Props) => {
  const pathname = usePathname()
  const active = pathname === href && href !== '/'

  const handleClick = () => {
    onClick?.()
  }

  return (
    <li className={cn(active && 'active')}>
      <Link href={href} onClick={handleClick}>
        <span className="icon sz-20 icon-color-white">{icon}</span>
        <span>{label}</span>
      </Link>
    </li>
  )
}
