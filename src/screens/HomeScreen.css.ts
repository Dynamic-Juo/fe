import { style } from '@vanilla-extract/css'

import { media } from '../styles/breakpoints'
import { vars } from '../styles/contract.css'

export const page = style({
  minHeight: '100dvh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.lg,
  padding: `${vars.space.xxl} ${vars.space.lg}`,
})

export const column = style({
  width: '100%',
  maxWidth: vars.layout.contentMax,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg,
})

export const brand = style({
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
})

export const title = style({
  fontSize: vars.font.size.xxl,
  letterSpacing: vars.font.letterSpacing.tight,
})

export const tagline = style({
  color: vars.color.text.secondary,
  fontSize: vars.font.size.sm,
  lineHeight: vars.font.lineHeight.normal,
})

export const form = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
})

/** 모바일은 버튼을 아래로 내리고 데스크톱은 입력 옆에 둔다. */
export const formRow = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
  '@media': {
    [media.desktop]: {
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
  },
})

export const field = style({
  flex: 1,
  minWidth: 0,
})

export const notice = style({
  color: vars.color.text.tertiary,
  fontSize: vars.font.size.xs,
  lineHeight: vars.font.lineHeight.normal,
  textAlign: 'center',
})

export const preview = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
})

export const thumbnail = style({
  width: '6rem',
  aspectRatio: '16 / 9',
  flexShrink: 0,
  objectFit: 'cover',
  borderRadius: vars.radius.sm,
  backgroundColor: vars.color.surface.sunken,
  border: `${vars.borderWidth.thin} solid ${vars.color.border.subtle}`,
})

export const previewBody = style({
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xxs,
})

export const previewTitle = style({
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.medium,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const previewAuthor = style({
  color: vars.color.text.tertiary,
  fontSize: vars.font.size.xs,
})
