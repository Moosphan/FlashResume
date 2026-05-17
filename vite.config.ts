/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  base: '/FlashResume/',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        zh: resolve(__dirname, 'zh/index.html'),
        official: resolve(__dirname, 'official/index.html'),
        officialFeatures: resolve(__dirname, 'official/features/index.html'),
        officialTemplates: resolve(__dirname, 'official/templates/index.html'),
        officialFaq: resolve(__dirname, 'official/faq/index.html'),
        officialZh: resolve(__dirname, 'official/zh/index.html'),
        officialZhFeatures: resolve(__dirname, 'official/zh/features/index.html'),
        officialZhTemplates: resolve(__dirname, 'official/zh/templates/index.html'),
        officialZhFaq: resolve(__dirname, 'official/zh/faq/index.html'),
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
})
