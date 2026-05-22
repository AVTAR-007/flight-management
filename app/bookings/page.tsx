import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BookingsList from '@/components/BookingsList'
import { Briefcase } from 'lucide-react'

export default async function BookingsPage() {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, flights(*), seats(*), passengers(*)')
    .eq('user_id', user.id)
    .order('booked_at', { ascending: false })

  return (
    <div className="animate-fade-in-up">
      <div className="page-header">
        <div className="section-badge animate-float">
          <Briefcase className="h-3.5 w-3.5" />
          <span>Your Bookings</span>
        </div>
        <h1 className="page-title">
          Manage Your Flights
        </h1>
        <p className="page-subtitle">
          View, reschedule, or cancel your booked luxury flights
        </p>
      </div>
      <BookingsList bookings={bookings ?? []} />
    </div>
  )
}