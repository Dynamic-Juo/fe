import type { ReactNode } from 'react'

import * as styles from './Chip.css'

export type ChipEmphasis = keyof typeof styles.emphasis
export type ChipTone = keyof typeof styles.tone

type Props = {
  children: ReactNode
  /** 색 없이도 구분되도록 두께와 굵기를 바꾼다. */
  emphasis?: ChipEmphasis
  /** 축에 따른 색. 두께·굵기 구분은 `emphasis`가 그대로 맡는다. */
  tone?: ChipTone
  size?: keyof typeof styles.size
  /** 문구 앞에 붙는 그림. 색을 못 보는 경우에도 구분되게 한다. */
  icon?: ReactNode
}

export function Chip({
  children,
  emphasis = 'normal',
  tone = 'neutral',
  size = 'md',
  icon,
}: Props) {
  return (
    <span
      className={`${styles.chip} ${styles.emphasis[emphasis]} ${styles.tone[tone]} ${styles.size[size]}`}
    >
      {icon}
      {children}
    </span>
  )
}
