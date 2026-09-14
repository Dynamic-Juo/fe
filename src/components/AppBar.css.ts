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

/**
 * 표식 옆 이름의 생김새다. 홈과 결과 화면이 같아야 해서 한 곳에서 정한다.
 *
 * 글자 크기는 값으로 박았다. 표식 크기에 맞춘 값이라 본문 크기 토큰 중에는
 * 쓸 만한 것이 없다.
 */
const brandBase = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.xxs,
  fontSize: '1.25rem',
  lineHeight: 1.05,
  fontWeight: vars.font.weight.bold,
  letterSpacing: vars.font.letterSpacing.tight,
  color: vars.color.text.primary,
})

export const brand = style([brandBase, { textDecoration: 'none' }])

/** 이름 옆에 붙는 설명. 좁은 화면에서는 이름까지만 둔다. */
export const brandTagline = style({
  display: 'none',
  fontSize: vars.font.size.md,
  fontWeight: vars.font.weight.regular,
  letterSpacing: vars.font.letterSpacing.normal,
  color: vars.color.text.faint,
  '@media': {
    [media.desktop]: {
      display: 'inline',
      marginLeft: vars.space.xs,
    },
  },
})

/**
 * 가운데 표식을 진짜 가운데에 두려면 양옆이 같은 폭을 차지해야 한다. 내용
 * 길이가 달라도 가운데가 밀리지 않는다.
 */
export const side = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
})

export const sideEnd = style({
  justifyContent: 'flex-end',
})

export const centerBrand = style([brandBase, { flexShrink: 0 }])

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
