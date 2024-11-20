'use client'

import { Navbar } from '@/components/navbar'

import '@/styles/css/layout.css'
import '@/styles/css/styles.css'
import '@/styles/css/game.css'

import { useParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ModalProvider } from '@/providers/modal-provider'
import { useEffect, useState } from 'react'
import {
  clearStorageToken,
  getStorageToken,
  saveStorageToken,
} from '@/utils/storage'
import { useSession } from 'next-auth/react'
import userApi from '@/services/api/modules/user-api'
import { logout } from '@/actions/logout'

interface GameLayoutProps {
  children: React.ReactNode
}

const GameLayout = ({ children }: GameLayoutProps) => {
  const params = useParams()
  const isTableIdRoute = params?.tableId
  const { data: session } = useSession()
  const accessToken = getStorageToken()

  // Detect user close browser or switch to another tab
  useEffect(() => {
    if (!accessToken && session?.user.token) {
      saveStorageToken(session.user.token)
    }

    const handleBeforeUnload = (event: any) => {
      var message = 'Are you sure you want to leave?'
      event.returnValue = message
      handleCloseGame()
      return message
    }

    const handleCloseGame = async () => {
      await lockUserOutOfGame()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('visibilitychange', handleCloseGame)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('visibilitychange', handleCloseGame)
    }
  }, [])

  const lockUserOutOfGame = async () => {
    await userApi.logout()
    clearStorageToken()
    await logout()
  }

  useEffect(() => {
    if (isTableIdRoute) {
      document.body.classList.add('overflow-hidden')
      document.documentElement.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
      document.documentElement.classList.remove('overflow-hidden')
    }
  }, [isTableIdRoute])

  return (
    <div className={cn(isTableIdRoute ? 'game-html' : 'page-sub')}>
      <div className={cn(isTableIdRoute && 'game')}>
        <div className="inner_page">
          <main>
            {!isTableIdRoute && <Navbar />}
            {children}
          </main>
        </div>
        <ModalProvider />
      </div>
    </div>
  )
}

export default GameLayout
