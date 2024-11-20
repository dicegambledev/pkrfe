'use client'

import { startTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import { addMemberToSystem } from '@/actions/addMember'
import { Header } from '@/components/auth/header'
import { Card, CardHeader } from '@/components/ui/card'
import { login } from '@/actions/login'
import { toast } from 'sonner'

export interface ExternalSecretProps {
  encryptedData: string
  iv: string
  secretKey: string
}

export default function AccessPage() {
  const searchParams = useSearchParams()

  const onStartGame = async () => {
    try {
      const secretData: ExternalSecretProps = {
        encryptedData: searchParams.get('encryptedData') ?? '',
        iv: searchParams.get('iv') ?? '',
        secretKey: searchParams.get('secretKey') ?? '',
      }
      const auth = await addMemberToSystem(secretData)
      if (auth) {
        const { username, password, expiredDate } = auth

        const now = new Date().getTime()
        const _expiredDate = new Date(expiredDate).getTime()

        if (_expiredDate < now) {
          toast.error('Your link has been expired')
          return
        }


        startTransition(async () => {
          login({ username, password })
            .then((data: any) => {
              if (data?.error) {
                toast.error(
                  data?.error ?? 'Something went wrong! Please try again'
                )
              }
              if (data?.success) {
                toast.success(data?.success ?? 'Start game successfully!')
              }
            })
            .catch(() => console.error('Something went wrong!'))
        })
      }
    } catch (error) {
      console.error('error: ', error)
    }
  }

  return (
    <div className="w-full h-[100dvh] flex items-center justify-center">
      <Card className="max-w-[460px] w-full  shadow-md p-[32px] z-20 bg-black/60 border-solid border-2 border-white/30">
        <CardHeader className="p-0">
          <Header
            label={'Access from an external link'}
            className="text-center"
          />
        </CardHeader>
        <div className="input-group text-center mt-10">
          <button
            className="btn btn-submit disabled:pointer-events-none disabled:opacity-50"
            onClick={() => onStartGame()}
          >
            <span className="color-main">Start Game</span>
          </button>
        </div>
      </Card>
    </div>
  )
}
