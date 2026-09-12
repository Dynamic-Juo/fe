import { globalStyle } from '@vanilla-extract/css'

globalStyle('*, *::before, *::after', {
  boxSizing: 'border-box',
})

globalStyle('html, body, #root', {
  height: '100%',
})

globalStyle('body', {
  margin: 0,
  WebkitFontSmoothing: 'antialiased',
})

globalStyle('h1, h2, h3, h4, p, figure', {
  margin: 0,
})

globalStyle('button, input, select, textarea', {
  font: 'inherit',
  color: 'inherit',
})

globalStyle('img, svg', {
  display: 'block',
  maxWidth: '100%',
})
