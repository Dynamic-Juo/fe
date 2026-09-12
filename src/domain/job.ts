import type {
  ClaimResult,
  ClaimSummary,
  JobResponse,
  JobStatus,
  TerminalJobStatus,
} from '../api/types'

/** 이 네 상태에서 폴링을 멈춘다. `progress`가 1인 것만으로 판단하지 않는다. */
export const TERMINAL_JOB_STATUSES: readonly TerminalJobStatus[] = [
  'completed',
  'completed_with_limitations',
  'timed_out',
  'failed',
]

export function isTerminalStatus(status: JobStatus): status is TerminalJobStatus {
  return (TERMINAL_JOB_STATUSES as readonly string[]).includes(status)
}

export function isJobFinished(job: JobResponse | undefined): boolean {
  return job !== undefined && isTerminalStatus(job.status)
}

/**
 * 카드에는 고유 ID가 없다. 배열 인덱스를 React key로 쓰면 폴링으로 배열이
 * 교체될 때 다른 카드의 펼침 상태가 옮겨 붙는다. 같은 job 안에서 변하지
 * 않는 값인 발언 위치와 본문으로 키를 만든다.
 */
export function claimKey(claim: ClaimResult, index: number): string {
  const at = claim.start ?? 'na'
  return `${index}:${at}:${claim.text}`
}

/** `done`일 때만 최종 판정으로 읽는다. 진행 중 카드의 기본값을 판정으로 표시하지 않는다. */
export function finalVerdict(claim: ClaimResult) {
  return claim.status === 'done' ? (claim.verdict ?? null) : null
}

export interface ClaimProgress {
  total: number
  /** 더 진행되지 않는 카드 수다. 실패와 시간 초과도 포함한다. */
  settled: number
  ratio: number | null
}

/**
 * 서버 summary를 우선 쓰고, 없으면 카드 배열에서 센다. `total`이 0이면
 * 나누지 않고 `ratio`를 `null`로 둔다.
 */
export function claimProgress(
  claims: ClaimResult[] | null | undefined,
  summary: ClaimSummary | null | undefined,
): ClaimProgress {
  const list = claims ?? []
  const total = summary?.total ?? list.length
  const settled =
    summary === null || summary === undefined
      ? list.filter((claim) => claim.status !== 'pending' && claim.status !== 'verifying').length
      : (summary.done ?? 0) + (summary.failed ?? 0) + (summary.timed_out ?? 0)

  return { total, settled, ratio: total > 0 ? settled / total : null }
}

/** `processing:collecting` 같은 상태에서 세부 단계만 떼어낸다. */
export function processingStage(status: JobStatus): string | null {
  return status.startsWith('processing:') ? status.slice('processing:'.length) : null
}

/**
 * 다시 분석을 권할지. 재실행으로 풀릴 수 있는 실패에만 준다. 같은 결과가
 * 뻔한 것을 다시 누르게 하지 않는다.
 *
 * 지원하지 않는 입력과 접근할 수 없는 영상은 접수 단계에서 걸러지므로 여기
 * 오지 않는다. 검증할 주장이 없는 것은 실패가 아니라 정상 결과다.
 */
export function canRetry(job: JobResponse): boolean {
  if (!isTerminalStatus(job.status)) return false
  if (job.status === 'failed') return job.error?.retryable ?? true
  // 검증할 주장이 없는 것은 다시 돌려도 같은 결과다.
  return job.result?.claim_verification?.status !== 'no_claims'
}
