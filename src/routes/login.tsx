import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getAuthFn, loginWithGoogleFn } from "#/lib/server-fns";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    const { isLoggedIn } = await getAuthFn();
    if (isLoggedIn) {
      throw redirect({ to: "/" });
    }
  },
  component: LoginPage,
});

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.0 24.0 0 0 0 0 21.56l7.98-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response: google.accounts.id.CredentialResponse) => {
          try {
            if (!response.credential) throw new Error("credential 없음");
            await loginWithGoogleFn({
              data: { credential: response.credential },
            });
            navigate({ to: "/edit" });
          } catch (e) {
            console.error("로그인 실패:", e);
          }
        },
      });
      setReady(true);
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [navigate]);

  const handleClick = () => {
    if (ready) {
      google.accounts.id.prompt();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-3xl font-light tracking-widest text-(--sea-ink)">inert</h1>
        <p className="text-(--sea-ink-soft) text-sm">무해한 사진과 글</p>
        <button
          onClick={handleClick}
          disabled={!ready}
          className="flex items-center gap-3 rounded-full border border-(--line) bg-(--surface-strong) px-6 py-3 text-sm font-medium text-(--sea-ink) hover:bg-(--surface) disabled:opacity-40 cursor-pointer"
        >
          <GoogleIcon />
          Google로 계속하기
        </button>
      </div>
    </div>
  );
}
