import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vanillaExtractPlugin(), react()],
  define: {
    // Vercel이 주입하는 VERCEL_ENV는 VITE_ 접두사가 없어 클라이언트로 전달되지 않는다.
    // Production 배포에서 mock이 절대 켜지지 않게 하는 잠금으로 쓴다.
    'import.meta.env.VITE_VERCEL_ENV': JSON.stringify(process.env.VERCEL_ENV ?? 'development'),
  },
})
