import { USE_MOCK } from './client'
import { mockFetchVideoPreview } from './mock/preview'

/**
 * 접수하기 전에 보여줄 영상 정보다. U-07에서 넣기로 했다.
 *
 * 출처는 YouTube oEmbed다. 키가 필요 없고 브라우저에서 바로 부를 수 있다.
 * 백엔드 계약과 무관한 경로라 `api/types.ts`가 아니라 여기에 따로 둔다.
 */
export interface VideoPreview {
  videoId: string
  title: string
  author: string
  thumbnailUrl: string | null
}

/**
 * 영상이 없거나 접근할 수 없다는 것이 확실할 때만 던진다. 네트워크 오류나
 * 호출 제한은 여기 넣지 않는다. 그런 실패로 분석을 막으면 정상 영상까지
 * 못 쓰게 된다.
 */
export class VideoUnavailableError extends Error {
  constructor() {
    super('영상을 확인할 수 없습니다.')
    this.name = 'VideoUnavailableError'
  }
}

const OEMBED = 'https://www.youtube.com/oembed'

interface OEmbedResponse {
  title?: unknown
  author_name?: unknown
  thumbnail_url?: unknown
}

export function fetchVideoPreview(videoId: string, signal?: AbortSignal): Promise<VideoPreview> {
  return USE_MOCK ? mockFetchVideoPreview(videoId) : realFetchVideoPreview(videoId, signal)
}

async function realFetchVideoPreview(videoId: string, signal?: AbortSignal): Promise<VideoPreview> {
  const target = `https://www.youtube.com/watch?v=${videoId}`
  const url = `${OEMBED}?url=${encodeURIComponent(target)}&format=json`

  const response = await fetch(url, signal === undefined ? {} : { signal })

  // 비공개, 삭제, 연령 제한 영상은 여기서 걸러진다. 나머지 상태는 확실하지
  // 않으므로 정보 없이 진행하게 둔다.
  if (response.status === 401 || response.status === 403 || response.status === 404) {
    throw new VideoUnavailableError()
  }
  if (!response.ok) {
    throw new Error('영상 정보를 가져오지 못했습니다.')
  }

  const data = (await response.json()) as OEmbedResponse
  return {
    videoId,
    title: typeof data.title === 'string' ? data.title : '',
    author: typeof data.author_name === 'string' ? data.author_name : '',
    thumbnailUrl: typeof data.thumbnail_url === 'string' ? data.thumbnail_url : null,
  }
}
