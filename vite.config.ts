import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(), 
    react(), 
    VitePWA({
    registerType: 'prompt',
    injectRegister: false,
    

    pwaAssets: {
      disabled: false,
      config: true,
    },

    manifest: {
      name: 'DriveParts - Sistema PWA',
      short_name: 'DriveParts',
      description: 'Front-end referente ao sistema PWA do projeto DriveParts',
      theme_color: '#F3F3F3',
    },

    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
    },

    devOptions: {
      enabled: true,
      navigateFallback: 'index.html',
      suppressWarnings: true,
      type: 'module',
    },
  })],
})