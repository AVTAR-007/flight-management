'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Plane, Search, Briefcase, LogOut, LogIn, Menu, X } from 'lucide-react'

interface NavbarProps {
  user: any // Pass user from layout
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '/search', label: 'Search Flights', icon: Search },
    { href: '/bookings', label: 'My Bookings', icon: Briefcase },
  ]

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)

  return (
    <nav className="skybook-nav">
      <div className="skybook-nav-inner">
        <Link href="/" className="skybook-logo">
          <Plane className="h-6 w-6 text-[var(--gold)] animate-float" style={{ transformOrigin: 'center' }} />
          <span>Sky</span>Book <span style={{ color: 'var(--gold)' }}>✦</span>
        </Link>

        {/* Desktop Nav */}
        <div className="skybook-nav-links">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${isActive ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            )
          })}

          {user ? (
            <form action="/api/logout" method="POST" style={{ margin: 0 }}>
              <button type="submit" className="btn-logout" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </form>
          ) : (
            <Link href="/login" className="btn-signin" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <LogIn className="h-4 w-4" />
              <span>Sign In</span>
            </Link>
          )}
        </div>

        {/* Mobile Nav Toggle */}
        <button
          className="mobile-nav-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: 'rgba(10, 15, 46, 0.95)',
              borderBottom: '1px solid var(--border)',
              backdropFilter: 'blur(20px)',
              overflow: 'hidden',
              position: 'absolute',
              width: '100%',
              left: 0,
              zIndex: 49,
            }}
          >
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      color: isActive ? 'var(--white)' : 'var(--gray)',
                      textDecoration: 'none',
                      fontSize: '16px',
                      fontWeight: isActive ? 600 : 500,
                      padding: '8px 0',
                    }}
                  >
                    <Icon className="h-5 w-5 text-[var(--gold)]" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              <div style={{ height: '1px', background: 'var(--border)', margin: '8px 0' }} />

              {user ? (
                <form action="/api/logout" method="POST" style={{ width: '100%' }}>
                  <button
                    type="submit"
                    className="btn-logout"
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '12px 24px',
                    }}
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </form>
              ) : (
                <Link
                  href="/login"
                  className="btn-signin"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                  }}
                >
                  <LogIn className="h-5 w-5" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
