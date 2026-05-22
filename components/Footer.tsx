import Link from 'next/link'
import { Plane, Globe, Mail, Phone, ShieldCheck } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="skybook-footer">
      <div className="skybook-footer-inner">
        <div className="skybook-footer-grid">
          <div className="footer-brand">
            <h3 className="skybook-logo" style={{ marginBottom: '16px' }}>
              <Plane className="h-6 w-6 text-[var(--gold)]" />
              <span>Sky</span>Book <span style={{ color: 'var(--gold)' }}>✦</span>
            </h3>
            <p>
              Experience the art of travel. Book premium flights across major destinations in India with unparalleled ease and luxury.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '20px', color: 'var(--gold)', fontSize: '13px', fontWeight: 600 }}>
              <ShieldCheck className="h-5 w-5" />
              <span>100% Secured Payments</span>
            </div>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <Link href="/search">Search Flights</Link>
              </li>
              <li>
                <Link href="/bookings">My Bookings</Link>
              </li>
              <li>
                <Link href="/login">Agent Login</Link>
              </li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Contact Us</h4>
            <ul style={{ gap: '16px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--gray)', fontSize: '14px' }}>
                <Phone className="h-4 w-4 text-[var(--gold)]" />
                <span>+91 1800 233 4455</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--gray)', fontSize: '14px' }}>
                <Mail className="h-4 w-4 text-[var(--gold)]" />
                <span>support@skybook.luxury</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--gray)', fontSize: '14px' }}>
                <Globe className="h-4 w-4 text-[var(--gold)]" />
                <span>Delhi & Mumbai, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} SkyBook Luxury Aviation. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="#" style={{ color: 'var(--gray)', textDecoration: 'none', transition: 'color 0.3s' }}>Terms of Service</a>
            <a href="#" style={{ color: 'var(--gray)', textDecoration: 'none', transition: 'color 0.3s' }}>Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
