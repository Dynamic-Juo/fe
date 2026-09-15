import { style } from '@vanilla-extract/css'

import { vars } from '../../styles/contract.css'

export const page = style({
  maxWidth: vars.layout.contentMax,
  margin: '0 auto',
  padding: `${vars.space.xl} ${vars.space.lg} ${vars.space.xxl}`,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg,
})

export const pageTitle = style({
  fontSize: vars.font.size.xxxl,
})

export const lead = style({
  marginTop: vars.space.xs,
  color: vars.color.text.secondary,
  fontSize: vars.font.size.sm,
})

export const scenarioList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
})

export const scenarioRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'baseline',
  gap: vars.space.xs,
})

export const scenarioNote = style({
  color: vars.color.text.tertiary,
  fontSize: vars.font.size.xs,
})

export const statusGrid = style({
  display: 'grid',
  gridTemplateColumns: 'max-content 1fr',
  gap: `${vars.space.xxs} ${vars.space.sm}`,
  fontSize: vars.font.size.sm,
})

export const statusLabel = style({
  color: vars.color.text.tertiary,
})

export const snapshot = style({
  margin: 0,
  padding: vars.space.sm,
  maxHeight: '24rem',
  overflow: 'auto',
  fontSize: vars.font.size.xs,
  lineHeight: vars.font.lineHeight.normal,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-all',
  backgroundColor: vars.color.surface.sunken,
  border: `${vars.borderWidth.thin} solid ${vars.color.border.subtle}`,
  borderRadius: vars.radius.sm,
})
