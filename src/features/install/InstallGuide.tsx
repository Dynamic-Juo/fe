import { useEffect, useRef } from 'react'

import { Button } from '../../components'
import { HOME } from '../../copy/strings'
import * as styles from './InstallGuide.css'

/**
 * iOS 설치 안내다. Safari에는 설치 창을 여는 방법이 없어 절차를 글로 적는다.
 *
 * 화면을 가리는 시트라 닫는 길을 분명히 둔다. 열리면 초점을 안으로 옮기고
 * 바깥을 누르거나 Esc를 눌러 닫는다.
 */
export function InstallGuide({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <div
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-label={HOME.installGuideTitle}
        onClick={(event) => {
          event.stopPropagation()
        }}
      >
        <h2 className={styles.title}>{HOME.installGuideTitle}</h2>
        <ol className={styles.steps}>
          {HOME.installGuideSteps.map((step) => (
            <li key={step} className={styles.step}>
              {step}
            </li>
          ))}
        </ol>
        <Button ref={closeRef} variant="outline" fullWidth onClick={onClose}>
          {HOME.installGuideClose}
        </Button>
      </div>
    </div>
  )
}
