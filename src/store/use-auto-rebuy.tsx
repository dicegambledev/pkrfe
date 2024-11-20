import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface AutoRebuyProps {
  isAutoRebuy: boolean
  canAutoRebuy: boolean
  autoRebuyAmount: number
  setAutoRebuy: ({
    isAutoRebuy,
    autoRebuyAmount,
    canAutoRebuy,
  }: {
    isAutoRebuy?: boolean
    autoRebuyAmount?: number
    canAutoRebuy?: boolean
  }) => void
}

export const useAutoRebuy = create<AutoRebuyProps>()(
  persist(
    set => ({
      isAutoRebuy: false,
      autoRebuyAmount: 0,
      canAutoRebuy: false,
      setAutoRebuy: ({ isAutoRebuy, autoRebuyAmount, canAutoRebuy }) => {
        set(state => ({
          ...state,
          canAutoRebuy: canAutoRebuy ?? state.canAutoRebuy,
          isAutoRebuy: isAutoRebuy ?? state.isAutoRebuy,
          autoRebuyAmount: autoRebuyAmount ?? state.autoRebuyAmount,
        }))
      },
    }),
    {
      name: 'auto-rebuy-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
