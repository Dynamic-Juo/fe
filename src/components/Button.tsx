import type { ButtonHTMLAttributes } from 'react'

import * as styles from './Button.css'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof styles.variant
  size?: keyof typeof styles.size
  fullWidth?: boolean
}

export function Button({
  variant = 'solid',
  size = 'md',
  fullWidth = false,
  type = 'button',
  className,
  ...rest
}: Props) {
  const classes = [
    styles.button,
    styles.variant[variant],
    styles.size[size],
    fullWidth ? styles.fullWidth : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return <button type={type} className={classes} {...rest} />
}
