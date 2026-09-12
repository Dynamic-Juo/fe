/**
 * 서버 URL 파서와 같은 경계를 본다. 기준은 `be/docs/api-reference.md`의
 * 지원 경계다. 여기서 거르는 것은 형식뿐이고, 공개 상태·길이·연령 제한은
 * 서버가 metadata를 받아본 뒤에야 알 수 있다.
 */

const ALLOWED_HOSTS = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com'])
const SHORT_HOST = 'youtu.be'
const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/

/** 서버가 정규화하는 형태와 같다. 시간 위치 같은 부가 query는 버린다. */
export function watchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`
}

/**
 * 지원하는 형태에서 11자 영상 ID를 뽑는다. 형태가 맞지 않으면 `null`이다.
 * 재생목록, 다른 플랫폼, 내부 주소는 받지 않는다.
 */
export function parseVideoId(input: string): string | null {
  const trimmed = input.trim()
  if (trimmed === '' || /\s/.test(trimmed)) return null

  let url: URL
  try {
    url = new URL(trimmed)
  } catch {
    return null
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null
  if (url.username !== '' || url.password !== '') return null
  if (url.port !== '') return null

  const host = url.hostname.toLowerCase()

  if (host === SHORT_HOST) {
    return takeId(url.pathname.slice(1))
  }

  if (!ALLOWED_HOSTS.has(host)) return null

  if (url.pathname === '/watch') {
    return takeId(url.searchParams.get('v') ?? '')
  }

  if (url.pathname.startsWith('/shorts/')) {
    return takeId(url.pathname.slice('/shorts/'.length))
  }

  return null
}

function takeId(raw: string): string | null {
  const id = raw.split('/')[0] ?? ''
  return VIDEO_ID.test(id) ? id : null
}
