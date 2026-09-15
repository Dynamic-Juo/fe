import { useState } from 'react'

import { USE_MOCK } from '../../api/client'
import { MOCK_SCENARIOS } from '../../api/mock/scenarios'
import { useJob, useSubmitAnalysis } from '../../api/queries'
import { Banner, Button, Card, Chip, ProgressBar } from '../../components'
import { claimKey, claimProgress, isTerminalStatus } from '../../domain/job'
import { watchUrl } from '../../domain/youtube'
import * as styles from './MockScreen.css'

/**
 * mock 시나리오 확인 화면이다. 아직 결과 화면이 없어서 접수와 폴링이
 * 계약대로 도는지 여기서 본다. 스냅샷을 그대로 보여주므로 서버를 붙였을 때
 * 응답이 달라지면 여기서 먼저 드러난다.
 *
 * 개발 모드에서만 등록한다. 배포본에는 이 경로가 없다.
 */
export function MockScreen() {
  const [jobId, setJobId] = useState<string | undefined>(undefined)
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const submit = useSubmitAnalysis()
  const job = useJob(jobId, accessToken)

  const start = (url: string) => {
    setSubmitError(null)
    setJobId(undefined)
    setAccessToken(undefined)
    submit.mutate(
      { url, session_id: null },
      {
        onSuccess: (response) => {
          setJobId(response.job_id)
          setAccessToken(response.job_access_token)
        },
        onError: (error) => {
          setSubmitError(error.message)
        },
      },
    )
  }

  const data = job.data
  const claims = data?.result?.claim_verification?.claims
  const progress = claimProgress(claims, data?.result?.claim_verification?.summary)

  return (
    <div className={styles.page}>
      <header>
        <h1 className={styles.pageTitle}>mock 시나리오</h1>
        <p className={styles.lead}>
          시나리오를 고르면 그 링크로 접수하고 폴링한다. 스냅샷은 서버가 주는 형태 그대로다. 지금
          mock은 {USE_MOCK ? '켜져' : '꺼져'} 있다.
        </p>
      </header>

      <section className={styles.scenarioList}>
        {MOCK_SCENARIOS.map((scenario) => (
          <div key={scenario.id}>
            <div className={styles.scenarioRow}>
              <Button variant="outline" onClick={() => start(watchUrl(scenario.videoId))}>
                {scenario.label}
              </Button>
              <span className={styles.scenarioNote}>{scenario.note}</span>
            </div>
          </div>
        ))}
        <div className={styles.scenarioRow}>
          <Button variant="outline" onClick={() => start('https://example.com/not-youtube')}>
            지원하지 않는 링크 (422)
          </Button>
          <span className={styles.scenarioNote}>
            YouTube 링크가 아니어서 접수 단계에서 거절된다.
          </span>
        </div>
      </section>

      {submitError === null ? null : (
        <Banner title="접수 거절" description={submitError} tone="notice" assertive />
      )}

      {job.error === null || job.error === undefined ? null : (
        <Banner title="조회 실패" description={job.error.message} tone="notice" assertive />
      )}

      {data === undefined ? null : (
        <Card>
          <div className={styles.statusGrid}>
            <span className={styles.statusLabel}>status</span>
            <span>
              {data.status} {isTerminalStatus(data.status) ? '(폴링 중지)' : '(폴링 중)'}
            </span>
            <span className={styles.statusLabel}>stage</span>
            <span>{data.stage ?? '—'}</span>
            <span className={styles.statusLabel}>display_id</span>
            <span>{data.display_id}</span>
            <span className={styles.statusLabel}>주장</span>
            <span>
              {progress.ratio === null
                ? '아직 없음'
                : `${progress.settled}/${progress.total}개 완료`}
            </span>
          </div>
          <ProgressBar done={progress.settled} total={progress.total} label="주장 검증 진행률" />
          <div className={styles.scenarioRow}>
            {(claims ?? []).map((claim, index) => (
              <Chip key={claimKey(claim, index)} emphasis="muted">
                {claim.status}
              </Chip>
            ))}
          </div>
          <pre className={styles.snapshot}>{JSON.stringify(data, null, 2)}</pre>
        </Card>
      )}
    </div>
  )
}
