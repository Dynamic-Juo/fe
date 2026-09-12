import { style } from '@vanilla-extract/css'

import { vars } from '../../styles/contract.css'

export const actions = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space.sm,
  padding: `${vars.space.md} ${vars.space.lg} ${vars.space.xxl}`,
})

export const meta = style({
  alignSelf: 'flex-start',
  color: vars.color.text.faint,
  fontSize: vars.font.size.xs,
})

export const feedback = style({
  color: vars.color.text.faint,
  fontSize: vars.font.size.xs,
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
})
