import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SkyBook — Premium Flight Management',
    short_name: 'SkyBook',
    description: 'Search, book and manage luxury flights with elegance',
    start_url: '/',
    display: 'standalone',
    background_color: '#060a22',
    theme_color: '#0a0f2e',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  }
}
