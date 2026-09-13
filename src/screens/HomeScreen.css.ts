import { style } from '@vanilla-extract/css'

import { media } from '../styles/breakpoints'
import { vars } from '../styles/contract.css'

export const page = style({
  minHeight: '100dvh',
  display: 'flex',
  flexDirection: 'column',
})

/** 화면 가운데에 놓되 아래쪽 여백을 더 준다. 시각적 중심이 조금 위다. */
export const body = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: `${vars.space.xl} ${vars.space.xl} ${vars.space.xxxl}`,
  '@media': {
    [media.desktop]: {
      paddingBottom: '5rem',
    },
  },
})

/** 가운데 정렬한 자식은 폭이 내용만큼 늘어난다. 좁은 화면에서 넘치지 않게 막는다. */
export const brand = style({
  maxWidth: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space.xs,
  marginBottom: vars.space.xxl,
  textAlign: 'center',
})

export const title = style({
  fontSize: vars.font.size.hero,
  fontWeight: vars.font.weight.bold,
  letterSpacing: vars.font.letterSpacing.tighter,
  '@media': {
    [media.desktop]: {
      fontSize: vars.font.size.heroLg,
      letterSpacing: vars.font.letterSpacing.tightest,
    },
  },
})

/** 이름과 설명 사이를 받는 줄. 이름보다 작고 설명보다 굵다. */
export const subtitle = style({
  fontSize: vars.font.size.xxl,
  fontWeight: vars.font.weight.bold,
  letterSpacing: vars.font.letterSpacing.tight,
  marginTop: vars.space.xs,
})

export const tagline = style({
  color: vars.color.text.tertiary,
  fontSize: vars.font.size.md,
  lineHeight: vars.font.lineHeight.relaxed,
  '@media': {
    [media.desktop]: {
      fontSize: vars.font.size.xl,
    },
  },
})

export const form = style({
  width: '100%',
  maxWidth: vars.layout.formMax,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
})

/** 좁은 화면은 버튼을 아래로 내려 너비를 다 쓰고, 넓은 화면은 입력 옆에 둔다. */
export const formRow = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
  '@media': {
    [media.desktop]: {
      flexDirection: 'row',
    },
  },
})

export const field = style({
  flex: 1,
  minWidth: 0,
})

export const submit = style({
  '@media': {
    [media.desktop]: {
      width: '8.5rem',
      flexShrink: 0,
    },
  },
})

export const notice = style({
  marginTop: vars.space.md,
  width: '100%',
  maxWidth: vars.layout.formMax,
  color: vars.color.text.faint,
  fontSize: vars.font.size.xs,
  lineHeight: vars.font.lineHeight.relaxed,
  textAlign: 'center',
})

export const footer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.md,
  flexWrap: 'wrap',
  flexShrink: 0,
  padding: `${vars.space.md} ${vars.space.xl}`,
  borderTop: `${vars.borderWidth.thin} solid ${vars.color.border.subtle}`,
  fontSize: vars.font.size.md,
  color: vars.color.text.faint,
  '@media': {
    [media.desktop]: {
      padding: `${vars.space.lg} ${vars.space.xxl}`,
    },
  },
})

export const footerBrand = style({
  display: 'flex',
  alignItems: 'baseline',
  gap: vars.space.sm,
  minWidth: 0,
})

export const footerName = style({
  fontSize: vars.font.size.xxl,
  fontWeight: vars.font.weight.bold,
  letterSpacing: vars.font.letterSpacing.tight,
  color: vars.color.text.primary,
})

export const footerLinks = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.md,
})

export const feedback = style({
  color: 'inherit',
  textDecoration: 'none',
  selectors: {
    '&:hover': { textDecoration: 'underline' },
  },
})

/** 조직 주소가 정해지기 전이다. 눌러도 갈 곳이 없어 링크로 만들지 않는다. */
export const repoPlaceholder = style({
  display: 'inline-grid',
  placeItems: 'center',
  color: vars.color.text.disabled,
})

/**
 * 기능 소개다. 넓은 화면에서만 그린다. 좁은 화면에서는 입력까지 닿는 길이
 * 길어져서 첫 화면에 들어오지 않는다.
 */
export const features = style({
  display: 'none',
  '@media': {
    [media.desktop]: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      width: '100%',
      maxWidth: vars.layout.formMax,
      marginTop: vars.space.xxxl,
      paddingTop: vars.space.xl,
      borderTop: `${vars.borderWidth.thin} solid ${vars.color.border.subtle}`,
    },
  },
})

export const feature = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  padding: `0 ${vars.space.md}`,
  selectors: {
    '& + &': {
      borderLeft: `${vars.borderWidth.thin} solid ${vars.color.border.subtle}`,
    },
  },
})

export const featureIcon = style({
  flexShrink: 0,
  color: vars.color.text.secondary,
})

export const featureName = style({
  display: 'block',
  fontSize: vars.font.size.xl,
  fontWeight: vars.font.weight.bold,
  letterSpacing: vars.font.letterSpacing.tight,
})

export const featureDetail = style({
  display: 'block',
  marginTop: vars.space.xxs,
  fontSize: vars.font.size.md,
  color: vars.color.text.tertiary,
  lineHeight: vars.font.lineHeight.relaxed,
})

export const preview = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
})

export const thumbnail = style({
  width: '2.375rem',
  aspectRatio: '9 / 16',
  flexShrink: 0,
  objectFit: 'cover',
  backgroundColor: vars.color.surface.sunken,
})

export const previewBody = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xxs,
})

export const previewTitle = style({
  fontSize: vars.font.size.md,
  lineHeight: vars.font.lineHeight.normal,
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
})

export const previewAuthor = style({
  color: vars.color.text.faint,
  fontSize: vars.font.size.xs,
})

/** 좁은 화면에서만 줄을 바꾼다. 넓은 화면에서는 한 줄로 둔다. */
export const breakMobile = style({
  '@media': {
    [media.desktop]: {
      display: 'none',
    },
  },
})

export const picker = style({
  width: '100%',
  maxWidth: vars.layout.formMax,
  marginTop: vars.space.lg,
})
