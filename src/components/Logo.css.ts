import { style, styleVariants } from '@vanilla-extract/css'

import { vars } from '../styles/contract.css'

export const mark = style({
  display: 'grid',
  placeItems: 'center',
  flexShrink: 0,
  borderRadius: vars.radius.full,
  color: vars.color.text.primary,
})

export const size = styleVariants({
  sm: {
    width: '1.5rem',
    height: '1.5rem',
    border: `${vars.borderWidth.medium} solid ${vars.color.border.strong}`,
  },
  md: {
    width: '3.75rem',
    height: '3.75rem',
    border: `${vars.borderWidth.thick} solid ${vars.color.border.strong}`,
  },
  lg: {
    width: '4.75rem',
    height: '4.75rem',
    border: `${vars.borderWidth.thick} solid ${vars.color.border.strong}`,
  },
})
