import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type sidebarMobileProps = {
  sidebarMobile: 'statistical' | 'raise' | 'none'
  setSidebarMobile: (sidebarMobile: 'statistical' | 'raise' | 'none') => void
}

export const useSidebarMobile = create<sidebarMobileProps>()(
  persist(
    set => ({
      sidebarMobile: 'statistical',
      setSidebarMobile: sidebarMobile => set({ sidebarMobile }),
    }),
    {
      name: 'sidebar-mobile-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
