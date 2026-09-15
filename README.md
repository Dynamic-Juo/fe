# 참새 AI 프런트엔드

길이 3분 이하 공개 YouTube 영상의 미디어 조작 가능성과 영상 속 주장의 사실성을 확인하는 서비스의 화면이다. 두 결과를 하나의 진위 판정으로 합치지 않고 따로 보여준다.

기획과 설계 기준은 [Dynamic-Juo/docs](https://github.com/Dynamic-Juo/docs), 분석 API는 [Dynamic-Juo/be](https://github.com/Dynamic-Juo/be)에 있다.

## 시작하기

```bash
corepack enable
pnpm install
pnpm dev
```

`pnpm dev`는 mock으로 동작한다. 서버를 부르지 않으므로 백엔드 없이 화면을 만들 수 있다.

| 명령 | 하는 일 |
| --- | --- |
| `pnpm dev` | 개발 서버 |
| `pnpm build` | 타입 검사와 프로덕션 빌드 |
| `pnpm preview` | 빌드 결과 확인 |
| `pnpm lint` | oxlint |
| `pnpm format` | Prettier |

## mock

`VITE_USE_MOCK`으로 켜고 끈다. 값이 `true`면 실제 API 대신 mock 클라이언트가 응답한다.

| 환경 | 값 | 결과 |
| --- | --- | --- |
| 로컬 `pnpm dev` | `.env.development`의 `true` | mock |
| Vercel Preview | Vercel 환경변수 Preview 범위의 `true` | mock |
| Vercel Production | Production 범위의 `false` | 실제 API |

Vercel은 Preview도 `vite build`를 그대로 돌려 `import.meta.env.MODE`가 Production과 같다. 그래서 모드가 아니라 환경변수로 가른다. Vite가 빌드할 때 `VITE_` 변수를 문자열로 치환하므로 Production에서는 mock 분기가 죽은 코드가 되어 번들에서 빠진다.

`vite.config.ts`가 Vercel의 `VERCEL_ENV`를 넘겨 두 번째 잠금으로 쓴다. 환경변수를 잘못 넣어도 Production에는 mock이 켜지지 않는다.

**로컬에서는 실제 API를 볼 수 없다.** 분석 요청은 같은 출처의 `/api`로 나가고 그 앞에 Vercel Function이 있어야 하는데, `pnpm dev`는 Vite 개발 서버라 그 함수를 돌리지 않는다. `VITE_USE_MOCK=false`로 바꾸면 요청이 화면 HTML을 받아 오류가 난다.

실제 API는 배포에서 확인한다. 연결 구조는 [공개 접수 연결](docs/reference/public-gateway.md)에 있다.

## 구조

```
src/
├── api/          API 클라이언트와 mock
├── domain/       도메인 타입과 순수 로직
├── styles/       디자인 토큰과 전역 스타일
├── copy/         화면 문구
├── components/   공통 컴포넌트
├── features/     주장 카드, 미디어 결과 같은 화면 조각
├── screens/      라우트가 가리키는 화면
└── app/          라우터와 QueryClient
```

`api/`는 저장소 최상위에 따로 있다. Vercel이 서버에서 실행하는 함수이고 화면 번들에 들어가지 않는다.

`wireframes/`에는 화면 흐름을 정리한 와이어프레임이 있다. `.dc.html` 파일은 브라우저로 바로 열어 볼 수 있다.

### 확인용 경로

개발 모드에서만 열린다. 빌드에서는 경로와 화면이 번들에서 빠진다.

| 경로 | 내용 |
| --- | --- |
| `/_components` | 공통 컴포넌트 목록. 토큰 값을 바꿨을 때 결과를 한 화면에서 본다 |
| `/_mock` | mock 시나리오 재생. 접수와 폴링, 스냅샷을 그대로 확인한다 |

## 참고 사양

| 문서 | 내용 |
| --- | --- |
| [지원하는 입력](docs/reference/supported-input.md) | 어떤 영상을 받는지, 각 조건을 어디서 언제 확인하는지 |
| [서비스 워커](docs/reference/service-worker.md) | 무엇을 캐시하고 무엇을 캐시하지 않는지, 확인하는 곳 |
| [공개 접수 연결](docs/reference/public-gateway.md) | 중계를 두는 이유, 봇 확인과 조회 자격, 환경변수와 오류 |

## 작업 기준

| 문서 | 내용 |
| --- | --- |
| [코드 기준](docs/conventions/code-style.md) | 프레임워크와 제품에 관계없이 적용하는 기준 |
| [제품 코드 기준](docs/conventions/product-rules.md) | 이 제품에서만 성립하는 규칙 |
| [커밋과 브랜치](docs/conventions/git.md) | 커밋 제목 형식과 브랜치 이름 |

화면을 바꾸는 작업에서는 제품 코드 기준의 '검토할 때 보는 것'을 함께 확인한다. 처리 상태와 판정을 섞지 않기, 조작이 없다고 단정하는 표현 쓰지 않기, 숫자 점수를 화면에 내보내지 않기, 조회 자격을 주소에 두지 않기가 거기 있다.

## 스택

Vite · React · TypeScript · react-router · vanilla-extract · TanStack Query

판정과 미디어 조작 단계의 색은 아직 정해지지 않았다. 지금은 문구와 테두리 두께로 구분하며, 교체될 값을 토큰으로 모아 두었다.
