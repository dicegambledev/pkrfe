import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type brightnessProps = {
  brightness: 'dim' | 'normal' | 'bright'
  setBrightness: (brightness: 'dim' | 'normal' | 'bright') => void
}

export const useBrightness = create<brightnessProps>()(
  persist(
    set => ({
      brightness: 'normal',
      setBrightness: (brightness: 'dim' | 'normal' | 'bright') =>
        set({ brightness }),
    }),
    {
      name: 'brightness-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
