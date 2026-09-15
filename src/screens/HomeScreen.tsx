import { useEffect, useRef, useState, type FormEvent, type ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'

import { USE_MOCK } from '../api/client'
import { ApiError } from '../api/errors'
import { TurnstileError } from '../api/turnstile'
import { MockScenarioPicker } from '../api/mock/ScenarioPicker'
import { VideoUnavailableError } from '../api/preview'
import { useSubmitAnalysis, useVideoPreview } from '../api/queries'
import { readAnalysis, writeAnalysis } from '../app/analysis'
import { AppBar, Banner, Button, Card, Logo, Skeleton, TextField } from '../components'
import { InstallEntry } from '../features/install/InstallEntry'
import { ShareButton } from '../features/share/ShareButton'
import {
  ArrowRightIcon,
  DocumentIcon,
  GithubIcon,
  LinkIcon,
  ScanFaceIcon,
  SearchIcon,
} from '../components/icons'
import { ERROR, FEATURES, FOOTER, HOME } from '../copy/strings'
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

    const stored = readAnalysis()
    submit.mutate(
      { url: watchUrl(videoId), session_id: stored?.sessionId ?? null },
      {
        onSuccess: (response) => {
          // 결과 화면으로 넘어가기 전에 적는다. 조회 자격이 여기에만 있다.
          writeAnalysis({
            jobId: response.job_id,
            jobAccessToken: response.job_access_token,
            sessionId: response.session_id,
            savedAt: Date.now(),
          })
          void navigate(`/r/${response.job_id}`)
        },
      },
    )
  }

  return (
    <div className={styles.page}>
      <AppBar>
        <ShareButton />
        <InstallEntry />
      </AppBar>

      <main className={styles.body}>
        <div className={styles.brand}>
          <Logo size="md" />
          <h1 className={styles.title}>{HOME.title}</h1>
          <p className={styles.subtitle}>
            {HOME.subtitle.map((line, index) => (
              <span key={line.mark}>
                {index === 0 ? null : <br />}
                {line.before}
                <span className={styles.brush}>{line.mark}</span>
                {line.after}
              </span>
            ))}
          </p>
          <p className={styles.tagline}>
            {HOME.taglineHead}
            <br />
            {HOME.taglineLead}
            <span className={styles.taglineName}>{HOME.taglineName}</span>
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
              {submit.isPending ? null : <ArrowRightIcon size={16} />}
            </Button>
          </div>

          {malformed ? (
            <Banner title={ERROR.unsupportedUrl} description={ERROR.unsupportedUrlDetail} />
          ) : null}

          {unavailable ? (
            <Banner title={ERROR.inaccessible} description={ERROR.inaccessibleDetail} assertive />
          ) : null}

          <SubmitFailure error={submit.error} />

          <PreviousAnalysis />

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

        <section className={styles.features}>
          {FEATURES.map((item) => (
            <div key={item.key} className={styles.feature}>
              <span className={styles.featureIcon}>{FEATURE_ICON[item.key]}</span>
              <div>
                <b className={styles.featureName}>{item.name}</b>
                <span className={styles.featureDetail}>{item.detail}</span>
              </div>
            </div>
          ))}
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <span className={styles.footerName}>{FOOTER.name}</span>
          <span>{FOOTER.tagline}</span>
        </div>
        <div className={styles.footerLinks}>
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
          <span className={styles.repoPlaceholder} title={FOOTER.github}>
            <GithubIcon size={36} label={FOOTER.github} />
          </span>
        </div>
      </footer>
    </div>
  )
}

/** 기능 소개의 아이콘. 문구는 `strings.ts`에 있고 여기서는 그림만 잇는다. */
const FEATURE_ICON: Record<(typeof FEATURES)[number]['key'], ReactElement> = {
  claims: <SearchIcon size={26} />,
  evidence: <DocumentIcon size={26} />,
  media: <ScanFaceIcon size={26} />,
}

/**
 * 탭을 닫았다가 돌아온 사용자를 이전 분석으로 되돌린다. 서버 작업은 화면을
 * 떠나도 계속 돌고, 조회 자격이 저장소에 남아 있으면 다시 볼 수 있다.
 *
 * 진행 중인지 끝났는지는 열어 봐야 안다. 여기서 미리 조회하지 않는다. 홈을
 * 열 때마다 서버를 부르게 되고, 새 분석을 하러 온 사람에게도 그렇게 된다.
 */
function PreviousAnalysis() {
  const navigate = useNavigate()
  const [stored] = useState(readAnalysis)
  if (stored === null) return null

  return (
    <Banner
      title={HOME.previousTitle}
      description={HOME.previousDetail}
      action={
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            void navigate(`/r/${stored.jobId}`)
          }}
        >
          {HOME.viewPrevious}
        </Button>
      }
    />
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
    const lastJobId = readAnalysis()?.jobId ?? null
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

  // 게이트웨이가 아직 켜지지 않았거나 서버 설정이 빠졌다. 사용자가 할 일은 없다.
  if (error instanceof ApiError && error.code === 'public_unavailable') {
    return <Banner title={ERROR.notOpen} description={ERROR.notOpenDetail} assertive />
  }

  if (error instanceof ApiError && error.code === 'upstream_unavailable') {
    return <Banner title={ERROR.upstream} description={ERROR.upstreamDetail} assertive />
  }

  // 봇 확인을 마치지 못한 경우다. 원인마다 할 일이 다르다.
  if (error instanceof TurnstileError) {
    if (error.kind === 'unavailable') {
      return (
        <Banner
          title={ERROR.checkUnavailable}
          description={ERROR.checkUnavailableDetail}
          assertive
        />
      )
    }
    if (error.kind === 'unconfigured') {
      return (
        <Banner
          title={ERROR.checkUnconfigured}
          description={ERROR.checkUnconfiguredDetail}
          assertive
        />
      )
    }
    return <Banner title={ERROR.checkFailed} description={ERROR.checkFailedDetail} assertive />
  }

  return <Banner title={ERROR.network} description={error.message} assertive />
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
