import { Link } from 'react-router-dom'

export function NotFoundScreen() {
  return (
    <div>
      <p>주소를 찾을 수 없습니다.</p>
      <Link to="/">처음으로</Link>
    </div>
  )
}
