import { useState } from 'react'

import { useInstallPrompt } from '../../app/useInstallPrompt'
import { Button, IconButton } from '../../components'
import { InstallIcon } from '../../components/icons'
import { HOME } from '../../copy/strings'
import { InstallGuide } from './InstallGuide'
import * as styles from './InstallEntry.css'

/**
 * 상단바의 설치 진입점이다. 좁은 화면에서는 아이콘만, 넓은 화면에서는 글자를
 * 함께 둔다.
 *
 * 설치할 수 없는 환경에서는 자리를 만들지 않는다. 이미 설치했거나 브라우저가
 * 설치를 지원하지 않으면 눌러도 할 일이 없다.
 */
export function InstallEntry() {
  const { kind, install } = useInstallPrompt()
  const [guideOpen, setGuideOpen] = useState(false)

  if (kind === 'none') return null

  const onClick = () => {
    if (kind === 'prompt') {
      install()
      return
    }
    setGuideOpen(true)
  }

  return (
    <>
      <span className={styles.narrow}>
        <IconButton label={HOME.install} onClick={onClick}>
          <InstallIcon size={17} />
        </IconButton>
      </span>
      <span className={styles.wide}>
        <Button variant="outline" size="sm" onClick={onClick}>
          {HOME.install}
        </Button>
      </span>
      {guideOpen ? (
        <InstallGuide
          onClose={() => {
            setGuideOpen(false)
          }}
        />
      ) : null}
    </>
  )
}
