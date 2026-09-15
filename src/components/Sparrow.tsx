import { vars } from '../styles/contract.css'

/**
 * 참새 표식이다. 말풍선 윤곽에 눈 두 점과 부리를 얹어 새가 된다. 말풍선은
 * 우리가 다루는 것이 영상 속 발언이라는 뜻이다.
 *
 * 24px 격자의 선 아이콘(`components/icons`)과 성격이 다르다. 색이 둘이고
 * 크기별로 획 굵기를 따로 잡아야 해서 따로 둔다.
 *
 * `plain`은 파비콘처럼 작은 자리를 위한 단순형이다. 날개 획과 눈 하나를 빼고
 * 선을 굵혔다. 흰 몸에 검은 선이라는 표식의 성격은 그대로 둔다.
 */
export function Sparrow({
  size = 28,
  variant = 'full',
  label,
}: {
  size?: number
  variant?: 'full' | 'plain'
  /** 화면에서 읽히는 이름. 없으면 장식으로 보고 낭독기에서 감춘다. */
  label?: string
}) {
  const decorative = label === undefined
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 120 120',
    role: decorative ? undefined : ('img' as const),
    'aria-hidden': decorative ? true : undefined,
    'aria-label': label,
  }

  if (variant === 'plain') {
    return (
      <svg {...common}>
        <path
          d="M58 22c-23 0-40 16-40 38 0 11 4 21 11 29l-7 15 19-8c5 2 11 3 17 3 23 0 40-16 40-39S81 22 58 22z"
          fill={vars.color.surface.raised}
          stroke="currentColor"
          strokeWidth={11}
          strokeLinejoin="round"
        />
        <circle cx="54" cy="56" r="8" fill="currentColor" />
        <path
          d="M92 52l22 8-22 9z"
          fill={vars.color.brand.beak}
          stroke="currentColor"
          strokeWidth={9}
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <svg {...common}>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M60 14c-27 0-46 19-46 44 0 13 4 26 14 36l-8 16 22-9c6 2 12 3 18 3 27 0 46-19 46-46S87 14 60 14z"
          fill={vars.color.surface.raised}
        />
        <path d="M22 60c10 0 14-14 24-16" />
      </g>
      <circle cx="70" cy="48" r="4.5" fill="currentColor" />
      <circle cx="46" cy="64" r="6" fill="currentColor" />
      <path
        d="M84 58l20 6-20 8z"
        fill={vars.color.brand.beak}
        stroke="currentColor"
        strokeWidth={5}
        strokeLinejoin="round"
      />
    </svg>
  )
}
