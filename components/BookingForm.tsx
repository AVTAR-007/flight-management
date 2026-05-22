'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFlightStore } from '@/store/flightStore'
import { bookFlight } from '@/app/actions/booking'
import { Flight, Seat } from '@/types'
import { motion } from 'framer-motion'
import { User, FileText, Globe, Calendar, AlertTriangle, ArrowRight } from 'lucide-react'

interface BookingFormProps {
  flight: Flight | null
  seat: Seat | null
  totalPrice: number
  flightId: string
  seatId: string
}

export default function BookingForm({ flight, seat, totalPrice, flightId, seatId }: BookingFormProps) {
  const router = useRouter()
  const { passengerForm, setPassengerForm, resetFlightStore } = useFlightStore()

  const [form, setForm] = useState({
    fullName: passengerForm.fullName || '',
    passportNo: passengerForm.passportNo || '',
    nationality: passengerForm.nationality || '',
    dob: passengerForm.dob || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!form.fullName || !form.passportNo || !form.nationality || !form.dob) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError('')

    // Save to store (excluding passportNo)
    setPassengerForm(form)

    const result = await bookFlight({
      flightId,
      seatId,
      totalPrice,
      fullName: form.fullName,
      passportNo: form.passportNo,
      nationality: form.nationality,
      dob: form.dob,
    })

    setLoading(false)

    if (result.error) {
      setError(result.error)
      return
    }

    resetFlightStore()
    router.push(`/confirm?pnr=${result.pnrCode}`)
  }

  return (
    <div className="booking-layout">
      {/* Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card"
      >
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 700, color: 'var(--white)', marginBottom: '24px' }}>
          Passenger Details
        </h2>

        <div className="form-grid">
          <div className="form-group span-2">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User className="h-3.5 w-3.5" style={{ color: 'var(--gold)' }} />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              placeholder="As printed on passport"
              className="input-field"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText className="h-3.5 w-3.5" style={{ color: 'var(--gold)' }} />
              <span>Passport Number</span>
            </label>
            <input
              type="text"
              placeholder="e.g. A1234567"
              className="input-field"
              value={form.passportNo}
              onChange={(e) => setForm({ ...form, passportNo: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe className="h-3.5 w-3.5" style={{ color: 'var(--gold)' }} />
              <span>Nationality</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Indian"
              className="input-field"
              value={form.nationality}
              onChange={(e) => setForm({ ...form, nationality: e.target.value })}
            />
          </div>

          <div className="form-group span-2">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar className="h-3.5 w-3.5" style={{ color: 'var(--gold)' }} />
              <span>Date of Birth</span>
            </label>
            <input
              type="date"
              className="input-field"
              style={{ colorScheme: 'dark' }}
              value={form.dob}
              onChange={(e) => setForm({ ...form, dob: e.target.value })}
            />
          </div>
        </div>

        {error && (
          <div className="error-box">
            <AlertTriangle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="btn-gold"
          style={{ width: '100%', marginTop: '8px' }}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg className="animate-spin h-5 w-5 text-navy" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Processing...</span>
            </span>
          ) : (
            <>
              <span>Confirm Booking</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </motion.div>

      {/* Summary Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card booking-summary"
      >
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 700, color: 'var(--white)', marginBottom: '24px' }}>
          Booking Summary
        </h2>

        {flight && (
          <div style={{ fontSize: '14px', color: 'var(--gray)', display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 500, color: 'var(--gray)' }}>Flight</span>
              <span style={{ color: 'var(--white)', fontWeight: 600 }}>{flight.flight_no}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 500, color: 'var(--gray)' }}>Route</span>
              <span style={{ color: 'var(--white)', fontWeight: 600 }}>{flight.origin} → {flight.destination}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 500, color: 'var(--gray)' }}>Departure Date</span>
              <span style={{ color: 'var(--white)', fontWeight: 600 }}>
                {new Date(flight.departs_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        )}

        {seat && (
          <div style={{ 
            fontSize: '14px', 
            color: 'var(--gray)', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '14px', 
            marginBottom: '24px', 
            paddingTop: '24px',
            borderTop: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 500, color: 'var(--gray)' }}>Seat Number</span>
              <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '15px' }}>{seat.seat_number}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 500, color: 'var(--gray)' }}>Cabin Class</span>
              <span style={{ color: 'var(--white)', fontWeight: 600, textTransform: 'capitalize' }}>{seat.class}</span>
            </div>
          </div>
        )}

        <div style={{ paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--white)' }}>Total Fare</span>
            <span className="price-tag">
              ₹{totalPrice.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Styled JSX for responsive layout controls */}
      <style jsx>{`
        .booking-layout {
          display: grid;
          grid-template-columns: 1.8fr 1fr;
          gap: 28px;
          align-items: start;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }
        .span-2 {
          grid-column: span 2;
        }
        .booking-summary {
          position: sticky;
          top: 96px;
          height: fit-content;
        }
        .price-tag {
          font-size: 24px;
          font-weight: 800;
          color: var(--white);
          background: linear-gradient(135deg, var(--gold), var(--gold-light));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 30px rgba(201, 168, 76, 0.1);
        }
        @media (max-width: 900px) {
          .booking-layout {
            grid-template-columns: 1fr;
          }
          .booking-summary {
            position: relative;
            top: 0;
          }
        }
        @media (max-width: 600px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          .span-2 {
            grid-column: span 1;
          }
        }
      `}</style>
    </div>
  )
}