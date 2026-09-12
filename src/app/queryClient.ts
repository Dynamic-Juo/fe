import { QueryClient } from '@tanstack/react-query'

/**
 * 분석 작업 조회는 폴링으로 계속 돌아온다. 실패해도 다음 주기에 다시
 * 시도하므로 재시도 횟수를 늘리지 않는다.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 0,
        refetchOnWindowFocus: true,
      },
      mutations: {
        retry: 0,
      },
    },
  })
}
