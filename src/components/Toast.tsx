import { useEffect } from 'react'
import { createPortal } from 'react-dom'

import { AlertIcon, CheckIcon } from './icons'
import * as styles from './Toast.css'

/** 알림을 띄워 두는 기본 시간. */
const DEFAULT_MS = 2000

export type ToastTone = keyof typeof styles.icon

/**
 * 잠깐 알리고 사라지는 메시지다. 화면 중앙 위에 뜬다.
 *
 * 시간이 지나면 스스로 사라지므로 부르는 쪽은 메시지만 들고 있으면 된다.
 * `message`가 `null`이면 아무것도 그리지 않는다.
 *
 * `tone`은 앞에 붙는 표시만 정한다. 성공은 체크, 실패는 느낌표, 그 밖의
 * 알림은 표시 없이 글자만 둔다.
 *
 * 본문 밖에 붙인다. 상단바나 카드처럼 넘침을 자르거나 `transform`을 가진
 * 조상 안에 있으면 화면 기준 위치가 그 안에 갇힌다.
 */
export function Toast({
  message,
  tone = 'plain',
  onDone,
  duration = DEFAULT_MS,
}: {
  message: string | null
  tone?: ToastTone
  /** 사라질 때. 부르는 쪽이 메시지를 비운다. */
  onDone: () => void
  duration?: number
}) {
  useEffect(() => {
    if (message === null) return
    const timer = setTimeout(onDone, duration)
    return () => {
      clearTimeout(timer)
    }
  }, [message, duration, onDone])

  if (message === null) return null

  return createPortal(
    <div className={styles.toast} role="status" aria-live="polite">
      {tone === 'plain' ? null : (
        <span className={`${styles.mark} ${styles.icon[tone]}`}>
          {tone === 'success' ? <CheckIcon size={16} /> : <AlertIcon size={16} />}
        </span>
      )}
      {message}
    </div>,
    document.body,
  )
}
