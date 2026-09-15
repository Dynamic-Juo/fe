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

/**
 * 축마다 다른 계열의 색을 싣는다. `emphasis`의 두께·굵기는 그대로 둔다.
 * 색을 지워도 읽혀야 하므로 색이 유일한 구분자가 되면 안 된다.
 */
export const tone = styleVariants({
  neutral: {},
  supported: { borderColor: vars.color.verdict.supported, color: vars.color.verdict.supported },
  refuted: { borderColor: vars.color.verdict.refuted, color: vars.color.verdict.refuted },
  unverified: { borderColor: vars.color.verdict.unverified, color: vars.color.verdict.unverified },
  suspected: {
    borderColor: vars.color.manipulation.suspected,
    color: vars.color.manipulation.suspected,
  },
  noClearSigns: {
    borderColor: vars.color.manipulation.noClearSigns,
    color: vars.color.manipulation.noClearSigns,
  },
  inconclusive: {
    borderColor: vars.color.manipulation.inconclusive,
    color: vars.color.manipulation.inconclusive,
  },
  unavailable: {
    borderColor: vars.color.manipulation.unavailable,
    color: vars.color.manipulation.unavailable,
  },
})

export const size = styleVariants({
  md: {},
  /** 근거 카드 안처럼 본문에 딸려 붙는 자리. */
  sm: {
    padding: '2px 7px',
    fontSize: vars.font.size.xxs,
  },
})
