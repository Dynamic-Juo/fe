import { Card } from '../../components'
import { PROGRESS } from '../../copy/strings'
import * as styles from './SummarySlot.css'

/**
 * 최종 요약이 들어갈 자리를 미리 잡아 둔다. 요약이 나중에 들어와도 위아래
 * 블록이 밀리지 않는다. 사이드바 순서는 영상 정보 → 요약 → 미디어이며 준비
 * 중·진행 중·완료에서 바뀌지 않는다.
 *
 * 좁은 화면에는 두지 않는다. 한 열로 이어져서 자리를 잡아 둘 이유가 없다.
 * 감추는 일은 부르는 쪽이 한다. 여기서 감추면 감싼 상자의 여백만 남는다.
 */
export function SummarySlot() {
  return (
    <Card tone="dashed">
      <p className={styles.text}>{PROGRESS.summarySlot}</p>
    </Card>
  )
}
