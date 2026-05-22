'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function bookFlight(formData: {
  flightId: string
  seatId: string
  totalPrice: number
  fullName: string
  passportNo: string
  nationality: string
  dob: string
}) {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to book a flight' }
  }

  const pnr = 'SKY' + Math.random().toString(36).substring(2, 8).toUpperCase()

  const { data, error } = await supabase.rpc('lock_seat', {
    p_flight_id: formData.flightId,
    p_seat_id: formData.seatId,
    p_user_id: user.id,
    p_total_price: formData.totalPrice,
    p_pnr: pnr,
    p_full_name: formData.fullName,
    p_passport_no: formData.passportNo,
    p_nationality: formData.nationality,
    p_dob: formData.dob,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true, pnrCode: pnr, bookingId: data?.booking_id }
}
export async function cancelBooking(bookingId: string) {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data, error } = await supabase.rpc('cancel_booking', {
    p_booking_id: bookingId,
    p_user_id: user.id,
  })

  if (error) return { error: error.message }
  return { success: true }
}

export async function fetchAlternativeFlights(origin: string, destination: string, excludeFlightId: string) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('flights')
    .select('*')
    .eq('origin', origin)
    .eq('destination', destination)
    .neq('id', excludeFlightId)
    .eq('status', 'scheduled')
    .gte('departs_at', new Date().toISOString())

  if (error) return { error: error.message }
  return { flights: data ?? [] }
}

export async function rescheduleBooking(
  bookingId: string,
  newFlightId: string,
  newSeatId: string
) {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data, error } = await supabase.rpc('reschedule_booking', {
    p_booking_id: bookingId,
    p_user_id: user.id,
    p_new_flight_id: newFlightId,
    p_new_seat_id: newSeatId,
  })

  if (error) return { error: error.message }
  return { success: true, feeCharged: data?.fee_charged }
}