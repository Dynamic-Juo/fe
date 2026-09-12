import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { HOME } from '../copy/strings'
import { Logo } from './Logo'
import * as styles from './AppBar.css'

/**
 * 화면 맨 위의 띠다. 어느 화면에서나 같은 자리에 제품 이름이 있어야
 * 분석 중에 다른 곳으로 넘어간 것이 아니라는 게 보인다.
 *
 * 오른쪽은 화면마다 다르다. 홈은 설치 진입점, 결과는 진행 상태다.
 */
export function AppBar({ children }: { children?: ReactNode }) {
  return (
    <header className={styles.bar}>
      <Link className={styles.brand} to="/">
        <Logo />
        {HOME.title}
      </Link>
      {children === undefined ? null : <div className={styles.actions}>{children}</div>}
    </header>
  )
}
