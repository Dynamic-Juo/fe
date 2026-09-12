import type { ReactNode } from 'react'

import * as styles from './Banner.css'

type Props = {
  title: string
  description?: string
  icon?: ReactNode
  tone?: keyof typeof styles.tone
  action?: ReactNode
  /** 사용자가 바로 알아야 하는 실패는 낭독기에도 알린다. */
  assertive?: boolean
}

export function Banner({
  title,
  description,
  icon,
  tone = 'info',
  action,
  assertive = false,
}: Props) {
  return (
    <div
      className={`${styles.banner} ${styles.tone[tone]}`}
      role={assertive ? 'alert' : 'status'}
      aria-live={assertive ? 'assertive' : 'polite'}
    >
      {icon ? <span className={styles.icon}>{icon}</span> : null}
      <div className={styles.body}>
        <p className={styles.title}>{title}</p>
        {description ? <p className={styles.description}>{description}</p> : null}
      </div>
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  )
}
