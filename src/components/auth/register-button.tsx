'use client'

import { RegisterForm } from '@/components/auth/register-form'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface RegisterButtonProps {
  children: React.ReactNode
  mode?: 'modal' | 'redirect'
  asChild?: boolean
  className?: string
}

export const RegisterButton = ({
  children,
  mode = 'redirect',
  asChild,
  className,
}: RegisterButtonProps) => {
  const router = useRouter()

  const onClick = () => {
    router.push('/auth/register')
  }

  if (mode === 'modal') {
    return (
      <Dialog>
        <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
        <DialogContent className="max-w-[460px] w-full border-none bg-transparent p-0 !rounded-[24px]  px-[16px]">
          <RegisterForm />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <span onClick={onClick} className={cn('cursor-pointer', className)}>
      {children}
    </span>
  )
}
