import type { ButtonHTMLAttributes, ReactNode } from 'react'

import * as styles from './IconButton.css'

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  /** 화면에는 아이콘만 보이므로 이름을 반드시 준다. 낭독기가 읽을 것이 없다. */
  label: string
  children: ReactNode
}

export function IconButton({ label, children, type = 'button', className, ...rest }: Props) {
  return (
    <button
      type={type}
      className={`${styles.button} ${className ?? ''}`.trim()}
      aria-label={label}
      title={label}
      {...rest}
    >
      {children}
    </button>
  )
}
