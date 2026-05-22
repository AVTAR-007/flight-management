'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cancelBooking, fetchAlternativeFlights, rescheduleBooking } from '@/app/actions/booking'
import { Flight } from '@/types'
import { AnimatePresence, motion } from 'framer-motion'
import { Inbox, Plane, Calendar, User, Ticket, RefreshCw, X, AlertCircle, Trash2, ArrowRight } from 'lucide-react'

interface BookingsListProps {
  bookings: any[]
}

export default function BookingsList({ bookings }: BookingsListProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [rescheduleModal, setRescheduleModal] = useState<{
    bookingId: string
    origin: string
    destination: string
    flightId: string
  } | null>(null)
  const [altFlights, setAltFlights] = useState<Flight[]>([])
  const [selectedAltFlight, setSelectedAltFlight] = useState<string | null>(null)

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return

    setLoading(bookingId)
    setError(null)

    const result = await cancelBooking(bookingId)

    setLoading(null)

    if (result.error) {
      setError(result.error)
      return
    }

    router.refresh()
  }

  const handleRescheduleOpen = async (booking: any) => {
    setLoading(booking.id)
    const result = await fetchAlternativeFlights(
      booking.flights.origin,
      booking.flights.destination,
      booking.flight_id
    )
    setLoading(null)

    if (result.error || !result.flights) {
      setError(result.error || 'No alternative flights found')
      return
    }

    setAltFlights(result.flights)
    setRescheduleModal({
      bookingId: booking.id,
      origin: booking.flights.origin,
      destination: booking.flights.destination,
      flightId: booking.flight_id,
    })
  }

  const handleRescheduleConfirm = async () => {
    if (!rescheduleModal || !selectedAltFlight) return

    // Get first available seat on new flight
    const { createSupabaseBrowserClient } = await import('@/lib/supabase/client')
    const supabase = createSupabaseBrowserClient()
    const { data: seat } = await supabase
      .from('seats')
      .select('id')
      .eq('flight_id', selectedAltFlight)
      .eq('is_available', true)
      .limit(1)
      .single()

    if (!seat) {
      setError('No seats available on selected flight')
      return
    }

    setLoading(rescheduleModal.bookingId)
    const result = await rescheduleBooking(rescheduleModal.bookingId, selectedAltFlight, seat.id)
    setLoading(null)

    if (result.error) {
      setError(result.error)
      return
    }

    setRescheduleModal(null)
    setSelectedAltFlight(null)
    router.refresh()
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
      },
    },
  }

  if (bookings.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="glass-card"
        style={{ textAlign: 'center', padding: '60px 40px' }}
      >
        <div className="empty-icon-wrap">
          <Inbox className="h-10 w-10 text-[var(--gold)]" />
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', fontWeight: 700, color: 'var(--white)', marginBottom: '12px' }}>
          No bookings yet
        </h2>
        <p style={{ color: 'var(--gray)', marginBottom: '32px', fontSize: '15px', fontWeight: 300 }}>
          You haven't booked any premium journeys yet. Start by exploring flights.
        </p>
        <a href="/search" className="btn-gold">
          <span>Search Flights</span>
          <ArrowRight className="h-4 w-4" />
        </a>
        <style jsx>{`
          .empty-icon-wrap {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 72px;
            height: 72px;
            border-radius: 50%;
            background: rgba(201, 168, 76, 0.06);
            border: 1px solid rgba(201, 168, 76, 0.15);
            margin: 0 auto 24px auto;
          }
        `}</style>
      </motion.div>
    )
  }

  return (
    <div>
      {error && (
        <div className="error-box" style={{ marginBottom: '24px' }}>
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      <motion.div
        className="bookings-list"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {bookings.map((booking) => {
          const flight = booking.flights
          const seat = booking.seats
          const passenger = booking.passengers?.[0]
          const isCancelled = booking.status === 'cancelled'

          return (
            <motion.div
              key={booking.id}
              variants={itemVariants}
              className="glass-card booking-card"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Header: Route + Status */}
                <div className="booking-header">
                  <div className="route-info">
                    <div className="icon-wrap">
                      <Plane className="h-6 w-6" style={{ transform: 'rotate(90deg)' }} />
                    </div>
                    <div>
                      <h3 className="route-title">
                        {flight?.origin} → {flight?.destination}
                      </h3>
                      <p className="flight-no">
                        {flight?.flight_no}
                      </p>
                    </div>
                  </div>
                  <span className={`badge badge-${booking.status}`}>
                    {booking.status}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="booking-details">
                  <div className="detail-item">
                    <div className="detail-label">
                      <Ticket className="h-3.5 w-3.5" />
                      <span>Seat</span>
                    </div>
                    <p className="detail-val-gold">
                      {seat?.seat_number}
                    </p>
                    <p className="detail-sub" style={{ textTransform: 'capitalize' }}>
                      {seat?.class} Class
                    </p>
                  </div>

                  <div className="detail-item">
                    <div className="detail-label">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Departure</span>
                    </div>
                    <p className="detail-val">
                      {flight?.departs_at ? new Date(flight.departs_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                    </p>
                    <p className="detail-sub">
                      {flight?.departs_at ? new Date(flight.departs_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : '-'}
                    </p>
                  </div>

                  <div className="detail-item">
                    <div className="detail-label">
                      <User className="h-3.5 w-3.5" />
                      <span>Passenger</span>
                    </div>
                    <p className="detail-val">
                      {passenger?.full_name}
                    </p>
                  </div>

                  <div className="detail-item">
                    <div className="detail-label">
                      <Ticket className="h-3.5 w-3.5" />
                      <span>PNR Code</span>
                    </div>
                    <p className="detail-val-gold" style={{ fontFamily: 'monospace', letterSpacing: '0.5px' }}>
                      {booking.pnr_code}
                    </p>
                  </div>
                </div>

                {/* Footer: Price + Actions */}
                <div className="booking-footer">
                  <p className="price-tag">
                    ₹{booking.total_price?.toLocaleString('en-IN')}
                  </p>

                  {!isCancelled && (
                    <div className="action-buttons">
                      <button
                        onClick={() => handleRescheduleOpen(booking)}
                        disabled={loading === booking.id}
                        className="btn-outline"
                        style={{ padding: '10px 24px', fontSize: '13px' }}
                      >
                        <RefreshCw className={`h-3.5 w-3.5 mr-1 ${loading === booking.id ? 'animate-spin' : ''}`} />
                        <span>Reschedule</span>
                      </button>
                      <button
                        onClick={() => handleCancel(booking.id)}
                        disabled={loading === booking.id}
                        className="btn-danger"
                        style={{ padding: '10px 24px', fontSize: '13px' }}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        <span>{loading === booking.id ? 'Processing...' : 'Cancel'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Reschedule Modal */}
      <AnimatePresence>
        {rescheduleModal && (
          <div className="modal-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card modal-container"
            >
              <button
                className="close-btn"
                onClick={() => {
                  setRescheduleModal(null)
                  setSelectedAltFlight(null)
                }}
              >
                <X className="h-5 w-5" />
              </button>

              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', fontWeight: 700, color: 'var(--white)', marginBottom: '8px' }}>
                Reschedule Flight
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--gray)', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plane className="h-4 w-4" style={{ transform: 'rotate(90deg)', color: 'var(--gold)' }} />
                <span>{rescheduleModal.origin} → {rescheduleModal.destination}</span>
              </p>

              {altFlights.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--gray)' }}>
                  <AlertCircle className="h-8 w-8 mx-auto mb-3 opacity-50" />
                  <p>No alternative flights available at this time.</p>
                </div>
              ) : (
                <div className="alt-flights-container">
                  {altFlights.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSelectedAltFlight(f.id)}
                      className={`alt-flight-btn ${selectedAltFlight === f.id ? 'active' : ''}`}
                    >
                      <div>
                        <p className="alt-flight-no">{f.flight_no}</p>
                        <p className="alt-flight-date">
                          {new Date(f.departs_at).toLocaleString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </p>
                      </div>
                      <p className="alt-flight-price">₹{f.base_price.toLocaleString('en-IN')}</p>
                    </button>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => {
                    setRescheduleModal(null)
                    setSelectedAltFlight(null)
                  }}
                  className="btn-outline"
                  style={{ flex: 1, padding: '14px 18px', fontSize: '14px' }}
                >
                  Close
                </button>
                <button
                  onClick={handleRescheduleConfirm}
                  disabled={!selectedAltFlight}
                  className="btn-gold"
                  style={{ flex: 1, padding: '14px 18px', fontSize: '14px' }}
                >
                  <span>Confirm</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .bookings-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .booking-card {
          position: relative;
        }
        .booking-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }
        .route-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 52px;
          height: 52px;
          border-radius: 16px;
          background: rgba(201, 168, 76, 0.06);
          border: 1px solid rgba(201, 168, 76, 0.15);
          color: var(--gold);
        }
        .route-title {
          font-size: 20px;
          font-weight: 700;
          color: var(--white);
          margin-bottom: 4px;
        }
        .flight-no {
          font-size: 12px;
          color: var(--gray);
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .booking-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 24px;
          padding: 24px 0;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .detail-label {
          font-size: 11px;
          color: var(--gray);
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .detail-val {
          font-size: 16px;
          font-weight: 700;
          color: var(--white);
        }
        .detail-val-gold {
          font-size: 16px;
          font-weight: 700;
          color: var(--gold);
        }
        .detail-sub {
          font-size: 12px;
          color: var(--gray);
        }
        .booking-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }
        .price-tag {
          font-size: 26px;
          font-weight: 800;
          background: linear-gradient(135deg, var(--gold), var(--gold-light));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .action-buttons {
          display: flex;
          gap: 12px;
        }
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(6, 10, 34, 0.85);
          backdrop-filter: blur(16px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 20px;
        }
        .modal-container {
          width: 100%;
          max-width: 500px;
          position: relative;
          background: rgba(10, 15, 46, 0.95);
        }
        .close-btn {
          position: absolute;
          top: 24px;
          right: 24px;
          background: transparent;
          border: none;
          color: var(--gray);
          cursor: pointer;
          transition: color 0.2s;
        }
        .close-btn:hover {
          color: var(--white);
        }
        .alt-flights-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 28px;
          max-height: 280px;
          overflow-y: auto;
          padding-right: 4px;
        }
        .alt-flight-btn {
          width: 100%;
          padding: 16px 20px;
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.02);
          border-radius: 16px;
          text-align: left;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .alt-flight-btn:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(201, 168, 76, 0.3);
        }
        .alt-flight-btn.active {
          border-color: var(--gold);
          background: rgba(201, 168, 76, 0.08);
          box-shadow: 0 0 20px rgba(201, 168, 76, 0.1);
        }
        .alt-flight-no {
          font-weight: 700;
          color: var(--white);
          margin-bottom: 4px;
        }
        .alt-flight-date {
          font-size: 13px;
          color: var(--gray);
        }
        .alt-flight-price {
          font-weight: 700;
          color: var(--gold);
          font-size: 15px;
        }
        @media (max-width: 768px) {
          .booking-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .booking-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .action-buttons {
            width: 100%;
          }
          .action-buttons button {
            flex: 1;
          }
        }
      `}</style>
    </div>
  )
}