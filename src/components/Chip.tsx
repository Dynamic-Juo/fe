import type { ReactNode } from 'react'

import * as styles from './Chip.css'

export type ChipEmphasis = keyof typeof styles.emphasis

type Props = {
  children: ReactNode
  /** 색 없이도 구분되도록 두께와 굵기를 바꾼다. */
  emphasis?: ChipEmphasis
  size?: keyof typeof styles.size
}

export function Chip({ children, emphasis = 'normal', size = 'md' }: Props) {
  return (
    <span className={`${styles.chip} ${styles.emphasis[emphasis]} ${styles.size[size]}`}>
      {children}
    </span>
  )
}
