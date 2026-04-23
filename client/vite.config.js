// vite.config.js
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue(), vueDevTools()],
  
    base:'/web/',
    
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    
    server: {
      port: 5173,
      proxy: env.VITE_API_URL ? {
        '/api': {
          target: env.VITE_API_URL.replace('/api', ''),
          changeOrigin: true,
          secure: false,
        }
      } : undefined
    },
    
    define: {
      __APP_ENV__: JSON.stringify(env.VITE_API_URL)
    }
  }
})