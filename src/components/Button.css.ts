import { style, styleVariants } from '@vanilla-extract/css'

import { vars } from '../styles/contract.css'

export const button = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.xs,
  minHeight: vars.layout.minTouchTarget,
  padding: `0 ${vars.space.md}`,
  border: `${vars.borderWidth.thick} solid ${vars.color.action.solid}`,
  borderRadius: vars.radius.sm,
  fontSize: vars.font.size.lg,
  fontWeight: vars.font.weight.medium,
  cursor: 'pointer',
  transition: `background-color ${vars.motion.duration.fast} ${vars.motion.easing.standard}`,
  selectors: {
    '&:disabled': {
      borderColor: vars.color.action.disabled,
      color: vars.color.action.disabled,
      backgroundColor: 'transparent',
      cursor: 'not-allowed',
    },
  },
})

export const variant = styleVariants({
  solid: {
    backgroundColor: vars.color.action.solid,
    color: vars.color.action.solidText,
  },
  outline: {
    backgroundColor: 'transparent',
    color: vars.color.text.primary,
  },
})

export const size = styleVariants({
  md: {},
  sm: {
    minHeight: '2.25rem',
    fontSize: vars.font.size.md,
    fontWeight: vars.font.weight.regular,
  },
})

export const fullWidth = style({ width: '100%' })
