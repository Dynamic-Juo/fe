import { style } from '@vanilla-extract/css'

import { vars } from '../styles/contract.css'

export const wrapper = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  minHeight: '3.25rem',
  padding: `0 ${vars.space.md}`,
  border: `${vars.borderWidth.thick} solid ${vars.color.border.strong}`,
  borderRadius: vars.radius.sm,
  backgroundColor: vars.color.surface.base,
})

export const invalid = style({
  borderColor: vars.color.border.default,
  borderStyle: 'dashed',
})

export const input = style({
  flex: 1,
  minWidth: 0,
  border: 'none',
  outline: 'none',
  backgroundColor: 'transparent',
  fontSize: vars.font.size.md,
  selectors: {
    '&::placeholder': {
      color: vars.color.text.tertiary,
    },
  },
})

export const icon = style({
  flexShrink: 0,
  color: vars.color.text.tertiary,
})
