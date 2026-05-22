import type { Metadata, Viewport } from 'next'
import './globals.css'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import InstallPrompt from '@/components/InstallPrompt'

export const metadata: Metadata = {
  title: 'SkyBook — Premium Flight Management',
  description: 'Search, book and manage flights with elegance',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SkyBook',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0f2e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body>
        <div className="bg-grid" />
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        
        <Navbar user={user} />
        
        <main className="skybook-main">
          {children}
        </main>

        <Footer />
        <InstallPrompt />
      </body>
    </html>
  )
}