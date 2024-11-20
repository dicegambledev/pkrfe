import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface ChatFocusProps {
  isChatFocus: boolean
  setIsChatFocus: (isChatFocus: boolean) => void
}

export const useChatFocus = create<ChatFocusProps>()(
  persist(
    set => ({
      isChatFocus: true,
      setIsChatFocus: (isChatFocus: boolean) => set({ isChatFocus }),
    }),
    {
      name: 'chat-focus-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
