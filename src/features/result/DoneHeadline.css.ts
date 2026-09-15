import { style } from '@vanilla-extract/css'

import { vars } from '../../styles/contract.css'

/** 진행 머리말이 있던 자리를 그대로 받는다. 같은 크기로 둬야 자리가 흔들리지 않는다. */
export const title = style({
  fontSize: vars.font.size.xxxl,
  fontWeight: vars.font.weight.bold,
  letterSpacing: vars.font.letterSpacing.tighter,
  lineHeight: vars.font.lineHeight.tight,
})
