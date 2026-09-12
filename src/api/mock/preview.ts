import { VideoUnavailableError, type VideoPreview } from '../preview'
import { MOCK_SCENARIOS } from './scenarios'

/**
 * 영상 정보 조회의 mock이다. 실제 oEmbed를 부르면 시나리오의 가짜 영상 ID가
 * 전부 없는 영상으로 걸려서 mock 흐름 자체가 막힌다.
 */

/** 접근할 수 없는 영상 상태를 보려고 둔 ID다. 어떤 시나리오에도 붙지 않는다. */
export const MOCK_UNAVAILABLE_VIDEO_ID = 'mock-gone-0'

export function mockFetchVideoPreview(videoId: string): Promise<VideoPreview> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (videoId === MOCK_UNAVAILABLE_VIDEO_ID) {
        reject(new VideoUnavailableError())
        return
      }
      const scenario = MOCK_SCENARIOS.find((item) => item.videoId === videoId)
      resolve({
        videoId,
        title: scenario?.media.title ?? '[예시] 분석할 영상',
        author: scenario?.media.uploader ?? '예시 채널',
        thumbnailUrl: null,
      })
    }, 250)
  })
}
