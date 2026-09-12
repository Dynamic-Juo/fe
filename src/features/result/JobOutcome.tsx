import type { JobResponse, TerminalJobStatus } from '../../api/types'
import { Banner } from '../../components'
import { ERROR, OUTCOME } from '../../copy/strings'

/**
 * 작업이 어떻게 끝났는지 알린다. 진행 헤더가 있던 자리에 대신 들어간다.
 *
 * 어떤 종료 상태든 이미 완료된 결과는 지우지 않는다. 화면을 비우고 오류만
 * 남기지 않는다. 이 배너는 남은 결과 위에 덧붙는 설명이다.
 *
 * 검증할 주장이 없는 것과 근거 부족은 여기 오지 않는다. 실패가 아니라 정상
 * 결과이고, 실패 배너를 붙이면 오류로 읽힌다.
 */
export function JobOutcome({ job, status }: { job: JobResponse; status: TerminalJobStatus }) {
  const outcome = describe(job, status)
  if (outcome === null) return null

  return (
    <Banner
      title={outcome.title}
      description={outcome.description}
      assertive={status !== 'completed'}
    />
  )
}

/**
 * 화면에 기술 오류 코드를 쓰지 않는다. 무엇이 안 됐고 어디까지 영향을
 * 받았는지만 쓰고, 내부 추적은 분석 ID로 한다.
 */
function describe(
  job: JobResponse,
  status: TerminalJobStatus,
): { title: string; description: string } | null {
  if (status === 'failed') {
    return {
      title: OUTCOME.failed.title,
      description: job.error?.message ?? ERROR.unknown,
    }
  }
  if (status === 'timed_out') return OUTCOME.timedOut
  if (status === 'completed_with_limitations') return OUTCOME.partial

  // 한국어가 아닌 영상은 분석 전에 거를 수 없다. 결과를 버리지 않고 안내만 붙인다.
  const language = job.result?.media?.language
  if (typeof language === 'string' && language !== '' && !language.startsWith('ko')) {
    return OUTCOME.nonKorean
  }
  return null
}
