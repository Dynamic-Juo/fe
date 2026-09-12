import { style } from '@vanilla-extract/css'

import { vars } from '../styles/contract.css'

export const wrapper = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  minHeight: vars.layout.controlHeight,
  padding: `0 ${vars.space.md}`,
  border: `${vars.borderWidth.medium} solid ${vars.color.border.strong}`,
  borderRadius: vars.radius.sm,
  backgroundColor: vars.color.surface.base,
})

/** 잘못된 입력은 선을 끊어 표시한다. 색만으로 구분하지 않는다. */
export const invalid = style({
  borderColor: vars.color.text.tertiary,
  borderStyle: 'dashed',
})

export const input = style({
  flex: 1,
  minWidth: 0,
  border: 'none',
  outline: 'none',
  backgroundColor: 'transparent',
  fontSize: vars.font.size.lg,
  selectors: {
    '&::placeholder': {
      color: vars.color.text.disabled,
    },
  },
})

export const icon = style({
  flexShrink: 0,
  color: vars.color.text.tertiary,
})
