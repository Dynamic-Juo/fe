# Conan AI 프런트엔드

YouTube Shorts의 미디어 조작 가능성과 영상 속 주장의 사실성을 확인하는 서비스의 화면이다. 두 결과를 하나의 진위 판정으로 합치지 않고 따로 보여준다.

기획과 설계 기준은 [Dynamic-Juo/docs](https://github.com/Dynamic-Juo/docs), 분석 API는 [Dynamic-Juo/be](https://github.com/Dynamic-Juo/be)에 있다.

## 시작하기

```bash
corepack enable
pnpm install
pnpm dev
```

`pnpm dev`는 mock으로 동작한다. 실제 API를 호출하지 않으므로 백엔드 인증이나 CORS 없이 화면을 만들 수 있다.

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

로컬에서 실제 API를 보려면 `.env.local`에 `VITE_USE_MOCK=false`를 넣는다. 백엔드가 Cloudflare Access 인증과 CORS를 열어둔 뒤에 동작한다.

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

`wireframes/`에는 화면 흐름을 정리한 와이어프레임이 있다. `.dc.html` 파일은 브라우저로 바로 열어 볼 수 있다.

## 작업 기준

| 문서 | 내용 |
| --- | --- |
| [코드 기준](docs/conventions/code-style.md) | 프레임워크와 제품에 관계없이 적용하는 기준 |
| [제품 코드 기준](docs/conventions/product-rules.md) | 이 제품에서만 성립하는 규칙 |
| [커밋과 브랜치](docs/conventions/commit-convention.md) | 커밋 제목 형식과 브랜치 이름 |

화면을 바꾸는 작업에서는 제품 코드 기준의 '검토할 때 보는 것'을 함께 확인한다. 처리 상태와 판정을 섞지 않기, 조작이 없다고 단정하는 표현 쓰지 않기, 숫자 점수를 화면에 내보내지 않기가 거기 있다.

## 스택

Vite · React · TypeScript · react-router · vanilla-extract · TanStack Query

색과 아이콘, 안내 문구는 아직 정해지지 않았다. 지금은 모노톤이며 나중에 교체될 값을 토큰으로 모아 두었다.
