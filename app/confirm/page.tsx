import { createSupabaseServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { CheckCircle, ShieldAlert, Plane, Ticket, User, CreditCard } from 'lucide-react'

interface SearchParams {
  pnr?: string
}

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const pnr = params.pnr ?? ''

  const supabase = await createSupabaseServerClient()

  const { data: booking } = await supabase
    .from('bookings')
    .select('*, flights(*), seats(*), passengers(*)')
    .eq('pnr_code', pnr)
    .maybeSingle()

  if (!booking) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(248,113,113,0.08)', borderRadius: '50%', color: 'var(--red)', marginBottom: '24px' }}>
          <ShieldAlert className="h-12 w-12" />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>Booking Not Found</h2>
        <p style={{ color: 'var(--gray)', marginBottom: '32px' }}>{"We couldn't locate any booking with the provided PNR code."}</p>
        <Link href="/search" className="btn-gold">
          Back to Search
        </Link>
      </div>
    )
  }

  const flight = booking.flights
  const seat = booking.seats
  const passenger = booking.passengers?.[0]

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }} className="animate-fade-in-up">
      {/* Breadcrumb Indicator */}
      <div className="breadcrumb-container" style={{ marginBottom: '40px' }}>
        <div className="breadcrumb-line">
          <div className="breadcrumb-line-progress" style={{ width: '100%' }} />
        </div>
        <div className="breadcrumb-step completed">
          <div className="breadcrumb-dot">1</div>
          <div className="breadcrumb-label">Search</div>
        </div>
        <div className="breadcrumb-step completed">
          <div className="breadcrumb-dot">2</div>
          <div className="breadcrumb-label">Flights</div>
        </div>
        <div className="breadcrumb-step completed">
          <div className="breadcrumb-dot">3</div>
          <div className="breadcrumb-label">Seats</div>
        </div>
        <div className="breadcrumb-step completed">
          <div className="breadcrumb-dot">4</div>
          <div className="breadcrumb-label">Book</div>
        </div>
        <div className="breadcrumb-step active">
          <div className="breadcrumb-dot">5</div>
          <div className="breadcrumb-label">Confirm</div>
        </div>
      </div>

      {/* Success card header */}
      <div className="glass-card success-card" style={{ textAlign: 'center', padding: '40px 32px', marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', padding: '12px', background: 'rgba(74,222,128,0.1)', borderRadius: '50%', color: 'var(--green)', marginBottom: '20px' }}>
          <CheckCircle className="h-12 w-12" />
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: 700, color: 'var(--green)', marginBottom: '8px' }}>
          Booking Confirmed!
        </h1>
        <p style={{ color: 'var(--gray-light)', fontSize: '15px', fontWeight: 300, marginBottom: '24px' }}>
          Your flight ticket has been locked successfully.
        </p>
        
        <div style={{ background: 'rgba(15, 21, 64, 0.6)', border: '1px solid var(--border)', borderRadius: '20px', padding: '16px 32px', display: 'inline-block' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gold)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
            PNR Reference Code
          </p>
          <p style={{ fontSize: '32px', fontWeight: 900, color: 'var(--white)', letterSpacing: '4px', fontFamily: 'monospace' }}>
            {pnr}
          </p>
        </div>
      </div>

      {/* Flight Details card */}
      <div className="glass-card" style={{ padding: '32px', marginBottom: '24px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', fontWeight: 700, marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '14px', fontFamily: "'Playfair Display', serif" }}>
          <Plane className="h-5 w-5 text-[var(--gold)]" />
          <span>Flight Details</span>
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Flight Number</p>
            <p style={{ fontWeight: 600, color: 'var(--white)' }}>{flight?.flight_no}</p>
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Route</p>
            <p style={{ fontWeight: 600, color: 'var(--white)' }}>{flight?.origin} &rarr; {flight?.destination}</p>
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Departure Time</p>
            <p style={{ fontWeight: 600, color: 'var(--white)', fontSize: '14px' }}>
              {flight?.departs_at ? new Date(flight.departs_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '-'}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Arrival Time</p>
            <p style={{ fontWeight: 600, color: 'var(--white)', fontSize: '14px' }}>
              {flight?.arrives_at ? new Date(flight.arrives_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '-'}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Seat & Cabin Class</p>
            <p style={{ fontWeight: 600, color: 'var(--white)' }}>
              {seat?.seat_number} <span style={{ color: 'var(--gold)', textTransform: 'capitalize', fontSize: '13px' }}>({seat?.class})</span>
            </p>
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Total Amount Paid</p>
            <p style={{ fontWeight: 700, color: 'var(--gold)', fontSize: '16px' }}>₹{booking.total_price?.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      {/* Passenger Details card */}
      {passenger && (
        <div className="glass-card" style={{ padding: '32px', marginBottom: '32px' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', fontWeight: 700, marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '14px', fontFamily: "'Playfair Display', serif" }}>
            <User className="h-5 w-5 text-[var(--gold)]" />
            <span>Passenger Details</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Full Name</p>
              <p style={{ fontWeight: 600, color: 'var(--white)' }}>{passenger.full_name}</p>
            </div>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Nationality</p>
              <p style={{ fontWeight: 600, color: 'var(--white)' }}>{passenger.nationality}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Link href="/bookings" className="btn-gold" style={{ flex: 1, minWidth: '200px' }}>
          <Ticket className="h-4 w-4" />
          <span>View My Bookings</span>
        </Link>
        <Link href="/search" className="btn-outline" style={{ flex: 1, minWidth: '200px' }}>
          <span>Book Another Flight</span>
        </Link>
      </div>
    </div>
  )
}