/**
 * 화면에 시간을 적는 방법이다. 서버가 주는 초를 그대로 두면 읽을 수 없고,
 * 없는 값을 0으로 채우면 모르는 것을 아는 것처럼 보인다.
 */

/** `12` → `00:12`. 한 시간이 넘는 영상은 다루지 않는다. */
export function clock(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds))
  const mm = String(Math.floor(total / 60)).padStart(2, '0')
  const ss = String(total % 60).padStart(2, '0')
  return `${mm}:${ss}`
}

export interface SpokenAt {
  start?: number | null | undefined
  end?: number | null | undefined
  /** `exact`도 전사 구간과의 정합성이며 음성 인식 시각의 정확도 보증이 아니다. */
  precision?: 'exact' | 'approx' | null | undefined
}

/**
 * 발언 위치는 세 가지로만 적는다. `00:12 ~ 00:19`, `약 00:28`, 그리고
 * 위치를 모를 때다. 모르는 위치를 만들어 내지 않는다.
 */
export function spokenAt(at: SpokenAt): string | null {
  if (at.start === null || at.start === undefined) return null
  if (at.precision === 'approx' || at.end === null || at.end === undefined) {
    return `약 ${clock(at.start)}`
  }
  return `${clock(at.start)} ~ ${clock(at.end)}`
}

/** 서버가 주는 epoch 초를 사람이 읽는 시각으로 옮긴다. */
export function timestamp(epochSeconds: number): string {
  const date = new Date(epochSeconds * 1000)
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/**
 * 같은 주장이 영상에서 여러 번 나온 위치다. 계약이 항목마다 같은 키가
 * 있다고 가정하지 말라고 밝히고 있어, 시각을 읽을 수 있는 것만 고른다.
 * 없는 위치를 만들어 내지 않는다.
 */
export function mentionPositions(
  mentions: Record<string, unknown>[] | null | undefined,
): SpokenAt[] {
  return (mentions ?? []).flatMap((mention) => {
    const start = mention['start']
    if (typeof start !== 'number') return []
    const end = mention['end']
    const precision = mention['time_precision']
    return [
      {
        start,
        end: typeof end === 'number' ? end : null,
        precision: precision === 'exact' || precision === 'approx' ? precision : null,
      },
    ]
  })
}
