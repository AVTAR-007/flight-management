'use client'

import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.error('Service worker registration failed:', err)
      })
    }

    // Check display mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const isAlreadyInstalled = localStorage.getItem('pwa-installed') === 'true'

    if (isStandalone || isAlreadyInstalled) {
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      const dismissed = sessionStorage.getItem('pwa-prompt-dismissed')
      if (!dismissed) {
        setShowBanner(true)
      }
    }

    window.addEventListener('beforeinstallprompt', handler)

    const appInstalledHandler = () => {
      localStorage.setItem('pwa-installed', 'true')
      setShowBanner(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('appinstalled', appInstalledHandler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('appinstalled', appInstalledHandler)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()

    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      localStorage.setItem('pwa-installed', 'true')
    }
    
    setDeferredPrompt(null)
    setShowBanner(false)
  }

  const handleDismiss = () => {
    sessionStorage.setItem('pwa-prompt-dismissed', 'true')
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-[100] animate-slide-in-right">
      <div className="glass-card p-5 relative border border-gold/30 bg-navy-card/95 shadow-premium flex gap-4 items-start">
        <button 
          onClick={handleDismiss} 
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
          aria-label="Dismiss install prompt"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex items-center justify-center p-3 rounded-xl bg-gold/10 border border-gold/20 text-gold shrink-0">
          <Download className="w-6 h-6" />
        </div>

        <div className="flex-1 pr-6">
          <h4 className="font-semibold text-white text-sm mb-1">
            Install SkyBook Web App
          </h4>
          <p className="text-xs text-gray-400 mb-3 leading-relaxed">
            Install our app on your home screen for quick offline access and smooth transitions.
          </p>
          <button 
            onClick={handleInstallClick}
            className="btn-gold text-xs px-4 py-2 cursor-pointer w-full sm:w-auto"
          >
            Add to Home Screen
          </button>
        </div>
      </div>
    </div>
  )
}
