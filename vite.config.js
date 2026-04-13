import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Esta é a configuração que diz ao Vite para ativar o Tailwind
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})