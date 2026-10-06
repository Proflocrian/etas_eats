import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: "Eta's Eats",
        short_name: "Eta's Eats",
        description: 'A personal food diary',
        theme_color: '#e5556e',
        background_color: '#fff8f3',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
      // Lets us verify the service worker in `pnpm dev` (not just in a build).
      devOptions: {
        enabled: true,
      },
    }),
  ],
})
