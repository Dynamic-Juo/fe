import { useParams } from 'react-router-dom'

import { useJob, useVideoPreview } from '../api/queries'
import { AppBar, Banner, Chip } from '../components'
import { ERROR, JOB_STATE_LABEL, PROGRESS } from '../copy/strings'
import { ClaimSection } from '../features/result/ClaimSection'
import { FinalSummary } from '../features/result/FinalSummary'
import { JobOutcome } from '../features/result/JobOutcome'
import { MediaPanel } from '../features/result/MediaPanel'
import { ProgressHeader } from '../features/result/ProgressHeader'
import { ResultActions } from '../features/result/ResultActions'
import { SummarySlot } from '../features/result/SummarySlot'
import { VideoStrip } from '../features/result/VideoStrip'
import { clock } from '../domain/format'
import { isTerminalStatus } from '../domain/job'
import { parseVideoId } from '../domain/youtube'
import { dividerTop } from '../styles/divider.css'
import * as styles from './ResultScreen.css'

/**
 * 같은 화면이 폴링으로 변해간다. 준비 중, 진행 중, 완료를 다른 페이지로
 * 나누지 않는다. 화면을 옮기면 폴링으로 도착하는 결과를 놓친다.
 *
 * 어떤 종료 상태든 이미 완료된 결과는 지우지 않는다. 화면을 비우고 오류만
 * 남기지 않는다.
 */
export function ResultScreen() {
  const { jobId } = useParams<{ jobId: string }>()
  const job = useJob(jobId)
  const data = job.data
  const result = data?.result

  // 종료 상태를 값으로 들고 있어야 최종 요약과 안내에 그대로 넘길 수 있다.
  const terminalStatus = data !== undefined && isTerminalStatus(data.status) ? data.status : null
  // 실패로 끝난 작업에는 요약을 만들지 않는다. 집계할 결과가 하나도 없다.
  const summaryStatus = terminalStatus === 'failed' ? null : terminalStatus

  /**
   * 서버가 media를 채우기 전에도 영상 정보를 보여준다. URL을 받는 즉시
   * oEmbed로 채운다는 결정이고, 홈에서 이미 받아둔 값이라 대개 곧바로 나온다.
   * 서버 값이 도착하면 정규화를 거친 그쪽을 쓴다.
   */
  const preview = useVideoPreview(data === undefined ? null : parseVideoId(data.url))

  return (
    <div className={styles.page}>
      <AppBar
        back
        title={terminalStatus === null ? JOB_STATE_LABEL.running : JOB_STATE_LABEL[terminalStatus]}
      >
        {data === undefined || terminalStatus !== null ? null : (
          <Chip emphasis="dashed">{PROGRESS.elapsed(clock(data.elapsed_sec))}</Chip>
        )}
      </AppBar>

      {data === undefined ? (
        <div className={styles.section}>
          {job.isError ? (
            <Banner
              title={ERROR.jobNotFound}
              description={ERROR.jobNotFoundDetail}
              tone="notice"
              assertive
            />
          ) : (
            <VideoStrip title={null} author={null} thumbnailUrl={null} />
          )}
        </div>
      ) : (
        <div className={styles.layout}>
          <div className={styles.main}>
            <div className={`${styles.orderHeadline} ${styles.section}`}>
              {terminalStatus === null ? (
                <ProgressHeader job={data} />
              ) : (
                <JobOutcome job={data} status={terminalStatus} />
              )}
            </div>
            <div className={`${styles.orderClaims} ${styles.section} ${dividerTop}`}>
              <ClaimSection
                verification={result?.claim_verification}
                transcriptSource={result?.media?.transcript_source}
                finished={terminalStatus !== null}
              />
            </div>
          </div>

          <aside className={styles.side}>
            <div className={styles.orderVideo}>
              <VideoStrip
                title={result?.media?.title ?? preview.data?.title ?? null}
                author={result?.media?.uploader ?? preview.data?.author ?? null}
                thumbnailUrl={result?.media?.thumbnail ?? preview.data?.thumbnailUrl ?? null}
              />
            </div>
            {summaryStatus !== null ? (
              <div className={`${styles.orderSummary} ${styles.section}`}>
                <FinalSummary job={data} status={summaryStatus} />
              </div>
            ) : terminalStatus === null ? (
              <div className={`${styles.orderSummary} ${styles.section}`}>
                <SummarySlot />
              </div>
            ) : null}
            <div className={`${styles.orderMedia} ${styles.section} ${dividerTop}`}>
              <MediaPanel
                face={result?.face_manipulation}
                wholeVideo={result?.whole_video_generation}
                finished={terminalStatus !== null}
              />
            </div>
          </aside>
        </div>
      )}

      {data === undefined ? null : (
        <ResultActions
          job={data}
          finished={terminalStatus !== null}
          showId={summaryStatus === null}
        />
      )}
    </div>
  )
}
