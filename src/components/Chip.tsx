import type { ReactNode } from 'react'

import * as styles from './Chip.css'

export type ChipEmphasis = keyof typeof styles.emphasis

type Props = {
  children: ReactNode
  /** 색 없이도 구분되도록 두께와 굵기를 바꾼다. */
  emphasis?: ChipEmphasis
}

export function Chip({ children, emphasis = 'normal' }: Props) {
  return <span className={`${styles.chip} ${styles.emphasis[emphasis]}`}>{children}</span>
}
