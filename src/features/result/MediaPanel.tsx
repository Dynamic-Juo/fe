import type { ManipulationResult } from '../../api/types'
import { Card } from '../../components'
import { Chip } from '../../components'
import { DETECTION_LABEL, DISCLOSURE, SECTION } from '../../copy/strings'
import { isDisclosed } from './disclosure'
import { ManipulationChip } from './ManipulationChip'
import * as styles from './MediaPanel.css'

/**
 * 미디어 조작 영역이다. 지금은 얼굴 합성·변형 하나만 표시한다.
 *
 * 주장 검증과 완전히 분리된 영역이며 서로를 기다리지 않는다.
 *
 * 업로더 AI 생성 표기는 분석 결과가 아니라 업로더가 적어 둔 것을 읽은 값이다.
 * 표기가 있을 때만 카드를 만든다. 없다고 적으면 AI로 만들지 않았다는 뜻으로
 * 읽힌다.
 *
 * 영상 전체 AI 생성 탐지와 음성 합성은 MVP에서 제외다. 화면에 항목을 두지 않는다.
 */
export function MediaPanel({
  face,
  disclosure,
  finished,
}: {
  face: ManipulationResult | null | undefined
  disclosure: ManipulationResult | null | undefined
  /** 작업이 끝났는지. 끝난 뒤에 비어 있는 축은 더 오지 않는다. */
  finished: boolean
}) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionTitle}>
        <h2 className={styles.heading}>{SECTION.mediaManipulation}</h2>
      </div>
      <Detection name={DETECTION_LABEL.face} result={face} finished={finished} />
      {isDisclosed(disclosure) ? <Disclosure evidence={disclosure?.evidence ?? []} /> : null}
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

/**
 * 서버 문구를 그대로 쓰지 않는다. 서버 `detail`은 탐지 모델을 선정하지
 * 않았다는 설명이라 이 카드의 제목과 맞지 않는다.
 */
function Disclosure({ evidence }: { evidence: readonly string[] }) {
  return (
    <Card>
      <div className={styles.head}>
        <span className={styles.name}>{DETECTION_LABEL.disclosure}</span>
        <Chip emphasis="strong">{DISCLOSURE.chip}</Chip>
      </div>
      <p className={styles.detail}>{DISCLOSURE.detail}</p>
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
