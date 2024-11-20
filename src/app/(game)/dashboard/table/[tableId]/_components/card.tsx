import { cn } from '@/lib/utils'
import Image from 'next/image'

interface CardProps {
  imageUrl: string
  value: number
  className?: string
  isShowdown?: boolean
  frontClassName?: string
  backClassName?: string
}

export const Card = ({
  imageUrl,
  frontClassName,
  backClassName,
}: CardProps) => {
  return (
    <>
      <div className="front">
        <Image
          src={imageUrl || '/images/back2.png'}
          alt="pokerOnImage"
          width={0}
          height={0}
          sizes="100vw"
          className={cn('w-auto h-full', frontClassName)}
          unoptimized
        />
      </div>
      <div className="back">
        <Image
          src="/images/pocker/back2.png"
          alt="pokerOnImage"
          width={0}
          height={0}
          sizes="100vw"
          className={cn('w-auto h-full', backClassName)}
          unoptimized
        />
      </div>
    </>
  )
}
