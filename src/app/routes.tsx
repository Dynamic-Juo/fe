import { createBrowserRouter } from 'react-router-dom'

import { HomeScreen } from '../screens/HomeScreen'
import { NotFoundScreen } from '../screens/NotFoundScreen'
import { ResultScreen } from '../screens/ResultScreen'

export const router = createBrowserRouter([
  { path: '/', element: <HomeScreen /> },
  { path: '/r/:jobId', element: <ResultScreen /> },
  { path: '*', element: <NotFoundScreen /> },
])
