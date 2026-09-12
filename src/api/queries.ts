import {
  useMutation,
  useQuery,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query'

import { isTerminalStatus } from '../domain/job'
import { getJob, submitAnalysis } from './client'
import { ApiError, isJobGone } from './errors'
import { fetchVideoPreview, type VideoPreview } from './preview'
import type { AnalyzeRequest, AnalyzeResponse, JobResponse } from './types'

/**
 * 계약이 권장하는 간격이다. 이전 요청이 끝난 뒤 다음 요청을 보내 겹치지
 * 않게 한다. TanStack Query의 `refetchInterval`이 그렇게 동작한다.
 */
export const POLL_INTERVAL_MS = 2_500

/** 조회 실패를 몇 번까지 다시 시도할지. 폴링이 계속 돌아 크게 잡지 않는다. */
const MAX_POLL_RETRY = 2

export function jobQueryKey(jobId: string): readonly unknown[] {
  return ['job', jobId]
}

export function useSubmitAnalysis(): UseMutationResult<AnalyzeResponse, Error, AnalyzeRequest> {
  return useMutation({
    mutationFn: submitAnalysis,
    // 접수 응답을 잃어도 이미 접수됐을 수 있다. 자동으로 다시 보내지 않는다.
    retry: 0,
  })
}

/**
 * 작업 하나를 폴링한다. 최종 상태 네 가지와 404에서 멈춘다. `progress`가
 * 1이 된 것만으로는 멈추지 않는다.
 */
export function useJob(jobId: string | undefined): UseQueryResult<JobResponse, Error> {
  return useQuery({
    queryKey: jobQueryKey(jobId ?? ''),
    queryFn: ({ signal }) => getJob(jobId ?? '', signal),
    enabled: jobId !== undefined && jobId !== '',
    refetchInterval: (query) => {
      if (isJobGone(query.state.error)) return false
      const data = query.state.data
      if (data !== undefined && isTerminalStatus(data.status)) return false
      return POLL_INTERVAL_MS
    },
    // 화면을 보고 있지 않을 때까지 서버를 부르지 않는다.
    refetchIntervalInBackground: false,
    retry: (failureCount, error) => {
      // 404와 요청 자체가 잘못된 오류는 다시 보내도 같은 답이 온다.
      if (error instanceof ApiError && !error.retryable) return false
      return failureCount < MAX_POLL_RETRY
    },
  })
}

/**
 * 접수 전에 보여줄 영상 정보다. 분석 도중에 바뀌지 않아 한 번 받아두고
 * 다시 부르지 않는다. 결과 화면도 같은 키로 이 값을 그대로 쓴다.
 */
export function useVideoPreview(videoId: string | null): UseQueryResult<VideoPreview, Error> {
  return useQuery({
    queryKey: ['videoPreview', videoId],
    queryFn: ({ signal }) => fetchVideoPreview(videoId ?? '', signal),
    enabled: videoId !== null,
    staleTime: 5 * 60 * 1000,
    retry: 0,
  })
}
