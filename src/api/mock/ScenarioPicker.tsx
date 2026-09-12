import { Button } from '../../components'
import { watchUrl } from '../../domain/youtube'
import { MOCK_UNAVAILABLE_VIDEO_ID } from './preview'
import { MOCK_SCENARIOS } from './scenarios'

/**
 * mock이 켜진 환경에서만 홈에 뜨는 시나리오 선택기다. 개발 모드가 아니라
 * mock 여부로 조건을 건다. Vercel Preview 배포에서도 보여야 하기 때문이다.
 *
 * 새 스타일 파일을 두지 않는다. 이 모듈이 부수 효과 없이 떨어져 나가야
 * 프로덕션 번들에서 mock 코드가 전부 빠진다.
 */
export function MockScenarioPicker({ onPick }: { onPick: (url: string) => void }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
      {MOCK_SCENARIOS.map((scenario) => (
        <Button
          key={scenario.id}
          type="button"
          variant="outline"
          title={scenario.note}
          onClick={() => {
            onPick(watchUrl(scenario.videoId))
          }}
        >
          {scenario.label}
        </Button>
      ))}
      <Button
        type="button"
        variant="outline"
        title="비공개·삭제·연령 제한 영상처럼 접근할 수 없는 경우"
        onClick={() => {
          onPick(watchUrl(MOCK_UNAVAILABLE_VIDEO_ID))
        }}
      >
        접근할 수 없는 영상
      </Button>
      <Button
        type="button"
        variant="outline"
        title="YouTube 링크가 아니어서 접수 전에 걸린다"
        onClick={() => {
          onPick('https://example.com/not-youtube')
        }}
      >
        지원하지 않는 링크
      </Button>
    </div>
  )
}
