'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { useUserStore } from '@/store/userStore'
import { KeyRound, Mail, AlertTriangle, HelpCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { setSession } = useUserStore()

  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError('')

    const supabase = createSupabaseBrowserClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    if (data.session) {
      setSession(data.session)
    }

    router.push('/search')
    router.refresh()
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '75vh', padding: '20px 0' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card"
        style={{ width: '100%', maxWidth: '440px' }}
      >
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: 700, color: 'var(--white)', marginBottom: '8px' }}>
          Welcome Back
        </h1>
        <p style={{ color: 'var(--gray)', fontSize: '14px', marginBottom: '32px', fontWeight: 300 }}>
          Sign in to access your premium flight options
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail className="h-3.5 w-3.5" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              placeholder="test@skybook.dev"
              className="input-field"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <KeyRound className="h-3.5 w-3.5" />
              <span>Password</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="input-field"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
        </div>

        {error && (
          <div className="error-box" style={{ marginTop: '24px', marginBottom: 0 }}>
            <AlertTriangle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="btn-gold"
          style={{ width: '100%', marginTop: '32px' }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        {/* Demo Account Banner */}
        <div
          style={{
            marginTop: '24px',
            padding: '16px',
            background: 'rgba(201, 168, 76, 0.04)',
            border: '1px solid rgba(201, 168, 76, 0.12)',
            borderRadius: '16px',
            fontSize: '13px',
            color: 'var(--gray)',
            display: 'flex',
            alignItems: 'start',
            gap: '10px',
            lineHeight: 1.5,
          }}
        >
          <HelpCircle className="h-5 w-5 text-[var(--gold)]" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <span style={{ fontWeight: 600, color: 'var(--white)' }}>Demonstration Mode</span>
            <br />
            Use: <span style={{ color: 'var(--gold)', fontWeight: 600 }}>test@skybook.dev</span> with password <span style={{ color: 'var(--gold)', fontWeight: 600 }}>Test@12345</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}