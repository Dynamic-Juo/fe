import { RESULT } from '../../copy/strings'
import * as styles from './DoneHeadline.css'

/**
 * 분석이 끝났음을 알리는 머리말이다. 진행 머리말이 있던 자리에 들어간다.
 *
 * 몇 건을 어떻게 판정했는지는 적지 않는다. 바로 아래 목록과 요약이 같은 말을
 * 하고 있고, 여기서 숫자를 다시 세면 두 곳이 어긋날 자리가 생긴다.
 *
 * 깨끗하게 끝난 경우에만 쓴다. 부분 완료, 시간 초과, 실패는 무엇이 덜 됐는지
 * 알려야 해서 `JobOutcome`이 대신 들어간다.
 */
export function DoneHeadline() {
  return <h1 className={styles.title}>{RESULT.done}</h1>
}
