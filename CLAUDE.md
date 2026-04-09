# inert (프론트엔드)

TanStack Start + React + Tailwind v4, bun 사용.
`npm`, `yarn`, `pnpm` 명령어 사용 금지.

## 기술 스택
- TanStack Start (React, Vite 7)
- TanStack Router (파일 기반 라우팅)
- TanStack Query
- Tailwind v4
- @react-oauth/google
- lucide-react (아이콘)

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
- 테마: 쿠키 기반 (`theme` 쿠키) + SSR 서버 사이드 읽기 (`createServerFn` + `getCookie`). localStorage 대신 쿠키를 사용하여 FOUC 방지. light/dark/auto 3단계 토글.
- CSS 변수 기반 테마: `--bg-base`, `--sea-ink`, `--sea-ink-soft`, `--surface`, `--surface-strong`, `--line` 등 시맨틱 변수 사용. 하드코딩된 색상(`bg-black`, `text-white`, `text-neutral-*` 등) 대신 CSS 변수로 통일.
- Header 컴포넌트: TanStack Start 기본 템플릿에서 inert 전용으로 단순화. `Header.tsx`로 분리하여 재사용.

## 현재 상태
- 완료: 기본 라우트 전체 (피드, 로그인, still 상세, 편집)
- 완료: 밝은 테마 지원 — 전 페이지 CSS 변수 기반 테마 시스템 적용
- 완료: 쿠키 기반 테마 저장 + SSR 서버 사이드 테마 적용 (FOUC 방지)
- 완료: Header 컴포넌트 단순화 및 ThemeToggle 아이콘화 (lucide-react)
- 완료: 프로필 수정 페이지 (`/edit/profile`) — 사용자명 변경, `PUT /auth/me` API 연동
- 미완료: 배포 설정 (프론트엔드 호스팅 미결정)
- 미완료: 사용자 공개 페이지 (`/u/$username`)
