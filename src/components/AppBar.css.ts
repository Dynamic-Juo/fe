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

/** 나가는 길. 아이콘만 두되 누를 자리는 충분히 잡는다. */
export const back = style({
  display: 'inline-grid',
  placeItems: 'center',
  width: vars.layout.minTouchTarget,
  height: vars.layout.minTouchTarget,
  marginLeft: `calc(-1 * ${vars.space.sm})`,
  color: vars.color.text.primary,
})

export const title = style({
  fontSize: vars.font.size.lg,
  fontWeight: vars.font.weight.bold,
  letterSpacing: vars.font.letterSpacing.tight,
})
