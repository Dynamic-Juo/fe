/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 분석 API 기본 주소. 경로와 마지막 슬래시는 포함하지 않는다. */
  readonly VITE_API_BASE_URL: string
  /** mock 사용 여부. Production 배포에서는 항상 false다. */
  readonly VITE_USE_MOCK: string
  /** Vercel 배포 환경. vite.config.ts에서 주입한다. */
  readonly VITE_VERCEL_ENV: 'production' | 'preview' | 'development'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
