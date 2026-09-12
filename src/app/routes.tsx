import { createBrowserRouter, type RouteObject } from 'react-router-dom'

import { HomeScreen } from '../screens/HomeScreen'
import { NotFoundScreen } from '../screens/NotFoundScreen'
import { ResultScreen } from '../screens/ResultScreen'
import { ComponentsScreen } from '../screens/dev/ComponentsScreen'

/**
 * 공통 컴포넌트 목록은 개발 모드에서만 등록한다. 빌드에서는 조건이 거짓이
 * 되어 경로도 화면도 번들에서 빠진다. 배포본에서는 없는 주소가 된다.
 */
const devRoutes: RouteObject[] = import.meta.env.DEV
  ? [{ path: '/_components', element: <ComponentsScreen /> }]
  : []

export const router = createBrowserRouter([
  { path: '/', element: <HomeScreen /> },
  { path: '/r/:jobId', element: <ResultScreen /> },
  ...devRoutes,
  { path: '*', element: <NotFoundScreen /> },
])
