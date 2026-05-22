'use client'

import Link from 'next/link'
import { Flight } from '@/types'
import { Plane, Clock } from 'lucide-react'

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

function formatDuration(departs: string, arrives: string) {
  const diff = new Date(arrives).getTime() - new Date(departs).getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return `${hours}h ${mins}m`
}

interface FlightCardProps {
  flight: Flight
}

export default function FlightCard({ flight }: FlightCardProps) {
  return (
    <div className="glass-card glass-card-hover" style={{ padding: '24px 28px' }}>
      {/* Flight Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(201, 168, 76, 0.06)', border: '1px solid rgba(201, 168, 76, 0.2)', color: 'var(--gold)' }}>
            <Plane className="h-5 w-5" style={{ transform: 'rotate(90deg)' }} />
          </div>
          <div>
            <p style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '2px' }}>
              {flight.flight_no}
            </p>
            <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--white)' }}>
              {flight.aircraft_type}
            </p>
          </div>
        </div>
        <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock className="h-4 w-4 text-[var(--gray)]" />
          <div>
            <p style={{ fontSize: '11px', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Duration</p>
            <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--gold)' }}>
              {formatDuration(flight.departs_at, flight.arrives_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Flight Timeline */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr 1.2fr', gap: '16px', alignItems: 'center', marginBottom: '24px', padding: '12px 0' }}>
        {/* Departure */}
        <div>
          <p style={{ fontSize: '10px', color: 'var(--gray)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
            Departs
          </p>
          <p style={{ fontSize: '22px', fontWeight: 700, color: 'var(--white)', letterSpacing: '-0.5px', marginBottom: '2px' }}>
            {formatTime(flight.departs_at)}
          </p>
          <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--gold)' }}>
            {flight.origin}
          </p>
        </div>

        {/* Timeline Path SVG */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '0 10px' }}>
          <span style={{ fontSize: '10px', color: 'var(--gray)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '6px' }}>
            Non-stop
          </span>
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', position: 'relative' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--gold)', border: '1px solid var(--navy-card)', zIndex: 2 }} />
            <div style={{ flex: 1, height: '1.5px', background: 'repeating-linear-gradient(90deg, var(--border) 0px, var(--border) 4px, transparent 4px, transparent 8px)' }} />
            <Plane className="h-3.5 w-3.5 text-[var(--gold)]" style={{ transform: 'rotate(90deg)', margin: '0 4px', zIndex: 2 }} />
            <div style={{ flex: 1, height: '1.5px', background: 'repeating-linear-gradient(90deg, var(--border) 0px, var(--border) 4px, transparent 4px, transparent 8px)' }} />
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--gold)', border: '1px solid var(--navy-card)', zIndex: 2 }} />
          </div>
        </div>

        {/* Arrival */}
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '10px', color: 'var(--gray)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
            Arrives
          </p>
          <p style={{ fontSize: '22px', fontWeight: 700, color: 'var(--white)', letterSpacing: '-0.5px', marginBottom: '2px' }}>
            {formatTime(flight.arrives_at)}
          </p>
          <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--gold)' }}>
            {flight.destination}
          </p>
        </div>
      </div>

      {/* Classes and Pricing */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
        {[
          { label: 'Economy', fee: 0, badgeClass: 'badge-economy' },
          { label: 'Business', fee: 2000, badgeClass: 'badge-business' },
          { label: 'First', fee: 5000, badgeClass: 'badge-first' },
        ].map((cls) => (
          <Link
            key={cls.label}
            href={`/seats?flightId=${flight.id}&class=${cls.label.toLowerCase()}&basePrice=${flight.base_price}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              padding: '14px 16px',
              border: '1px solid var(--border)',
              background: 'rgba(255,255,255,0.01)',
              borderRadius: '16px',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="flight-class-card"
          >
            <span className={`badge ${cls.badgeClass}`} style={{ width: 'fit-content', padding: '3px 8px', fontSize: '9px' }}>
              {cls.label}
            </span>
            <span style={{ fontSize: '17px', fontWeight: 700, color: 'var(--white)', marginTop: '4px' }} className="price-text">
              ₹{(flight.base_price + cls.fee).toLocaleString('en-IN')}
            </span>
          </Link>
        ))}
      </div>

      <style jsx global>{`
        .flight-class-card:hover {
          background: rgba(201,168,76,0.05) !important;
          border-color: rgba(201,168,76,0.3) !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(201,168,76,0.05);
        }
        .flight-class-card:hover .price-text {
          color: var(--gold) !important;
        }
      `}</style>
    </div>
  )
}
