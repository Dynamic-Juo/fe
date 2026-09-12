import { QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { RouterProvider } from 'react-router-dom'

import { createQueryClient } from './app/queryClient'
import { router } from './app/routes'

export function App() {
  // 컴포넌트 밖에서 만들면 개발 중 갱신에 인스턴스가 섞인다.
  const [queryClient] = useState(createQueryClient)

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
