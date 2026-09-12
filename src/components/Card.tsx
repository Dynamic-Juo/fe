import type { HTMLAttributes } from 'react'

import * as styles from './Card.css'

type Props = HTMLAttributes<HTMLDivElement> & {
  tone?: keyof typeof styles.tone
}

export function Card({ tone = 'default', className, ...rest }: Props) {
  return (
    <div className={`${styles.card} ${styles.tone[tone]} ${className ?? ''}`.trim()} {...rest} />
  )
}
