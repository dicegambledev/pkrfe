import Image from 'next/image'

interface ImageOptionProps {
  imageUrl: string
  onClick?: () => void
  index: number
}

export const ImageOption = ({ imageUrl, onClick, index }: ImageOptionProps) => {
  return (
    <div className="group_item">
      <input type="radio" name="selectAvt" id={`selectAv${index + 1}`} />
      <label htmlFor={`selectAv${index + 1}`} onClick={onClick}>
        <div className="images">
          <div className="imgDrop ratio_1_1">
            <Image
              src={imageUrl}
              alt="image alt"
              width={0}
              height={0}
              sizes="100vw"
              className="w-auto h-full object-cover"
            />
          </div>
        </div>
      </label>
    </div>
  )
}
