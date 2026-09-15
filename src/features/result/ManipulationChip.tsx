import type { ManipulationResult } from '../../api/types'
import { Chip } from '../../components'
import { AlertIcon, QuestionIcon, ScanFaceIcon, SlashIcon } from '../../components/icons'
import { CLAIM, MANIPULATION_LABEL } from '../../copy/strings'

const TONE = {
  suspected: 'suspected',
  no_clear_signs: 'noClearSigns',
  inconclusive: 'inconclusive',
  unavailable: 'unavailable',
} as const

const ICON = {
  suspected: <AlertIcon size={13} />,
  no_clear_signs: <ScanFaceIcon size={13} />,
  inconclusive: <QuestionIcon size={13} />,
  unavailable: <SlashIcon size={13} />,
} as const

/**
 * 미디어 조작 단계 칩이다. 요약과 미디어 영역이 같은 값을 다르게 그리면
 * 사용자는 다른 뜻으로 읽는다. 한 곳에서 그린다.
 *
 * 조작 의심만 굵게 둔다. 나머지를 같은 무게로 두어야 단정처럼 읽히지 않는다.
 * 라벨은 줄이지 않는다. `뚜렷한 조작 징후 없음`을 줄이면 조작이 없다는
 * 단정에 가까워진다.
 */
export function ManipulationChip({
  result,
  finished,
}: {
  result: ManipulationResult | null | undefined
  /** 작업이 끝났는지. 끝난 뒤에 비어 있는 축은 수행하지 못한 것이다. */
  finished: boolean
}) {
  const missing = result === null || result === undefined
  if (missing && !finished) return <Chip emphasis="dashed">{CLAIM.analyzing}</Chip>

  const status = missing ? 'unavailable' : result.status
  const label = missing
    ? MANIPULATION_LABEL.unavailable
    : (result.status_label ?? MANIPULATION_LABEL[result.status])

  return (
    <Chip
      emphasis={status === 'suspected' ? 'strong' : 'normal'}
      tone={TONE[status]}
      icon={ICON[status]}
    >
      {label}
    </Chip>
  )
}
