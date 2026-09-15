# 공개 접수 연결

일반 사용자에게 공개하면서 인증 구조가 바뀌었다. 이 문서는 브라우저에서 분석 서버까지 요청이 어떤 관문을 지나는지와, 프런트가 무엇을 하고 무엇을 하지 않는지를 적는다. 서버 계약의 기준은 `be/docs/public-access.md`와 `be/docs/frontend-resume.md`다.

## 왜 중계하는가

브라우저가 분석 서버를 직접 부르지 않는다. 화면과 같은 출처의 `/api`를 부르고, 그 앞의 Vercel Function이 서버에만 둔 인증 정보를 붙여 전달한다.

```
브라우저 ──(같은 출처 /api)──→ Vercel Function ──(Service Token)──→ 분석 서버
```

직접 부르려면 인증 정보가 브라우저에 있어야 한다. `VITE_` 접두사가 붙은 값은 빌드할 때 번들에 문자열로 박히므로, 배포본을 받은 사람이면 누구나 읽을 수 있다. 그래서 인증을 서버 쪽으로 옮겼다.

같은 출처라서 CORS도 자격 증명도 쓰지 않는다. 브라우저는 분석 서버 주소를 알지 못한다.

## 요청이 지나는 관문

접수 한 번이 관문 다섯을 지난다. 관문마다 확인하는 것이 다르고 막혔을 때 돌려주는 것도 다르다.

```
브라우저
  │  ① 봇 확인 토큰을 받는다
  ▼
Vercel Function
  │  ② 요청 모양과 출처를 보고 서버에만 둔 자격 증명을 붙인다
  ▼
Cloudflare 엣지
  │  ③ 봇·WAF 규칙
  ▼
Cloudflare Access
  │  ④ Service Token이 정책에 있는가
  ▼
Cloudflare Tunnel
  ▼
분석 서버
     ⑤ 전달 키, 클라이언트 식별자, 봇 확인 토큰, 요청 한도
```

### ① 브라우저가 봇 확인 토큰을 받는다

`challenges.cloudflare.com`에 사이트 키로 요청한다. 인증이 필요 없다. 사이트 키는 노출되는 것이 정상이고, 검증에 쓰는 시크릿 키는 분석 서버에 있다.

Turnstile 위젯에는 허용 도메인 목록이 있다. 운영 주소가 거기 없으면 토큰이 나오지 않는다.

### ② Vercel Function이 자격 증명을 붙인다

브라우저가 아는 것은 여기까지다. 분석 서버 주소도, 어떤 자격 증명이 붙는지도 모른다.

붙이는 헤더는 넷이다.

| 헤더 | 값 |
| --- | --- |
| `CF-Access-Client-Id` | `CF_ACCESS_CLIENT_ID` 그대로 |
| `CF-Access-Client-Secret` | `CF_ACCESS_CLIENT_SECRET` 그대로 |
| `x-public-gateway-key` | `GATEWAY_SHARED_SECRET` 그대로 |
| `x-public-client-id` | `GATEWAY_SHARED_SECRET`으로 요청자 IP를 HMAC-SHA256 한 64자리 |

마지막 것이 요청 한도를 세는 단위다. 원본 IP를 그대로 넘기지 않으려고 해시로 바꾼다. IP는 Vercel이 덮어쓴 `x-forwarded-for`에서 읽고, IP 하나로 읽히지 않으면 거절한다.

붙이기 전에 보는 것은 이렇다.

| 확인 | 막히면 |
| --- | --- |
| `PUBLIC_GATEWAY_ENABLED`가 `true`인가 | 503 `public_unavailable` |
| 서버 변수 다섯이 다 있고 형식이 맞는가 | 503 `public_unavailable` |
| 알고 있는 경로·메서드인가 | 404 `not_found` |
| `Origin`이 `PUBLIC_FRONTEND_ORIGIN`인가 | 403 `origin_denied` |
| 접수 본문이 `url`·`session_id`·`turnstile_token`뿐인가 | 422 `invalid_request` |

환경변수만 바꾸면 반영되지 않는다. Vercel은 다시 배포해야 새 값을 읽는다.

### ③ Cloudflare 엣지의 봇·WAF 규칙

Access보다 앞에 있다. 자격 증명을 아무리 정확히 붙여도 여기서 막히면 Access까지 가지 못한다.

**Bot Fight Mode는 꺼야 한다.** Vercel 함수는 데이터센터 IP에서 나가고, 이 기능은 그런 요청을 봇으로 보고 403과 HTML 차단 페이지를 돌려준다. 게이트웨이는 JSON이 아닌 응답을 502로 바꾸므로 화면에는 "분석 서버 연결을 확인 중입니다"만 나온다. 자격 증명 문제와 구분되지 않는다.

무료 플랜에서는 영역 전체를 켜고 끄는 것만 된다. 경로나 Service Token만 예외로 빼지 못한다. 이 경로는 Access가 앞을 막고 있어 봇 보호를 꺼도 토큰 없는 요청은 들어오지 못한다.

집에서 `curl`로 부르면 되는데 운영에서만 안 되면 여기를 본다. 사람의 IP와 데이터센터 IP를 다르게 취급하기 때문이다. Cloudflare 대시보드의 Security 이벤트에서 응답의 `cf-ray`로 찾으면 어떤 규칙이 막았는지 나온다.

### ④ Cloudflare Access가 Service Token을 본다

앞에서 붙인 `CF-Access-Client-Id`와 `CF-Access-Client-Secret`이 이 애플리케이션 정책에 있는 Service Token인지 확인한다. 통과하지 못하면 로그인 페이지로 보내거나 거절한다. 둘 다 JSON이 아니라 게이트웨이에서 502가 된다.

관리자용 이메일 정책은 그대로 둔다. Everyone Allow나 Bypass로 애플리케이션 전체를 열지 않는다. 그렇게 열면 게이트웨이를 거치지 않은 요청도 분석 서버에 닿는다.

Service Token은 서버끼리의 인증이고 개별 사용자를 확인하지 않는다. 사용자 구분은 다음 관문의 클라이언트 식별자가 맡는다.

### ⑤ 분석 서버가 전달 키와 봇 확인 토큰을 본다

Tunnel을 지나 맥미니에 닿는다. 여기서는 Access 헤더를 보지 않는다. 그것은 이미 Cloudflare가 확인했다.

접수는 이 순서로 확인한다.

| 순서 | 확인 | 막히면 |
| --- | --- | --- |
| 1 | `x-public-gateway-key`가 서버의 값과 같은가 | 404 `not_found` |
| 2 | `x-public-client-id`가 64자리 16진수인가 | 400 `invalid_gateway_request` |
| 3 | 본문에 서버 기본값 밖의 옵션이 섞였는가 | 422 `public_options_forbidden` |
| 4 | 봇 확인 토큰이 있는가 | 403 `challenge_required` |
| 5 | 봇 확인 시도 한도를 넘었는가 | 429 `public_quota_exceeded` |
| 6 | Siteverify가 통과하고 호스트와 `action`이 맞는가 | 403 `challenge_failed` |
| 7 | 접수 한도를 넘었는가 | 429 `public_quota_exceeded` |

1번이 404인 것은 일부러다. 키가 틀리면 그런 경로가 없는 것처럼 답해 게이트웨이의 존재를 알리지 않는다.

접수에 성공하면 그 작업의 조회 자격을 서명해 `job_access_token`으로 돌려준다.

조회는 순서가 다르다. 전달 키와 식별자를 확인한 뒤 조회 자격을 보고, 마지막에 조회 한도를 센다. 봇 확인은 다시 하지 않는다.

## 설정해야 하는 곳

| 어디 | 무엇 |
| --- | --- |
| Cloudflare Zero Trust → Access → Service Auth | Service Token을 발급한다. Client ID와 Secret이 Vercel로 간다 |
| Cloudflare Zero Trust → Access → Applications | 분석 서버 애플리케이션 정책에 그 Service Token을 허용한다. 이메일 정책은 유지한다 |
| Cloudflare → Security | Bot Fight Mode를 끈다. WAF 커스텀 규칙에 지역·IP 조건이 있으면 데이터센터 IP도 통과하는지 본다 |
| Cloudflare → Turnstile | 위젯의 허용 도메인에 운영 주소를 넣는다. 시크릿 키는 분석 서버에 둔다 |
| Cloudflare → Tunnel | 공개 주소를 맥미니로 잇는다 |
| Vercel → 환경변수 | 아래 [환경변수](#환경변수)의 일곱 가지. 넣고 다시 배포한다 |
| Vercel → `vercel.json` | rewrite 두 줄과 `regions` |
| 분석 서버 | 공개 모드를 켜고 전달 키를 Vercel과 같은 값으로 둔다. Turnstile 호스트를 운영 주소로 고정한다 |

어느 하나가 빠지면 대개 502나 503으로 뭉뚱그려 나온다. 아래 표로 어느 관문인지 좁힌다.

| 증상 | 어느 관문 |
| --- | --- |
| 503 `public_unavailable` | ② 게이트웨이가 꺼졌거나 서버 변수가 빠졌다 |
| 502인데 로그에 `status: 403`과 `text/html` | ③ 봇·WAF 규칙이 막았다 |
| 502인데 로그에 `status: 302`나 로그인 주소 | ④ Service Token이 정책에 없다 |
| 502인데 로그에 `ECONNREFUSED`·`ENOTFOUND` | Tunnel이 끊겼다 |
| 404 JSON이 그대로 돌아온다 | ⑤ 전달 키가 양쪽에서 다르다 |
| 403 `challenge_failed` | ① 사이트 키·시크릿 키 짝이나 허용 도메인이 안 맞는다 |

로그를 보는 곳은 Vercel의 함수 실행 기록이다. 502가 되는 지점에서 상태 코드와 `content-type`, `cf-ray`를 남긴다.

## 이 저장소가 가진 것

`api/gateway.mjs`는 백엔드 저장소에서 가져온 계약 파일이다. 형식을 바꾸지 않고 포맷과 린트 대상에서 뺐다. 갱신할 때 원본과 그대로 대조해야 한다.

한 곳만 원본과 다르다. 분석 서버 응답을 502로 바꾸는 세 지점에서 `console.error`로 서버 로그를 남긴다. 클라이언트 응답은 그대로다. 502는 리다이렉트·비JSON 응답·요청 실패를 한 코드로 묶기 때문에 로그가 없으면 원인을 가릴 수 없다. 로그에는 상태 코드, `content-type`, `location` 앞 120자, `cf-ray`, 예외 이름만 넣는다. 비밀값과 응답 본문은 넣지 않는다.

`vercel.json`의 `regions`를 `icn1`로 둔다. 기본값 `iad1`이면 함수가 미국에서 실행되어 서울 엣지로 들어온 요청이 태평양을 왕복한 뒤 다시 한국의 분석 서버로 간다. 접수뿐 아니라 2.5초마다 도는 상태 조회가 전부 이 경로를 탄다.

`vercel.json`의 rewrite 순서가 중요하다. 게이트웨이 두 줄이 SPA rewrite보다 앞에 있어야 한다. 뒤에 두면 `/(.*)`가 `/api/analyze`까지 삼켜 화면 HTML을 돌려준다. 그러면 JSON이 아닌 응답으로 보여 연결이 안 된 것처럼 나온다.

## 봇 확인

접수에 Turnstile 토큰이 필요하다. 한 번만 쓸 수 있고 5분 뒤 만료된다.

**접수를 누른 순간에 받는다.** 화면을 열 때 미리 받아 두면, 사용자가 유튜브에서 링크를 찾아 붙여넣는 사이 5분이 지나 접수가 거절된다. 위젯은 평소에 보이지 않고 사람 확인이 필요할 때만 Cloudflare가 띄운다.

토큰을 받는 일은 `src/api/turnstile.ts` 한 곳에 있다. 화면은 접수만 부르고 토큰의 존재를 모른다.

스크립트가 차단되면 접수할 수 없다. 광고 차단기나 사내 방화벽에서 그럴 수 있어 원인별로 다른 안내를 준다.

## 조회 자격

접수 응답에 `job_access_token`이 온다. 조회할 때 `Authorization: Bearer`로 보낸다. **토큰이 없으면 작업이 살아 있어도 404다.**

이 토큰은 그 작업의 결과를 읽을 수 있는 자격이다. 주소, 공유 링크, 로그, 분석 도구에 넣지 않는다. 결과 화면 주소는 `/r/:jobId`이고 토큰은 저장소에서만 읽는다. 링크를 받은 사람이 남의 결과를 열 수 있으면 안 된다.

작업 ID로 토큰을 만들 수 없다. 서버가 접수할 때 서명해 주는 값이고, 세션 목록으로 찾아보는 경로는 공개에서 닫혀 있다.

## 재방문 복원

`localStorage`의 `chamsae.analysis.v1`에 마지막 분석 한 건을 남긴다.

```
{ jobId, jobAccessToken, sessionId, savedAt }
```

작업 ID와 조회 토큰은 같이 있어야 쓸모가 있어 한 레코드로 묶는다. 접수 응답을 받은 직후, 결과 화면으로 넘어가기 전에 적는다.

홈에서는 미리 조회하지 않는다. 진행 중인지 끝났는지는 열어 봐야 알지만, 홈을 열 때마다 서버를 부르면 새 분석을 하러 온 사람에게도 그렇게 된다.

조회 자격이 없거나 서버에 결과가 없으면 레코드를 지운다. 지우지 않으면 눌러도 같은 화면으로 돌아오는 버튼이 홈에 남는다.

토큰은 24시간 유효하지만 **결과를 24시간 보관한다는 뜻은 아니다.** 보관 개수 상한에 걸리면 더 일찍 지워진다. 서버 응답이 최종 기준이다.

옛 키 `chamsae.session`은 읽을 때 지운다. 조회 토큰이 없어 복원할 수 없다.

## 환경변수

접두사가 브라우저로 갈지 말지를 정한다. `VITE_`가 붙은 것만 번들에 들어간다.

| 이름 | 읽는 쪽 | 비고 |
| --- | --- | --- |
| `VITE_TURNSTILE_SITE_KEY` | 브라우저 | 공개 키다. 위젯을 그리는 데 쓴다 |
| `PUBLIC_GATEWAY_ENABLED` | Vercel Function | 꺼져 있으면 503 |
| `PUBLIC_FRONTEND_ORIGIN` | Vercel Function | |
| `PRIVATE_API_ORIGIN` | Vercel Function | 분석 서버 주소 |
| `CF_ACCESS_CLIENT_ID` | Vercel Function | 비밀 |
| `CF_ACCESS_CLIENT_SECRET` | Vercel Function | 비밀 |
| `GATEWAY_SHARED_SECRET` | Vercel Function | 비밀. 분석 서버의 값과 같아야 한다 |

서버 쪽 변수에 `VITE_`를 붙이면 안 된다. 붙이는 순간 번들에 박혀 비밀이 새어 나간다.

Turnstile은 사이트 키와 시크릿 키가 한 쌍이다. 사이트 키는 노출되는 것이 정상이고, 검증에 쓰는 시크릿 키는 분석 서버에 있다.

## 오류

| 상태 | 코드 | 뜻 |
| --- | --- | --- |
| 503 | `public_unavailable` | 게이트웨이가 꺼졌거나 서버 설정이 빠졌다 |
| 502 | `upstream_unavailable` | 게이트웨이는 살아 있고 분석 서버에 닿지 못했다 |
| 403 | `origin_denied` | 허용되지 않은 출처다 |
| 429 | | `Retry-After`를 따른다 |
| 404 | | 조회 자격이 없거나 결과가 없다. 둘을 구분할 수 없다 |

JSON이 아닌 응답은 게이트웨이를 거치지 못한 것으로 본다. 게이트웨이는 어떤 경우에도 JSON 봉투를 주기 때문이다.

## 요청 한도

전체 일자당 300회, IP 기준 시간당 60회다. 같은 공인 IP를 쓰는 팀원들은 한도를 나눠 쓴다. 접수가 실패하거나 중복 작업으로 재사용돼도 한도를 소비한다.
