import { useNavigate } from 'react-router-dom'

import { useSubmitAnalysis } from '../../api/queries'
import type { JobResponse } from '../../api/types'
import { readAnalysis, writeAnalysis } from '../../app/analysis'

/**
 * 다시 분석은 새 접수다. 서버에 결과 캐시가 없어 같은 주소로 다시 접수하는
 * 것 말고는 방법이 없다.
 *
 * 상단바와 화면 아래 두 곳에서 부른다. 각자 따로 만들면 세션을 저장하는
 * 방식이 어긋나고 한쪽만 고쳐도 모른다.
 */
export function useRetryAnalysis(job: JobResponse): { retry: () => void; pending: boolean } {
  const navigate = useNavigate()
  const submit = useSubmitAnalysis()

  return {
    pending: submit.isPending,
    retry: () => {
      const stored = readAnalysis()
      submit.mutate(
        { url: job.url, session_id: stored?.sessionId ?? null },
        {
          onSuccess: (response) => {
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
    },
  }
}
