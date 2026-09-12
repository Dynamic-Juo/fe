import type { ManipulationResult } from '../../api/types'
import { Card } from '../../components'
import { DETECTION_LABEL, SECTION } from '../../copy/strings'
import { ManipulationChip } from './ManipulationChip'
import * as styles from './MediaPanel.css'

/**
 * 미디어 조작 영역이다. 두 탐지를 항상 각각 표시한다. 하나로 합치거나 둘 중
 * 하나만 보여주지 않는다.
 *
 * 주장 검증과 완전히 분리된 영역이며 서로를 기다리지 않는다. 한쪽이 먼저
 * 끝나면 그쪽만 결과로 바뀐다.
 *
 * 음성 합성 탐지는 MVP에서 제외다. 자리도 만들지 않는다.
 */
export function MediaPanel({
  face,
  wholeVideo,
  finished,
}: {
  face: ManipulationResult | null | undefined
  wholeVideo: ManipulationResult | null | undefined
  /** 작업이 끝났는지. 끝난 뒤에 비어 있는 축은 더 오지 않는다. */
  finished: boolean
}) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionTitle}>
        <h2 className={styles.heading}>{SECTION.mediaManipulation}</h2>
      </div>
      <Detection name={DETECTION_LABEL.face} result={face} finished={finished} />
      <Detection name={DETECTION_LABEL.wholeVideo} result={wholeVideo} finished={finished} />
    </section>
  )
}

/**
 * 아직 도착하지 않은 탐지에는 단계 칩을 두지 않고 카드를 눌러 둔다. 회색
 * 단계 칩이라도 두면 결과가 나온 것처럼 읽힌다.
 *
 * 서버가 `status_label`을 주면 그쪽을 먼저 쓴다. 라벨을 줄이지 않는다.
 * `뚜렷한 조작 징후 없음`을 줄이면 조작이 없다는 단정에 가까워진다.
 */
function Detection({
  name,
  result,
  finished,
}: {
  name: string
  result: ManipulationResult | null | undefined
  finished: boolean
}) {
  const missing = result === null || result === undefined
  // 끝난 뒤에도 비어 있으면 수행하지 못한 것이다. 계속 돌고 있는 것처럼 두지 않는다.
  const pending = missing && !finished
  const detail = missing ? null : result.detail
  const evidence = (missing ? null : result.evidence) ?? []

  return (
    <Card tone={pending ? 'muted' : 'default'}>
      <div className={styles.head}>
        <span className={styles.name}>{name}</span>
        <ManipulationChip result={result} finished={finished} />
      </div>
      {/* 징후 없음에는 분석 범위를 반드시 붙인다. 범위 없는 없음은 안전하다는 뜻으로 읽힌다. */}
      {detail === null || detail === undefined ? null : <p className={styles.detail}>{detail}</p>}
      {evidence.length === 0 ? null : (
        <ul className={styles.evidence}>
          {evidence.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </Card>
  )
}
