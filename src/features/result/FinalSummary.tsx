import type { JobResponse, ManipulationResult, TerminalJobStatus } from '../../api/types'
import { Card, Chip } from '../../components'
import { DETECTION_LABEL, DISCLOSURE, JOB_STATE_LABEL, SECTION, SUMMARY } from '../../copy/strings'
import { isDisclosed } from './disclosure'
import { timestamp } from '../../domain/format'
import { ManipulationChip } from './ManipulationChip'
import * as styles from './FinalSummary.css'

/**
 * 최종 요약이다. 작업이 끝난 뒤에만 생긴다. 진행 중에 부분 집계를 미리
 * 보여주면 최종 요약과 숫자가 달라진다.
 *
 * 사용자에게는 완료 항목 수와 전체 항목 수만 보여준다. 내부 검수용 처리
 * 완성도 등급은 화면에 표시하지 않는다.
 */
export function FinalSummary({ job, status }: { job: JobResponse; status: TerminalJobStatus }) {
  const result = job.result
  const verification = result?.claim_verification
  const summary = verification?.summary
  const total = summary?.total ?? verification?.claims?.length ?? 0

  return (
    <section className={styles.section}>
      <div className={styles.sectionTitle}>
        <h2 className={styles.heading}>{SUMMARY.heading}</h2>
        <Chip>{JOB_STATE_LABEL[status]}</Chip>
      </div>

      <Card>
        <div className={styles.group}>
          <p className={styles.groupTitle}>{SECTION.mediaManipulation}</p>
          <DetectionRow name={DETECTION_LABEL.face} result={result?.face_manipulation} />
          {isDisclosed(result?.whole_video_generation) ? (
            <div className={styles.row}>
              <span className={styles.rowName}>{DETECTION_LABEL.disclosure}</span>
              <Chip emphasis="strong">{DISCLOSURE.chip}</Chip>
            </div>
          ) : null}
        </div>

        <hr className={styles.rule} />

        {/* 판정별 개수는 완료된 카드만 센다. 전체 개수가 0이면 나누지 않는다. */}
        <div className={styles.group}>
          <p className={styles.groupTitle}>
            {SUMMARY.verdicts} <span className={styles.strong}>{SUMMARY.total(total)}</span>
          </p>
          <div className={styles.verdicts}>
            <span className={styles.verdict}>
              <Chip>{SUMMARY.supported(summary?.supported ?? 0)}</Chip>
            </span>
            <span className={styles.verdict}>
              <Chip>{SUMMARY.refuted(summary?.refuted ?? 0)}</Chip>
            </span>
            <span className={styles.verdict}>
              <Chip>{SUMMARY.unverified(summary?.unverified ?? 0)}</Chip>
            </span>
          </div>
        </div>

        <hr className={styles.rule} />

        <p className={styles.meta}>
          {SUMMARY.counts(
            summary?.done ?? 0,
            (summary?.pending ?? 0) + (summary?.verifying ?? 0) + (summary?.failed ?? 0),
            summary?.timed_out ?? 0,
          )}
        </p>

        <hr className={styles.rule} />

        {/* 신고할 때 첨부할 값이다. 조회 키가 아니다. */}
        <p className={styles.meta}>
          {SUMMARY.analysisId} <span className={styles.strong}>{job.display_id}</span> ·{' '}
          {timestamp(job.created_at)}
        </p>
      </Card>
    </section>
  )
}

function DetectionRow({
  name,
  result,
}: {
  name: string
  result: ManipulationResult | null | undefined
}) {
  return (
    <div className={styles.row}>
      <span className={styles.rowName}>{name}</span>
      {/* 요약은 끝난 뒤에만 만들어지므로 비어 있으면 수행하지 못한 것이다. */}
      <ManipulationChip result={result} finished />
    </div>
  )
}
