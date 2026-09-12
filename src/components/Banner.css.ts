import { globalStyle, style, styleVariants } from '@vanilla-extract/css'

import { media } from '../styles/breakpoints'
import { vars } from '../styles/contract.css'

export const banner = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  gap: vars.space.xs,
  padding: vars.space.sm,
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

export const title = style({
  fontWeight: vars.font.weight.medium,
  color: vars.color.text.primary,
})

export const description = style({
  marginTop: vars.space.xxs,
  color: vars.color.text.secondary,
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
      marginLeft: 'auto',
      alignSelf: 'center',
    },
  },
})

// 어떤 요소가 올지 몰라 슬롯에서 늘린다. 넓은 화면에서는 슬롯 자체가
// 내용만큼만 차지하므로 결과적으로 버튼 크기가 된다.
globalStyle(`${action} > *`, { flex: 1 })
