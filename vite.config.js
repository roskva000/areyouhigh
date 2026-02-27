import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import prerender from 'vite-plugin-prerender'
import path from 'path'
import routes from './scripts/routes.json'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    prerender({
      // REQUIRED - The path to the vite-outputted static site to prerender.
      staticDir: path.join(__dirname, 'dist'),
      // REQUIRED - List of routes to prerender.
      routes: routes,
    })
  ],
})
