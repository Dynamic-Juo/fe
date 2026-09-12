import type {
  ApiErrorBody,
  ClaimVerificationStatus,
  EvidenceResult,
  ManipulationResult,
  MediaResult,
  StageResult,
  TerminalJobStatus,
  TranscriptResult,
  Verdict,
} from '../types'

/**
 * mock 시나리오 정의다. 화면이 만나야 할 상태를 전부 재생하려고 만들었다.
 *
 * 여기 나오는 영상 제목, 발언, 자료는 전부 지어낸 값이다. 실제 영상이나
 * 실제 보도가 아니다. 번들에 남지 않도록 mock이 꺼진 빌드에서는 이 모듈을
 * 가져오는 경로가 통째로 제거된다.
 */

/** mock 안에서만 쓰는 카드 정의다. 검증이 끝나는 시각을 함께 적는다. */
export interface MockClaim {
  text: string
  start: number | null
  end: number | null
  /** 서버가 인용 검증을 통과시킨 발췌. 주장 요약이 아니라 실제로 한 말이다. */
  quote?: string
  context?: string
  /** 같은 주장이 반복해서 나온 위치. 구조가 고정이 아닌 것을 흉내 낸다. */
  mentions?: Record<string, unknown>[]
  /** 접수 후 몇 초에 이 카드의 검증이 끝나는지. 작업 종료보다 늦으면 시간 초과로 끝난다. */
  settleAt: number
  /** 생략하면 작업이 끝날 때까지 검증 중으로 남는다. */
  outcome?:
    | {
        status: 'done'
        verdict: Verdict
        reason: string
        quote?: string
        evidence: EvidenceResult[]
      }
    | {
        status: 'done'
        verdict: 'unverified'
        reason: string
        insufficientReason: string
        insufficientLabel: string
        evidence: EvidenceResult[]
      }
    | { status: 'failed'; reason: string }
}

/** 접수 후 각 단계로 넘어가는 시각이다. 초 단위이며 실제보다 짧게 눌러 뒀다. */
export interface MockMarks {
  collecting: number
  transcribing: number
  extractingClaims: number
  verifying: number
  /** 작업이 종료되는 시각. 이 시각을 넘으면 `finalStatus`가 된다. */
  end: number
}

export interface MockScenario {
  id: string
  /**
   * 화면에 적는 시간을 이 배수로 부풀린다. 실제로 기다리는 시간은 그대로다.
   *
   * 오래 걸리는 분석의 화면을 보려고 열 분을 기다리게 할 수는 없다. mock은
   * 화면을 보려고 만든 것이지 서버를 흉내 내려고 만든 것이 아니다.
   */
  reportScale?: number
  /** 이 ID가 들어간 링크를 넣으면 이 시나리오가 재생된다. */
  videoId: string
  label: string
  note: string
  /** 접수 자체가 거절되는 시나리오. GET까지 가지 않는다. */
  rejectSubmit?: { httpStatus: number; body: ApiErrorBody; retryAfterSec?: number }
  media: MediaResult
  marks: MockMarks
  faceManipulation: ManipulationResult
  wholeVideoGeneration: ManipulationResult
  transcript?: TranscriptResult
  stages?: Record<string, StageResult>
  claims?: MockClaim[]
  /** 카드를 만들지 못한 경우의 주장 축 상태. */
  claimFallback?: { status: Exclude<ClaimVerificationStatus, 'analyzed'>; detail: string }
  finalStatus: TerminalJobStatus
  jobError?: ApiErrorBody
}

const NO_WHOLE_VIDEO_MODEL: ManipulationResult = {
  status: 'unavailable',
  status_label: '분석 불가',
  detail: '영상 전체 AI 생성 탐지 모델을 선정하지 않았다.',
  evidence: [],
}

const NEWS_EVIDENCE = (
  title: string,
  publisher: string,
  published: string,
  reason: string,
): EvidenceResult => ({
  title,
  url: 'https://example.com/mock-article',
  source: 'naver_news',
  publisher,
  published_at: published,
  snippet: '검색 결과에서 가져온 발췌다. 기사 원문 전체를 읽은 것이 아니다.',
  content_scope: 'search_excerpt',
  provenance_verified: false,
  source_type: 'news',
  source_type_label: '뉴스',
  is_primary: false,
  cited: true,
  cite_reason: reason,
})

/** 1차 자료다. 유형 라벨이 달라 배치가 어떻게 바뀌는지 같이 본다. */
const OFFICIAL_EVIDENCE = (
  title: string,
  publisher: string,
  published: string,
  reason: string,
): EvidenceResult => ({
  title,
  url: 'https://example.go.kr/mock-notice',
  source: 'gov_notice',
  publisher,
  published_at: published,
  content_scope: 'search_excerpt',
  provenance_verified: false,
  source_type: 'government',
  source_type_label: '정부 · 공공기관',
  is_primary: true,
  cited: true,
  cite_reason: reason,
})

const REFERENCE_EVIDENCE: EvidenceResult = {
  title: '같은 주제를 다루지만 주장을 직접 확인하지 못한 자료',
  url: 'https://example.com/mock-reference',
  source: 'wikipedia',
  publisher: '위키백과',
  snippet: '주제만 겹치고 주장을 직접 다루지 않는다.',
  content_scope: 'search_excerpt',
  provenance_verified: false,
  source_type: 'encyclopedia',
  source_type_label: '백과사전',
  is_primary: false,
  cited: false,
  cite_reason: '주장을 직접 확인하지 못해 참고 자료로 분리했다.',
}

const KOREAN_TRANSCRIPT: TranscriptResult = {
  language: 'ko',
  source: 'stt',
  word_count: 214,
  coverage_pct: 92.4,
  coverage_basis: 'input_audio_duration',
  segment_coverage_pct: 88.1,
  coverage_detail: '입력 오디오 길이 대비 비율이다. 인식 정확도가 아니다.',
  tone: 'informative',
  keywords: ['전기요금', '가구', '인상'],
}

const OK_STAGES: Record<string, StageResult> = {
  download: { status: 'ok', elapsed_sec: 3.1 },
  frames: { status: 'ok', elapsed_sec: 1.4 },
  media_manipulation: { status: 'ok', elapsed_sec: 2.2 },
  transcript: { status: 'ok', elapsed_sec: 6.8 },
  claim_verification: { status: 'ok', elapsed_sec: 12.5 },
  cleanup: { status: 'ok' },
}

const NORMAL_MARKS: MockMarks = {
  collecting: 2,
  transcribing: 7,
  extractingClaims: 12,
  verifying: 16,
  end: 34,
}

export const MOCK_SCENARIOS: readonly MockScenario[] = [
  {
    id: 'completed',
    videoId: 'mock-done-1',
    label: '정상 완료',
    note: '주장 8건이 순서대로 검증된다. 판정이 섞여 있고 근거 부족도 포함한다.',
    media: {
      title: '[예시] 전기요금 인상 관련 설명 영상',
      uploader: '예시 채널',
      duration: 58,
      video_id: 'mock-done-1',
      language: 'ko',
      transcript_source: 'stt',
      stt_coverage_pct: 92.4,
    },
    marks: NORMAL_MARKS,
    faceManipulation: {
      status: 'no_clear_signs',
      status_label: '뚜렷한 조작 징후 없음',
      detail: '검사한 프레임에서 얼굴 합성 신호를 찾지 못했다. 조작이 없다는 뜻은 아니다.',
      evidence: ['검사한 프레임 8장'],
    },
    wholeVideoGeneration: NO_WHOLE_VIDEO_MODEL,
    transcript: KOREAN_TRANSCRIPT,
    stages: OK_STAGES,
    finalStatus: 'completed',
    claims: [
      {
        text: '올해 주택용 전기요금이 두 차례 올랐다.',
        start: 4,
        end: 9,
        settleAt: 19,
        quote: '올해 들어서만 전기요금이 두 번 올랐거든요.',
        context: '앞부분에서 최근 공공요금 흐름을 설명하다가 전기요금을 예로 들며 나온 말이다.',
        mentions: [
          { start: 4, end: 9, time_precision: 'exact' },
          { start: 33, time_precision: 'approx' },
          // 시각을 모르는 언급. 계약이 항목마다 같은 키가 있다고 가정하지 말라고 한다.
          { context: '마무리에서 다시 언급' },
        ],
        outcome: {
          status: 'done',
          verdict: 'supported',
          reason: '인상 시점 두 건을 다룬 보도에서 같은 내용을 확인했다.',
          evidence: [
            OFFICIAL_EVIDENCE(
              '전기요금 조정 내역 공고',
              '예시에너지공단',
              '2026-07-01',
              '조정 시점과 폭을 고시한 1차 자료다.',
            ),
            NEWS_EVIDENCE(
              '주택용 전기요금 두 차례 조정',
              '예시일보',
              '2026-07-02',
              '조정 시점 두 건을 날짜와 함께 적고 있다.',
            ),
          ],
        },
      },
      {
        text: '4인 가구 기준 월 부담이 세 배로 늘었다.',
        start: 11,
        end: 16,
        settleAt: 21,
        quote: '4인 가구면 체감상 세 배는 나오는 것 같아요.',
        outcome: {
          status: 'done',
          verdict: 'refuted',
          reason: '같은 기준으로 비교한 자료의 증가 폭과 맞지 않는다.',
          evidence: [
            OFFICIAL_EVIDENCE(
              '가구원 수별 월 평균 사용량과 요금',
              '예시에너지공단',
              '2026-07-03',
              '같은 사용량 기준의 월 요금을 표로 제시한다.',
            ),
            NEWS_EVIDENCE(
              '요금 인상 체감과 실제 차이',
              '예시일보',
              '2026-07-12',
              '세 배라는 표현이 어디서 나왔는지 짚고 있다.',
            ),
            NEWS_EVIDENCE(
              '4인 가구 월 부담 변화 정리',
              '예시경제',
              '2026-07-10',
              '같은 기준으로 비교한 증가 폭을 제시한다.',
            ),
          ],
        },
      },
      {
        text: '이 조정으로 전체 가구의 90%가 영향을 받는다.',
        start: 18,
        end: 23,
        settleAt: 23,
        outcome: {
          status: 'done',
          verdict: 'unverified',
          reason: '적용 범위를 밝힌 자료를 찾지 못했다.',
          insufficientReason: 'no_source',
          insufficientLabel: '검색했지만 관련 자료를 찾지 못했습니다',
          evidence: [REFERENCE_EVIDENCE],
        },
      },
      {
        text: '산업용 요금은 이번에 바뀌지 않았다.',
        start: 25,
        end: 29,
        settleAt: 25,
        outcome: {
          status: 'done',
          verdict: 'supported',
          reason: '조정 대상에서 산업용을 제외했다는 설명을 확인했다.',
          evidence: [
            NEWS_EVIDENCE(
              '이번 조정 대상과 제외 대상',
              '예시일보',
              '2026-06-28',
              '산업용이 조정 대상에서 빠졌다고 밝히고 있다.',
            ),
          ],
        },
      },
      {
        text: '인접 국가 대비 요금 수준이 가장 낮다.',
        start: 31,
        end: 36,
        settleAt: 27,
        outcome: {
          status: 'done',
          verdict: 'unverified',
          reason: '비교 기준이 제각각이라 같은 조건으로 맞춰 보지 못했다.',
          insufficientReason: 'not_direct',
          insufficientLabel: '자료가 같은 주제만 다루고 주장을 직접 확인하지 못했습니다',
          evidence: [
            NEWS_EVIDENCE(
              '국가별 전기요금 비교 보도',
              '예시경제',
              '2026-06-30',
              '비교 기준이 서로 달라 같은 조건으로 맞추지 못했다.',
            ),
            REFERENCE_EVIDENCE,
          ],
        },
      },
      {
        text: '요금 고지서에 인상분이 다음 달부터 반영된다.',
        start: null,
        end: null,
        settleAt: 29,
        outcome: {
          status: 'done',
          verdict: 'supported',
          reason: '반영 시점을 밝힌 안내를 확인했다.',
          evidence: [
            NEWS_EVIDENCE(
              '조정분 반영 시점 안내',
              '예시경제',
              '2026-07-05',
              '고지서에 반영되는 시점을 안내하고 있다.',
            ),
          ],
        },
      },
      {
        text: '지난해 같은 기간에도 동일한 폭으로 올랐다.',
        start: 40,
        end: 45,
        settleAt: 31,
        outcome: {
          status: 'done',
          verdict: 'refuted',
          reason: '지난해 조정 폭은 이번과 다르다.',
          evidence: [
            NEWS_EVIDENCE(
              '연도별 조정 폭 비교',
              '예시일보',
              '2026-07-08',
              '지난해 조정 폭이 이번과 다르다는 것을 보여준다.',
            ),
          ],
        },
      },
      {
        text: '요금 할인 대상 가구는 신청 없이 자동 적용된다.',
        start: 47,
        end: 52,
        settleAt: 33,
        quote: '따로 신청 안 해도 자동으로 적용된다고 하더라고요.',
        outcome: {
          status: 'failed',
          reason: '근거 조회 중 오류가 나 판정하지 못했다.',
        },
      },
    ],
  },
  {
    id: 'no_claims',
    videoId: 'mock-none-2',
    label: '검증할 주장 없음',
    note: '발언은 확보했지만 외부 근거로 확인할 주장이 없다. 실패가 아니다.',
    media: {
      title: '[예시] 배경음악만 있는 일상 영상',
      uploader: '예시 채널',
      duration: 31,
      video_id: 'mock-none-2',
      language: 'ko',
      transcript_source: 'stt',
      stt_coverage_pct: 41.2,
    },
    marks: { collecting: 2, transcribing: 6, extractingClaims: 10, verifying: 13, end: 16 },
    faceManipulation: {
      status: 'inconclusive',
      status_label: '판단 보류',
      detail: '얼굴이 충분히 검출되지 않아 판단하지 못했다.',
      evidence: [],
    },
    wholeVideoGeneration: NO_WHOLE_VIDEO_MODEL,
    transcript: { ...KOREAN_TRANSCRIPT, word_count: 27, coverage_pct: 41.2, keywords: [] },
    stages: {
      ...OK_STAGES,
      claim_verification: { status: 'ok', detail: '검증 대상 주장을 찾지 못했다.' },
    },
    claimFallback: {
      status: 'no_claims',
      detail: '외부 근거로 확인할 수 있는 주장을 찾지 못했다.',
    },
    finalStatus: 'completed',
  },
  {
    id: 'claim_unavailable',
    videoId: 'mock-noTx-3',
    label: '주장 검증 불가',
    note: '발언을 텍스트로 옮기지 못해 주장 축을 실행하지 못했다. 미디어 축은 남는다.',
    media: {
      title: '[예시] 음성이 거의 없는 영상',
      uploader: '예시 채널',
      duration: 47,
      video_id: 'mock-noTx-3',
      transcript_source: 'none',
    },
    marks: { collecting: 2, transcribing: 7, extractingClaims: 11, verifying: 13, end: 17 },
    faceManipulation: {
      status: 'suspected',
      status_label: '조작 의심',
      detail: '일부 프레임에서 얼굴 경계가 어긋나는 신호를 찾았다.',
      evidence: ['프레임 3, 5에서 경계 불일치'],
    },
    wholeVideoGeneration: NO_WHOLE_VIDEO_MODEL,
    stages: {
      ...OK_STAGES,
      transcript: {
        status: 'failed',
        detail: '음성 인식에 실패했다.',
        error: {
          code: 'transcription_failed',
          message: '발언을 텍스트로 옮기지 못했습니다.',
          retryable: true,
        },
      },
      claim_verification: { status: 'skipped', detail: '발언 텍스트가 없어 실행하지 않았다.' },
    },
    claimFallback: {
      status: 'unavailable',
      detail: '발언 텍스트를 확보하지 못해 주장을 검증하지 못했다.',
    },
    finalStatus: 'completed_with_limitations',
  },
  {
    id: 'partial',
    videoId: 'mock-part-4',
    label: '부분 완료',
    note: '카드는 만들었지만 일부가 실패했고 미디어 축 하나가 빠졌다.',
    media: {
      title: '[예시] 통계 인용이 많은 설명 영상',
      uploader: '예시 채널',
      duration: 55,
      video_id: 'mock-part-4',
      language: 'ko',
      transcript_source: 'caption',
      stt_coverage_pct: 100,
      transcript_coverage_basis: 'caption_last_timestamp',
    },
    marks: { collecting: 2, transcribing: 7, extractingClaims: 11, verifying: 15, end: 26 },
    faceManipulation: {
      status: 'unavailable',
      status_label: '분석 불가',
      detail: '얼굴 기반 분석을 수행하지 못했다.',
      evidence: [],
    },
    wholeVideoGeneration: NO_WHOLE_VIDEO_MODEL,
    transcript: {
      ...KOREAN_TRANSCRIPT,
      source: 'caption',
      coverage_basis: 'caption_last_timestamp',
    },
    stages: {
      ...OK_STAGES,
      media_manipulation: {
        status: 'failed',
        detail: '얼굴 검출 단계에서 실패했다.',
        error: {
          code: 'dependency_missing',
          message: '필요한 모델을 사용할 수 없습니다.',
          retryable: false,
        },
      },
    },
    finalStatus: 'completed_with_limitations',
    claims: [
      {
        text: '지난 분기 신규 가입자가 20만 명을 넘었다.',
        start: 6,
        end: 11,
        settleAt: 18,
        outcome: {
          status: 'done',
          verdict: 'supported',
          reason: '분기 실적 자료에서 같은 수치를 확인했다.',
          evidence: [
            NEWS_EVIDENCE(
              '분기 가입자 실적 발표',
              '예시경제',
              '2026-08-01',
              '해당 분기 신규 가입자 수를 밝히고 있다.',
            ),
          ],
        },
      },
      {
        text: '해지율은 업계 최저 수준이다.',
        start: 13,
        end: 18,
        settleAt: 21,
        outcome: {
          status: 'done',
          verdict: 'unverified',
          reason: '업계 전체를 같은 기준으로 비교한 자료가 없다.',
          insufficientReason: 'weak_source',
          insufficientLabel: '출처의 신뢰성이나 내용이 판정에 충분하지 않습니다',
          evidence: [REFERENCE_EVIDENCE],
        },
      },
      {
        text: '요금제 개편은 모든 가입자에게 유리하다.',
        start: 20,
        end: 26,
        settleAt: 24,
        outcome: { status: 'failed', reason: '근거 조회 제공자에서 오류가 반환됐다.' },
      },
    ],
  },
  {
    id: 'timed_out',
    videoId: 'mock-time-5',
    label: '시간 초과',
    note: '검증이 끝나기 전에 시간이 초과된다. 완료된 카드는 남는다.',
    media: {
      title: '[예시] 주장이 많고 긴 영상',
      uploader: '예시 채널',
      duration: 178,
      video_id: 'mock-time-5',
      language: 'ko',
      transcript_source: 'stt',
      stt_coverage_pct: 76.3,
    },
    marks: { collecting: 3, transcribing: 9, extractingClaims: 14, verifying: 18, end: 27 },
    faceManipulation: {
      status: 'no_clear_signs',
      status_label: '뚜렷한 조작 징후 없음',
      detail: '검사한 프레임에서 얼굴 합성 신호를 찾지 못했다. 조작이 없다는 뜻은 아니다.',
      evidence: ['검사한 프레임 8장'],
    },
    wholeVideoGeneration: NO_WHOLE_VIDEO_MODEL,
    transcript: { ...KOREAN_TRANSCRIPT, coverage_pct: 76.3 },
    stages: {
      ...OK_STAGES,
      claim_verification: { status: 'failed', detail: '시간 예산을 넘겨 중단했다.' },
    },
    finalStatus: 'timed_out',
    claims: [
      {
        text: '이 제도는 다음 달부터 시행된다.',
        start: 5,
        end: 10,
        settleAt: 21,
        outcome: {
          status: 'done',
          verdict: 'supported',
          reason: '시행 시점을 밝힌 자료를 확인했다.',
          evidence: [
            NEWS_EVIDENCE(
              '시행 시점 안내',
              '예시일보',
              '2026-08-20',
              '제도의 시행 시점을 밝히고 있다.',
            ),
          ],
        },
      },
      {
        text: '신청 기한은 이미 지났다.',
        start: 12,
        end: 16,
        settleAt: 24,
        outcome: {
          status: 'done',
          verdict: 'refuted',
          reason: '공지된 기한과 다르다.',
          evidence: [
            NEWS_EVIDENCE(
              '신청 기한 공지',
              '예시일보',
              '2026-08-18',
              '공지된 신청 기한이 아직 남아 있음을 보여준다.',
            ),
          ],
        },
      },
      { text: '대상자는 전체 인구의 절반이다.', start: 18, end: 23, settleAt: 90 },
      { text: '예산은 전액 국비로 충당한다.', start: 25, end: 30, settleAt: 95 },
      { text: '지난해 시범 사업에서 만족도가 가장 높았다.', start: 32, end: 38, settleAt: 99 },
    ],
  },
  {
    id: 'failed',
    videoId: 'mock-fail-6',
    label: '전체 실패',
    note: '영상을 받지 못해 분석을 시작하지 못했다. 조회 HTTP는 그대로 200이다.',
    media: {},
    marks: { collecting: 2, transcribing: 99, extractingClaims: 99, verifying: 99, end: 7 },
    faceManipulation: { status: 'unavailable', status_label: '분석 불가' },
    wholeVideoGeneration: NO_WHOLE_VIDEO_MODEL,
    stages: {
      download: {
        status: 'failed',
        detail: '영상 수집에 실패했다.',
        error: { code: 'download_failed', message: '영상을 받지 못했습니다.', retryable: true },
      },
    },
    finalStatus: 'failed',
    jobError: {
      code: 'download_failed',
      message: '영상을 받지 못했습니다. 공개 상태와 지원 조건을 확인해주세요.',
      retryable: true,
      stage: 'download',
    },
  },
  {
    id: 'long_running',
    videoId: 'mock-slow-7',
    label: '오래 걸림',
    note: '화면에 적히는 시간만 스무 배로 늘린다. 5분을 넘기면 오래 걸린다는 안내가 붙는다.',
    media: {
      title: '[예시] 주장이 많은 3분짜리 영상',
      uploader: '예시 채널',
      duration: 178,
      video_id: 'mock-slow-7',
      language: 'ko',
      transcript_source: 'stt',
      stt_coverage_pct: 88.2,
    },
    /** 실제로는 36초에 끝나고 화면에는 열두 분으로 적힌다. */
    reportScale: 20,
    marks: { collecting: 2, transcribing: 5, extractingClaims: 9, verifying: 13, end: 36 },
    faceManipulation: {
      status: 'no_clear_signs',
      status_label: '뚜렷한 조작 징후 없음',
      detail: '검사한 프레임에서 얼굴 합성 신호를 찾지 못했다. 조작이 없다는 뜻은 아니다.',
      evidence: ['검사한 프레임 8장'],
    },
    wholeVideoGeneration: NO_WHOLE_VIDEO_MODEL,
    transcript: { ...KOREAN_TRANSCRIPT, coverage_pct: 88.2 },
    stages: OK_STAGES,
    finalStatus: 'completed',
    claims: [
      {
        text: '이 제도는 다음 달부터 시행된다.',
        start: 8,
        end: 14,
        settleAt: 16,
        quote: '다음 달부터 바로 시행된다고 합니다.',
        outcome: {
          status: 'done',
          verdict: 'supported',
          reason: '시행 시점을 밝힌 자료를 확인했다.',
          evidence: [
            OFFICIAL_EVIDENCE(
              '제도 시행 일정 공고',
              '예시부처',
              '2026-08-19',
              '시행일을 고시한 1차 자료다.',
            ),
          ],
        },
      },
      {
        text: '신청 기한은 이미 지났다.',
        start: 22,
        end: 28,
        settleAt: 20,
        outcome: {
          status: 'done',
          verdict: 'refuted',
          reason: '공지된 기한과 다르다.',
          evidence: [
            NEWS_EVIDENCE(
              '신청 기한 안내',
              '예시일보',
              '2026-08-18',
              '기한이 아직 남아 있음을 보여준다.',
            ),
          ],
        },
      },
      {
        text: '대상자는 전체 인구의 절반이다.',
        start: 41,
        end: 48,
        settleAt: 25,
        outcome: {
          status: 'done',
          verdict: 'unverified',
          reason: '적용 범위를 밝힌 자료를 찾지 못했다.',
          insufficientReason: 'no_source',
          insufficientLabel: '검색했지만 관련 자료를 찾지 못했습니다',
          evidence: [REFERENCE_EVIDENCE],
        },
      },
      {
        text: '예산은 전액 국비로 충당한다.',
        start: 63,
        end: 70,
        settleAt: 30,
        outcome: {
          status: 'done',
          verdict: 'supported',
          reason: '재원 구성을 밝힌 자료를 확인했다.',
          evidence: [
            OFFICIAL_EVIDENCE(
              '사업 재원 구성 자료',
              '예시부처',
              '2026-08-20',
              '전액 국비로 편성했다고 적고 있다.',
            ),
          ],
        },
      },
      {
        text: '지난해 시범 사업에서 만족도가 가장 높았다.',
        start: 92,
        end: 100,
        settleAt: 34,
        outcome: { status: 'failed', reason: '근거 조회 제공자에서 오류가 반환됐다.' },
      },
    ],
  },
  {
    id: 'non_korean',
    videoId: 'mock-lang-9',
    label: '한국어 아님',
    note: '주 사용 언어가 한국어가 아니다. 실패가 아니라 안내만 붙는다.',
    media: {
      title: '[예시] 영어로 말하는 설명 영상',
      uploader: '예시 채널',
      duration: 49,
      video_id: 'mock-lang-9',
      language: 'en',
      transcript_source: 'stt',
      stt_coverage_pct: 81.5,
    },
    marks: { collecting: 2, transcribing: 7, extractingClaims: 11, verifying: 14, end: 24 },
    faceManipulation: {
      status: 'no_clear_signs',
      status_label: '뚜렷한 조작 징후 없음',
      detail: '검사한 프레임에서 얼굴 합성 신호를 찾지 못했다. 조작이 없다는 뜻은 아니다.',
      evidence: ['검사한 프레임 8장'],
    },
    wholeVideoGeneration: NO_WHOLE_VIDEO_MODEL,
    transcript: { ...KOREAN_TRANSCRIPT, language: 'en', keywords: [] },
    stages: OK_STAGES,
    finalStatus: 'completed',
    claims: [
      {
        text: '이 정책은 올해 안에 시행된다.',
        start: 6,
        end: 12,
        settleAt: 17,
        outcome: {
          status: 'done',
          verdict: 'supported',
          reason: '시행 시점을 밝힌 자료를 확인했다.',
          evidence: [
            NEWS_EVIDENCE(
              '정책 시행 일정 공개',
              '예시경제',
              '2026-05-14',
              '시행 시점을 날짜로 밝히고 있다.',
            ),
          ],
        },
      },
      {
        text: '관련 예산이 지난해보다 두 배로 늘었다.',
        start: 20,
        end: 27,
        settleAt: 21,
        outcome: {
          status: 'done',
          verdict: 'unverified',
          reason: '한국어가 아닌 발언이라 검색어를 정확히 만들지 못했다.',
          insufficientReason: 'no_source',
          insufficientLabel: '검색했지만 관련 자료를 찾지 못했습니다',
          evidence: [REFERENCE_EVIDENCE],
        },
      },
    ],
  },
  {
    id: 'session_busy',
    videoId: 'mock-busy-8',
    label: '세션 충돌 (429)',
    note: '같은 세션에 진행 중인 작업이 있어 접수가 거절된다. 자동 재접수하지 않는다.',
    media: {},
    marks: NORMAL_MARKS,
    faceManipulation: { status: 'unavailable' },
    wholeVideoGeneration: NO_WHOLE_VIDEO_MODEL,
    finalStatus: 'failed',
    rejectSubmit: {
      httpStatus: 429,
      retryAfterSec: 10,
      body: {
        code: 'session_busy',
        message: '진행 중인 분석이 있습니다. 먼저 확인해주세요.',
        retryable: true,
      },
    },
  },
]

/**
 * 링크에서 뽑은 영상 ID로 시나리오를 고른다. 시나리오 ID가 아닌 링크는
 * 정상 완료로 재생한다. 링크 형식 자체가 틀린 경우는 여기까지 오지 않고
 * `unsupported_url`로 거절된다.
 */
export function pickScenario(videoId: string): MockScenario {
  const found = MOCK_SCENARIOS.find((scenario) => scenario.videoId === videoId)
  return found ?? (MOCK_SCENARIOS[0] as MockScenario)
}
