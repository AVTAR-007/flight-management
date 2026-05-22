'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plane, Search, Briefcase, Calendar, ShieldCheck, Ticket, RefreshCw } from 'lucide-react'

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  }

  const features = [
    {
      icon: Search,
      title: 'Real-time Search',
      desc: 'Instantly find and book direct or connecting flights with transparent pricing.',
    },
    {
      icon: Ticket,
      title: 'Interactive Seat Selection',
      desc: 'Choose your preferred seat from our live interactive 3D cabin layout maps.',
    },
    {
      icon: RefreshCw,
      title: 'Flexible Bookings',
      desc: 'Reschedule your flights or cancel instantly with seamless automated refunds.',
    },
  ]

  const stats = [
    { num: '8+', label: 'Premium Routes' },
    { num: '4', label: 'Key Cities' },
    { num: '100%', label: 'Secure Checkout' },
  ]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 0',
      }}
    >
      {/* Badge Chip */}
      <motion.div variants={itemVariants} className="section-badge animate-float">
        <Plane className="h-3.5 w-3.5" />
        <span>Premium Flight Experience</span>
      </motion.div>

      {/* Hero Title */}
      <motion.h1
        variants={itemVariants}
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(44px, 7vw, 76px)',
          fontWeight: 900,
          lineHeight: 1.1,
          letterSpacing: '-2px',
          marginBottom: '24px',
          textAlign: 'center',
          maxWidth: '800px',
        }}
      >
        Travel the world<br />
        with <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 'inherit' }}>elegance</em>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        variants={itemVariants}
        style={{
          color: 'var(--gray)',
          fontSize: 'clamp(16px, 2.5vw, 19px)',
          lineHeight: 1.7,
          marginBottom: '40px',
          maxWidth: '520px',
          textAlign: 'center',
          fontWeight: 300,
        }}
      >
        Search, book, and manage your flights with elegance. SkyBook offers a premium experience tailored for the modern traveller.
      </motion.p>

      {/* Call to Actions */}
      <motion.div
        variants={itemVariants}
        style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '80px',
        }}
      >
        <Link href="/search" className="btn-gold">
          <span>Search Flights</span>
          <Plane className="h-4 w-4" style={{ transform: 'rotate(90deg)' }} />
        </Link>
        <Link href="/bookings" className="btn-outline">
          <Briefcase className="h-4 w-4 text-[var(--gold)]" />
          <span>My Bookings</span>
        </Link>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        variants={itemVariants}
        style={{
          width: '100%',
          maxWidth: '800px',
          borderTop: '1px solid var(--border)',
          paddingTop: '60px',
          marginBottom: '80px',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' }}>
          {stats.map((s, idx) => (
            <div key={idx} className="stat-card">
              <div className="stat-card-value">{s.num}</div>
              <div className="stat-card-label">{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        variants={itemVariants}
        style={{
          width: '100%',
          maxWidth: '1000px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginTop: '20px',
        }}
      >
        {features.map((feat, idx) => {
          const Icon = feat.icon
          return (
            <div key={idx} className="glass-card glass-card-hover" style={{ padding: '32px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(201, 168, 76, 0.08)',
                  border: '1px solid rgba(201, 168, 76, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  color: 'var(--gold)',
                }}
              >
                <Icon className="h-6 w-6" />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px', fontFamily: "'Playfair Display', serif" }}>
                {feat.title}
              </h3>
              <p style={{ color: 'var(--gray)', fontSize: '14px', lineHeight: 1.6, fontWeight: 300 }}>
                {feat.desc}
              </p>
            </div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}