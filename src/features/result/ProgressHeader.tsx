import type { JobResponse } from '../../api/types'
import { Card, ProgressBar } from '../../components'
import { ClockIcon } from '../../components/icons'
import { PROGRESS, STEPS } from '../../copy/strings'
import { clock } from '../../domain/format'
import { claimProgress, processingStage } from '../../domain/job'
import * as styles from './ProgressHeader.css'

/** 이 시간을 넘기면 오래 걸린다고 알린다. 대기열에서 기다린 시간은 세지 않는다. */
const LONG_RUNNING_SEC = 5 * 60

/**
 * 진행 헤더다. 주장 수가 확정되기 전에는 완료 개수도 전체 개수도 카드도
 * 만들지 않는다. 나중에 숫자가 줄거나 늘면 신뢰를 깎는다.
 *
 * 확정 전에는 네 단계 중 어디인지를 칸으로 보여주고, 확정된 뒤에는 주장
 * 검증 진행률로 바뀐다. 진행률의 분모는 주장 수다. 미디어 조작 2건은 더하지
 * 않는다. 축이 다르다.
 */
export function ProgressHeader({ job }: { job: JobResponse }) {
  const verification = job.result?.claim_verification
  const progress = claimProgress(verification?.claims, verification?.summary)
  const counted = verification?.status === 'analyzed' && progress.total > 0
  const step = currentStep(job)

  return (
    <div className={styles.header}>
      {counted ? (
        <>
          <h1 className={styles.title}>{PROGRESS.claimsFound(progress.total)}</h1>
          <ProgressBar
            done={progress.settled}
            total={progress.total}
            label={PROGRESS.completedOf(progress.settled, progress.total)}
          />
          <p className={styles.meta}>
            {PROGRESS.completedOf(progress.settled, progress.total)} ·{' '}
            {PROGRESS.elapsed(clock(job.elapsed_sec))}
          </p>
        </>
      ) : (
        <>
          <StepBar current={step} />
          <h1 className={styles.title}>{STEPS[step]?.headline}</h1>
          <p className={styles.meta}>{timeLine(job)}</p>
        </>
      )}

      {/* 결과 영역은 그대로 두고 이 안내만 덧붙인다. 실패가 아니라 지연이다. */}
      {job.processing_elapsed_sec > LONG_RUNNING_SEC ? (
        <Card tone="dashed">
          <div className={styles.notice}>
            <ClockIcon size={17} />
            <p className={styles.noticeText}>{PROGRESS.longRunning}</p>
          </div>
        </Card>
      ) : null}
    </div>
  )
}

/**
 * 지나온 칸, 지금 칸, 남은 칸을 구분한다. 숫자를 쓰지 않아 단계가 늘거나
 * 줄어도 사용자가 세던 수가 틀어지지 않는다.
 */
function StepBar({ current }: { current: number }) {
  return (
    <ol className={styles.steps} aria-label={STEPS[current]?.name}>
      {STEPS.map((step, index) => (
        <li
          key={step.key}
          className={[
            styles.step,
            index < current ? styles.stepDone : '',
            index === current ? styles.stepNow : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <span className={styles.stepName}>{step.name}</span>
        </li>
      ))}
    </ol>
  )
}

/**
 * 서버의 `message`는 파싱하지 않고 `status`와 `stage`로 고른다. 계약이 문구
 * 파싱을 금지하고 있고, 문구가 바뀌어도 화면이 흔들리지 않는다.
 *
 * 주장 추출이 끝난 뒤의 `verifying`은 마지막 칸으로 본다. 카드가 아직
 * 도착하지 않았어도 남은 단계는 없다.
 */
function currentStep(job: JobResponse): number {
  if (job.status === 'queued') return 0
  const stage = processingStage(job.status) ?? job.stage
  if (stage === 'verifying') return STEPS.length - 1
  const index = STEPS.findIndex((step) => step.key === stage)
  return index === -1 ? 1 : index
}

/**
 * 대기열에서 기다린 시간과 분석 시간을 나눠 적는다. 합쳐 두면 대기가
 * 길었던 것인지 분석이 오래 걸린 것인지 알 수 없다.
 *
 * 직전 단계를 마쳤다는 표기를 앞에 붙인다. 첫 단계에서는 마친 것이 없다.
 */
function timeLine(job: JobResponse): string {
  const index = currentStep(job)
  const previous = index > 0 ? STEPS[index - 1] : undefined
  const done = previous !== undefined && 'done' in previous ? previous.done : undefined

  return [
    done,
    PROGRESS.waited(clock(job.queue_wait_sec)),
    PROGRESS.analyzing(clock(job.processing_elapsed_sec)),
  ]
    .filter((value): value is string => value !== undefined)
    .join(' · ')
}
