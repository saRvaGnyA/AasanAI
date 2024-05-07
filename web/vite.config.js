import { defineConfig } from 'vite'
import postcss from './postcss.config.js'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': process.env
  },
  server: {
    port: 3000
  },

  css: {
    postcss,
  },
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: /^~.+/,
        replacement: (val) => {
          return val.replace(/^~/, "");
        },
      },
      {
        find: 'fs',
        replacement: 'memfs',
      },
    ],
  },

  build: {
    chunkSizeWarningLimit: 3200,
    commonjsOptions: {

      transformMixedEsModules: true,
    }
  }
})
