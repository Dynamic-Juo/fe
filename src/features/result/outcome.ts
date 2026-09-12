import type { JobResponse, TerminalJobStatus } from '../../api/types'
import { ERROR, OUTCOME } from '../../copy/strings'

export interface Outcome {
  title: string
  description: string
  /** 낭독기가 읽던 것을 끊고 알릴지. 실패와 시간 초과만 그렇게 한다. */
  assertive: boolean
}

/**
 * 알릴 것이 있는지 먼저 판단한다. 없으면 화면이 자리를 잡지 않게 하려고
 * 그리는 쪽이 아니라 부르는 쪽에서 안다.
 *
 * 화면에 기술 오류 코드를 쓰지 않는다. 무엇이 안 됐고 어디까지 영향을
 * 받았는지만 쓰고, 내부 추적은 분석 ID로 한다.
 */
export function outcomeOf(job: JobResponse, status: TerminalJobStatus): Outcome | null {
  if (status === 'failed') {
    return {
      title: OUTCOME.failed.title,
      description: job.error?.message ?? ERROR.unknown,
      assertive: true,
    }
  }
  if (status === 'timed_out') return { ...OUTCOME.timedOut, assertive: true }
  if (status === 'completed_with_limitations') return { ...OUTCOME.partial, assertive: true }

  // 한국어가 아닌 영상은 분석 전에 거를 수 없다. 결과를 버리지 않고 안내만 붙인다.
  const language = job.result?.media?.language
  if (typeof language === 'string' && language !== '' && !language.startsWith('ko')) {
    return { ...OUTCOME.nonKorean, assertive: false }
  }
  return null
}
