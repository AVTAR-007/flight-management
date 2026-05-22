'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useFlightStore } from '@/store/flightStore'
import { Plane, Calendar, Users, ArrowRightLeft, AlertTriangle, ArrowRight } from 'lucide-react'

const CITIES = ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad']

const POPULAR_ROUTES = [
  { from: 'Delhi', to: 'Mumbai' },
  { from: 'Bangalore', to: 'Delhi' },
  { from: 'Mumbai', to: 'Hyderabad' },
]

export default function SearchPage() {
  const router = useRouter()
  const { setSearchQuery } = useFlightStore()

  const [form, setForm] = useState({
    origin: '',
    destination: '',
    date: '',
    passengerCount: 1,
  })
  const [error, setError] = useState('')
  const [swapRotate, setSwapRotate] = useState(0)

  const handleSubmit = () => {
    if (!form.origin || !form.destination || !form.date) {
      setError('Please fill in all fields')
      return
    }
    if (form.origin === form.destination) {
      setError('Origin and destination cannot be the same')
      return
    }
    const today = new Date().toISOString().split('T')[0]
    if (form.date < today) {
      setError('Date cannot be in the past')
      return
    }
    setError('')
    setSearchQuery(form)
    router.push(`/flights?origin=${form.origin}&destination=${form.destination}&date=${form.date}&passengers=${form.passengerCount}`)
  }

  const swap = () => {
    setForm({ ...form, origin: form.destination, destination: form.origin })
    setSwapRotate(prev => prev + 180)
  }

  const handleRouteSelect = (from: string, to: string) => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dateStr = tomorrow.toISOString().split('T')[0]
    setForm({
      origin: from,
      destination: to,
      date: dateStr,
      passengerCount: 1
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '20px 0' }}>
      
      {/* Breadcrumb Indicator */}
      <div className="breadcrumb-container" style={{ width: '100%', marginBottom: '48px' }}>
        <div className="breadcrumb-line">
          <div className="breadcrumb-line-progress" style={{ width: '0%' }} />
        </div>
        <div className="breadcrumb-step active">
          <div className="breadcrumb-dot">1</div>
          <div className="breadcrumb-label">Search</div>
        </div>
        <div className="breadcrumb-step">
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

      {/* Hero text */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ textAlign: 'center', marginBottom: '40px' }}
      >
        <div className="section-badge animate-float">
          <Plane className="h-3.5 w-3.5" />
          <span>Find Your Perfect Flight</span>
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(36px, 5vw, 52px)',
          fontWeight: 900,
          letterSpacing: '-2px',
          lineHeight: 1.15,
          marginBottom: '12px',
        }}>
          Where would you like<br />
          to <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 'inherit' }}>fly?</em>
        </h1>
        <p style={{ color: 'var(--gray)', fontSize: '15px', fontWeight: 300 }}>
          Search luxury routes connecting key cities in India
        </p>
      </motion.div>

      {/* Search card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="glass-card"
        style={{ width: '100%', maxWidth: '820px' }}
      >
        {/* From / To row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: '16px',
          alignItems: 'end',
          marginBottom: '24px',
        }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plane className="h-3.5 w-3.5" style={{ transform: 'rotate(45deg)' }} />
              <span>Origin City</span>
            </label>
            <select
              value={form.origin}
              onChange={e => setForm({ ...form, origin: e.target.value })}
              className="select-field"
              style={{ color: form.origin ? 'var(--white)' : 'var(--gray)' }}
            >
              <option value="">Select origin</option>
              {CITIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Swap button */}
          <motion.button
            onClick={swap}
            animate={{ rotate: swapRotate }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            style={{
              width: '48px',
              height: '48px',
              background: 'rgba(201,168,76,0.08)',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: '50%',
              color: 'var(--gold)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '2px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
            whileHover={{ background: 'rgba(201,168,76,0.15)', scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Swap locations"
          >
            <ArrowRightLeft className="h-5 w-5" />
          </motion.button>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plane className="h-3.5 w-3.5" style={{ transform: 'rotate(135deg)' }} />
              <span>Destination City</span>
            </label>
            <select
              value={form.destination}
              onChange={e => setForm({ ...form, destination: e.target.value })}
              className="select-field"
              style={{ color: form.destination ? 'var(--white)' : 'var(--gray)' }}
            >
              <option value="">Select destination</option>
              {CITIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Date / Passengers row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '32px',
        }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar className="h-3.5 w-3.5" />
              <span>Departure Date</span>
            </label>
            <input
              type="date"
              value={form.date}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => setForm({ ...form, date: e.target.value })}
              className="input-field"
              style={{ colorScheme: 'dark' }}
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users className="h-3.5 w-3.5" />
              <span>Passengers</span>
            </label>
            <select
              value={form.passengerCount}
              onChange={e => setForm({ ...form, passengerCount: Number(e.target.value) })}
              className="select-field"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                <option key={n} value={n}>
                  {n} Passenger{n > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="error-box">
            <AlertTriangle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="btn-gold"
          style={{ width: '100%', padding: '18px' }}
        >
          <span>Search Flights</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </motion.div>

      {/* Suggested Routes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}
      >
        <span style={{ fontSize: '13px', color: 'var(--gray)', fontWeight: 500, letterSpacing: '0.5px' }}>
          Popular routes:
        </span>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {POPULAR_ROUTES.map((route, idx) => (
            <button
              key={idx}
              onClick={() => handleRouteSelect(route.from, route.to)}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1.5px solid var(--border)',
                borderRadius: '100px',
                padding: '10px 20px',
                color: 'var(--white)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--gold)'
                e.currentTarget.style.background = 'rgba(201, 168, 76, 0.05)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'
              }}
            >
              <span>{route.from}</span>
              <ArrowRight className="h-3.5 w-3.5 text-[var(--gold)]" />
              <span>{route.to}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}