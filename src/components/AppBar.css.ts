import { style } from '@vanilla-extract/css'

import { media } from '../styles/breakpoints'
import { vars } from '../styles/contract.css'

export const bar = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  flexShrink: 0,
  height: '3.5rem',
  padding: `0 ${vars.space.lg}`,
  borderBottom: `${vars.borderWidth.thin} solid ${vars.color.border.subtle}`,
  '@media': {
    [media.desktop]: {
      height: '4rem',
      padding: `0 ${vars.space.xxl}`,
    },
  },
})

export const brand = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.xs,
  fontSize: vars.font.size.xl,
  fontWeight: vars.font.weight.bold,
  letterSpacing: vars.font.letterSpacing.tight,
  color: vars.color.text.primary,
  textDecoration: 'none',
})

export const actions = style({
  marginLeft: 'auto',
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
})
