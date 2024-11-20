import { cn } from '@/lib/utils'
import { QueryProvider } from '@/providers/query-provider'
import { SocketProvider } from '@/providers/socket-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import type { Metadata } from 'next'

import './globals.css'
import '@/styles/custom.css'
import '@/styles/bootstrap.css'

import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'
import { SoundProvider } from '@/providers/sound-provider'
import { ToastProvider } from '@/providers/toast-provider'

export const metadata: Metadata = {
  title: 'Poker',
  description: 'A Poker Game built with Next.js and Tailwind CSS.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <SessionProvider session={session}>
      <html className="h-full" lang="en" suppressHydrationWarning>
        <body className={cn('bg-white dark:bg-[#213338] h-full')}>
          <SoundProvider />
          <ToastProvider />
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey="game-theme"
          >
            <SocketProvider>
              <QueryProvider>{children}</QueryProvider>
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  )
}
