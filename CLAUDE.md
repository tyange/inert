# inert (프론트엔드)

TanStack Start + React + Tailwind v4, bun 사용.
`npm`, `yarn`, `pnpm` 명령어 사용 금지.

## 기술 스택
- TanStack Start (React, Vite 7)
- TanStack Router (파일 기반 라우팅)
- TanStack Query
- Tailwind v4
- @react-oauth/google

## 환경변수 (.env)
- `VITE_API_URL` — 백엔드 API URL (https://api.inert.tyange.com)
- `VITE_GOOGLE_CLIENT_ID` — Google OAuth Client ID

## 라우트 구조
- `/` — 공개 피드 (3열 그리드)
- `/login` — Google 로그인
- `/s/$slug` — still 상세 페이지 (멀티 이미지 캐러셀)
- `/edit` — 편집 레이아웃 (로그인 필요)
- `/edit/` — 내 스틸 목록
- `/edit/new` — 새 스틸 작성

## 주요 결정사항
- Google 로그인: `GoogleLogin` 컴포넌트 사용 (credential = ID token). `useGoogleLogin`은 access_token만 반환해서 불가.
- 인증: JWT를 localStorage에 저장 (`src/lib/auth.ts`)
- API 클라이언트: `src/lib/api.ts` — 모든 API 호출 집중 관리

## 현재 상태
- 완료: 기본 라우트 전체 (피드, 로그인, still 상세, 편집)
- 미완료: 배포 설정 (프론트엔드 호스팅 미결정)
- 미완료: 사용자 공개 페이지 (`/u/$username`)
