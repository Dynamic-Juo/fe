/**
 * 백엔드 응답을 그대로 옮긴 타입이다. 기준은 `be/backend/schemas.py`와
 * `be/docs/api-reference.md`이며, 서버가 주는 이름과 값을 그대로 쓴다.
 * 화면에서 읽기 좋은 이름으로 바꾸지 않는다. 바꾸면 계약이 갱신될 때
 * 어느 필드가 달라졌는지 대조할 수 없다.
 *
 * 서버 모델은 `extra="allow"`라 여기에 없는 필드가 더 올 수 있다.
 * 모르는 필드를 만났다고 파싱 전체를 실패시키지 않는다.
 */

/** 서버가 세부 단계를 늘릴 수 있어 `processing:` 뒤를 고정하지 않는다. */
export type ProcessingStatus = `processing:${string}`

/** 폴링을 멈추는 네 가지 상태다. `progress`가 1이 되는 것과 다른 축이다. */
export type TerminalJobStatus = 'completed' | 'completed_with_limitations' | 'timed_out' | 'failed'

export type JobStatus = 'queued' | ProcessingStatus | 'partially_completed' | TerminalJobStatus

/** 카드의 처리 상태다. 검증 판정과 다른 축이며 한 값으로 합치지 않는다. */
export type ClaimStatus = 'pending' | 'verifying' | 'done' | 'failed' | 'timed_out'

/** 검증 판정이다. `status`가 `done`일 때만 최종 판정으로 읽는다. */
export type Verdict = 'supported' | 'refuted' | 'unverified'

export type ManipulationStatus = 'suspected' | 'no_clear_signs' | 'inconclusive' | 'unavailable'

export type ClaimVerificationStatus = 'analyzed' | 'no_claims' | 'unavailable'

export type StageStatus = 'ok' | 'failed' | 'skipped'

export interface ValidationField {
  field: string
  reason: string
}

export interface ApiErrorBody {
  code: string
  message: string
  retryable: boolean
  stage?: string | null
  fields?: ValidationField[] | null
}

export interface ErrorResponse {
  error: ApiErrorBody
  request_id: string
}

export interface AnalyzeRequest {
  url: string
  session_id?: string | null
}

export interface AnalyzeResponse {
  job_id: string
  status: JobStatus
  session_id: string
  deduplicated: boolean
}

export interface MediaResult {
  title?: string | null
  uploader?: string | null
  /** 영상 길이, 초. */
  duration?: number | null
  video_id?: string | null
  thumbnail?: string | null
  upload_date?: string | null
  language?: string | null
  /** `stt`, `caption`, `none`. */
  transcript_source?: string | null
  /** 품질이나 정확도 점수가 아니다. 사용자에게 정확도로 표시하지 않는다. */
  stt_coverage_pct?: number | null
  transcript_coverage_basis?: string | null
  transcript_segment_coverage_pct?: number | null
  transcript_coverage_detail?: string | null
}

export interface StageResult {
  status: StageStatus
  detail?: string | null
  elapsed_sec?: number | null
  error?: ApiErrorBody | null
}

export interface ManipulationResult {
  status: ManipulationStatus
  status_label?: string | null
  detail?: string | null
  evidence?: string[] | null
  /** 내부 참고 신호다. 조작 확률이나 점수로 표시하지 않는다. */
  signals?: Record<string, unknown> | null
}

export interface EvidenceResult {
  title: string
  url: string
  source: string
  published_at?: string | null
  snippet?: string | null
  /** 기존 팩트체크 기관의 표기다. 서비스의 최종 판정으로 승격하지 않는다. */
  rating?: string | null
  content?: string | null
  /** `search_excerpt`는 검색 발췌, `original`은 별도 확보한 원문이다. */
  content_scope?: string | null
  provenance_verified?: boolean | null
  independence_group?: string | null
  source_type?: string | null
  source_type_label?: string | null
  is_primary?: boolean | null
  publisher?: string | null
  /** `false`면 참고 자료다. 판정 근거와 분리해서 보여준다. */
  cited?: boolean | null
  cite_reason?: string | null
  quote?: string | null
}

export interface ClaimResult {
  text: string
  /** 영상 내 발언 시작, 초. 위치를 모르면 `null`이다. */
  start?: number | null
  end?: number | null
  status: ClaimStatus
  verdict?: Verdict | null
  verdict_label?: string | null
  reason?: string | null
  insufficient_reason?: string | null
  insufficient_label?: string | null
  quote?: string | null
  /** `exact`도 전사 구간과의 정합성이며 음성 인식 시각의 정확도 보증이 아니다. */
  time_precision?: 'exact' | 'approx' | null
  mentions?: Record<string, unknown>[] | null
  context?: string | null
  video_title?: string | null
  video_published_at?: string | null
  evidence?: EvidenceResult[] | null
  error?: ApiErrorBody | null
}

export interface ClaimSummary {
  total?: number | null
  pending?: number | null
  verifying?: number | null
  done?: number | null
  failed?: number | null
  timed_out?: number | null
  supported?: number | null
  refuted?: number | null
  unverified?: number | null
}

export interface ClaimVerificationResult {
  status: ClaimVerificationStatus
  claims?: ClaimResult[] | null
  summary?: ClaimSummary | null
  detail?: string | null
}

export interface TranscriptResult {
  summary?: string | null
  keywords?: string[] | null
  tone?: string | null
  language?: string | null
  word_count?: number | null
  /** 전사 정확도나 내용 완성도 점수가 아니다. */
  coverage_pct?: number | null
  coverage_basis?: string | null
  segment_coverage_pct?: number | null
  coverage_detail?: string | null
  source?: string | null
  signals?: Record<string, unknown> | null
}

/** 누적 스냅샷이다. 처리 중에는 `{}`이거나 일부 축만 있을 수 있다. */
export interface AnalysisResult {
  url?: string | null
  /** 최종 결과의 완성도다. 작업 종료 여부는 바깥 `status`로 판단한다. */
  analysis_status?: 'complete' | 'partial' | null
  media?: MediaResult | null
  stages?: Record<string, StageResult> | null
  face_manipulation?: ManipulationResult | null
  whole_video_generation?: ManipulationResult | null
  claim_verification?: ClaimVerificationResult | null
  transcript?: TranscriptResult | null
}

export interface JobResponse {
  id: string
  url: string
  params: Record<string, unknown>
  status: JobStatus
  stage: string | null
  /** 0~1 실행 진행률이다. 정확도나 완성도 점수가 아니다. */
  progress: number
  /** 단계 안내 문구다. 파싱하지 말고 `status`와 `stage`를 쓴다. */
  message: string
  result: AnalysisResult | null
  /** HTTP 200 응답 안에도 분석 실패가 들어 있을 수 있다. */
  error: ApiErrorBody | null
  created_at: number
  updated_at: number
  started_at: number | null
  /** 신고와 피드백용 표시 ID다. 조회 키가 아니다. */
  display_id: string
  created_at_iso: string
  updated_at_iso: string
  elapsed_sec: number
  queue_wait_sec: number
  processing_elapsed_sec: number
}
