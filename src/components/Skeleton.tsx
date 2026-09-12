import * as styles from './Skeleton.css'

type Props = {
  width?: string
  height?: string
}

/**
 * 자리만 잡는 표시다. 개수가 무엇을 뜻하는 것처럼 보이면 안 되므로
 * 주장 수가 확정되기 전에 카드 모양으로 반복해서 그리지 않는다.
 */
export function Skeleton({ width = '100%', height = '0.75rem' }: Props) {
  return (
    <span className={styles.skeleton} style={{ display: 'block', width, height }} aria-hidden />
  )
}
