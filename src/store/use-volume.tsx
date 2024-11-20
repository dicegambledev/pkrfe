import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface VolumeProps {
  volume: number
  setVolume: (volume: number) => void
}

export const useVolume = create<VolumeProps>()(
  persist(
    set => ({
      volume: 0.5,
      setVolume: (volume: number) => set({ volume }),
    }),
    {
      name: 'volumn-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
