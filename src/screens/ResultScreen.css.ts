import { style } from '@vanilla-extract/css'

import { media } from '../styles/breakpoints'
import { vars } from '../styles/contract.css'

export const page = style({
  minHeight: '100dvh',
  display: 'flex',
  flexDirection: 'column',
  '@media': {
    [media.desktop]: {
      maxWidth: `calc(${vars.layout.contentMax} + ${vars.layout.sidebarWidth} + ${vars.space.xxl})`,
      margin: '0 auto',
      width: '100%',
    },
  },
})

/**
 * 좁은 화면은 한 열이고 넓은 화면은 두 열이다. 두 배치에서 요소 순서가
 * 달라야 해서, 좁은 화면에서는 감싼 상자를 없애고 하나의 흐름으로 편다.
 *
 * 좁은 화면 순서는 영상 → 진행·요약 → 미디어 → 주장이고, 넓은 화면은
 * 왼쪽에 진행·주장, 오른쪽에 영상 → 요약 → 미디어다. 사이드바 순서는
 * 준비 중·진행 중·완료에서 바뀌지 않는다.
 */
export const layout = style({
  display: 'flex',
  flexDirection: 'column',
  '@media': {
    [media.desktop]: {
      display: 'grid',
      gridTemplateColumns: `minmax(0, 1fr) ${vars.layout.sidebarWidth}`,
      gap: vars.space.xxl,
      alignItems: 'start',
      padding: `${vars.space.lg} ${vars.space.xxl}`,
    },
  },
})

const columnOnDesktop = {
  display: 'contents',
  '@media': {
    [media.desktop]: {
      display: 'flex',
      flexDirection: 'column',
      gap: vars.space.lg,
    },
  },
} as const

export const main = style(columnOnDesktop)

/** 내용이 화면 높이를 넘으면 사이드바 안에서만 스크롤한다. */
export const side = style({
  ...columnOnDesktop,
  '@media': {
    [media.desktop]: {
      ...columnOnDesktop['@media'][media.desktop],
      position: 'sticky',
      top: vars.space.lg,
      maxHeight: `calc(100dvh - ${vars.space.xxxl})`,
      overflowY: 'auto',
    },
  },
})

/** 좁은 화면에서 한 덩어리가 차지하는 자리. 넓은 화면은 바깥에서 여백을 준다. */
export const section = style({
  padding: `${vars.space.md} ${vars.space.lg}`,
  '@media': {
    [media.desktop]: {
      padding: 0,
    },
  },
})

/** 좁은 화면의 순서다. 넓은 화면에서도 각 열 안의 순서로 그대로 쓰인다. */
export const orderVideo = style({ order: 1 })
export const orderHeadline = style({ order: 2 })
export const orderSummary = style({ order: 2 })
export const orderMedia = style({ order: 3 })
export const orderClaims = style({ order: 4 })
