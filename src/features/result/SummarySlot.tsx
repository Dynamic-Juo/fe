import { Card } from '../../components'
import { PROGRESS } from '../../copy/strings'
import * as styles from './SummarySlot.css'

/**
 * 최종 요약이 들어갈 자리를 미리 잡아 둔다. 요약이 나중에 들어와도 위아래
 * 블록이 밀리지 않는다. 사이드바 순서는 영상 정보 → 요약 → 미디어이며 준비
 * 중·진행 중·완료에서 바뀌지 않는다.
 */
export function SummarySlot() {
  return (
    <div className={styles.slot}>
      <Card tone="dashed">
        <p className={styles.text}>{PROGRESS.summarySlot}</p>
      </Card>
    </div>
  )
}
