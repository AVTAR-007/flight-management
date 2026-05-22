import { createSupabaseServerClient } from '@/lib/supabase/server'
import BookingForm from '@/components/BookingForm'
import { Flight, Seat } from '@/types'
import Link from 'next/link'
import { UserCheck } from 'lucide-react'

interface SearchParams {
  flightId?: string
  seatId?: string
  totalPrice?: string
}

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const flightId = params.flightId ?? ''
  const seatId = params.seatId ?? ''
  const totalPrice = Number(params.totalPrice ?? 0)

  const supabase = await createSupabaseServerClient()

  const { data: flight } = await supabase
    .from('flights')
    .select('*')
    .eq('id', flightId)
    .maybeSingle()

  const { data: seat } = await supabase
    .from('seats')
    .select('*')
    .eq('id', seatId)
    .maybeSingle()

  const typedFlight = flight as Flight | null

  return (
    <div className="animate-fade-in-up">
      {/* Breadcrumb Indicator */}
      <div className="breadcrumb-container">
        <div className="breadcrumb-line">
          <div className="breadcrumb-line-progress" style={{ width: '75%' }} />
        </div>
        <div className="breadcrumb-step completed">
          <Link href="/search" style={{ textDecoration: 'none' }}>
            <div className="breadcrumb-dot">1</div>
          </Link>
          <div className="breadcrumb-label">Search</div>
        </div>
        <div className="breadcrumb-step completed">
          <Link href={`/flights?origin=${typedFlight?.origin}&destination=${typedFlight?.destination}&date=${typedFlight?.departs_at.split('T')[0]}`} style={{ textDecoration: 'none' }}>
            <div className="breadcrumb-dot">2</div>
          </Link>
          <div className="breadcrumb-label">Flights</div>
        </div>
        <div className="breadcrumb-step completed">
          <Link href={`/seats?flightId=${flightId}&class=${seat?.class}&basePrice=${flight?.base_price}`} style={{ textDecoration: 'none' }}>
            <div className="breadcrumb-dot">3</div>
          </Link>
          <div className="breadcrumb-label">Seats</div>
        </div>
        <div className="breadcrumb-step active">
          <div className="breadcrumb-dot">4</div>
          <div className="breadcrumb-label">Book</div>
        </div>
        <div className="breadcrumb-step">
          <div className="breadcrumb-dot">5</div>
          <div className="breadcrumb-label">Confirm</div>
        </div>
      </div>

      {/* Page Header */}
      <div className="page-header">
        <div className="section-badge animate-float">
          <UserCheck className="h-3.5 w-3.5" />
          <span>Final Step</span>
        </div>
        <h1 className="page-title">Passenger Details</h1>
        <p className="page-subtitle">
          Fill in your details to secure your ticket on this flight
        </p>
      </div>

      <BookingForm
        flight={flight as Flight | null}
        seat={seat as Seat | null}
        totalPrice={totalPrice}
        flightId={flightId}
        seatId={seatId}
      />
    </div>
  )
}