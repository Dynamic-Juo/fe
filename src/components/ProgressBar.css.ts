import { style } from '@vanilla-extract/css'

import { vars } from '../styles/contract.css'

export const track = style({
  height: '6px',
  backgroundColor: vars.color.border.subtle,
  borderRadius: vars.radius.none,
  overflow: 'hidden',
})

export const fill = style({
  height: '100%',
  backgroundColor: vars.color.action.solid,
  transition: `width ${vars.motion.duration.base} ${vars.motion.easing.standard}`,
})
