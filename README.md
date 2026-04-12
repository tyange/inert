# inert

사진과 글을 공유하는 앱의 프론트엔드.

## 기술 스택

- [TanStack Start](https://tanstack.com/start) (React, Vite 7)
- [TanStack Router](https://tanstack.com/router) (파일 기반 라우팅)
- [TanStack Query](https://tanstack.com/query)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google)
- [lucide-react](https://lucide.dev/)

## 시작하기

```bash
bun install
bun --bun run dev
```

## 빌드

```bash
bun --bun run build
```

## 환경변수

`.env` 파일에 다음 변수를 설정:

```
VITE_API_URL=https://api.inert.tyange.com
VITE_GOOGLE_CLIENT_ID=<Google OAuth Client ID>
```

## 라우트

| 경로 | 설명 | 인증 |
|------|------|------|
| `/` | 공개 피드 | - |
| `/login` | Google 로그인 | - |
| `/s/$slug` | still 상세 (멀티 이미지 캐러셀) | - |
| `/u/$username` | 사용자 프로필 + 스틸 목록 | - |
| `/edit` | 내 스틸 목록 | 필요 |
| `/edit/new` | 새 스틸 작성 | 필요 |
| `/edit/profile` | 프로필 수정 | 필요 |

## 연결 프로젝트

- 백엔드: [inert-api](https://github.com/tyange/inert-api) (Rust + Poem)
