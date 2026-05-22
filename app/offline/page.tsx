'use client'

import { WifiOff, RefreshCw, Briefcase } from 'lucide-react'
import Link from 'next/link'

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 animate-fade-in-up">
      <div className="relative mb-6">
        <div className="absolute -inset-1 rounded-full bg-gold/30 opacity-30 blur-lg"></div>
        <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-navy-card border border-gold/30 text-gold">
          <WifiOff className="w-12 h-12" />
        </div>
      </div>
      
      <h1 className="text-3xl font-bold font-display mb-2 text-white">
        Connection Lost
      </h1>
      <p className="text-gray-400 max-w-md mb-8">
        It seems you are currently offline. Check your internet connection and try again, or view your pre-loaded bookings.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          onClick={handleRetry}
          className="btn-gold flex items-center justify-center gap-2 px-6 py-3 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Connection
        </button>
        <Link 
          href="/bookings" 
          className="btn-outline flex items-center justify-center gap-2 px-6 py-3 border border-border hover:border-gold/50 text-white rounded-full transition-all"
        >
          <Briefcase className="w-4 h-4 text-gold" />
          View Bookings
        </Link>
      </div>
    </div>
  )
}
