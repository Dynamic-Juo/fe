import { Sparrow } from './Sparrow'
import * as styles from './Logo.css'

/**
 * 제품 표식이다. 상단바에서는 작게, 홈 가운데에서는 크게 쓴다.
 * 크기가 달라도 같은 표식이라 한 곳에서 그린다.
 *
 * 크기는 여기서만 정한다. 상자와 그림을 따로 두면 한쪽만 바뀌어 어긋난다.
 */
const PX = { sm: 34, md: 76, lg: 96 } as const

export function Logo({ size = 'sm' }: { size?: keyof typeof PX }) {
  return (
    <span className={styles.mark} aria-hidden>
      <Sparrow size={PX[size]} />
    </span>
  )
}
