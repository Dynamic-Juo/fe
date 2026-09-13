import { style } from '@vanilla-extract/css'

import { media } from '../../styles/breakpoints'

export const narrow = style({
  display: 'inline-flex',
  '@media': {
    [media.desktop]: { display: 'none' },
  },
})

export const wide = style({
  display: 'none',
  '@media': {
    [media.desktop]: { display: 'inline-flex' },
  },
})
