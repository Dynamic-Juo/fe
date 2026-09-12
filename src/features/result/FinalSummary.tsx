import type { JobResponse, TerminalJobStatus } from '../../api/types'
import { Card, Chip } from '../../components'
import {
  DETECTION_LABEL,
  JOB_STATE_LABEL,
  MANIPULATION_LABEL,
  SECTION,
  SUMMARY,
} from '../../copy/strings'
import { timestamp } from '../../domain/format'
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
        <span className={styles.state}>
          <Chip>{JOB_STATE_LABEL[status]}</Chip>
        </span>
      </div>

      <Card>
        <div className={styles.group}>
          <p className={styles.groupTitle}>{SECTION.mediaManipulation}</p>
          <DetectionRow
            name={DETECTION_LABEL.face}
            value={
              result?.face_manipulation?.status_label ?? label(result?.face_manipulation?.status)
            }
          />
          <DetectionRow
            name={DETECTION_LABEL.wholeVideo}
            value={
              result?.whole_video_generation?.status_label ??
              label(result?.whole_video_generation?.status)
            }
          />
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
          {SUMMARY.analysisId} <span className={styles.strong}>{job.display_id}</span>
          <br />
          {timestamp(job.created_at)}
        </p>
      </Card>
    </section>
  )
}

function label(status: string | undefined): string {
  return status !== undefined && status in MANIPULATION_LABEL
    ? MANIPULATION_LABEL[status as keyof typeof MANIPULATION_LABEL]
    : MANIPULATION_LABEL.unavailable
}

/** 조작 의심만 굵게 둔다. 나머지를 같은 무게로 두어야 단정처럼 읽히지 않는다. */
function DetectionRow({ name, value }: { name: string; value: string }) {
  return (
    <div className={styles.row}>
      <span className={styles.rowName}>{name}</span>
      <Chip emphasis={value === MANIPULATION_LABEL.suspected ? 'strong' : 'normal'}>{value}</Chip>
    </div>
  )
}
