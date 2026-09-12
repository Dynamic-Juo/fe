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

/** 발언 위치와 같은 주장의 다른 위치를 한 줄에 늘어놓는다. */
export const spoken = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: `0 ${vars.space.xxs}`,
  color: vars.color.text.faint,
  fontSize: vars.font.size.xs,
  lineHeight: vars.font.lineHeight.relaxed,
})

export const timeLink = style({
  color: vars.color.text.faint,
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
})

export const divider = style({
  color: vars.color.border.medium,
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

/** 실제로 한 말이다. 주장 요약과 구분되게 인용 부호를 둔다. */
export const quote = style({
  paddingLeft: vars.space.xs,
  borderLeft: `${vars.borderWidth.thick} solid ${vars.color.border.default}`,
  color: vars.color.text.secondary,
  fontSize: vars.font.size.md,
  lineHeight: vars.font.lineHeight.relaxed,
})

/** 문맥은 길이 제한이 없다. 세 줄까지만 두고 나머지는 자른다. */
export const context = style({
  color: vars.color.text.muted,
  fontSize: vars.font.size.sm,
  lineHeight: vars.font.lineHeight.relaxed,
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 3,
})

export const rule = style({
  margin: 0,
  border: 0,
  borderTop: `${vars.borderWidth.thin} solid ${vars.color.border.faint}`,
})

/** 펼친 영역. 덩어리끼리는 넉넉히 벌린다. */
export const block = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
})

/** 이름과 내용 한 덩어리. 둘은 바짝 붙인다. */
export const field = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
})

/**
 * 항목 이름이다. 내용보다 굵고 진하게 둔다. 여기서 이름은 부가 정보가
 * 아니라 무엇을 읽고 있는지 알려주는 유일한 단서다. 작게 두면 제 역할을
 * 못 한다.
 */
export const fieldLabel = style({
  fontSize: vars.font.size.md,
  fontWeight: vars.font.weight.bold,
  color: vars.color.text.primary,
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

/**
 * 근거 목록이다. 넓은 화면에서는 한 줄에 둘씩 놓고, 홀수로 남은 마지막
 * 하나는 줄을 다 쓴다. 개수를 세지 않아도 빈 칸이 생기지 않는다.
 */
export const evidenceList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.xs,
  marginTop: vars.space.xxs,
})

export const evidence = style({
  flex: '1 1 15rem',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xxs,
  padding: `${vars.space.xs} ${vars.space.sm}`,
  border: `${vars.borderWidth.thin} solid ${vars.color.border.muted}`,
  backgroundColor: vars.color.surface.sunken,
})

/** 출처 유형은 왼쪽, 그 자료의 시점은 오른쪽 끝이다. */
export const evidenceHead = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.xs,
})

export const evidenceDate = style({
  color: vars.color.text.faint,
  fontSize: vars.font.size.xs,
})

export const evidenceReason = style({
  color: vars.color.text.tertiary,
  fontSize: vars.font.size.sm,
  lineHeight: vars.font.lineHeight.relaxed,
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
