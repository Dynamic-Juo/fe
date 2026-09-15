import { mockGetJob, mockSubmitAnalysis } from './mock/client'
import { realGetJob, realSubmitAnalysis } from './realClient'
import { requestTurnstileToken } from './turnstile'
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

/** 접수에 필요한 값이다. 봇 확인 토큰은 여기서 받아 붙이므로 화면이 넘기지 않는다. */
export type SubmitRequest = Omit<AnalyzeRequest, 'turnstile_token'>

/**
 * 봇 확인 토큰을 받아 붙인 뒤 접수한다. 토큰은 한 번만 쓸 수 있어 접수마다
 * 새로 받는다.
 *
 * mock에는 봇 확인이 없다. 확인을 거치지 않고 바로 접수한다.
 */
export async function submitAnalysis(request: SubmitRequest): Promise<AnalyzeResponse> {
  if (USE_MOCK) return mockSubmitAnalysis({ ...request, turnstile_token: 'mock' })
  const turnstileToken = await requestTurnstileToken()
  return realSubmitAnalysis({ ...request, turnstile_token: turnstileToken })
}

/**
 * 조회에는 접수할 때 받은 토큰이 필요하다. 토큰이 없으면 서버가 404를 준다.
 * 작업이 살아 있는지와 무관하다.
 */
export function getJob(
  jobId: string,
  accessToken: string,
  signal?: AbortSignal,
): Promise<JobResponse> {
  return USE_MOCK ? mockGetJob(jobId) : realGetJob(jobId, accessToken, signal)
}
