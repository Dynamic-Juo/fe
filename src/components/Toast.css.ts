import { style, styleVariants } from '@vanilla-extract/css'

import { vars } from '../styles/contract.css'

/**
 * 화면 중앙 위에 뜬다. 어느 화면에서 띄우든 같은 자리에 나오게 뷰포트를
 * 기준으로 잡는다.
 *
 * 설치 안내 시트(10)보다 위에 둔다. 시트를 띄운 상태에서 알릴 일이 생기면
 * 가려지면 안 된다.
 */
export const toast = style({
  position: 'fixed',
  top: vars.space.lg,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 20,
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  maxWidth: 'calc(100% - 2rem)',
  padding: `${vars.space.xs} ${vars.space.md}`,
  borderRadius: vars.radius.sm,
  backgroundColor: vars.color.text.primary,
  color: vars.color.text.inverse,
  fontSize: vars.font.size.lg,
  textAlign: 'left',
  // 알림일 뿐이라 누를 것이 없다. 아래 요소를 가로막지 않는다.
  pointerEvents: 'none',
})

/**
 * 아이콘 색이다. 바탕이 먹색이라 흰 글씨와 구분되려면 색을 줘야 한다.
 * 성공과 실패만 색을 갖고, 일반 알림은 아이콘 자체가 없다.
 */
export const icon = styleVariants({
  plain: {},
  success: { color: vars.color.brand.beak },
  error: { color: vars.color.brand.cream },
})

export const mark = style({
  display: 'inline-flex',
  flexShrink: 0,
})
