import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.jpg', 'vite.svg'],
      manifest: {
        name: 'Generador de Presupuestos',
        short_name: 'Presupuestos',
        description: 'Aplicación para generar presupuestos de puertas y ventanas',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'logo.jpg',
            sizes: '192x192',
            type: 'image/jpeg'
          },
          {
            src: 'logo.jpg',
            sizes: '512x512',
            type: 'image/jpeg'
          }
        ]
      }
    })
  ],
  base: '/CATALOGO-APP/',
})
