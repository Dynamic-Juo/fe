import { SearchIcon } from './icons'
import * as styles from './Logo.css'

/**
 * 제품 표식이다. 상단바에서는 작게, 홈 가운데에서는 크게 쓴다.
 * 크기가 달라도 같은 표식이라 한 곳에서 그린다.
 */
export function Logo({ size = 'sm' }: { size?: keyof typeof styles.size }) {
  return (
    <span className={`${styles.mark} ${styles.size[size]}`} aria-hidden>
      <SearchIcon size={size === 'sm' ? 13 : size === 'md' ? 26 : 32} />
    </span>
  )
}
