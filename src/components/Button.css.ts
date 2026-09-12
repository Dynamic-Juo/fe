import { style, styleVariants } from '@vanilla-extract/css'

import { vars } from '../styles/contract.css'

export const button = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.xs,
  minHeight: vars.layout.controlHeight,
  padding: `0 ${vars.space.md}`,
  border: `${vars.borderWidth.medium} solid ${vars.color.action.solid}`,
  borderRadius: vars.radius.sm,
  fontSize: vars.font.size.xl,
  fontWeight: vars.font.weight.medium,
  letterSpacing: vars.font.letterSpacing.tight,
  cursor: 'pointer',
  transition: `background-color ${vars.motion.duration.fast} ${vars.motion.easing.standard}`,
  selectors: {
    // 시안은 색을 바꾸지 않고 흐리게 둔다. 무엇이 잠겼는지는 그대로 읽혀야 한다.
    '&:disabled': {
      opacity: 0.35,
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
    padding: `0 ${vars.space.sm}`,
    fontSize: vars.font.size.md,
    fontWeight: vars.font.weight.regular,
  },
})

export const fullWidth = style({ width: '100%' })
