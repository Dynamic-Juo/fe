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

/**
 * 주장 수가 정해지기 전까지 거치는 네 단계다. 순서가 곧 진행 표시의 칸
 * 순서이며, 서버의 `job.stage`를 사용자 문구로 옮긴 것이다.
 *
 * `headline`은 지금 하고 있는 일, `done`은 그 단계를 마쳤다는 표기다.
 */
export const STEPS = [
  { key: 'queued', name: '대기 중', headline: '분석을 기다리고 있습니다' },
  {
    key: 'collecting',
    name: '영상 처리 중',
    headline: '영상을 처리하고 있습니다',
    done: '영상 처리 완료',
  },
  {
    key: 'transcribing',
    name: '발언 추출 중',
    headline: '발언을 추출하고 있습니다',
    done: '발언 추출 완료',
  },
  {
    key: 'extracting_claims',
    name: '검증 준비 중',
    headline: '검증 결과를 준비하고 있습니다',
    done: '검증 준비 완료',
  },
] as const

/** 작업 전체의 상태를 한마디로 적는다. 처리 상태·판정과 또 다른 축이다. */
export const JOB_STATE_LABEL = {
  running: '분석 중',
  completed: '분석 완료',
  completed_with_limitations: '일부 분석만 완료',
  timed_out: '분석 시간 초과',
  failed: '분석 실패',
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

/** 음성 합성은 MVP에서 제외다. 라벨을 만들지 않는다. */
export const DETECTION_LABEL = {
  face: '얼굴 합성 · 변형',
  disclosure: '업로더 AI·합성 표기',
} as const

/**
 * 업로더가 제목이나 설명에 스스로 적은 표기다. 영상을 분석한 결과가 아니라서
 * 조작 단계 라벨을 쓰지 않는다. `조작 의심`이라고 적으면 우리가 판정한
 * 것처럼 읽힌다.
 *
 * 이름에 `AI 생성`만 쓰지 않는다. 서버는 딥페이크·합성 영상·가상 인물도 같이
 * 잡는다.
 *
 * 표기가 있을 때만 보여준다. 없다고 적으면 AI로 만들지 않았다는 뜻으로 읽힌다.
 */
export const DISCLOSURE = {
  chip: '표기 있음',
  /**
   * 어떤 표기였는지는 근거 목록이 말한다. 여기에 `AI로 만들었다`라고 적지
   * 않는다. 서버는 `패러디`, `합성 영상`처럼 AI 생성이 아닌 표기도 같이
   * 잡는다.
   */
  detail: '업로더가 제목이나 설명에 아래 표기를 했습니다.',
} as const

export const HOME = {
  title: '참새',
  /** 상단바에서 이름 옆에 붙는다. 이름만 두면 무엇을 하는지 모른다. */
  headerTagline: '진짜 소식을 물어와드려요!',
  /**
   * 부제 두 줄이다. `mark`에 들어가는 글자가 이름을 이룬다. 참새의 참과 새라서
   * 그 두 글자에만 붓칠 강조를 얹는다.
   */
  subtitle: [
    { before: '그 영상, ', mark: '참', after: '이야?' },
    { before: '', mark: '새', after: '빨간 거짓이야?' },
  ],
  /** 두 문장이라 어느 폭에서나 줄을 끊는다. */
  taglineHead: '영상 속 주장과 사실을 AI가 꼼꼼히 확인합니다.',
  taglineLead: '그냥 넘기지 말고, ',
  taglineName: '참새',
  taglineTail: '에게 물어보세요.',
  inputPlaceholder: 'YouTube 영상 링크 붙여넣기',
  submit: '분석하기',
  supportNotice: '길이 3분 이하인 공개 YouTube 영상을 분석합니다.',
  optimizedNotice: '한국어 영상에 최적화되어 있습니다.',
  feedback: '피드백 · 잘못된 결과 신고',
  install: '앱으로 설치',
  installGuideTitle: '홈 화면에 추가하기',
  installGuideSteps: ['브라우저 하단의 공유 버튼을 누릅니다.', '홈 화면에 추가를 선택합니다.'],
  installGuideClose: '닫기',
  submitting: '접수하는 중',
  viewRunning: '진행 중인 분석 보기',
  checkingVideo: '영상을 확인하는 중',
} as const

/**
 * 홈 아래쪽 기능 소개다. 넓은 화면에서만 그린다. 좁은 화면에서는 입력까지
 * 닿는 길이 길어진다.
 *
 * 우리가 실제로 하는 일만 적는다. 영상 요약은 하지 않으므로 쓰지 않는다.
 */
export const FEATURES = [
  { key: 'claims', name: '주장 추출', detail: '영상 속 주요 주장을 AI가 찾아냅니다.' },
  {
    key: 'evidence',
    name: '근거 찾기',
    detail: '주장을 뒷받침하거나 반박하는 자료를 찾아 붙입니다.',
  },
  { key: 'media', name: '조작 징후', detail: '얼굴 합성 같은 조작 징후를 함께 확인합니다.' },
] as const

/**
 * 공유 진입점 문구다. 기기 공유 창이 받는 제목과 설명, 복사했을 때의 알림을
 * 함께 둔다.
 */
export const SHARE = {
  label: '공유하기',
  title: '참새 AI',
  text: '그 영상, 참인지 새빨간 거짓인지 확인해 보세요.',
  copied: '링크를 복사했어요',
  failed: '복사하지 못했어요',
} as const

export const FOOTER = {
  name: '참새',
  tagline: '그 영상, 참인지 새빨간 거짓인지.',
  github: '저장소',
} as const

export const PROGRESS = {
  /** 주장 수가 확정되기 전에는 개수를 표시하지 않는다. */
  preparing: '검증 결과를 준비하고 있습니다.',
  claimsFound: (total: number) => `검증할 주장 ${total}개를 찾았습니다`,
  completedOf: (done: number, total: number) => `${done}/${total}개 완료`,
  longRunning: '분석이 예상보다 오래 걸리고 있습니다. 완료된 결과부터 확인할 수 있습니다.',
  /** 대기열에서 기다린 시간과 분석 시간을 나눠서 적는다. 둘은 다른 시간이다. */
  waited: (value: string) => `대기 ${value}`,
  analyzing: (value: string) => `분석 ${value}`,
  elapsed: (value: string) => `경과 ${value}`,
  /** 요약 자리를 미리 잡아 둔다. 나중에 요약이 들어와도 위아래 블록이 밀리지 않는다. */
  summarySlot: '분석이 끝나면 이 자리에 최종 요약이 나타납니다.',
} as const

export const SUMMARY = {
  heading: '분석 결과 요약',
  verdicts: '주장 판정',
  total: (count: number) => `전체 ${count}개`,
  supported: (count: number) => `일치 ${count}`,
  refuted: (count: number) => `불일치 ${count}`,
  unverified: (count: number) => `근거 부족 ${count}`,
  /** 사용자에게는 완료 항목 수와 전체 항목 수만 보인다. 내부 등급은 화면에 없다. */
  counts: (done: number, unfinished: number, timedOut: number) =>
    `완료 ${done} · 미완료 ${unfinished} · 시간 초과 ${timedOut}`,
  analysisId: '분석 ID',
} as const

export const CLAIM = {
  analyzing: '분석 중',
  /** 서버가 인용 검증을 통과시킨 발췌다. 주장 요약이 아니라 실제로 한 말이다. */
  quote: '영상에서 한 말',
  /** 주장만 떼어 놓으면 뜻이 달라지는 경우가 있어 앞뒤를 함께 둔다. */
  context: '앞뒤 문맥',
  evidenceCount: (count: number) => `근거 ${count}건`,
  referenceCount: (count: number) => `참고 자료 ${count}건 · 판정에는 사용하지 않음`,
  sourceLink: '원문 링크',
  failed: '이 주장의 근거를 확인하지 못했습니다.',
  timedOut: '시간 안에 검증을 끝내지 못했습니다.',
} as const

export const OUTCOME = {
  partial: {
    title: '일부 분석만 완료되었습니다',
    description: '분석하지 못한 영역과 이유를 해당 자리에 표시합니다.',
  },
  timedOut: {
    title: '분석 시간이 초과되었습니다',
    description: '완료된 결과는 그대로 확인할 수 있습니다.',
  },
  failed: {
    title: '분석 결과를 만들지 못했습니다',
    description: '어느 단계에서 멈췄는지는 아래 설명을 확인해주세요.',
  },
  /** 한국어가 아닌 영상은 분석 전에 거를 수 없다. 실패나 분석 불가가 아니다. */
  nonKorean: {
    title: '한국어 영상이 아닙니다',
    description: '판정 신뢰도가 떨어질 수 있습니다. 분석은 그대로 진행했습니다.',
  },
} as const

export const RESULT = {
  /** 깨끗하게 끝났을 때의 머리말. 개수와 판정은 아래 목록과 요약이 말한다. */
  done: '참새가 물어온 결과입니다',
  noClaims: '영상에서 외부 근거로 확인할 수 있는 주장을 찾지 못했습니다.',
  claimUnavailable: '발언을 텍스트로 옮기지 못해 주장을 검증할 수 없습니다.',
  /** 이유를 모를 때 쓴다. 서버가 이유를 주면 그쪽을 먼저 쓴다. */
  claimNotRun: '주장 검증을 수행하지 못했습니다.',
  nonKoreanNotice: '한국어 영상이 아니어서 판정 신뢰도가 떨어질 수 있습니다.',
  partial: '일부 분석만 완료되었습니다.',
  timedOut: '분석 시간이 초과되었습니다. 완료된 결과는 그대로 확인할 수 있습니다.',
  failed: '분석 결과를 만들지 못했습니다.',
  retry: '다시 분석',
  retrying: '접수하는 중',
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
  unsupportedUrlDetail: 'YouTube 영상 링크만 분석합니다. 길이 3분 이하인 공개 영상.',
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
