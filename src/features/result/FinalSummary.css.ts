import { globalStyle, style } from '@vanilla-extract/css'

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

/** 화면 제목이다. 섹션 제목보다 한 단계 위다. */
export const heading = style({
  flex: 1,
  fontSize: vars.font.size.xxxl,
  fontWeight: vars.font.weight.bold,
  letterSpacing: vars.font.letterSpacing.tighter,
})

export const group = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
})

export const groupTitle = style({
  color: vars.color.text.faint,
  fontSize: vars.font.size.xs,
  lineHeight: vars.font.lineHeight.relaxed,
})

export const strong = style({
  color: vars.color.text.muted,
})

export const row = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
})

export const rowName = style({
  flex: 1,
  fontSize: vars.font.size.md,
})

/** 세 판정을 같은 너비로 둔다. 하나가 커 보이면 그쪽이 결론처럼 읽힌다. */
export const verdicts = style({
  display: 'flex',
  gap: vars.space.xxs,
})

export const verdict = style({
  flex: 1,
  display: 'flex',
})

globalStyle(`${verdict} > *`, { flex: 1 })

export const rule = style({
  margin: 0,
  border: 0,
  borderTop: `${vars.borderWidth.thin} solid ${vars.color.border.faint}`,
})

export const meta = style({
  color: vars.color.text.faint,
  fontSize: vars.font.size.xs,
  lineHeight: vars.font.lineHeight.relaxed,
})
