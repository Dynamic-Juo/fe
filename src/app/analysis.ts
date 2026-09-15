/**
 * 마지막 분석 한 건을 브라우저에 남긴다. 로그인이 없고 서버에 이력도 없어서
 * 진행 중이거나 끝난 분석으로 돌아갈 방법이 이것뿐이다.
 *
 * `jobAccessToken`이 없으면 조회가 404다. 작업이 살아 있는지와 무관하다.
 * 그래서 작업 ID만 따로 두지 않고 둘을 한 레코드로 묶는다.
 *
 * `sessionId`는 인증 수단이 아니다. 세션당 활성 작업을 하나로 묶는 값이며,
 * 새 ID를 만들어 그 제한을 우회하지 않는다.
 *
 * 계정별 이력이나 다른 기기 동기화가 아니다. 같은 브라우저, 같은 출처에
 * 저장이 남아 있을 때만 복원한다.
 */

const KEY = 'chamsae.analysis.v1'

/**
 * 조회 토큰이 없던 시절의 키다. 남아 있어도 복원할 수 없다. 토큰은 서버가
 * 접수할 때 서명해 주는 값이라 작업 ID로 만들어낼 수 없고, 세션 목록으로
 * 찾아보는 경로도 공개에서 닫혀 있다.
 */
const LEGACY_KEY = 'chamsae.session'

export interface StoredAnalysis {
  jobId: string
  /** 이 작업의 결과를 읽을 자격. URL·로그·공유 링크에 넣지 않는다. */
  jobAccessToken: string
  sessionId: string
  /** 저장 시각. 토큰은 24시간 뒤 만료된다. */
  savedAt: number
}

export function readAnalysis(): StoredAnalysis | null {
  try {
    localStorage.removeItem(LEGACY_KEY)
    const raw = localStorage.getItem(KEY)
    if (raw === null) return null

    const parsed = JSON.parse(raw) as Partial<StoredAnalysis>
    if (
      typeof parsed.jobId !== 'string' ||
      typeof parsed.jobAccessToken !== 'string' ||
      typeof parsed.sessionId !== 'string' ||
      typeof parsed.savedAt !== 'number'
    ) {
      return null
    }
    return parsed as StoredAnalysis
  } catch {
    // 저장소를 못 읽어도 화면 오류로 만들지 않는다. 이번 분석은 그대로 진행된다.
    return null
  }
}

export function writeAnalysis(record: StoredAnalysis): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(record))
  } catch {
    // 저장하지 못해도 이번 분석은 진행된다. 재방문으로 돌아갈 길만 없어진다.
  }
}

export function clearAnalysis(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // 지우지 못해도 다음 접수가 덮어쓴다.
  }
}
