import type { ManipulationResult } from '../../api/types'

/**
 * 업로더가 AI 생성 표기를 했는지. 서버는 제목·설명에서 표기를 찾았을 때만
 * `suspected`를 준다.
 *
 * 표기가 없으면 `unavailable`이 오는데, 확인하지 못했다는 뜻이 아니라 표기가
 * 없었다는 뜻이다. 그래도 화면에는 그리지 않는다. 없다고 적으면 AI로 만들지
 * 않았다는 뜻으로 읽힌다.
 */
export function isDisclosed(result: ManipulationResult | null | undefined): boolean {
  return result?.status === 'suspected'
}
