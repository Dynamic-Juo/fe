import { style, styleVariants } from '@vanilla-extract/css'

import { vars } from '../styles/contract.css'

export const banner = style({
  display: 'flex',
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
