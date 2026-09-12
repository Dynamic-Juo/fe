import { style } from '@vanilla-extract/css'

import { vars } from '../styles/contract.css'

export const button = style({
  display: 'grid',
  placeItems: 'center',
  flexShrink: 0,
  width: '2.25rem',
  height: '2.25rem',
  border: `${vars.borderWidth.thin} solid ${vars.color.border.default}`,
  borderRadius: vars.radius.sm,
  backgroundColor: vars.color.surface.base,
  color: vars.color.text.primary,
  cursor: 'pointer',
  selectors: {
    '&:disabled': {
      opacity: 0.35,
      cursor: 'not-allowed',
    },
  },
})
