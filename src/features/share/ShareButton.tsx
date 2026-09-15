import { useCallback, useState } from 'react'

import { SITE_URL } from '../../app/site'
import { IconButton, Toast, type ToastTone } from '../../components'
import { ShareIcon } from '../../components/icons'
import { SHARE } from '../../copy/strings'

/**
 * 홈 상단바의 공유 진입점이다.
 *
 * 기기 공유 창을 먼저 연다. 쓸 수 없는 환경이면 링크를 복사한다. 둘 다
 * 안 되면 안 됐다고 알린다. 아무 반응이 없으면 눌렀는지 알 수 없다.
 *
 * 사용자가 공유 창을 닫은 것은 실패가 아니다. 그때는 복사로 넘어가지 않는다.
 * 취소했는데 클립보드가 바뀌면 하지 않은 일이 일어난 것이 된다.
 */
interface Notice {
  text: string
  tone: ToastTone
}

export function ShareButton() {
  const [notice, setNotice] = useState<Notice | null>(null)
  const clear = useCallback(() => {
    setNotice(null)
  }, [])

  const onClick = () => {
    void share(setNotice)
  }

  return (
    <>
      <IconButton label={SHARE.label} onClick={onClick}>
        <ShareIcon size={17} />
      </IconButton>
      <Toast message={notice?.text ?? null} tone={notice?.tone ?? 'plain'} onDone={clear} />
    </>
  )
}

async function share(setNotice: (value: Notice) => void): Promise<void> {
  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({ title: SHARE.title, text: SHARE.text, url: SITE_URL })
      return
    } catch (error) {
      // 사용자가 닫은 것이면 여기서 끝낸다.
      if (error instanceof DOMException && error.name === 'AbortError') return
      // 그 밖의 실패는 공유를 쓸 수 없는 환경으로 보고 복사로 넘어간다.
    }
  }

  try {
    await navigator.clipboard.writeText(SITE_URL)
    setNotice({ text: SHARE.copied, tone: 'success' })
  } catch {
    setNotice({ text: SHARE.failed, tone: 'error' })
  }
}
