import { keyframes, style } from '@vanilla-extract/css'

import { vars } from '../styles/contract.css'

const pulse = keyframes({
  '0%, 100%': { opacity: 1 },
  '50%': { opacity: 0.5 },
})

export const skeleton = style({
  backgroundColor: vars.color.border.subtle,
  borderRadius: vars.radius.sm,
  animation: `${pulse} 1.6s ${vars.motion.easing.standard} infinite`,
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
})
