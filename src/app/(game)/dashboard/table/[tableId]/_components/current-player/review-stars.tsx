import { Star, StarHalf } from 'lucide-react'
import { useMedia } from 'react-use'

type Props = {
  stars: number
}

export const ReviewStars = ({ stars }: Props) => {
  const isMobile = useMedia('(max-width: 768px), (max-height: 768px)', false)

  const ratingStar = Array.from({ length: 5 }, (_, index) => {
    let number = index + 0.5
    return (
      <span key={index}>
        {stars >= index + 1 ? (
          <Star
            size={isMobile ? 10 : 18}
            className="fill-yellow-500 stroke-yellow-500"
          />
        ) : stars >= number ? (
          <div className="relative">
            <StarHalf
              size={isMobile ? 10 : 18}
              className="absolute fill-yellow-500 stroke-yellow-500"
            />
            <Star
              size={isMobile ? 10 : 18}
              className="text-slate-600 fill-slate-600"
            />
          </div>
        ) : (
          <Star
            size={isMobile ? 10 : 18}
            className="text-slate-600 fill-slate-600"
          />
        )}
      </span>
    )
  })

  return <div className="flex items-center gap-x-0.5">{ratingStar}</div>
}
