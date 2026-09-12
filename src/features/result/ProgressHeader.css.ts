import { style } from '@vanilla-extract/css'

import { vars } from '../../styles/contract.css'

export const header = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
})

export const steps = style({
  display: 'flex',
  gap: vars.space.xxs,
  margin: 0,
  padding: 0,
  listStyle: 'none',
})

export const step = style({
  flex: 1,
  height: vars.space.xxs,
  backgroundColor: vars.color.border.subtle,
})

export const stepDone = style({
  backgroundColor: vars.color.text.primary,
})

export const stepNow = style({
  backgroundColor: vars.color.text.tertiary,
})

/** 단계 이름은 낭독기에만 남긴다. 화면에는 칸의 자리와 진하기로 보인다. */
export const stepName = style({
  position: 'absolute',
  width: '1px',
  height: '1px',
  margin: '-1px',
  padding: 0,
  overflow: 'hidden',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
})

export const title = style({
  fontSize: vars.font.size.xxl,
  fontWeight: vars.font.weight.bold,
  letterSpacing: vars.font.letterSpacing.tighter,
  lineHeight: vars.font.lineHeight.tight,
})

export const meta = style({
  color: vars.color.text.faint,
  fontSize: vars.font.size.xs,
  lineHeight: vars.font.lineHeight.relaxed,
})

/** 오래 걸린다는 안내. 아이콘을 글 첫 줄에 맞춰 둔다. */
export const notice = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: vars.space.xs,
  color: vars.color.text.tertiary,
})

export const noticeText = style({
  flex: 1,
  color: vars.color.text.tertiary,
  fontSize: vars.font.size.md,
  lineHeight: vars.font.lineHeight.relaxed,
})
