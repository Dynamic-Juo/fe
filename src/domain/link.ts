/**
 * 외부에서 받은 주소를 링크로 쓸 수 있는지 본다. 서버가 주는 값이라도
 * 그대로 `href`에 넣지 않는다. `javascript:`나 `data:`가 들어오면 클릭이
 * 코드 실행이 된다.
 */
export function isHttpUrl(value: string | null | undefined): value is string {
  if (value === null || value === undefined) return false
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}
