import { style } from '@vanilla-extract/css'

import { vars } from '../../styles/contract.css'

export const box = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space.xs,
  padding: `${vars.space.xxl} ${vars.space.sm}`,
})

export const icon = style({
  color: vars.color.text.disabled,
})

export const text = style({
  color: vars.color.text.tertiary,
  fontSize: vars.font.size.md,
  lineHeight: vars.font.lineHeight.relaxed,
  textAlign: 'center',
})
