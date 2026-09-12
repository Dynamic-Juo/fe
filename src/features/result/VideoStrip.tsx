import { Skeleton } from '../../components'
import * as styles from './VideoStrip.css'

/**
 * 영상 정보다. 썸네일, 제목, 채널명 셋만 표시한다. 길이와 게시일은 Data API
 * 키가 있어야 해서 넣지 않는다. U-07에서 정했다.
 *
 * 값이 오기 전에는 자리만 잡아 둔다. 빈 칸을 두면 원래 비어 있는 것인지 아직
 * 안 온 것인지 구분되지 않는다.
 *
 * 좁은 화면에서는 상단바 아래 띠로 붙고, 넓은 화면에서는 사이드바 맨 위
 * 카드가 된다. 준비 중·진행 중·완료에서 자리가 바뀌지 않는다.
 */
export function VideoStrip({
  title,
  author,
  thumbnailUrl,
}: {
  title: string | null
  author: string | null
  thumbnailUrl: string | null
}) {
  return (
    <div className={styles.box}>
      {thumbnailUrl === null ? (
        <div className={styles.thumbnail}>
          <Skeleton width="100%" height="100%" />
        </div>
      ) : (
        <img className={styles.thumbnail} src={thumbnailUrl} alt="" />
      )}
      <div className={styles.body}>
        {title === null ? <Skeleton width="88%" /> : <p className={styles.title}>{title}</p>}
        {author === null ? (
          <Skeleton width="50%" height="9px" />
        ) : (
          <p className={styles.author}>{author}</p>
        )}
      </div>
    </div>
  )
}
