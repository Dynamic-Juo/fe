import type { InputHTMLAttributes, ReactNode, Ref } from 'react'
import { useId } from 'react'

import * as styles from './TextField.css'

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  /** 자리 표시자를 설명 대신 쓰지 않는다. 입력을 시작하면 사라진다. */
  label: string
  /** 화면에 라벨을 감춰야 할 때만 쓴다. 낭독기에는 남는다. */
  hideLabel?: boolean
  icon?: ReactNode
  invalid?: boolean
  describedBy?: string
  ref?: Ref<HTMLInputElement>
}

export function TextField({
  label,
  hideLabel = false,
  icon,
  invalid = false,
  describedBy,
  ref,
  ...rest
}: Props) {
  const id = useId()

  return (
    <div>
      <label htmlFor={id} hidden={hideLabel}>
        {label}
      </label>
      <div className={`${styles.wrapper} ${invalid ? styles.invalid : ''}`.trim()}>
        {icon ? <span className={styles.icon}>{icon}</span> : null}
        <input
          ref={ref}
          id={id}
          className={styles.input}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          {...rest}
        />
      </div>
    </div>
  )
}
