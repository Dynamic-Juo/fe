import { parseVideoId, watchUrl } from '../../domain/youtube'
import { ApiError } from '../errors'
import type {
  AnalysisResult,
  AnalyzeRequest,
  AnalyzeResponse,
  ClaimResult,
  ClaimStatus,
  ClaimSummary,
  JobResponse,
  JobStatus,
} from '../types'
import { MOCK_SCENARIOS, pickScenario, type MockClaim, type MockScenario } from './scenarios'

/**
 * mock 클라이언트다. 타이머를 들고 있지 않고 접수 시각과 현재 시각의 차이로
 * 스냅샷을 계산한다. 새로고침해도 같은 지점에서 이어지고, 폴링을 몇 번
 * 건너뛰어도 상태가 어긋나지 않는다.
 *
 * 응답은 서버와 같은 전체 스냅샷이다. 이전 응답에 덧붙이지 않는다.
 */

const STORAGE_KEY = 'conan.mock.jobs'
/** 서버 보관 상한과 같은 성격이다. 오래된 작업부터 버린다. */
const MAX_JOBS = 20
/** 카드가 `pending`에서 `verifying`으로 바뀌는 시점. 검증이 끝나기 몇 초 전인지. */
const VERIFYING_LEAD_SEC = 4

interface MockJobRecord {
  jobId: string
  scenarioId: string
  url: string
  sessionId: string
  createdAt: number
}

function readRecords(): MockJobRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw === null ? [] : (JSON.parse(raw) as MockJobRecord[])
  } catch {
    return []
  }
}

function writeRecords(records: MockJobRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records.slice(-MAX_JOBS)))
  } catch {
    // 저장하지 못해도 이번 세션 동안은 동작한다. 새로고침에서만 끊긴다.
  }
}

function randomHex32(): string {
  return crypto.randomUUID().replaceAll('-', '')
}

/** 서버의 `CN-0123-4567` 형태를 흉내 낸다. 조회 키가 아니다. */
function displayId(jobId: string): string {
  const body = jobId.replaceAll(/[^0-9a-f]/g, '').toUpperCase()
  return `CN-${body.slice(0, 4)}-${body.slice(4, 8)}`
}

export async function mockSubmitAnalysis(request: AnalyzeRequest): Promise<AnalyzeResponse> {
  await delay(300)

  const videoId = parseVideoId(request.url)
  if (videoId === null) {
    throw new ApiError({
      httpStatus: 422,
      body: {
        code: 'unsupported_url',
        message: 'YouTube 영상 링크만 분석할 수 있습니다.',
        retryable: false,
      },
    })
  }

  const scenario = pickScenario(videoId)
  const sessionId = request.session_id ?? `mock-session-${randomHex32().slice(0, 8)}`

  if (scenario.rejectSubmit !== undefined) {
    throw new ApiError({
      httpStatus: scenario.rejectSubmit.httpStatus,
      body: scenario.rejectSubmit.body,
      retryAfterSec: scenario.rejectSubmit.retryAfterSec ?? null,
    })
  }

  const record: MockJobRecord = {
    jobId: randomHex32(),
    scenarioId: scenario.id,
    url: watchUrl(videoId),
    sessionId,
    createdAt: Date.now(),
  }
  writeRecords([...readRecords(), record])

  return { job_id: record.jobId, status: 'queued', session_id: sessionId, deduplicated: false }
}

export async function mockGetJob(jobId: string): Promise<JobResponse> {
  await delay(200)

  const record = readRecords().find((item) => item.jobId === jobId)
  if (record === undefined) {
    throw new ApiError({
      httpStatus: 404,
      body: {
        code: 'job_not_found',
        message: '분석 결과를 찾을 수 없습니다.',
        retryable: false,
      },
    })
  }

  const scenario = MOCK_SCENARIOS.find((item) => item.id === record.scenarioId)
  if (scenario === undefined) {
    throw new ApiError({
      httpStatus: 404,
      body: { code: 'job_not_found', message: '분석 결과를 찾을 수 없습니다.', retryable: false },
    })
  }

  return buildSnapshot(scenario, record, Date.now())
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

type Phase = 'queued' | 'collecting' | 'transcribing' | 'extracting_claims' | 'verifying' | 'final'

function phaseAt(scenario: MockScenario, elapsed: number): Phase {
  const { marks } = scenario
  if (elapsed >= marks.end) return 'final'
  if (elapsed < marks.collecting) return 'queued'
  if (elapsed < marks.transcribing) return 'collecting'
  if (elapsed < marks.extractingClaims) return 'transcribing'
  if (elapsed < marks.verifying) return 'extracting_claims'
  return 'verifying'
}

/** 서버가 보내는 안내 문구를 흉내 낸다. 화면은 이 문구를 파싱하지 않는다. */
const PHASE_MESSAGE: Record<Phase, string> = {
  queued: '대기 중',
  collecting: '영상을 받는 중...',
  transcribing: '발언 텍스트 확보 중...',
  extracting_claims: '검증할 주장을 찾는 중...',
  verifying: '주장을 검증하는 중...',
  final: '분석을 마쳤습니다',
}

const PHASE_PROGRESS: Record<Phase, number> = {
  queued: 0,
  collecting: 0.15,
  transcribing: 0.4,
  extracting_claims: 0.6,
  verifying: 0.75,
  final: 1,
}

function buildSnapshot(scenario: MockScenario, record: MockJobRecord, now: number): JobResponse {
  const elapsed = Math.max(0, (now - record.createdAt) / 1000)
  const phase = phaseAt(scenario, elapsed)
  const finished = phase === 'final'
  const claims = buildClaims(scenario, elapsed, finished)
  const summary = claims === null ? null : summarize(claims)

  const status = jobStatus(scenario, phase, claims)
  const stage = phase === 'queued' ? null : phase === 'final' ? lastStage(scenario) : phase
  const startedAt =
    elapsed < scenario.marks.collecting ? null : record.createdAt + scenario.marks.collecting * 1000

  const progress = progressAt(scenario, phase, summary)

  const updatedAt = now
  // 화면에 적는 시간만 부풀린다. 실제로 기다리는 시간과 단계 전환은 그대로다.
  const scale = scenario.reportScale ?? 1

  return {
    id: record.jobId,
    url: record.url,
    params: {},
    status,
    stage,
    progress: Number(progress.toFixed(2)),
    message: PHASE_MESSAGE[phase],
    result: buildResult(scenario, phase, claims, summary, record.url),
    error: finished && scenario.jobError !== undefined ? scenario.jobError : null,
    created_at: record.createdAt / 1000,
    updated_at: updatedAt / 1000,
    started_at: startedAt === null ? null : startedAt / 1000,
    display_id: displayId(record.jobId),
    created_at_iso: new Date(record.createdAt).toISOString().slice(0, 19),
    updated_at_iso: new Date(updatedAt).toISOString().slice(0, 19),
    elapsed_sec: Number((elapsed * scale).toFixed(1)),
    queue_wait_sec: scenario.marks.collecting * scale,
    processing_elapsed_sec: Number(
      (Math.max(0, elapsed - scenario.marks.collecting) * scale).toFixed(1),
    ),
  }
}

/**
 * 실패로 끝난 작업은 진행률을 1로 올리지 않는다. 계약 예시도 다운로드에서
 * 실패한 작업의 progress를 낮은 값 그대로 둔다. 진행률과 종료 여부는 다른
 * 축이고, 1은 다 처리했다는 뜻으로 읽힌다.
 */
function progressAt(scenario: MockScenario, phase: Phase, summary: ClaimSummary | null): number {
  if (phase === 'final') {
    if (scenario.finalStatus !== 'failed') return 1
    return PHASE_PROGRESS[phaseAt(scenario, scenario.marks.end - 0.001)]
  }
  if (phase === 'verifying' && summary !== null && (summary.total ?? 0) > 0) {
    const ratio = settledCount(summary) / (summary.total ?? 1)
    return PHASE_PROGRESS.verifying + (1 - PHASE_PROGRESS.verifying) * ratio
  }
  return PHASE_PROGRESS[phase]
}

function jobStatus(scenario: MockScenario, phase: Phase, claims: ClaimResult[] | null): JobStatus {
  if (phase === 'final') return scenario.finalStatus
  if (phase === 'queued') return 'queued'
  // 카드가 하나라도 끝났으면 부분 결과가 도착한 것이다.
  if (
    claims !== null &&
    claims.some((claim) => claim.status !== 'pending' && claim.status !== 'verifying')
  ) {
    return 'partially_completed'
  }
  return `processing:${phase}`
}

function lastStage(scenario: MockScenario): string {
  return scenario.claims === undefined && scenario.claimFallback === undefined
    ? 'collecting'
    : 'verifying'
}

/** 아직 카드를 만들 단계가 아니면 `null`이다. `[]`와 구분한다. */
function buildClaims(
  scenario: MockScenario,
  elapsed: number,
  finished: boolean,
): ClaimResult[] | null {
  if (scenario.claims === undefined) return null
  if (!finished && elapsed < scenario.marks.verifying) return null
  return scenario.claims.map((claim) => toClaimResult(claim, scenario, elapsed, finished))
}

function toClaimResult(
  claim: MockClaim,
  scenario: MockScenario,
  elapsed: number,
  finished: boolean,
): ClaimResult {
  const outcome = claim.outcome
  const settled = outcome !== undefined && elapsed >= claim.settleAt
  const status: ClaimStatus = settled
    ? outcome.status
    : finished
      ? 'timed_out'
      : elapsed >= claim.settleAt - VERIFYING_LEAD_SEC
        ? 'verifying'
        : 'pending'

  const base: ClaimResult = {
    text: claim.text,
    start: claim.start,
    end: claim.end,
    status,
    time_precision: claim.start === null ? null : 'approx',
    video_title: scenario.media.title ?? null,
  }
  if (claim.context !== undefined) base.context = claim.context
  if (claim.quote !== undefined) base.quote = claim.quote
  if (claim.mentions !== undefined) base.mentions = claim.mentions

  if (!settled || outcome === undefined) return base

  if (outcome.status === 'failed') {
    return { ...base, reason: outcome.reason }
  }

  const result: ClaimResult = {
    ...base,
    verdict: outcome.verdict,
    reason: outcome.reason,
    evidence: outcome.evidence,
  }
  if ('insufficientReason' in outcome) {
    result.insufficient_reason = outcome.insufficientReason
    result.insufficient_label = outcome.insufficientLabel
  }
  return result
}

function summarize(claims: ClaimResult[]): ClaimSummary {
  const count = (predicate: (claim: ClaimResult) => boolean) => claims.filter(predicate).length
  return {
    total: claims.length,
    pending: count((claim) => claim.status === 'pending'),
    verifying: count((claim) => claim.status === 'verifying'),
    done: count((claim) => claim.status === 'done'),
    failed: count((claim) => claim.status === 'failed'),
    timed_out: count((claim) => claim.status === 'timed_out'),
    // 판정별 개수는 done 카드만 센다.
    supported: count((claim) => claim.status === 'done' && claim.verdict === 'supported'),
    refuted: count((claim) => claim.status === 'done' && claim.verdict === 'refuted'),
    unverified: count((claim) => claim.status === 'done' && claim.verdict === 'unverified'),
  }
}

function settledCount(summary: ClaimSummary): number {
  return (summary.done ?? 0) + (summary.failed ?? 0) + (summary.timed_out ?? 0)
}

function buildResult(
  scenario: MockScenario,
  phase: Phase,
  claims: ClaimResult[] | null,
  summary: ClaimSummary | null,
  url: string,
): AnalysisResult | null {
  if (phase === 'queued') return null

  const result: AnalysisResult = { url }

  // 실패로 끝난 작업은 확보한 것이 없어도 result 자체는 빈 객체로 온다.
  if (phase === 'final' && scenario.finalStatus === 'failed') {
    return scenario.stages === undefined ? {} : { stages: scenario.stages }
  }

  result.media = scenario.media

  if (phase !== 'collecting') {
    result.face_manipulation = scenario.faceManipulation
    result.whole_video_generation = scenario.wholeVideoGeneration
    if (scenario.transcript !== undefined) result.transcript = scenario.transcript
  }

  if (claims !== null) {
    result.claim_verification = { status: 'analyzed', claims, summary }
  } else if (scenario.claimFallback !== undefined && (phase === 'verifying' || phase === 'final')) {
    result.claim_verification = {
      status: scenario.claimFallback.status,
      claims: scenario.claimFallback.status === 'no_claims' ? [] : null,
      summary: scenario.claimFallback.status === 'no_claims' ? { total: 0 } : null,
      detail: scenario.claimFallback.detail,
    }
  }

  if (phase === 'final') {
    if (scenario.stages !== undefined) result.stages = scenario.stages
    result.analysis_status = scenario.finalStatus === 'completed' ? 'complete' : 'partial'
  }

  return result
}
