import { mockGetJob, mockSubmitAnalysis } from './mock/client'
import { realGetJob, realSubmitAnalysis } from './realClient'
import type { AnalyzeRequest, AnalyzeResponse, JobResponse } from './types'

/**
 * mock과 실 API를 가르는 한 곳이다. 화면은 어느 쪽이 붙어 있는지 모른다.
 *
 * 모드가 아니라 환경변수로 가른다. Vercel은 Preview도 `vite build`를 그대로
 * 돌려서 `import.meta.env.MODE`가 Production과 똑같이 `production`이기
 * 때문이다. `VITE_VERCEL_ENV`는 환경변수를 잘못 넣어도 Production에는 mock이
 * 켜지지 않게 하는 두 번째 잠금이다.
 *
 * 두 값 모두 빌드할 때 문자열 리터럴로 치환되므로, Production 빌드에서는
 * 이 조건이 상수 거짓이 되어 mock 쪽 코드가 번들에서 빠진다.
 */
export const USE_MOCK =
  import.meta.env.VITE_USE_MOCK === 'true' && import.meta.env.VITE_VERCEL_ENV !== 'production'

export function submitAnalysis(request: AnalyzeRequest): Promise<AnalyzeResponse> {
  return USE_MOCK ? mockSubmitAnalysis(request) : realSubmitAnalysis(request)
}

export function getJob(jobId: string, signal?: AbortSignal): Promise<JobResponse> {
  return USE_MOCK ? mockGetJob(jobId) : realGetJob(jobId, signal)
}
