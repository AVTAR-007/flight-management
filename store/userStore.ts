import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Session } from '@supabase/supabase-js'
import { Booking } from '@/types'

interface UserStore {
  session: Session | null
  cachedBookings: Booking[] | null
  setSession: (session: Session | null) => void
  setCachedBookings: (bookings: Booking[]) => void
  resetUserStore: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      session: null,
      cachedBookings: null,
      setSession: (session) => set({ session }),
      setCachedBookings: (bookings) => set({ cachedBookings: bookings }),
      resetUserStore: () => set({ session: null, cachedBookings: null }),
    }),
    {
      name: 'user-store',
      partialize: (state) => ({
        session: state.session,
        // cachedBookings intentionally excluded
      }),
    }
  )
)