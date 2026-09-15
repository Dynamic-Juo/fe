import { globalStyle, style, styleVariants } from '@vanilla-extract/css'

import { media } from '../styles/breakpoints'
import { vars } from '../styles/contract.css'

export const banner = style({
  position: 'relative',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  gap: vars.space.xs,
  padding: `${vars.space.sm} ${vars.space.sm}`,
  border: `${vars.borderWidth.thin} solid ${vars.color.border.default}`,
  borderRadius: vars.radius.sm,
  backgroundColor: vars.color.surface.sunken,
  fontSize: vars.font.size.sm,
  lineHeight: vars.font.lineHeight.normal,
})

export const tone = styleVariants({
  info: {},
  notice: {
    borderStyle: 'dashed',
  },
})

export const icon = style({
  flexShrink: 0,
  marginTop: '1px',
  color: vars.color.text.secondary,
})

export const body = style({ flex: 1, minWidth: 0 })

/**
 * 좁은 화면에서는 닫기가 흐름 밖에 떠 있어 제목과 같은 줄에 놓인다. 제목이
 * 길어지면 그 밑으로 들어가므로 그만큼 오른쪽을 비운다. 설명은 닫기 그림보다
 * 아래에서 시작해 겹치지 않으니 폭을 다 쓴다.
 *
 * 넓은 화면에서는 닫기가 오른쪽 칸에 자리를 차지하므로 비울 필요가 없다.
 */
export const titleInset = style({
  paddingRight: vars.space.xl,
  '@media': {
    [media.desktop]: {
      paddingRight: 0,
      gridRow: 1,
      gridColumn: 1,
    },
  },
})

/** 설명은 둘째 행 왼쪽 칸이다. 행 사이는 격자가 벌리므로 제 여백은 지운다. */
export const descriptionRow = style({
  '@media': {
    [media.desktop]: {
      gridRow: 2,
      gridColumn: 1,
      marginTop: 0,
    },
  },
})

/** 동작 단추는 둘째 행 오른쪽 칸이다. */
export const actionRow = style({
  '@media': {
    [media.desktop]: {
      gridRow: 2,
      gridColumn: 2,
      justifySelf: 'end',
    },
  },
})

/**
 * 닫기와 동작 단추를 담는 오른쪽 칸이다.
 *
 * 좁은 화면에서는 칸이 한 줄을 다 써서 동작 단추가 본문 아래로 내려가고,
 * 닫기만 흐름에서 빠져 오른쪽 위에 붙는다.
 *
 * 넓은 화면에서는 세로로 쌓는다. 닫기가 위, 동작 단추가 그 아래다. 둘을 같은
 * 줄에 나란히 두면 어느 쪽을 누를지 헷갈린다.
 */
export const side = style({
  width: '100%',
  '@media': {
    [media.desktop]: {
      width: 'auto',
      marginLeft: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: vars.space.xs,
    },
  },
})

/**
 * 안내 안에 있는 단추라 테두리를 두지 않는다. 좁은 화면에서는 그림이 18px이라도
 * 눌리는 범위를 손가락 기준까지 넓히고, 흐름에서 빼 안내 높이를 늘리지 않는다.
 * 넓은 화면에서는 손가락 기준이 필요 없어 제목 높이에 맞춰 줄인다.
 */
export const dismiss = style({
  position: 'absolute',
  top: 0,
  right: 0,
  display: 'grid',
  placeItems: 'center',
  width: vars.layout.minTouchTarget,
  height: vars.layout.minTouchTarget,
  padding: 0,
  border: 'none',
  background: 'none',
  color: vars.color.text.tertiary,
  cursor: 'pointer',
  selectors: {
    '&:hover': { color: vars.color.text.primary },
  },
  '@media': {
    [media.desktop]: {
      position: 'static',
      width: '1.5rem',
      height: '1.5rem',
      marginRight: '-0.125rem',
      gridRow: 1,
      gridColumn: 2,
      justifySelf: 'end',
    },
  },
})

export const title = style({
  fontSize: vars.font.size.xxl,
  fontWeight: vars.font.weight.medium,
  color: vars.color.text.primary,
})

export const description = style({
  marginTop: vars.space.xxs,
  fontSize: vars.font.size.md,
  lineHeight: vars.font.lineHeight.relaxed,
  color: vars.color.text.tertiary,
})

/**
 * 좁은 화면에서는 줄을 바꿔 너비를 다 쓰고, 넓은 화면에서는 오른쪽 끝에 붙는다.
 * 안내 옆에 작은 버튼이 끼어 있으면 누를 곳으로 보이지 않는다.
 */
export const action = style({
  width: '100%',
  display: 'flex',
  '@media': {
    [media.desktop]: {
      width: 'auto',
    },
  },
})

// 어떤 요소가 올지 몰라 슬롯에서 늘린다. 넓은 화면에서는 슬롯 자체가
// 내용만큼만 차지하므로 결과적으로 버튼 크기가 된다.
globalStyle(`${action} > *`, { flex: 1 })

/**
 * 닫기가 있을 때 넓은 화면에서만 격자로 바꾼다.
 *
 * 흐름대로 두면 왼쪽(제목·설명)과 오른쪽(닫기·동작 단추)이 각자 쌓인 두
 * 덩어리가 된다. 두 덩어리의 줄 높이가 서로 달라 같은 줄처럼 보이지 않는다.
 * 격자로 묶어야 제목과 닫기가, 설명과 단추가 실제로 같은 행에 놓이고 행마다
 * 세로 가운데로 맞는다.
 */
export const grid = style({
  '@media': {
    [media.desktop]: {
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      columnGap: vars.space.md,
      rowGap: vars.space.xs,
      alignItems: 'center',
    },
  },
})

/** 격자에서는 감싼 상자가 사라지고 그 안이 바로 칸이 된다. */
export const unwrap = style({
  '@media': {
    [media.desktop]: {
      display: 'contents',
    },
  },
})
