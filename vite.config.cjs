const { defineConfig } = require('vite')
const react = require('@vitejs/plugin-react')
const prerender = require('vite-plugin-prerender')
const path = require('path')
const routes = require('./scripts/routes.json')

// https://vite.dev/config/
module.exports = defineConfig({
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
