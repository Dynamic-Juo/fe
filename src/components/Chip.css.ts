import { style, styleVariants } from '@vanilla-extract/css'

import { vars } from '../styles/contract.css'

export const chip = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.xxs,
  padding: `3px ${vars.space.xs}`,
  border: `${vars.borderWidth.thin} solid ${vars.color.border.medium}`,
  borderRadius: vars.radius.sm,
  fontSize: vars.font.size.xs,
  lineHeight: vars.font.lineHeight.relaxed,
  whiteSpace: 'nowrap',
  color: vars.color.text.secondary,
})

/**
 * 색이 아직 없어 두께와 굵기로 구분한다. 색이 정해져도 이 구분은 남긴다.
 * 색을 지워도 읽혀야 한다.
 */
export const emphasis = styleVariants({
  normal: {},
  strong: {
    borderWidth: vars.borderWidth.thick,
    borderColor: vars.color.border.strong,
    fontWeight: vars.font.weight.bold,
    color: vars.color.text.primary,
  },
  muted: {
    borderColor: vars.color.border.muted,
    color: vars.color.text.disabled,
  },
  dashed: {
    borderStyle: 'dashed',
    color: vars.color.text.tertiary,
  },
  solid: {
    backgroundColor: vars.color.action.solid,
    borderColor: vars.color.action.solid,
    color: vars.color.action.solidText,
  },
})
