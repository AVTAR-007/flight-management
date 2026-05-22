export interface Flight {
  id: string
  flight_no: string
  origin: string
  destination: string
  departs_at: string
  arrives_at: string
  aircraft_type: string
  status: string
  base_price: number
}

export interface Seat {
  id: string
  flight_id: string
  seat_number: string
  class: 'economy' | 'business' | 'first'
  is_available: boolean
  extra_fee: number
}

export interface Booking {
  id: string
  user_id: string
  flight_id: string
  seat_id: string
  status: 'confirmed' | 'rescheduled' | 'cancelled'
  booked_at: string
  total_price: number
  pnr_code: string
}

export interface Passenger {
  id: string
  booking_id: string
  full_name: string
  passport_no: string
  nationality: string
  dob: string
}

export interface Reschedule {
  id: string
  booking_id: string
  old_flight_id: string
  new_flight_id: string
  requested_at: string
  fee_charged: number
}
