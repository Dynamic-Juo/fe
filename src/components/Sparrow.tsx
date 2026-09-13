/**
 * 참새 표식이다. 말풍선 윤곽에 눈 두 점과 부리를 얹어 새가 된다. 말풍선은
 * 우리가 다루는 것이 영상 속 발언이라는 뜻이다.
 *
 * 24px 격자의 선 아이콘(`components/icons`)과 성격이 다르다. 색이 둘이고
 * 크기별로 획 굵기를 따로 잡아야 해서 따로 둔다.
 *
 * `plain`은 파비콘처럼 작은 자리를 위한 단순형이다. 눈 하나와 부리만 남기고
 * 획을 굵혀서 16px에서도 형태가 붙지 않게 한다.
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
          d="M60 16c-26 0-45 18-45 43 0 12 4 24 13 33l-8 16 21-9c6 2 12 3 19 3 26 0 45-18 45-45S86 16 60 16z"
          fill="currentColor"
        />
        <circle cx="52" cy="58" r="9" fill="var(--sparrow-eye, #faf9f6)" />
        <path d="M88 54l24 8-24 9z" fill="var(--sparrow-beak, #f2b233)" />
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
          fill="var(--sparrow-body, #ffffff)"
        />
        <path d="M22 60c10 0 14-14 24-16" />
      </g>
      <circle cx="70" cy="48" r="4.5" fill="currentColor" />
      <circle cx="46" cy="64" r="6" fill="currentColor" />
      <path
        d="M84 58l20 6-20 8z"
        fill="var(--sparrow-beak, #f2b233)"
        stroke="currentColor"
        strokeWidth={5}
        strokeLinejoin="round"
      />
    </svg>
  )
}
