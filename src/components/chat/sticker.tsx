import { cn } from '@/lib/utils'

type StickerProps = {
  show: boolean
  setShow: (show: boolean) => void
  onClick: (imageSrc: string) => void
}

const stickerImageSrc = [
  '/images/sticker/smile1.gif',
  '/images/sticker/smile2.gif',
  '/images/sticker/angry1.gif',
  '/images/sticker/angry2.gif',
  '/images/sticker/cry1.gif',
  '/images/sticker/cry2.gif',
  '/images/sticker/happy1.gif',
  '/images/sticker/happy2.gif',
  '/images/sticker/angry1.gif',
  '/images/sticker/angry3.gif',
  '/images/sticker/sorry1.gif',
  '/images/sticker/sorry2.gif',
  '/images/sticker/thank1.gif',
  '/images/sticker/thank2.gif',
]

export const Sticker = ({ show, setShow, onClick }: StickerProps) => {
  const handleClick = (imageSrc: string) => {
    onClick(imageSrc)
    setShow(false)
  }

  return (
    <div className={cn('block_sticker hidden transition', show && 'block')}>
      <div className="list">
        {stickerImageSrc.map((src, index) => (
          <div
            key={index}
            className="item rounded-sm cursor-pointer transition hover:bg-white/20"
            onClick={() => handleClick(src)}
          >
            <div className="imgDrop">
              <img src={src} alt="sticker" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
