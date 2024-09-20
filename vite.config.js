import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  server: { port: 3000 },
  plugins: [
    legacy({ targets: ['defaults', 'not IE 11'] }),
    VitePWA({
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Muslim Calendar',
        short_name: 'Muslim Calendar',
        description: 'Welcome to Muslim Calendar. Display Islamic Calendar Information.',
        theme_color: '#22c55e',
        orientation: 'portrait',
        icons: [
          {
            src: 'favicon.ico',
            sizes: '144x144 64x64 32x32 24x24 16x16',
            type: 'image/x-icon',
            purpose: 'any maskable'
          },
          {
            src: 'mc-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'mc-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        display: 'standalone'
      },
      registerType: 'autoUpdate'
    })
  ]
})