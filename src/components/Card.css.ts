import { style, styleVariants } from '@vanilla-extract/css'

import { vars } from '../styles/contract.css'

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
  padding: vars.space.md,
  border: `${vars.borderWidth.thin} solid ${vars.color.border.default}`,
  borderRadius: vars.radius.sm,
  backgroundColor: vars.color.surface.raised,
})

export const tone = styleVariants({
  default: {},
  muted: {
    backgroundColor: vars.color.surface.sunken,
    borderColor: vars.color.border.subtle,
  },
  dashed: {
    borderStyle: 'dashed',
    borderColor: vars.color.border.default,
  },
})
