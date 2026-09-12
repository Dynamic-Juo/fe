import { style } from '@vanilla-extract/css'

import { vars } from '../../styles/contract.css'

export const section = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
})

export const sectionTitle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
})

export const heading = style({
  fontSize: vars.font.size.xl,
  fontWeight: vars.font.weight.bold,
  letterSpacing: vars.font.letterSpacing.tight,
})

export const head = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
})

export const name = style({
  flex: 1,
  fontSize: vars.font.size.md,
})

export const detail = style({
  color: vars.color.text.tertiary,
  fontSize: vars.font.size.md,
  lineHeight: vars.font.lineHeight.relaxed,
})

export const evidence = style({
  margin: 0,
  paddingLeft: vars.space.md,
  color: vars.color.text.faint,
  fontSize: vars.font.size.xs,
  lineHeight: vars.font.lineHeight.relaxed,
})
