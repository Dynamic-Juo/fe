import { ERROR } from '../copy/strings'
import { ApiError, ApiTransportError } from './errors'
import type { AnalyzeRequest, AnalyzeResponse, ErrorResponse, JobResponse } from './types'

/**
 * 실 API 클라이언트다. 기준은 `be/docs/api-reference.md`다.
 *
 * 오류를 세 층으로 나눈다. Cloudflare Access 로그인과 CORS 차단은 서버의 오류
 * 봉투가 아니고, HTTP 오류는 봉투로 오며, 작업 실패는 HTTP 200 안에 들어온다.
 * 세 번째 층은 여기서 예외로 던지지 않고 화면이 `job.error`로 읽는다.
 */

/** 429에 `Retry-After`가 없을 때 쓰는 서버 안내값. */
const DEFAULT_RETRY_AFTER_SEC = 10

function url(path: string): string {
  return `${import.meta.env.VITE_API_BASE_URL}${path}`
}

/**
 * Access 인증과 CORS를 통과한 JSON 응답만 돌려준다.
 *
 * 이동을 따라가지 않는다. 따라가면 로그인 페이지가 다른 출처라 CORS 오류가
 * 나고, 인증이 필요한 것인지 서버가 죽은 것인지 구분할 수 없게 된다.
 */
async function apiJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response
  try {
    response = await fetch(url(path), {
      ...init,
      credentials: 'include',
      redirect: 'manual',
    })
  } catch {
    // 연결 실패와 CORS 차단은 브라우저가 같은 오류로 준다. 구분할 방법이 없다.
    throw new ApiTransportError('network', ERROR.network)
  }

  if (response.type === 'opaqueredirect' || response.redirected) {
    throw new ApiTransportError('auth', ERROR.authRequiredDetail)
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    const needsLogin = response.status === 401 || response.status === 403
    throw new ApiTransportError(
      needsLogin ? 'auth' : 'malformed',
      needsLogin ? ERROR.authRequiredDetail : ERROR.unknown,
    )
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
