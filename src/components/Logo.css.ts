import { style, styleVariants } from '@vanilla-extract/css'

import { vars } from '../styles/contract.css'

export const mark = style({
  display: 'grid',
  placeItems: 'center',
  flexShrink: 0,
  color: vars.color.text.primary,
})

/** 상자 크기는 `Sparrow`에 넘기는 픽셀과 맞춘다. 표식 자체가 형태라 테두리를 두르지 않는다. */
export const size = styleVariants({
  sm: { width: '1.5rem', height: '1.5rem' },
  md: { width: '4.75rem', height: '4.75rem' },
  lg: { width: '6rem', height: '6rem' },
})
