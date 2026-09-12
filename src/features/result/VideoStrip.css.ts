import { style } from '@vanilla-extract/css'

import { media } from '../../styles/breakpoints'
import { vars } from '../../styles/contract.css'

export const box = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  padding: `${vars.space.sm} ${vars.space.lg}`,
  borderBottom: `${vars.borderWidth.thin} solid ${vars.color.border.subtle}`,
  '@media': {
    [media.desktop]: {
      padding: vars.space.sm,
      border: `${vars.borderWidth.thin} solid ${vars.color.border.default}`,
      backgroundColor: vars.color.surface.raised,
    },
  },
})

/** 세로 영상이라 9:16이다. 가로 썸네일이 와도 같은 자리를 차지한다. */
export const thumbnail = style({
  width: '2.375rem',
  aspectRatio: '9 / 16',
  flexShrink: 0,
  objectFit: 'cover',
  backgroundColor: vars.color.surface.sunken,
  '@media': {
    [media.desktop]: {
      width: '3.25rem',
    },
  },
})

export const body = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xxs,
})

export const title = style({
  fontSize: vars.font.size.md,
  lineHeight: vars.font.lineHeight.normal,
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
})

export const author = style({
  color: vars.color.text.faint,
  fontSize: vars.font.size.xs,
  lineHeight: vars.font.lineHeight.relaxed,
})
