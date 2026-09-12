import type { JobResponse } from '../../api/types'
import { Button } from '../../components'
import { HOME, RESULT, SUMMARY } from '../../copy/strings'
import { timestamp } from '../../domain/format'
import { canRetry } from '../../domain/job'
import { useRetryAnalysis } from './useRetryAnalysis'
import * as styles from './ResultActions.css'

/** 피드백 창구 주소. 정해지기 전에는 링크를 만들지 않는다. */
const FEEDBACK_URL = import.meta.env.VITE_FEEDBACK_URL

/**
 * 화면 아래 동작 줄이다. 결과를 다 읽은 다음에 할 일을 모아 둔다.
 *
 * 다시 분석은 새 접수다. 서버에 결과 캐시가 없어 같은 주소로 다시 접수하는
 * 것 말고는 방법이 없다. 재실행으로 풀릴 수 있는 실패에만 준다. 같은 결과가
 * 뻔한 것을 다시 누르게 하지 않는다.
 *
 * 신고 링크는 분석 ID 근처에 둔다. ID를 복사해 붙이는 동선이다.
 */
export function ResultActions({
  job,
  finished,
  showId,
}: {
  job: JobResponse
  finished: boolean
  /** 요약 카드가 없을 때만 여기서 분석 ID를 보여준다. 두 곳에 두지 않는다. */
  showId: boolean
}) {
  const { retry, pending } = useRetryAnalysis(job)

  return (
    <div className={styles.actions}>
      {finished && canRetry(job) ? (
        <Button variant="outline" size="sm" fullWidth disabled={pending} onClick={retry}>
          {pending ? RESULT.retrying : RESULT.retry}
        </Button>
      ) : null}

      {/* 요약이 없는 동안 분석 ID를 여기 둔다. 신고할 때 첨부할 값이다. */}
      {showId ? (
        <p className={styles.meta}>
          {SUMMARY.analysisId} {job.display_id} · {timestamp(job.created_at)}
        </p>
      ) : null}

      {FEEDBACK_URL === undefined || FEEDBACK_URL === '' ? null : (
        <a
          className={styles.feedback}
          href={FEEDBACK_URL}
          target="_blank"
          rel="noreferrer noopener"
        >
          {HOME.feedback}
        </a>
      )}
    </div>
  )
}
