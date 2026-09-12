import { Banner } from '../../components'
import type { Outcome } from './outcome'

/**
 * 작업이 어떻게 끝났는지 알린다. 진행 헤더가 있던 자리에 대신 들어간다.
 *
 * 어떤 종료 상태든 이미 완료된 결과는 지우지 않는다. 화면을 비우고 오류만
 * 남기지 않는다. 이 배너는 남은 결과 위에 덧붙는 설명이다.
 *
 * 검증할 주장이 없는 것과 근거 부족은 여기 오지 않는다. 실패가 아니라 정상
 * 결과이고, 실패 배너를 붙이면 오류로 읽힌다.
 */
export function JobOutcome({ outcome }: { outcome: Outcome }) {
  return (
    <Banner title={outcome.title} description={outcome.description} assertive={outcome.assertive} />
  )
}
