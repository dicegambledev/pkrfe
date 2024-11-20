import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type TalbeImageType = '/images/table_v3.png' | '/images/table.png'

export enum TableImageEnum {
  V1 = '/images/table.png',
  V2 = '/images/table_v3.png',
}

interface TableImageProps {
  imageSrc: TalbeImageType
  setImageSrc: (imageSrc: TalbeImageType) => void
}

export const useTableImage = create<TableImageProps>()(
  persist(
    set => ({
      imageSrc: TableImageEnum.V2,
      setImageSrc: imageSrc => set({ imageSrc }),
    }),
    {
      name: 'table-image-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
