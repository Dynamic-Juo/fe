import { useState } from 'react'

import type { ClaimResult, EvidenceResult } from '../../api/types'
import { Card, Chip } from '../../components'
import { ChevronDownIcon, ChevronUpIcon, PlayIcon } from '../../components/icons'
import { A11Y, CLAIM, CLAIM_STATUS_LABEL, RESULT, VERDICT_LABEL } from '../../copy/strings'
import { spokenAt } from '../../domain/format'
import { finalVerdict } from '../../domain/job'
import { isHttpUrl } from '../../domain/link'
import { watchUrlAt } from '../../domain/youtube'
import * as styles from './ClaimCard.css'

/** 처리 상태마다 칩의 성격이 다르다. 완료만 결과이고 나머지는 진행이다. */
const STATUS_EMPHASIS = {
  pending: 'muted',
  verifying: 'dashed',
  done: 'normal',
  failed: 'normal',
  timed_out: 'normal',
} as const

/**
 * 주장 카드다. 축이 둘이라 칩도 둘이다. 왼쪽은 처리 상태, 오른쪽은 검증
 * 판정이며 절대 한 칩으로 합치지 않는다.
 *
 * 완료되지 않은 카드에는 판정 칩을 두지 않는다. 회색 판정 칩도 두지 않는다.
 * 사용자는 그것을 결과로 읽는다. 대신 카드 자체를 눌러 두어 아직 결과가
 * 아니라는 것이 한눈에 보이게 한다.
 *
 * 펼침은 카드 안에서 일어난다. 상세 화면으로 옮기면 폴링으로 도착하는
 * 나머지 카드를 놓친다. 펼침 상태는 서버 상태와 분리해 폴링이 와도 접히지
 * 않는다.
 */
export function ClaimCard({
  claim,
  transcriptSource,
  videoId,
}: {
  claim: ClaimResult
  transcriptSource: string | null | undefined
  /** 발언 위치를 누르면 영상의 그 지점을 연다. 모르면 누를 수 없다. */
  videoId: string | null
}) {
  const [expanded, setExpanded] = useState(false)

  const settled = claim.status !== 'pending' && claim.status !== 'verifying'
  const verdict = finalVerdict(claim)
  // 근거 부족은 이유가 곧 결과라 접지 않고 그대로 보여준다.
  const insufficient =
    verdict === 'unverified' ? (claim.insufficient_label ?? claim.reason ?? null) : null
  const cited = (claim.evidence ?? []).filter((item) => item.cited !== false)
  const references = (claim.evidence ?? []).filter((item) => item.cited === false)
  const toggleLabel = footerLabel(cited.length, references.length)

  return (
    <Card tone={settled ? 'default' : 'muted'}>
      <div className={styles.head}>
        <Chip emphasis={STATUS_EMPHASIS[claim.status]}>{CLAIM_STATUS_LABEL[claim.status]}</Chip>
        {verdict === null ? null : (
          <>
            <span className={styles.spacer} />
            <Chip emphasis="strong">{VERDICT_LABEL[verdict]}</Chip>
          </>
        )}
      </div>

      <p className={claim.status === 'pending' ? styles.textPending : styles.text}>{claim.text}</p>

      {/* 아직 처리되지 않은 카드에는 발언 위치도 없다. 서버가 아직 주지 않았다. */}
      {claim.status === 'pending' ? null : videoId !== null &&
        claim.start !== null &&
        claim.start !== undefined ? (
        <a
          className={styles.spokenLink}
          href={watchUrlAt(videoId, claim.start)}
          target="_blank"
          rel="noreferrer noopener"
        >
          <PlayIcon size={13} />
          {spokenLine(claim, transcriptSource)}
        </a>
      ) : (
        <p className={styles.spoken}>
          <PlayIcon size={13} />
          {spokenLine(claim, transcriptSource)}
        </p>
      )}

      {claim.status === 'verifying' ? <div className={styles.working} /> : null}

      {insufficient === null ? null : (
        <>
          <hr className={styles.rule} />
          <div className={styles.block}>
            <p className={styles.blockTitle}>{RESULT.insufficientReason}</p>
            <p className={styles.blockBody}>{insufficient}</p>
          </div>
        </>
      )}

      {claim.status === 'failed' ? <p className={styles.note}>{CLAIM.failed}</p> : null}
      {claim.status === 'timed_out' ? <p className={styles.note}>{CLAIM.timedOut}</p> : null}

      {toggleLabel === null ? null : (
        <>
          <hr className={styles.rule} />
          <button
            type="button"
            className={styles.toggle}
            aria-expanded={expanded}
            onClick={() => {
              setExpanded((value) => !value)
            }}
          >
            <span className={styles.toggleLabel}>{expanded ? A11Y.collapse : toggleLabel}</span>
            {expanded ? <ChevronUpIcon size={18} /> : <ChevronDownIcon size={18} />}
          </button>

          {expanded ? (
            <div className={styles.block}>
              {/* 근거 부족의 이유는 위에 이미 있다. 같은 문장을 두 번 쓰지 않는다. */}
              {insufficient !== null ||
              claim.reason === null ||
              claim.reason === undefined ? null : (
                <>
                  <p className={styles.blockTitle}>{RESULT.evidenceReason}</p>
                  <p className={styles.blockBody}>{claim.reason}</p>
                </>
              )}
              {cited.length === 0 ? null : (
                <div className={styles.evidenceList}>
                  {cited.map((item, index) => (
                    <EvidenceItem key={evidenceKey(item, index)} evidence={item} />
                  ))}
                </div>
              )}
              {references.length === 0 ? null : (
                <>
                  <p className={styles.blockTitle}>{RESULT.referenceOnly}</p>
                  <div className={styles.evidenceList}>
                    {references.map((item, index) => (
                      <EvidenceItem key={evidenceKey(item, index)} evidence={item} />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : null}
        </>
      )}
    </Card>
  )
}

/** 자료에도 고유 ID가 없다. 주소와 제목으로 키를 만든다. */
function evidenceKey(evidence: EvidenceResult, index: number): string {
  return `${index}:${evidence.url}:${evidence.title}`
}

/**
 * 접힌 상태의 한 줄이다. 보여줄 것이 없으면 펼치기 자체를 만들지 않는다.
 * 빈 칸을 펼치게 하면 누를 때마다 헛걸음이 된다.
 */
function footerLabel(citedCount: number, referenceCount: number): string | null {
  if (citedCount > 0) return CLAIM.evidenceCount(citedCount)
  if (referenceCount > 0) return CLAIM.referenceCount(referenceCount)
  return null
}

/** 발언 위치는 처리된 카드에 모두 있다. 못 잡았으면 못 잡았다고 적는다. */
function spokenLine(claim: ClaimResult, transcriptSource: string | null | undefined): string {
  const at = spokenAt({ start: claim.start, end: claim.end, precision: claim.time_precision })
  const source = transcriptSource === 'caption' ? RESULT.captionSource : RESULT.transcriptSource
  return at === null ? `${RESULT.spokenUnknown} · ${source}` : `${at} · ${source}`
}

/**
 * 출처 하나다. 여섯 항목을 채운다. 출처 유형과 발행일이 맨 위에 나란히 서고,
 * 그 아래 제목과 발행 기관, 뒷받침하는 이유, 원문 링크가 온다. 유형과 시점을
 * 먼저 보여야 그 자료를 얼마나 믿을지 정하고 읽는다.
 *
 * 없는 값은 지어내지 않고 그 줄을 비운다.
 *
 * 주소는 HTTP(S)만 링크로 만든다. 서버가 주는 값이라도 그대로 href에 넣지
 * 않는다.
 */
function EvidenceItem({ evidence }: { evidence: EvidenceResult }) {
  return (
    <div className={styles.evidence}>
      <div className={styles.evidenceHead}>
        {evidence.source_type_label === null || evidence.source_type_label === undefined ? (
          <span />
        ) : (
          <Chip size="sm">{evidence.source_type_label}</Chip>
        )}
        {evidence.published_at === null || evidence.published_at === undefined ? null : (
          <span className={styles.evidenceDate}>{evidence.published_at}</span>
        )}
      </div>

      <p className={styles.evidenceTitle}>{evidence.title}</p>

      {evidence.publisher === null || evidence.publisher === undefined ? null : (
        <p className={styles.evidenceMeta}>{evidence.publisher}</p>
      )}

      {evidence.cite_reason === null || evidence.cite_reason === undefined ? null : (
        <p className={styles.evidenceReason}>{evidence.cite_reason}</p>
      )}

      {isHttpUrl(evidence.url) ? (
        <a className={styles.link} href={evidence.url} target="_blank" rel="noreferrer noopener">
          {CLAIM.sourceLink}
        </a>
      ) : null}
    </div>
  )
}
