import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: './',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 8192,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('maplibre-gl')) return 'maplibre';
          if (id.includes('node_modules/react') || id.includes('react-router-dom')) return 'react-vendor';
        },
      },
    },
  },
})
