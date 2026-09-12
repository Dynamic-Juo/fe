import * as styles from './ProgressBar.css'

type Props = {
  /** 완료한 항목 수. 전체를 모르면 진행률을 그리지 않는다. */
  done: number
  total: number
  label: string
}

/**
 * 주장 수가 확정되기 전에는 그리지 않는다. 나중에 숫자가 줄거나 늘면
 * 신뢰를 깎는다.
 */
export function ProgressBar({ done, total, label }: Props) {
  if (total <= 0) {
    return null
  }

  const ratio = Math.min(done / total, 1)

  return (
    <div
      className={styles.track}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={done}
      aria-label={label}
    >
      <div className={styles.fill} style={{ width: `${ratio * 100}%` }} />
    </div>
  )
}
