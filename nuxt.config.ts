// https://nuxt.com/docs/api/configuration/nuxt-config
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  plugins: [{ src: '~/plugins/socket.io.client.js', mode: 'client' }],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  vite: {
    plugins: [
      nodePolyfills({
        include: ['buffer', 'util', 'stream', 'crypto'], // Add polyfills you need
        globals: {
          process: false, // Fixes potential global `process` polyfill issues
        },
      }),
    ],
  }
})
