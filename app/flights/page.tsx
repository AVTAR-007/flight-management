import { createSupabaseServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Flight } from '@/types'
import FlightCard from '@/components/FlightCard'
import { Plane, AlertCircle, ArrowLeft } from 'lucide-react'

interface SearchParams {
  origin?: string
  destination?: string
  date?: string
  passengers?: string
}

export default async function FlightsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const origin = params.origin ?? ''
  const destination = params.destination ?? ''
  const date = params.date ?? ''
  const passengers = params.passengers ?? '1'

  const supabase = await createSupabaseServerClient()

  let flights: Flight[] = []

  if (origin && destination && date) {
    // Use wide range to cover full IST day regardless of UTC offset
    const startOfDay = new Date(`${date}T00:00:00+05:30`)
    const endOfDay = new Date(`${date}T23:59:59+05:30`)

    const { data, error } = await supabase
      .from('flights')
      .select('*')
      .eq('origin', origin)
      .eq('destination', destination)
      .gte('departs_at', startOfDay.toISOString())
      .lte('departs_at', endOfDay.toISOString())
      .order('departs_at', { ascending: true })

    console.log('flights data:', data, 'error:', error)
    flights = data ?? []
  }

  return (
    <div className="animate-fade-in-up">
      {/* Breadcrumb Indicator */}
      <div className="breadcrumb-container">
        <div className="breadcrumb-line">
          <div className="breadcrumb-line-progress" style={{ width: '25%' }} />
        </div>
        <div className="breadcrumb-step completed">
          <Link href="/search" style={{ textDecoration: 'none' }}>
            <div className="breadcrumb-dot">1</div>
          </Link>
          <div className="breadcrumb-label">Search</div>
        </div>
        <div className="breadcrumb-step active">
          <div className="breadcrumb-dot">2</div>
          <div className="breadcrumb-label">Flights</div>
        </div>
        <div className="breadcrumb-step">
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
          <Plane className="h-3.5 w-3.5" />
          <span>Available Flights</span>
        </div>
        <h1 className="page-title">
          {origin} &rarr; {destination}
        </h1>
        <p className="page-subtitle">
          {date
            ? new Date(`${date}T12:00:00`).toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : ''}{' '}
          &middot; {passengers} Passenger{Number(passengers) > 1 ? 's' : ''}
        </p>
      </div>

      {flights.length === 0 && (
        <div className="glass-card" style={{ padding: '60px 40px', textAlign: 'center', margin: '0 auto', maxWidth: '640px' }}>
          <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '50%', color: 'var(--gold)', marginBottom: '24px' }} className="animate-float">
            <Plane className="h-12 w-12" style={{ transform: 'rotate(90deg)' }} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--white)', marginBottom: '12px', fontFamily: "'Playfair Display', serif" }}>
            No flights found
          </h2>
          <p style={{ color: 'var(--gray)', marginBottom: '32px', fontSize: '15px', fontWeight: 300 }}>
            We couldn't find any scheduled flights on this route for the selected date.
          </p>
          <Link href="/search" className="btn-gold">
            <ArrowLeft className="h-4 w-4" />
            <span>Modify Search</span>
          </Link>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {flights.map((flight: Flight) => (
          <FlightCard key={flight.id} flight={flight} />
        ))}
      </div>
    </div>
  )
}