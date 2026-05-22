import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Flight, Seat } from '@/types'

interface SearchQuery {
  origin: string
  destination: string
  date: string
  passengerCount: number
}

interface PassengerForm {
  fullName: string
  passportNo: string
  nationality: string
  dob: string
}

interface FlightStore {
  searchQuery: SearchQuery | null
  selectedFlight: Flight | null
  selectedSeat: Seat | null
  bookingStep: number
  passengerForm: PassengerForm
  setSearchQuery: (query: SearchQuery) => void
  setSelectedFlight: (flight: Flight) => void
  setSelectedSeat: (seat: Seat) => void
  setBookingStep: (step: number) => void
  setPassengerForm: (form: PassengerForm) => void
  resetFlightStore: () => void
}

const initialPassengerForm = {
  fullName: '',
  passportNo: '',
  nationality: '',
  dob: '',
}

export const useFlightStore = create<FlightStore>()(
  persist(
    (set) => ({
      searchQuery: null,
      selectedFlight: null,
      selectedSeat: null,
      bookingStep: 0,
      passengerForm: initialPassengerForm,
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedFlight: (flight) => set({ selectedFlight: flight }),
      setSelectedSeat: (seat) => set({ selectedSeat: seat }),
      setBookingStep: (step) => set({ bookingStep: step }),
      setPassengerForm: (form) => set({ passengerForm: form }),
      resetFlightStore: () =>
        set({
          searchQuery: null,
          selectedFlight: null,
          selectedSeat: null,
          bookingStep: 0,
          passengerForm: initialPassengerForm,
        }),
    }),
    {
      name: 'flight-store',
      partialize: (state) => ({
        searchQuery: state.searchQuery,
        selectedFlight: state.selectedFlight,
        bookingStep: state.bookingStep,
        // passengerForm intentionally excluded — contains passport number
      }),
    }
  )
)