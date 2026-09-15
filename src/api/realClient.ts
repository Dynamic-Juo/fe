import { ERROR } from '../copy/strings'
import { ApiError, ApiTransportError } from './errors'
import type { AnalyzeRequest, AnalyzeResponse, ErrorResponse, JobResponse } from './types'

/**
 * 실 API 클라이언트다. 기준은 `be/docs/public-access.md`와 `api-reference.md`다.
 *
 * 화면과 같은 출처의 `/api`를 부른다. 그 앞의 Vercel Function이 서버에만 둔
 * 인증 정보를 붙여 백엔드로 전달한다. 브라우저는 백엔드 주소를 알지 못하고
 * 인증 정보도 갖지 않는다.
 *
 * 오류를 두 층으로 나눈다. HTTP 오류는 오류 봉투로 오고, 작업 실패는 HTTP 200
 * 안에 들어온다. 두 번째 층은 여기서 예외로 던지지 않고 화면이 `job.error`로
 * 읽는다.
 */

/** 429에 `Retry-After`가 없을 때 쓰는 서버 안내값. */
const DEFAULT_RETRY_AFTER_SEC = 10

/**
 * JSON 응답만 돌려준다.
 *
 * 같은 출처라 CORS도 자격 증명도 쓰지 않는다. 게이트웨이는 어떤 경우에도
 * JSON 오류 봉투를 주므로, JSON이 아닌 응답은 게이트웨이를 거치지 못한
 * 것으로 본다. rewrite가 빠지면 화면 HTML이 돌아온다.
 */
async function apiJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response
  try {
    response = await fetch(path, init)
  } catch {
    throw new ApiTransportError('network', ERROR.network)
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    throw new ApiTransportError('malformed', ERROR.unknown)
  }

  const body: unknown = await response.json()
  if (!response.ok) throw toApiError(response, body)
  return body as T
}

/** 서버 오류 봉투를 그대로 옮긴다. 봉투가 아닌 응답도 같은 모양으로 만든다. */
function toApiError(response: Response, body: unknown): ApiError {
  const envelope = body as Partial<ErrorResponse>
  const header = response.headers.get('retry-after')
  const parsed = header === null ? Number.NaN : Number(header)

  return new ApiError({
    httpStatus: response.status,
    body: envelope.error ?? {
      code: 'internal_error',
      message: ERROR.unknown,
      retryable: response.status >= 500,
    },
    requestId: envelope.request_id ?? response.headers.get('x-request-id'),
    retryAfterSec: Number.isFinite(parsed)
      ? parsed
      : response.status === 429
        ? DEFAULT_RETRY_AFTER_SEC
        : null,
  })
}

export function realSubmitAnalysis(request: AnalyzeRequest): Promise<AnalyzeResponse> {
  return apiJson<AnalyzeResponse>('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
}

export function realGetJob(jobId: string, signal?: AbortSignal): Promise<JobResponse> {
  const path = `/api/jobs/${encodeURIComponent(jobId)}`
  return apiJson<JobResponse>(path, signal === undefined ? {} : { signal })
}
