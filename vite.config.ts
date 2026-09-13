import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vanillaExtractPlugin(),
    react(),
    /**
     * 설치할 수 있게만 만든다. 오프라인 캐시와 별도 업데이트 처리는 M-05에서
     * 제외했다. 서비스 워커는 등록만 하고 아무것도 미리 받아 두지 않아,
     * 새로고침하면 늘 최신 배포본을 불러온다.
     */
    VitePWA({
      registerType: 'autoUpdate',
      // 아무것도 미리 받아 두지 않는다. 탐색을 캐시로 돌리지도 않는다.
      workbox: { globPatterns: [], navigateFallback: null },
      manifest: {
        name: 'Conan AI',
        short_name: 'Conan AI',
        description: 'YouTube Shorts의 조작 가능성과 주장의 사실성을 따로 확인합니다.',
        lang: 'ko',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  define: {
    // Vercel이 주입하는 VERCEL_ENV는 VITE_ 접두사가 없어 클라이언트로 전달되지 않는다.
    // Production 배포에서 mock이 절대 켜지지 않게 하는 잠금으로 쓴다.
    'import.meta.env.VITE_VERCEL_ENV': JSON.stringify(process.env.VERCEL_ENV ?? 'development'),
  },
})
