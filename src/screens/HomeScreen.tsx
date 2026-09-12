import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import { USE_MOCK } from '../api/client'
import { ApiError } from '../api/errors'
import { MockScenarioPicker } from '../api/mock/ScenarioPicker'
import { VideoUnavailableError } from '../api/preview'
import { useSubmitAnalysis, useVideoPreview } from '../api/queries'
import { readSession, writeSession } from '../app/session'
import { AppBar, Banner, Button, Card, Logo, Skeleton, TextField } from '../components'
import { LinkIcon } from '../components/icons'
import { ERROR, HOME } from '../copy/strings'
import { parseVideoId, watchUrl } from '../domain/youtube'
import * as styles from './HomeScreen.css'

/** 피드백 창구 주소. 정해지기 전에는 링크를 만들지 않는다. */
const FEEDBACK_URL = import.meta.env.VITE_FEEDBACK_URL

/**
 * S-01 · 홈. 표식과 제품 이름, 입력, 버튼만 둔다.
 *
 * 링크 형식이 맞지 않거나 접근할 수 없는 영상은 접수하지 않는다. `jobId`가
 * 발급되지 않으므로 진행 화면으로 넘어갈 것도 없다. 공개 상태와 길이는
 * 서버가 metadata를 받아본 뒤에야 알 수 있어 여기서 거르지 못한다.
 */
export function HomeScreen() {
  const navigate = useNavigate()
  const fieldRef = useRef<HTMLInputElement>(null)
  const [input, setInput] = useState('')
  const [touched, setTouched] = useState(false)
  const submit = useSubmitAnalysis()

  const videoId = parseVideoId(input)
  const settled = useSettledInput(input)

  // 형식 오류는 입력 즉시 판정되므로 타이핑 중에는 띄우지 않는다. 한 글자마다
  // 안내가 깜빡인다. 입력이 멎었거나 포커스를 뗀 뒤에 보여준다.
  const malformed = videoId === null && input.trim() !== '' && (touched || settled)

  const preview = useVideoPreview(videoId)
  const unavailable = preview.error instanceof VideoUnavailableError

  /**
   * 아직 아무것도 넣지 않은 상태에서는 버튼을 잠그지 않는다. 시작도 하기 전에
   * 잠긴 버튼을 보여주면 무엇이 문제인지 알 수 없다. 잘못된 링크임을 알게 된
   * 뒤에만 잠근다.
   */
  const blocked = malformed || unavailable || isSessionBusy(submit.error) || submit.isPending

  /**
   * 입력이 바뀌면 직전 접수 실패는 더 이상 이 입력에 대한 것이 아니다.
   * 지우지 않으면 다른 링크를 넣어도 앞선 안내가 남는다.
   */
  const changeUrl = (value: string) => {
    setInput(value)
    if (submit.error !== null) submit.reset()
  }

  const start = (event: FormEvent) => {
    event.preventDefault()
    setTouched(true)
    if (input.trim() === '') {
      fieldRef.current?.focus()
      return
    }
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
    <div className={styles.page}>
      <AppBar />

      <main className={styles.body}>
        <div className={styles.brand}>
          <Logo size="md" />
          <h1 className={styles.title}>{HOME.title}</h1>
          <p className={styles.tagline}>
            {HOME.taglineHead}
            <br className={styles.breakMobile} />
            {HOME.taglineTail}
          </p>
        </div>

        <form className={styles.form} onSubmit={start}>
          <div className={styles.formRow}>
            <div className={styles.field}>
              <TextField
                ref={fieldRef}
                label={HOME.inputPlaceholder}
                hideLabel
                icon={<LinkIcon size={18} />}
                type="url"
                inputMode="url"
                autoComplete="off"
                placeholder={HOME.inputPlaceholder}
                value={input}
                invalid={malformed || unavailable}
                onChange={(event) => {
                  changeUrl(event.target.value)
                }}
                onBlur={() => {
                  setTouched(true)
                }}
              />
            </div>
            <Button type="submit" className={styles.submit} disabled={blocked}>
              {submit.isPending ? HOME.submitting : HOME.submit}
            </Button>
          </div>

          {malformed ? (
            <Banner title={ERROR.unsupportedUrl} description={ERROR.unsupportedUrlDetail} />
          ) : null}

          {unavailable ? (
            <Banner title={ERROR.inaccessible} description={ERROR.inaccessibleDetail} assertive />
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
          {HOME.supportNotice}
          <br className={styles.breakMobile} /> {HOME.optimizedNotice}
        </p>

        {USE_MOCK ? (
          <MockScenarioPicker
            className={styles.picker}
            onPick={(url) => {
              changeUrl(url)
              setTouched(false)
            }}
          />
        ) : null}
      </main>

      <footer className={styles.footer}>
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
      </footer>
    </div>
  )
}

/** 세션당 활성 작업은 하나다. 이 상태에서는 새 접수를 막는다. */
function isSessionBusy(error: Error | null): boolean {
  return error instanceof ApiError && error.code === 'session_busy'
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

  if (isSessionBusy(error)) {
    const lastJobId = readSession().lastJobId
    return (
      <Banner
        title={ERROR.sessionBusy}
        description={ERROR.sessionBusyDetail}
        assertive
        action={
          lastJobId === null ? undefined : (
            <Button
              variant="outline"
              size="sm"
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
      <Banner title={ERROR.unsupportedUrl} description={ERROR.unsupportedUrlDetail} assertive />
    )
  }

  return <Banner title={ERROR.unknown} description={error.message} assertive />
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
          <div className={styles.thumbnail}>
            <Skeleton width="100%" height="100%" />
          </div>
        ) : (
          <img className={styles.thumbnail} src={thumbnailUrl} alt="" />
        )}
        <div className={styles.previewBody}>
          {loading ? (
            <>
              <Skeleton width="88%" />
              <Skeleton width="50%" height="9px" />
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
