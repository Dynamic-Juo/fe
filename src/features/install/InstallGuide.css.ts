import { style } from '@vanilla-extract/css'

import { media } from '../../styles/breakpoints'
import { vars } from '../../styles/contract.css'

export const backdrop = style({
  position: 'fixed',
  inset: 0,
  zIndex: 10,
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  backgroundColor: 'rgba(28, 27, 25, 0.35)',
  '@media': {
    [media.desktop]: { alignItems: 'center' },
  },
})

export const sheet = style({
  width: '100%',
  maxWidth: vars.layout.contentMax,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
  padding: `${vars.space.xl} ${vars.space.lg} ${vars.space.xxl}`,
  backgroundColor: vars.color.surface.base,
  borderTop: `${vars.borderWidth.thin} solid ${vars.color.border.default}`,
  '@media': {
    [media.desktop]: {
      maxWidth: '24rem',
      border: `${vars.borderWidth.thin} solid ${vars.color.border.default}`,
      padding: vars.space.xl,
    },
  },
})

export const title = style({
  fontSize: vars.font.size.xxl,
  fontWeight: vars.font.weight.bold,
  letterSpacing: vars.font.letterSpacing.tighter,
})

export const steps = style({
  margin: 0,
  paddingLeft: vars.space.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
})

export const step = style({
  fontSize: vars.font.size.lg,
  lineHeight: vars.font.lineHeight.relaxed,
  color: vars.color.text.secondary,
})
