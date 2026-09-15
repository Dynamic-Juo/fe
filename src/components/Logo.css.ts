import { style } from '@vanilla-extract/css'

import { vars } from '../styles/contract.css'

/** 크기는 `Logo`가 정한다. 여기서는 색과 정렬만 맡는다. */
export const mark = style({
  display: 'grid',
  placeItems: 'center',
  flexShrink: 0,
  color: vars.color.text.primary,
})
