/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Turnstile 공개 사이트 키. 위젯을 그리는 데 쓰며 번들에 들어가도 되는 값이다. */
  readonly VITE_TURNSTILE_SITE_KEY: string
  /** mock 사용 여부. Production 배포에서는 항상 false다. */
  readonly VITE_USE_MOCK: string
  /** 피드백과 오분석 신고 창구 주소. 정해지기 전에는 비워 둔다. */
  readonly VITE_FEEDBACK_URL?: string
  /** Vercel 배포 환경. vite.config.ts에서 주입한다. */
  readonly VITE_VERCEL_ENV: 'production' | 'preview' | 'development'
}

/** iOS Safari가 홈 화면 실행 여부를 여기에 둔다. 표준이 아니다. */
interface Navigator {
  readonly standalone?: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
