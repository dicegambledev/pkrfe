'use client'

import { logout } from '@/actions/logout'
import { cn } from '@/lib/utils'
import userApi from '@/services/api/modules/user-api'
import { useSession } from 'next-auth/react'

interface LogoutButtonProps {
  children?: React.ReactNode
  className?: string
}

export const LogoutButton = ({ children, className }: LogoutButtonProps) => {
  const { data } = useSession()
  const onClick = async () => {
    await logout()
    await userApi.logout()
  }

  return (
    <span onClick={onClick} className={cn('cursor-pointer', className)}>
      {children}
    </span>
  )
}
