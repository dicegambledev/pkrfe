import { cn } from '@/lib/utils'
import { Poppins } from 'next/font/google'
import Image from 'next/image'

const font = Poppins({
  subsets: ['latin'],
  weight: ['600'],
})

interface HeaderProps {
  label?: string
  description?: string
  className?: string
}

export const Header = ({ label, description, className }: HeaderProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-4">
      <div className="logo w-[180px]">
        <Image
          src="/images/logo_2.png"
          alt="pokerOnImage"
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-auto"
        />
      </div>
      <h1
        className={cn(
          'text-3xl font-semibold color-main',
          font.className,
          className
        )}
      >
        {label}
      </h1>
      {/* <p className="text-center text-sm leading-6 text-muted-foreground">
        {description}
      </p> */}
    </div>
  )
}
