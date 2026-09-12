import type { ReactNode } from 'react'

import { Card } from '../../components'
import * as styles from './EmptyState.css'

/**
 * 카드가 하나도 없는 자리다. 아직 만들지 못한 경우와 만들 것이 없는 경우가
 * 모두 여기로 온다.
 *
 * 모양을 같게 두고 아이콘만 바꾼다. 한 줄짜리 작은 상자로 두면 결과가 없는
 * 것인지 화면이 덜 그려진 것인지 구분되지 않는다.
 */
export function EmptyState({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <Card tone="dashed">
      <div className={styles.box}>
        <span className={styles.icon}>{icon}</span>
        <p className={styles.text}>{children}</p>
      </div>
    </Card>
  )
}
