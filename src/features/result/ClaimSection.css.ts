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

/** 개수는 확정된 뒤에만 오른쪽 끝에 붙는다. */
export const count = style({
  marginLeft: 'auto',
  color: vars.color.text.faint,
  fontSize: vars.font.size.md,
})

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
})

export const notice = style({
  color: vars.color.text.tertiary,
  fontSize: vars.font.size.md,
  lineHeight: vars.font.lineHeight.relaxed,
})

/** 주장 수가 확정되기 전의 자리다. 카드 모양을 흉내 내지 않고 한 줄만 둔다. */
export const waiting = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space.xs,
  padding: `${vars.space.xxl} ${vars.space.sm}`,
  color: vars.color.text.disabled,
})

export const waitingText = style({
  color: vars.color.text.tertiary,
  fontSize: vars.font.size.md,
  lineHeight: vars.font.lineHeight.relaxed,
  textAlign: 'center',
})
