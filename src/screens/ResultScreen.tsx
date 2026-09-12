import { useParams } from 'react-router-dom'

export function ResultScreen() {
  const { jobId } = useParams<{ jobId: string }>()
  return <p>분석 {jobId}</p>
}
