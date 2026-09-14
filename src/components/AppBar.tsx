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
 *
 * 돌아가는 길이 있는 화면에서는 표식을 가운데에 둔다. 양옆을 같은 비율로
 * 잡아 내용 길이와 상관없이 가운데가 흔들리지 않게 한다. 결과 화면을 공유하거나
 * 갈무리했을 때 어느 서비스인지 남아야 한다.
 *
 * 작업 상태는 여기에 적지 않는다. 진행 중에는 본문 제목이, 끝난 뒤에는 요약
 * 카드의 칩이 같은 말을 하고 있다. 띠는 스크롤하면 사라져서 남겨 둘 값도 없다.
 */
export function AppBar({
  back = false,
  children,
}: {
  back?: boolean
  children?: ReactNode
}) {
  return (
    <header className={styles.bar}>
      {back ? (
        <>
          <div className={styles.side}>
            <Link className={styles.back} to="/" aria-label={A11Y.goHome}>
              <BackIcon size={20} />
            </Link>
          </div>
          <Link className={styles.centerBrand} to="/">
            <Logo />
            {HOME.title}
          </Link>
          <div className={`${styles.side} ${styles.sideEnd}`}>{children}</div>
        </>
      ) : (
        <>
          <Link className={styles.brand} to="/">
            <Logo />
            {HOME.title}
            <span className={styles.brandTagline}>{HOME.headerTagline}</span>
          </Link>
          {children === undefined ? null : <div className={styles.actions}>{children}</div>}
        </>
      )}
    </header>
  )
}
