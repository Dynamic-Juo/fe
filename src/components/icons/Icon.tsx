import type { ReactNode, SVGProps } from 'react'

export type IconProps = Omit<SVGProps<SVGSVGElement>, 'children' | 'viewBox'> & {
  /** 화면에서 읽히는 이름. 없으면 장식으로 보고 낭독기에서 감춘다. */
  label?: string
  size?: number
}

/**
 * 선 기반 24px 격자 아이콘의 공통 껍데기. 굵기와 끝 모양을 한곳에서 정해
 * 아이콘 세트가 바뀌어도 호출부를 고치지 않는다.
 */
export function Icon({ label, size = 20, children, ...rest }: IconProps & { children: ReactNode }) {
  const decorative = label === undefined

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative ? true : undefined}
      aria-label={label}
      {...rest}
    >
      {children}
    </svg>
  )
}
