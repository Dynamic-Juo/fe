import type { ReactNode } from 'react'

import { A11Y } from '../copy/strings'
import { CloseIcon } from './icons'
import * as styles from './Banner.css'

type Props = {
  title: string
  description?: string
  icon?: ReactNode
  tone?: keyof typeof styles.tone
  action?: ReactNode
  /** 사용자가 바로 알아야 하는 실패는 낭독기에도 알린다. */
  assertive?: boolean
  /** 주면 닫기 단추가 생긴다. 사용자가 치울 수 있는 안내에만 준다. */
  onDismiss?: () => void
  dismissLabel?: string
}

export function Banner({
  title,
  description,
  icon,
  tone = 'info',
  action,
  assertive = false,
  onDismiss,
  dismissLabel = A11Y.dismiss,
}: Props) {
  const dismissable = onDismiss !== undefined
  const cell = (dismissableStyle: string) => (dismissable ? ` ${dismissableStyle}` : '')

  return (
    <div
      className={`${styles.banner} ${styles.tone[tone]}${cell(styles.grid)}`}
      role={assertive ? 'alert' : 'status'}
      aria-live={assertive ? 'assertive' : 'polite'}
    >
      {icon ? <span className={styles.icon}>{icon}</span> : null}
      <div className={`${styles.body}${cell(styles.unwrap)}`}>
        <p className={`${styles.title}${cell(styles.titleInset)}`}>{title}</p>
        {description ? (
          <p className={`${styles.description}${cell(styles.descriptionRow)}`}>{description}</p>
        ) : null}
      </div>
      {action === undefined && !dismissable ? null : (
        <div className={`${styles.side}${cell(styles.unwrap)}`}>
          {onDismiss === undefined ? null : (
            <button
              type="button"
              className={styles.dismiss}
              aria-label={dismissLabel}
              onClick={onDismiss}
            >
              <CloseIcon size={18} />
            </button>
          )}
          {action ? (
            <div className={`${styles.action}${cell(styles.actionRow)}`}>{action}</div>
          ) : null}
        </div>
      )}
    </div>
  )
}
