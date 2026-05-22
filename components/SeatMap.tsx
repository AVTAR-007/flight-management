'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { useFlightStore } from '@/store/flightStore'
import { Seat, Flight } from '@/types'
import { motion } from 'framer-motion'
import { Crown, Briefcase, Plane, ArrowRight } from 'lucide-react'

interface SeatMapProps {
  seats: Seat[]
  flightId: string
  selectedClass: string
  basePrice: number
  flight: Flight | null
}

export default function SeatMap({ seats: initialSeats, flightId, basePrice, flight }: SeatMapProps) {
  const router = useRouter()
  const { setSelectedSeat, setSelectedFlight } = useFlightStore()
  const [seats, setSeats] = useState<Seat[]>(initialSeats)
  const [activeSeat, setActiveSeat] = useState<Seat | null>(null)

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    const channel = supabase
      .channel('seats-realtime')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'seats',
          filter: `flight_id=eq.${flightId}`,
        },
        (payload) => {
          setSeats((prev) =>
            prev.map((s) => (s.id === payload.new.id ? { ...s, ...payload.new as Seat } : s))
          )
          if (activeSeat?.id === payload.new.id && !payload.new.is_available) {
            setActiveSeat(null)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [flightId, activeSeat])

  const handleSeatClick = (seat: Seat) => {
    if (!seat.is_available) return
    setActiveSeat(seat)
  }

  const handleConfirm = () => {
    if (!activeSeat || !flight) return
    setSelectedSeat(activeSeat)
    setSelectedFlight(flight)
    router.push(`/book?flightId=${flightId}&seatId=${activeSeat.id}&totalPrice=${basePrice + activeSeat.extra_fee}`)
  }

  const classes = ['first', 'business', 'economy']
  const cols = ['A', 'B', 'C', 'D', 'E', 'F']

  // Count total rows for rendering windows dynamically
  const uniqueRows = [...new Set(seats.map((s) => s.seat_number.slice(0, -1)))]
  const totalRowsCount = uniqueRows.length

  const renderClassIcon = (cls: string) => {
    switch (cls) {
      case 'first':
        return <Crown className="h-3.5 w-3.5" />
      case 'business':
        return <Briefcase className="h-3.5 w-3.5" />
      case 'economy':
      default:
        return <Plane className="h-3.5 w-3.5" />
    }
  }

  return (
    <div className="seatmap-layout">
      {/* Seat grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card cabin-card"
      >
        {/* Legend */}
        <div className="legend-container">
          <div className="legend-item">
            <div className="legend-color available" />
            <span>Available</span>
          </div>
          <div className="legend-item">
            <div className="legend-color selected" />
            <span>Selected</span>
          </div>
          <div className="legend-item">
            <div className="legend-color occupied" />
            <span>Occupied</span>
          </div>
        </div>

        {/* Airplane Fuselage Wrapper */}
        <div className="cabin-container">
          <div className="airplane-fuselage">
            {/* Cockpit / Nose */}
            <div className="cockpit-windows">
              <div className="cockpit-window" />
              <div className="cockpit-window" />
            </div>

            {/* Side Cabin Windows */}
            <div className="cabin-wall-left">
              {Array.from({ length: Math.max(totalRowsCount, 4) }).map((_, i) => (
                <div key={i} className="cabin-window" />
              ))}
            </div>
            <div className="cabin-wall-right">
              {Array.from({ length: Math.max(totalRowsCount, 4) }).map((_, i) => (
                <div key={i} className="cabin-window" />
              ))}
            </div>

            {/* Column headers */}
            <div className="column-headers">
              {['A', 'B', 'C', '', 'D', 'E', 'F'].map((col, i) => (
                <div key={i} className={`column-header ${col === '' ? 'aisle' : ''}`}>
                  {col}
                </div>
              ))}
            </div>

            {/* Seats by class */}
            {classes.map((cls) => {
              const classSeats = seats.filter((s) => s.class === cls)
              if (classSeats.length === 0) return null

              const rows = [...new Set(classSeats.map((s) => s.seat_number.slice(0, -1)))].sort(
                (a, b) => Number(a) - Number(b)
              )

              return (
                <div key={cls} className="class-section">
                  <div className="class-section-header">
                    {renderClassIcon(cls)}
                    <span>{cls.charAt(0).toUpperCase() + cls.slice(1)} Class</span>
                  </div>

                  {rows.map((row) => {
                    const rowSeats = classSeats.filter((s) => s.seat_number.slice(0, -1) === row)

                    return (
                      <div key={row} className="seat-row">
                        <div className="row-label">{row}</div>
                        {cols.map((col, idx) => {
                          const seat = rowSeats.find((s) => s.seat_number === `${row}${col}`)
                          const isSelected = activeSeat?.id === seat?.id

                          return (
                            <div key={col} className={idx === 3 ? 'aisle-space' : ''}>
                              {seat ? (
                                <div className="seat-container">
                                  <button
                                    disabled={!seat.is_available}
                                    onClick={() => handleSeatClick(seat)}
                                    className={`seat-button ${
                                      isSelected
                                        ? 'seat-selected'
                                        : seat.is_available
                                        ? 'seat-available'
                                        : 'seat-occupied'
                                    }`}
                                  >
                                    {seat.seat_number}
                                  </button>
                                  {seat.is_available && (
                                    <div className="seat-tooltip">
                                      {seat.class.charAt(0).toUpperCase() + seat.class.slice(1)} · {seat.extra_fee > 0 ? `+₹${seat.extra_fee}` : 'Choice Seat'}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="seat-placeholder" />
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* Summary panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card summary-panel"
      >
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 700, color: 'var(--white)', marginBottom: '24px' }}>
          Booking Summary
        </h2>
        {flight && (
          <div style={{ fontSize: '14px', color: 'var(--gray)', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 500, color: 'var(--gray)' }}>Flight</span>
              <span style={{ color: 'var(--white)', fontWeight: 600 }}>{flight.flight_no}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 500, color: 'var(--gray)' }}>Route</span>
              <span style={{ color: 'var(--white)', fontWeight: 600 }}>{flight.origin} → {flight.destination}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 500, color: 'var(--gray)' }}>Base Price</span>
              <span style={{ color: 'var(--gold)', fontWeight: 600 }}>₹{basePrice.toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}

        {activeSeat ? (
          <div className="selected-seat-card">
            <p style={{ fontWeight: 700, color: 'var(--gold)', fontSize: '16px', marginBottom: '6px' }}>
              Seat {activeSeat.seat_number}
            </p>
            <p style={{ color: 'var(--gray)', fontSize: '13px', marginBottom: '6px', textTransform: 'capitalize' }}>
              {activeSeat.class} Class Cabin
            </p>
            {activeSeat.extra_fee > 0 && (
              <p style={{ color: 'var(--gray)', fontSize: '13px', marginBottom: '14px' }}>
                Choice Seat Fee: +₹{activeSeat.extra_fee.toLocaleString('en-IN')}
              </p>
            )}
            <div style={{ paddingTop: '14px', borderTop: '1px solid rgba(201, 168, 76, 0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, color: 'var(--white)', fontSize: '14px' }}>Total Price</span>
              <span className="price-tag">
                ₹{(basePrice + activeSeat.extra_fee).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        ) : (
          <div className="no-seat-select">
            <p>Please select a seat from the cabin layout to proceed.</p>
          </div>
        )}

        <button
          onClick={handleConfirm}
          disabled={!activeSeat}
          className="btn-gold"
          style={{ width: '100%' }}
        >
          <span>Continue to Booking</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </motion.div>

      <style jsx>{`
        .seatmap-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 28px;
          align-items: start;
        }
        .cabin-card {
          padding: 32px;
          overflow-x: auto;
        }
        .legend-container {
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
          margin-bottom: 32px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border);
          font-size: 13px;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .legend-color {
          width: 18px;
          height: 18px;
          border-radius: 4px;
        }
        .legend-color.available {
          background: rgba(74, 222, 128, 0.06);
          border: 1.5px solid rgba(74, 222, 128, 0.3);
        }
        .legend-color.selected {
          background: linear-gradient(135deg, var(--gold), var(--gold-light));
          border: 1.5px solid var(--gold);
        }
        .legend-color.occupied {
          background: rgba(148, 163, 184, 0.04);
          border: 1.5px solid rgba(148, 163, 184, 0.15);
        }
        .cabin-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 40px auto;
          max-width: fit-content;
        }
        .airplane-fuselage {
          background: rgba(10, 15, 46, 0.4);
          border-left: 6px solid var(--border);
          border-right: 6px solid var(--border);
          border-radius: 60px 60px 20px 20px;
          position: relative;
          padding: 50px 48px;
          box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.6), 0 10px 30px rgba(0, 0, 0, 0.4);
        }
        .cockpit-windows {
          position: absolute;
          top: -24px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          z-index: 2;
        }
        .cockpit-window {
          width: 28px;
          height: 14px;
          background: rgba(201, 168, 76, 0.1);
          border: 1.5px solid rgba(201, 168, 76, 0.4);
          box-shadow: 0 0 10px rgba(201, 168, 76, 0.1);
        }
        .cockpit-window:first-child {
          border-radius: 14px 4px 0 0;
          transform: skewX(-15deg);
        }
        .cockpit-window:last-child {
          border-radius: 4px 14px 0 0;
          transform: skewX(15deg);
        }
        .cabin-wall-left, .cabin-wall-right {
          position: absolute;
          top: 60px;
          bottom: 40px;
          width: 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          pointer-events: none;
        }
        .cabin-wall-left {
          left: 12px;
        }
        .cabin-wall-right {
          right: 12px;
        }
        .cabin-window {
          width: 10px;
          height: 14px;
          border-radius: 5px;
          background: rgba(6, 10, 34, 0.85);
          border: 1px solid var(--border);
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.5);
        }
        .column-headers {
          display: flex;
          gap: 6px;
          margin-bottom: 20px;
          margin-left: 44px;
        }
        .column-header {
          width: 38px;
          text-align: center;
          font-size: 12px;
          font-weight: 700;
          color: var(--gray);
          letter-spacing: 0.5px;
        }
        .column-header.aisle {
          width: 20px;
        }
        .class-section {
          margin-bottom: 32px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .class-section-header {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
          margin-bottom: 20px;
          border: 1px solid rgba(201, 168, 76, 0.25);
          background: rgba(201, 168, 76, 0.06);
          color: var(--gold);
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .seat-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
        }
        .row-label {
          width: 32px;
          font-size: 12px;
          color: var(--gray);
          text-align: right;
          padding-right: 12px;
          font-weight: 600;
        }
        .seat-placeholder {
          width: 38px;
          height: 38px;
        }
        .aisle-space {
          margin-left: 20px;
        }
        .seat-container {
          position: relative;
        }
        .seat-button {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .seat-available {
          background: rgba(74, 222, 128, 0.06) !important;
          border: 1.5px solid rgba(74, 222, 128, 0.3) !important;
          color: var(--green) !important;
          cursor: pointer;
        }
        .seat-available:hover {
          background: rgba(74, 222, 128, 0.15) !important;
          border-color: var(--green) !important;
          box-shadow: 0 0 12px rgba(74, 222, 128, 0.2);
          transform: translateY(-1px);
        }
        .seat-selected {
          background: linear-gradient(135deg, var(--gold), var(--gold-light)) !important;
          border: 1.5px solid var(--gold) !important;
          color: var(--navy) !important;
          cursor: pointer;
          transform: scale(1.08);
          box-shadow: var(--shadow-gold), 0 0 15px rgba(201, 168, 76, 0.4);
        }
        .seat-occupied {
          background: rgba(148, 163, 184, 0.04) !important;
          border: 1.5px solid rgba(148, 163, 184, 0.15) !important;
          color: rgba(148, 163, 184, 0.3) !important;
          cursor: not-allowed;
        }
        .seat-tooltip {
          position: absolute;
          bottom: 125%;
          left: 50%;
          transform: translateX(-50%) translateY(8px);
          background: rgba(10, 15, 46, 0.95);
          border: 1px solid var(--border);
          color: var(--white);
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 500;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          z-index: 10;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: var(--shadow-premium);
          backdrop-filter: blur(8px);
        }
        .seat-container:hover .seat-tooltip {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
        .summary-panel {
          position: sticky;
          top: 96px;
          height: fit-content;
        }
        .selected-seat-card {
          border: 1px solid rgba(201, 168, 76, 0.25);
          background: rgba(201, 168, 76, 0.05);
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 24px;
        }
        .no-seat-select {
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.01);
          border-radius: 16px;
          padding: 20px;
          color: var(--gray);
          font-size: 14px;
          text-align: center;
          margin-bottom: 24px;
          font-weight: 300;
          line-height: 1.5;
        }
        .price-tag {
          font-size: 20px;
          font-weight: 800;
          background: linear-gradient(135deg, var(--gold), var(--gold-light));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        @media (max-width: 900px) {
          .seatmap-layout {
            grid-template-columns: 1fr;
          }
          .summary-panel {
            position: relative;
            top: 0;
          }
        }
      `}</style>
    </div>
  )
}