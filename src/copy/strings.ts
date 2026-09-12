/**
 * 화면 문구를 한곳에 모았다. 판정 세부 문구는 U-03, 안내 문구는 U-05가
 * 아직 결정 전이라 바뀔 수 있다. 컴포넌트에 문자열을 흩뿌리지 않는다.
 *
 * 아래 라벨 중 일부는 결정으로 고정된 값이다. 줄이거나 바꾸지 않는다.
 */

/** U-03에서 고정했다. 확률이나 숫자 점수는 함께 표시하지 않는다. */
export const VERDICT_LABEL = {
  supported: '근거와 일치',
  refuted: '근거와 불일치',
  unverified: '근거 부족',
} as const

/**
 * U-04에서 고정했다. `조작되지 않음`이나 `실제 영상`처럼 조작이 없다고
 * 단정하는 표현을 쓰지 않는다. 라벨을 줄이지 않는다. `뚜렷한 조작 징후
 * 없음`을 `징후 없음`으로 줄이면 단정에 가까워진다.
 */
export const MANIPULATION_LABEL = {
  suspected: '조작 의심',
  no_clear_signs: '뚜렷한 조작 징후 없음',
  inconclusive: '판단 보류',
  unavailable: '분석 불가',
} as const

/** 처리 상태. 검증 판정과 다른 축이며 한 칩에 합치지 않는다. */
export const CLAIM_STATUS_LABEL = {
  pending: '대기 중',
  verifying: '검증 중',
  done: '완료',
  failed: '실패',
  timed_out: '시간 초과',
} as const

/** 진행 단계. 서버의 `job.stage`를 사용자 문구로 옮긴다. */
export const STAGE_LABEL = {
  queued: '대기 중',
  collecting: '영상 처리 중',
  transcribing: '발언 추출 중',
  extracting_claims: '검증 결과 준비 중',
  verifying: '주장 검증 중',
} as const

/** 근거가 부족한 이유. 서버가 `insufficient_label`을 주면 그쪽을 우선한다. */
export const INSUFFICIENT_LABEL = {
  no_source: '검색했지만 관련 자료를 찾지 못했습니다',
  not_direct: '자료가 같은 주제만 다루고 주장을 직접 확인하지 못했습니다',
  timeout: '근거를 확인하는 데 시간이 걸려 판단하지 못했습니다',
  time_mismatch: '주장과 자료의 기준 시점이 다릅니다',
  source_conflict: '신뢰할 수 있는 출처가 서로 충돌합니다',
  weak_source: '출처의 신뢰성이나 내용이 판정에 충분하지 않습니다',
  partial: '주장의 일부만 확인됐습니다',
} as const

export const SECTION = {
  mediaManipulation: '미디어 조작 가능성',
  claimVerification: '주장 사실성 검증',
  summary: '분석 결과 요약',
  videoInfo: '분석 대상 영상',
} as const

export const DETECTION_LABEL = {
  face: '얼굴 합성 · 변형',
  wholeVideo: '영상 전체 AI 생성',
} as const

export const HOME = {
  title: 'Conan AI',
  tagline: '영상의 조작 가능성과 주장의 사실성을 따로 확인합니다',
  inputPlaceholder: 'YouTube Shorts 링크 붙여넣기',
  submit: '분석하기',
  supportNotice: '공개 상태인 YouTube Shorts를 분석합니다. 최대 3분.',
  optimizedNotice: '한국어 영상에 최적화되어 있습니다.',
  feedback: '피드백 · 잘못된 결과 신고',
  install: '앱으로 설치',
} as const

export const PROGRESS = {
  /** 주장 수가 확정되기 전에는 개수를 표시하지 않는다. */
  preparing: '검증 결과를 준비하고 있습니다.',
  claimsFound: (total: number) => `검증할 주장 ${total}개를 찾았습니다`,
  completedOf: (done: number, total: number) => `${done}/${total}개 완료`,
  longRunning: '분석이 예상보다 오래 걸리고 있습니다. 완료된 결과부터 확인할 수 있습니다.',
} as const

export const RESULT = {
  noClaims: '영상에서 외부 근거로 확인할 수 있는 주장을 찾지 못했습니다.',
  claimUnavailable: '발언을 텍스트로 옮기지 못해 주장을 검증할 수 없습니다.',
  nonKoreanNotice: '한국어 영상이 아니어서 판정 신뢰도가 떨어질 수 있습니다.',
  partial: '일부 분석만 완료되었습니다.',
  timedOut: '분석 시간이 초과되었습니다. 완료된 결과는 그대로 확인할 수 있습니다.',
  failed: '분석 결과를 만들지 못했습니다.',
  retry: '다시 분석',
  newAnalysis: '새 영상 분석',
  evidenceReason: '판정 근거',
  insufficientReason: '판정하지 못한 이유',
  referenceOnly: '참고 자료 · 판정에는 사용하지 않음',
  spokenUnknown: '발언 위치 확인 불가',
  transcriptSource: '음성 인식',
  captionSource: '자막',
} as const

export const ERROR = {
  unsupportedUrl: '이 링크는 분석할 수 없습니다',
  unsupportedUrlDetail: 'YouTube Shorts 링크만 분석합니다. 공개 상태인 영상, 최대 3분.',
  videoNotFound: '영상을 찾을 수 없습니다',
  inaccessible: '접근할 수 없는 영상입니다',
  inaccessibleDetail: '비공개, 일부 공개, 연령 제한 영상은 분석할 수 없습니다.',
  sessionBusy: '진행 중인 분석이 있습니다',
  sessionBusyDetail: '한 번에 한 영상만 분석합니다. 진행 중인 분석을 먼저 확인하세요.',
  serverBusy: '요청이 많아 잠시 기다려야 합니다',
  jobNotFound: '분석 결과를 찾을 수 없습니다',
  jobNotFoundDetail: '서버에 결과가 남아 있지 않습니다. 다시 분석할 수 있습니다.',
  downloadFailed: '영상을 가져오지 못했습니다',
  authRequired: '로그인이 필요합니다',
  authRequiredDetail: 'API 접근 인증을 마친 뒤 다시 시도해주세요.',
  network: '서버에 연결하지 못했습니다',
  unknown: '알 수 없는 오류가 발생했습니다',
} as const

export const A11Y = {
  goHome: '처음으로',
  expand: '펼치기',
  collapse: '접기',
  openSource: '원문 열기',
  seekTo: '해당 위치로 이동',
} as const
