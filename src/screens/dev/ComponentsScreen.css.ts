import { style } from '@vanilla-extract/css'

import { vars } from '../../styles/contract.css'

export const page = style({
  maxWidth: vars.layout.contentMax,
  margin: '0 auto',
  padding: `${vars.space.xl} ${vars.space.lg} ${vars.space.xxl}`,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xl,
})

export const pageTitle = style({
  fontSize: vars.font.size.xxxl,
})

export const lead = style({
  marginTop: vars.space.xs,
  color: vars.color.text.secondary,
  fontSize: vars.font.size.sm,
})

export const section = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
})

export const sectionTitle = style({
  fontSize: vars.font.size.lg,
  paddingBottom: vars.space.xxs,
  borderBottom: `${vars.borderWidth.thin} solid ${vars.color.border.subtle}`,
})

export const caption = style({
  color: vars.color.text.tertiary,
  fontSize: vars.font.size.xs,
})

export const row = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: vars.space.xs,
})

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(9rem, 1fr))',
  gap: vars.space.sm,
})

export const iconCell = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space.xxs,
  padding: vars.space.sm,
  border: `${vars.borderWidth.thin} solid ${vars.color.border.subtle}`,
  borderRadius: vars.radius.sm,
  fontSize: vars.font.size.xs,
  color: vars.color.text.tertiary,
})

export const swatch = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  fontSize: vars.font.size.xs,
  color: vars.color.text.secondary,
})

export const swatchBox = style({
  width: '1.5rem',
  height: '1.5rem',
  borderRadius: vars.radius.sm,
  border: `${vars.borderWidth.thin} solid ${vars.color.border.subtle}`,
  flexShrink: 0,
})
