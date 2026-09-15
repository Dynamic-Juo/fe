/**
 * 봇 확인 토큰을 받는다. 공개 접수에 필수다.
 *
 * 토큰은 한 번만 쓸 수 있고 5분 뒤 만료된다. 그래서 화면을 열 때 미리 받아
 * 두지 않고 접수를 누른 그 순간에 받는다. 링크를 찾아 붙여넣는 사이 5분이
 * 지나는 일이 드물지 않다.
 *
 * 위젯은 평소에 보이지 않는다. 사람 확인이 필요한 경우에만 Cloudflare가
 * 화면에 띄운다.
 */

const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY

/** 사람 확인까지 기다려 주는 시간. 넘으면 실패로 보고 다시 누르게 한다. */
const TIMEOUT_MS = 60_000

interface RenderOptions {
  sitekey: string
  action: string
  execution: 'execute'
  appearance: 'interaction-only'
  callback: (token: string) => void
  'error-callback': () => void
  'expired-callback': () => void
  'timeout-callback': () => void
}

interface Turnstile {
  render: (container: HTMLElement, options: RenderOptions) => string
  execute: (widgetId: string) => void
  reset: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: Turnstile
  }
}

/** 토큰을 받지 못한 이유다. 화면이 무엇을 안내할지 고르는 데 쓴다. */
export class TurnstileError extends Error {
  readonly kind: 'unconfigured' | 'unavailable' | 'failed'

  constructor(kind: TurnstileError['kind'], message: string) {
    super(message)
    this.name = 'TurnstileError'
    this.kind = kind
  }
}

export function isTurnstileConfigured(): boolean {
  return typeof SITE_KEY === 'string' && SITE_KEY !== ''
}

let scriptPromise: Promise<void> | null = null

/** 스크립트는 한 번만 넣는다. 광고 차단기나 사내 방화벽이 막으면 실패한다. */
function loadScript(): Promise<void> {
  scriptPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SCRIPT_URL
    script.async = true
    script.onload = () => {
      resolve()
    }
    script.onerror = () => {
      scriptPromise = null
      reject(new TurnstileError('unavailable', '확인 절차를 불러오지 못했습니다.'))
    }
    document.head.append(script)
  })
  return scriptPromise
}

let widgetId: string | null = null
let settle: ((result: { token: string } | { error: TurnstileError }) => void) | null = null

/** 위젯도 한 번만 만든다. 만들 때마다 늘어나면 다음 실행이 어느 것인지 모른다. */
function ensureWidget(turnstile: Turnstile): string {
  if (widgetId !== null) return widgetId

  const container = document.createElement('div')
  container.dataset.turnstile = ''
  document.body.append(container)

  widgetId = turnstile.render(container, {
    sitekey: SITE_KEY,
    action: 'analyze',
    execution: 'execute',
    appearance: 'interaction-only',
    callback: (token) => {
      settle?.({ token })
    },
    'error-callback': () => {
      settle?.({ error: new TurnstileError('failed', '확인에 실패했습니다.') })
    },
    'expired-callback': () => {
      settle?.({ error: new TurnstileError('failed', '확인이 만료됐습니다.') })
    },
    'timeout-callback': () => {
      settle?.({ error: new TurnstileError('failed', '확인이 끝나지 않았습니다.') })
    },
  })
  return widgetId
}

/**
 * 토큰 하나를 받는다. 부를 때마다 새로 받는다.
 *
 * 앞선 실행의 토큰은 이미 쓰였거나 버려졌으므로 실행 전에 위젯을 되돌린다.
 */
export async function requestTurnstileToken(): Promise<string> {
  if (!isTurnstileConfigured()) {
    throw new TurnstileError('unconfigured', '확인 절차가 설정되지 않았습니다.')
  }

  await loadScript()
  const turnstile = window.turnstile
  if (turnstile === undefined) {
    throw new TurnstileError('unavailable', '확인 절차를 불러오지 못했습니다.')
  }

  const id = ensureWidget(turnstile)
  turnstile.reset(id)

  return new Promise<string>((resolve, reject) => {
    const timer = setTimeout(() => {
      finish({ error: new TurnstileError('failed', '확인이 끝나지 않았습니다.') })
    }, TIMEOUT_MS)

    // 한 번만 끝낸다. 콜백이 겹쳐 들어와도 앞선 결과를 뒤집지 않는다.
    function finish(result: { token: string } | { error: TurnstileError }): void {
      if (settle === null) return
      settle = null
      clearTimeout(timer)
      if ('token' in result) resolve(result.token)
      else reject(result.error)
    }

    settle = finish
    turnstile.execute(id)
  })
}
