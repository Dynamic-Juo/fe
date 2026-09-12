import { ApiTransportError } from './errors'
import type { AnalyzeRequest, AnalyzeResponse, JobResponse } from './types'

/**
 * 실 API 클라이언트다. 아직 구현하지 않았다.
 *
 * 연결에는 Cloudflare Access 이메일 인증과 Vercel Origin CORS 허용이 함께
 * 필요하다. 둘 다 열리기 전에는 브라우저에서 호출해도 로그인 HTML이나
 * CORS 차단만 돌아온다. 그때까지는 mock으로 화면을 만든다.
 *
 * 구현할 때 지킬 것은 `be/docs/api-reference.md`에 있다. `credentials:
 * "include"`, JSON이 아닌 응답을 인증 실패로 구분, 429의 `Retry-After`,
 * 404에서 폴링 중지다.
 */

function notConnected(): never {
  throw new ApiTransportError(
    'network',
    '실 API 연결을 아직 구현하지 않았습니다. mock 모드로 확인해주세요.',
  )
}

export function realSubmitAnalysis(_request: AnalyzeRequest): Promise<AnalyzeResponse> {
  return notConnected()
}

export function realGetJob(_jobId: string, _signal?: AbortSignal): Promise<JobResponse> {
  return notConnected()
}
