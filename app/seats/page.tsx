import { createSupabaseServerClient } from '@/lib/supabase/server'
import SeatMap from '@/components/SeatMap'
import { Flight, Seat } from '@/types'
import Link from 'next/link'
import { Armchair } from 'lucide-react'

interface SearchParams {
  flightId?: string
  class?: string
  basePrice?: string
}

export default async function SeatsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const flightId = params.flightId ?? ''
  const selectedClass = params.class ?? 'economy'
  const basePrice = Number(params.basePrice ?? 0)

  const supabase = await createSupabaseServerClient()

  const { data: seats } = await supabase
    .from('seats')
    .select('*')
    .eq('flight_id', flightId)
    .order('seat_number', { ascending: true })

  const { data: flight } = await supabase
    .from('flights')
    .select('*')
    .eq('id', flightId)
    .maybeSingle()

  const typedFlight = flight as Flight | null
  const typedSeats = (seats ?? []) as Seat[]

  return (
    <div className="animate-fade-in-up">
      {/* Breadcrumb Indicator */}
      <div className="breadcrumb-container">
        <div className="breadcrumb-line">
          <div className="breadcrumb-line-progress" style={{ width: '50%' }} />
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
        <div className="breadcrumb-step active">
          <div className="breadcrumb-dot">3</div>
          <div className="breadcrumb-label">Seats</div>
        </div>
        <div className="breadcrumb-step">
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
          <Armchair className="h-3.5 w-3.5" />
          <span>Choose Your Seat</span>
        </div>
        <h1 className="page-title">Select Your Seat</h1>
        {typedFlight && (
          <p className="page-subtitle">
            {typedFlight.flight_no} &middot; {typedFlight.origin} &rarr; {typedFlight.destination} &middot; {new Date(typedFlight.departs_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
          </p>
        )}
      </div>

      <SeatMap
        seats={typedSeats}
        flightId={flightId}
        selectedClass={selectedClass}
        basePrice={basePrice}
        flight={typedFlight}
      />
    </div>
  )
}