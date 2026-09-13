import { useEffect, useState } from 'react'

/** Chromium이 설치 가능하다고 판단하면 던지는 이벤트. 표준이 아니라 타입을 직접 적는다. */
interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>
}

export type InstallKind = 'none' | 'prompt' | 'guide'

/**
 * 설치 진입점을 어떻게 낼지 정한다.
 *
 * - `prompt`: Chromium 계열. 이벤트를 잡아 뒀다가 브라우저 설치 창을 연다.
 * - `guide`: iOS Safari. 설치 창을 여는 방법이 없어 절차를 안내한다.
 * - `none`: 이미 설치했거나 설치를 지원하지 않는 환경. 진입점을 두지 않는다.
 *
 * 설치 가능 여부를 모르는 채 버튼만 두면 눌러도 아무 일이 없는 자리가 된다.
 */
export function useInstallPrompt(): { kind: InstallKind; install: () => void } {
  const [event, setEvent] = useState<InstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    const onPrompt = (e: Event) => {
      // 브라우저가 제 시점에 띄우지 않게 막고, 사용자가 누를 때 연다.
      e.preventDefault()
      setEvent(e as InstallPromptEvent)
    }
    const onInstalled = () => {
      setInstalled(true)
      setEvent(null)
    }

    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const kind: InstallKind =
    installed || isStandalone()
      ? 'none'
      : event !== null
        ? 'prompt'
        : isIosSafari()
          ? 'guide'
          : 'none'

  return {
    kind,
    install: () => {
      void event?.prompt()
    },
  }
}

/** 이미 설치해서 앱으로 열린 상태. 홈 화면에서 연 iOS도 여기 해당한다. */
function isStandalone(): boolean {
  if (window.matchMedia('(display-mode: standalone)').matches) return true
  return 'standalone' in navigator && navigator.standalone === true
}

/**
 * iOS는 Safari 엔진만 쓸 수 있어 브라우저 이름으로 가리지 않는다. 대신
 * 터치 기기이면서 Apple 엔진인지를 본다.
 */
function isIosSafari(): boolean {
  const ua = navigator.userAgent
  const iOS =
    /iPad|iPhone|iPod/.test(ua) || (ua.includes('Macintosh') && navigator.maxTouchPoints > 1)
  return iOS && /AppleWebKit/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua)
}
