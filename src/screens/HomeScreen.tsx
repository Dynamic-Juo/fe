import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import { USE_MOCK } from '../api/client'
import { ApiError } from '../api/errors'
import { MockScenarioPicker } from '../api/mock/ScenarioPicker'
import { fetchVideoPreview, VideoUnavailableError } from '../api/preview'
import { useSubmitAnalysis } from '../api/queries'
import { readSession, writeSession } from '../app/session'
import { Banner, Button, Card, Skeleton, TextField } from '../components'
import { LinkIcon } from '../components/icons'
import { ERROR, HOME } from '../copy/strings'
import { parseVideoId, watchUrl } from '../domain/youtube'
import * as styles from './HomeScreen.css'

/**
 * S-01 · 홈. 로고와 입력과 버튼만 둔다.
 *
 * 링크 형식이 맞지 않거나 접근할 수 없는 영상은 접수하지 않는다. `jobId`가
 * 발급되지 않으므로 진행 화면으로 넘어갈 것도 없다. 공개 상태와 길이는
 * 서버가 metadata를 받아본 뒤에야 알 수 있어 여기서 거르지 못한다.
 */
export function HomeScreen() {
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [touched, setTouched] = useState(false)
  const submit = useSubmitAnalysis()

  const videoId = parseVideoId(input)
  const settled = useSettledInput(input)

  // 형식 오류는 입력 즉시 판정되므로 타이핑 중에는 띄우지 않는다. 한 글자마다
  // 안내가 깜빡인다. 입력이 멎었거나 포커스를 뗀 뒤에 보여준다.
  const malformed = videoId === null && input.trim() !== '' && (touched || settled)

  const preview = useQuery({
    queryKey: ['videoPreview', videoId],
    queryFn: ({ signal }) => fetchVideoPreview(videoId ?? '', signal),
    enabled: videoId !== null,
    retry: 0,
    staleTime: 5 * 60 * 1000,
  })

  const unavailable = preview.error instanceof VideoUnavailableError
  const blocked = videoId === null || unavailable || submit.isPending

  const start = (event: FormEvent) => {
    event.preventDefault()
    setTouched(true)
    if (videoId === null || unavailable) return

    const session = readSession()
    submit.mutate(
      { url: watchUrl(videoId), session_id: session.sessionId },
      {
        onSuccess: (response) => {
          writeSession({ sessionId: response.session_id, lastJobId: response.job_id })
          void navigate(`/r/${response.job_id}`)
        },
      },
    )
  }

  return (
    <main className={styles.page}>
      <div className={styles.column}>
        <header className={styles.brand}>
          <h1 className={styles.title}>{HOME.title}</h1>
          <p className={styles.tagline}>{HOME.tagline}</p>
        </header>

        <form className={styles.form} onSubmit={start}>
          <div className={styles.formRow}>
            <div className={styles.field}>
              <TextField
                label={HOME.inputPlaceholder}
                hideLabel
                icon={<LinkIcon />}
                type="url"
                inputMode="url"
                autoComplete="off"
                placeholder={HOME.inputPlaceholder}
                value={input}
                invalid={malformed || unavailable}
                onChange={(event) => {
                  setInput(event.target.value)
                }}
                onBlur={() => {
                  setTouched(true)
                }}
              />
            </div>
            <Button type="submit" disabled={blocked}>
              {submit.isPending ? HOME.submitting : HOME.submit}
            </Button>
          </div>

          {malformed ? (
            <Banner
              title={ERROR.unsupportedUrl}
              description={ERROR.unsupportedUrlDetail}
              tone="notice"
            />
          ) : null}

          {unavailable ? (
            <Banner
              title={ERROR.inaccessible}
              description={ERROR.inaccessibleDetail}
              tone="notice"
              assertive
            />
          ) : null}

          <SubmitFailure error={submit.error} />

          {videoId !== null && !malformed && !unavailable ? (
            <VideoPreviewCard
              loading={preview.isPending}
              title={preview.data?.title ?? ''}
              author={preview.data?.author ?? ''}
              thumbnailUrl={preview.data?.thumbnailUrl ?? null}
            />
          ) : null}
        </form>

        <p className={styles.notice}>
          {HOME.supportNotice} {HOME.optimizedNotice}
        </p>

        {USE_MOCK ? (
          <MockScenarioPicker
            onPick={(url) => {
              setInput(url)
              setTouched(false)
            }}
          />
        ) : null}
      </div>
    </main>
  )
}

/** 입력이 멎었다고 볼 때까지 기다리는 시간. */
const SETTLE_DELAY_MS = 500

/**
 * 마지막 입력 뒤 일정 시간이 지났는지. 안내를 띄울 시점을 정하는 데 쓴다.
 *
 * 값이 바뀔 때 상태를 되돌리지 않고 마지막으로 멎은 값을 들고 비교한다.
 * 효과 안에서 곧바로 상태를 바꾸면 렌더가 한 번 더 돈다.
 */
function useSettledInput(value: string): boolean {
  const [settledValue, setSettledValue] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setSettledValue(value)
    }, SETTLE_DELAY_MS)
    return () => {
      clearTimeout(timer)
    }
  }, [value])

  return value.trim() !== '' && settledValue === value
}

/**
 * 접수가 거절된 경우다. 세션이 이미 차 있으면 진행 중인 분석으로 보낸다.
 * 새 세션 ID를 만들어 제한을 우회하지 않는다.
 */
function SubmitFailure({ error }: { error: Error | null }) {
  const navigate = useNavigate()
  if (error === null) return null

  if (error instanceof ApiError && error.code === 'session_busy') {
    const lastJobId = readSession().lastJobId
    return (
      <Banner
        title={ERROR.sessionBusy}
        description={ERROR.sessionBusyDetail}
        tone="notice"
        assertive
        action={
          lastJobId === null ? undefined : (
            <Button
              variant="outline"
              onClick={() => {
                void navigate(`/r/${lastJobId}`)
              }}
            >
              {HOME.viewRunning}
            </Button>
          )
        }
      />
    )
  }

  if (error instanceof ApiError && error.code === 'unsupported_url') {
    return (
      <Banner
        title={ERROR.unsupportedUrl}
        description={ERROR.unsupportedUrlDetail}
        tone="notice"
        assertive
      />
    )
  }

  return <Banner title={ERROR.unknown} description={error.message} tone="notice" assertive />
}

function VideoPreviewCard({
  loading,
  title,
  author,
  thumbnailUrl,
}: {
  loading: boolean
  title: string
  author: string
  thumbnailUrl: string | null
}) {
  return (
    <Card>
      <div className={styles.preview}>
        {thumbnailUrl === null ? (
          <div className={styles.thumbnail} />
        ) : (
          <img className={styles.thumbnail} src={thumbnailUrl} alt="" />
        )}
        <div className={styles.previewBody}>
          {loading ? (
            <>
              <Skeleton width="12rem" />
              <Skeleton width="6rem" />
            </>
          ) : (
            <>
              <p className={styles.previewTitle}>{title}</p>
              <p className={styles.previewAuthor}>{author}</p>
            </>
          )}
        </div>
      </div>
    </Card>
  )
}
