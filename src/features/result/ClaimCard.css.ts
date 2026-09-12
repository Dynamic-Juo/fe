import { keyframes, style } from '@vanilla-extract/css'

import { vars } from '../../styles/contract.css'

export const head = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
})

/** 처리 상태는 왼쪽, 검증 판정은 오른쪽 끝이다. 자리가 곧 축이다. */
export const spacer = style({
  marginLeft: 'auto',
})

export const text = style({
  fontSize: vars.font.size.lg,
  lineHeight: vars.font.lineHeight.normal,
  color: vars.color.text.secondary,
})

/** 아직 처리되지 않은 주장은 읽을 차례가 아니라는 것이 보이게 눌러 둔다. */
export const textPending = style([
  text,
  {
    fontSize: vars.font.size.md,
    color: vars.color.text.disabled,
  },
])

export const spoken = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xxs,
  color: vars.color.text.faint,
  fontSize: vars.font.size.xs,
  lineHeight: vars.font.lineHeight.relaxed,
})

const slide = keyframes({
  '0%': { transform: 'translateX(-100%)' },
  '100%': { transform: 'translateX(300%)' },
})

/**
 * 검증 중인 카드에만 둔다. 남은 시간을 아는 것이 아니라 아직 돌고 있다는
 * 표시라 진행률을 숫자로 쓰지 않는다.
 */
export const working = style({
  height: vars.space.xxs,
  backgroundColor: vars.color.border.subtle,
  overflow: 'hidden',
  '::after': {
    content: '',
    display: 'block',
    width: '33%',
    height: '100%',
    backgroundColor: vars.color.border.medium,
    animation: `${slide} 1.6s ${vars.motion.easing.standard} infinite`,
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      '::after': { animation: 'none' },
    },
  },
})

export const rule = style({
  margin: 0,
  border: 0,
  borderTop: `${vars.borderWidth.thin} solid ${vars.color.border.faint}`,
})

export const block = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xxs,
})

export const blockTitle = style({
  fontSize: vars.font.size.xs,
  fontWeight: vars.font.weight.medium,
  color: vars.color.text.tertiary,
})

export const blockBody = style({
  fontSize: vars.font.size.md,
  lineHeight: vars.font.lineHeight.relaxed,
  color: vars.color.text.secondary,
})

export const note = style({
  fontSize: vars.font.size.md,
  color: vars.color.text.tertiary,
})

export const toggle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  minHeight: vars.layout.minTouchTarget,
  margin: `calc(-1 * ${vars.space.xs}) 0`,
  padding: 0,
  border: 'none',
  background: 'none',
  color: vars.color.text.faint,
  fontSize: vars.font.size.xs,
  textAlign: 'left',
  cursor: 'pointer',
})

export const toggleLabel = style({
  flex: 1,
})

export const evidence = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xxs,
  marginTop: vars.space.xxs,
  padding: vars.space.sm,
  border: `${vars.borderWidth.thin} solid ${vars.color.border.subtle}`,
  backgroundColor: vars.color.surface.sunken,
})

export const evidenceTitle = style({
  fontSize: vars.font.size.md,
  fontWeight: vars.font.weight.medium,
  lineHeight: vars.font.lineHeight.normal,
})

export const evidenceMeta = style({
  color: vars.color.text.faint,
  fontSize: vars.font.size.xs,
  lineHeight: vars.font.lineHeight.relaxed,
})

export const link = style({
  alignSelf: 'flex-start',
  minHeight: vars.layout.minTouchTarget,
  display: 'inline-flex',
  alignItems: 'center',
  color: vars.color.text.primary,
  fontSize: vars.font.size.xs,
})
