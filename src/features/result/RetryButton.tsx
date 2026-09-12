import type { JobResponse } from '../../api/types'
import { IconButton } from '../../components'
import { RetryIcon } from '../../components/icons'
import { RESULT } from '../../copy/strings'
import { useRetryAnalysis } from './useRetryAnalysis'

/**
 * 상단바의 다시 분석이다. 결과를 다 읽지 않아도 바로 누를 수 있게 위에도 둔다.
 * 화면 아래의 버튼과 같은 동작이다.
 */
export function RetryButton({ job }: { job: JobResponse }) {
  const { retry, pending } = useRetryAnalysis(job)

  return (
    <IconButton label={RESULT.retry} disabled={pending} onClick={retry}>
      <RetryIcon size={17} />
    </IconButton>
  )
}
