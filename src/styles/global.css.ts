import { globalStyle } from '@vanilla-extract/css'

import { vars } from './contract.css'

globalStyle('*, *::before, *::after', {
  boxSizing: 'border-box',
})

globalStyle('html, body, #root', {
  height: '100%',
})

globalStyle('body', {
  margin: 0,
  backgroundColor: vars.color.surface.base,
  color: vars.color.text.primary,
  fontFamily: vars.font.family.sans,
  fontSize: vars.font.size.md,
  lineHeight: vars.font.lineHeight.normal,
  WebkitFontSmoothing: 'antialiased',
})

globalStyle('h1, h2, h3, h4, p, figure', {
  margin: 0,
})

globalStyle('h1, h2, h3, h4', {
  fontSize: 'inherit',
  fontWeight: vars.font.weight.bold,
  letterSpacing: vars.font.letterSpacing.tight,
})

globalStyle('button, input, select, textarea', {
  font: 'inherit',
  color: 'inherit',
})

globalStyle('img, svg', {
  display: 'block',
  maxWidth: '100%',
})

globalStyle('a', {
  color: 'inherit',
})

/** 기본 표시를 지우지 않는다. 지울 때는 대신할 것을 반드시 둔다. */
globalStyle(':focus-visible', {
  outline: `${vars.borderWidth.thick} solid ${vars.color.focus}`,
  outlineOffset: '2px',
})
