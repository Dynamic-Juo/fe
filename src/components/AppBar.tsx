import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { A11Y, HOME } from '../copy/strings'
import { BackIcon } from './icons'
import { Logo } from './Logo'
import * as styles from './AppBar.css'

/**
 * 화면 맨 위의 띠다.
 *
 * 홈에서는 제품 표식과 이름을 둔다. 다른 화면에서는 돌아가는 길을 둔다.
 * 분석 화면은 주소를 직접 연 경우가 많아 브라우저 뒤로 가기가 홈으로
 * 이어지지 않는다. 나갈 길이 화면 안에 있어야 한다.
 *
 * 오른쪽은 화면마다 다르다. 홈은 설치 진입점, 결과는 진행 상태다.
 */
export function AppBar({
  back = false,
  title,
  children,
}: {
  back?: boolean
  title?: string
  children?: ReactNode
}) {
  return (
    <header className={styles.bar}>
      {back ? (
        <Link className={styles.back} to="/" aria-label={A11Y.goHome}>
          <BackIcon size={20} />
        </Link>
      ) : null}
      {back ? (
        <span className={styles.title}>{title}</span>
      ) : (
        <Link className={styles.brand} to="/">
          <Logo />
          {HOME.title}
        </Link>
      )}
      {children === undefined ? null : <div className={styles.actions}>{children}</div>}
    </header>
  )
}
