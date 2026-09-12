/**
 * 미디어 쿼리 조건에는 CSS 변수를 쓸 수 없어 계약이 아니라 상수로 둔다.
 */
export const breakpoint = {
  desktop: 1024,
} as const

export const media = {
  desktop: `screen and (min-width: ${breakpoint.desktop}px)`,
} as const
