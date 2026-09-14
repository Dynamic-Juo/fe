import type { ClaimVerificationResult } from '../../api/types'
import { ClockIcon, ErrorIcon, InfoIcon } from '../../components/icons'
import { PROGRESS, RESULT, SECTION } from '../../copy/strings'
import { claimKey, claimProgress } from '../../domain/job'
import { ClaimCard } from './ClaimCard'
import { EmptyState } from './EmptyState'
import * as styles from './ClaimSection.css'

/**
 * 주장 카드 목록이다. 서버가 준 개수만큼 전부 그린다. 클라이언트 상한도
 * 페이지네이션도 두지 않는다.
 *
 * 카드 순서는 서버가 준 그대로다. 완료된 것을 위로 올리지 않는다. 순서가
 * 흔들리면 읽던 자리를 잃는다.
 */
export function ClaimSection({
  verification,
  transcriptSource,
  videoId,
  finished,
  asPageTitle,
}: {
  verification: ClaimVerificationResult | null | undefined
  transcriptSource: string | null | undefined
  videoId: string | null
  /** 작업이 끝났는지. 끝난 뒤에 비어 있으면 더 오지 않는다. */
  finished: boolean
  /**
   * 이 절의 제목을 화면 제목으로 쓸지. 진행 중에는 진행 머리말이 화면 제목을
   * 맡으므로 그때는 켜지 않는다. 화면에 제목 요소가 없으면 낭독기로 훑을 때
   * 이 페이지가 무엇인지 알 수 없다.
   */
  asPageTitle: boolean
}) {
  const claims = verification?.claims ?? []
  const progress = claimProgress(claims, verification?.summary)
  const counted = verification?.status === 'analyzed' && progress.total > 0

  return (
    <section className={styles.section}>
      <div className={styles.sectionTitle}>
        {asPageTitle ? (
          <h1 className={styles.heading}>{SECTION.claimVerification}</h1>
        ) : (
          <h2 className={styles.heading}>{SECTION.claimVerification}</h2>
        )}
        {counted ? (
          <span className={styles.count}>
            {progress.settled}/{progress.total}
          </span>
        ) : null}
      </div>

      {/* 검증할 주장이 없는 것과 검증하지 못한 것은 다르다. 둘 다 실패가 아니다. */}
      {verification === null || verification === undefined ? (
        finished ? (
          <EmptyState icon={<ErrorIcon size={26} />}>{RESULT.claimNotRun}</EmptyState>
        ) : (
          // 주장 수가 확정되기 전이라 카드도 만들지 않는다. 안내 문구 한 줄만 둔다.
          <EmptyState icon={<ClockIcon size={26} />}>{PROGRESS.preparing}</EmptyState>
        )
      ) : verification.status === 'no_claims' ? (
        <EmptyState icon={<InfoIcon size={26} />}>{RESULT.noClaims}</EmptyState>
      ) : verification.status === 'unavailable' ? (
        <EmptyState icon={<ErrorIcon size={26} />}>
          {verification.detail ?? RESULT.claimUnavailable}
        </EmptyState>
      ) : (
        <div className={styles.list}>
          {claims.map((claim, index) => (
            <ClaimCard
              key={claimKey(claim, index)}
              claim={claim}
              transcriptSource={transcriptSource}
              videoId={videoId}
            />
          ))}
        </div>
      )}
    </section>
  )
}
