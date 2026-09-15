/**
 * 브라우저에 남기는 최소한의 상태다. 로그인이 없고 서버에 이력도 없어서,
 * 진행 중인 분석으로 돌아갈 방법이 이것뿐이다.
 *
 * `sessionId`는 인증 토큰이 아니다. 세션당 활성 작업을 하나로 묶는 값이다.
 * 새 ID를 만들어 세션 제한을 우회하지 않는다.
 */

const KEY = 'chamsae.session'

export interface StoredSession {
  sessionId: string | null
  /** 마지막으로 접수한 작업. 종료 여부와 무관하게 마지막 값을 둔다. */
  lastJobId: string | null
}

const EMPTY: StoredSession = { sessionId: null, lastJobId: null }

export function readSession(): StoredSession {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw === null) return EMPTY
    const parsed = JSON.parse(raw) as Partial<StoredSession>
    return {
      sessionId: typeof parsed.sessionId === 'string' ? parsed.sessionId : null,
      lastJobId: typeof parsed.lastJobId === 'string' ? parsed.lastJobId : null,
    }
  } catch {
    return EMPTY
  }
}

export function writeSession(next: StoredSession): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // 저장하지 못해도 이번 분석은 진행된다. 새로고침 뒤 돌아갈 길만 없어진다.
  }
}
