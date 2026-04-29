# inert

사진과 글을 공유하는 앱의 프론트엔드.

## 기술 스택

- [TanStack Start](https://tanstack.com/start) (React 19, Vite 7)
- [TanStack Router](https://tanstack.com/router) (파일 기반 라우팅, `beforeLoad` 인증 가드)
- [TanStack Query](https://tanstack.com/query) (서버 상태 캐싱)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google) — Google Identity Services(One Tap 커스텀 렌더링)
- [Embla Carousel](https://www.embla-carousel.com/) — 멀티 이미지 스와이프(dot indicator, 반응형)
- [browser-image-compression](https://www.npmjs.com/package/browser-image-compression) — 클라이언트 WebWorker 이미지 압축
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

GitHub Actions 배포 시 위 값들은 Repository Secrets/Variables에서 주입되어 빌드 타임에 `.env`가 생성됩니다.

## 라우트

| 경로 | 설명 | 인증 |
|------|------|------|
| `/` | 공개 피드 | - |
| `/login` | Google 로그인 (One Tap 커스텀 버튼) | - |
| `/s/$slug` | still 상세 (Embla 멀티 이미지 캐러셀, OG 메타) | - |
| `/u/$username` | 사용자 프로필 + 스틸 목록 | - |
| `/edit` | 내 스틸 목록 | 필요 |
| `/edit/new` | 새 스틸 작성 (클라이언트 이미지 압축) | 필요 |
| `/edit/profile` | 프로필 수정 | 필요 |

## 주요 설계

- **httpOnly 세션 쿠키 + 서버 함수 프록시(`authRequestFn`)**: Google `id_token`을 서버 함수로 받아 백엔드에서 JWT를 받은 뒤 httpOnly 쿠키로 저장한다. 클라이언트 JS에 토큰이 노출되지 않아 XSS로 인한 탈취 위험을 차단한다.
- **SSR 테마 (쿠키 기반 light/dark)**: CSS 변수를 쿠키에서 초기 렌더 시점에 주입해 FOUC(플래시) 제거.
- **클라이언트 이미지 압축**: 업로드 전에 `browser-image-compression`(WebWorker)으로 리사이즈·압축 → 서버 부하 감소 + 모바일 업로드 체감 개선.
- **Embla Carousel 멀티 이미지 UI**: dot indicator, 터치 제스처, 반응형 높이 자동 조정.
- **OG 메타 + 공유 링크 미리보기**: `/s/$slug` 상세 페이지에서 서버 사이드 메타 태그를 주입해 카카오톡/트위터/디스코드 등에서 카드 미리보기가 보이도록 처리.

## 배포

- GitHub Actions `push` on `master` → `bun run build` → SCP로 AWS Lightsail 업로드 → nginx 리버스 프록시가 정적 자산을 서빙 + Nitro Node 서버를 프록시.

## 연결 프로젝트

- 백엔드: [inert-api](https://github.com/tyange/inert-api) (Rust + Poem)
