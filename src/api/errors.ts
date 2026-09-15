import type { ApiErrorBody, ValidationField } from './types'

/**
 * HTTP 응답으로 돌아온 오류다. 계약의 두 층 중 첫 번째 층이다.
 *
 * 두 번째 층인 작업 실패(`job.error`)는 HTTP 200 안에 들어 있어 이 오류로
 * 오지 않는다.
 */
export class ApiError extends Error {
  readonly httpStatus: number
  readonly code: string
  readonly retryable: boolean
  readonly fields: ValidationField[] | null
  readonly requestId: string | null
  /** `Retry-After` 헤더값, 초. 없으면 서버 안내값 10초를 쓴다. */
  readonly retryAfterSec: number | null

  constructor(init: {
    httpStatus: number
    body: ApiErrorBody
    requestId?: string | null
    retryAfterSec?: number | null
  }) {
    super(init.body.message)
    this.name = 'ApiError'
    this.httpStatus = init.httpStatus
    this.code = init.body.code
    this.retryable = init.body.retryable
    this.fields = init.body.fields ?? null
    this.requestId = init.requestId ?? null
    this.retryAfterSec = init.retryAfterSec ?? null
  }
}

/**
 * 서버의 오류 봉투가 아닌 실패다. 연결 실패와 JSON이 아닌 응답이 여기 들어온다.
 *
 * 게이트웨이는 어떤 경우에도 JSON 봉투를 주므로, JSON이 아니면 게이트웨이를
 * 거치지 못한 것이다. rewrite가 빠졌거나 배포가 덜 된 상태다.
 */
export class ApiTransportError extends Error {
  readonly kind: 'network' | 'malformed'

  constructor(kind: 'network' | 'malformed', message: string) {
    super(message)
    this.name = 'ApiTransportError'
    this.kind = kind
  }
}

/** 404는 같은 작업을 다시 조회해도 살아나지 않는다. 폴링을 멈춘다. */
export function isJobGone(error: unknown): boolean {
  return error instanceof ApiError && error.httpStatus === 404
}

/** 서버가 말한 재시도 간격. 없으면 `null`이다. */
export function retryAfterMs(error: unknown): number | null {
  if (!(error instanceof ApiError) || error.retryAfterSec === null) return null
  return error.retryAfterSec * 1000
}
