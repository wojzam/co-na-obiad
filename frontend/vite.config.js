import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        watch: {
            usePolling: true,
        },
        host: true,
        strictPort: true,
        port: 3000,
        proxy: {
            '/api': {
              target: process.env.API_URL,
              changeOrigin: true,
              secure: false,
              rewrite: (path) => path.replace(/^\/api/, '')
            }
          }
    }
})
