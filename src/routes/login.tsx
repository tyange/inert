import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
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

function LoginPage() {
  const navigate = useNavigate();
  const buttonRef = useRef<HTMLDivElement>(null);

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
            await loginWithGoogleFn({ data: { credential: response.credential } });
            navigate({ to: "/edit" });
          } catch (e) {
            console.error("로그인 실패:", e);
          }
        },
      });
      if (buttonRef.current) {
        google.accounts.id.renderButton(buttonRef.current, {
          type: "standard",
          theme: "filled_black",
          shape: "pill",
          text: "continue_with",
          size: "large",
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-3xl font-light tracking-widest text-(--sea-ink)">inert</h1>
        <p className="text-(--sea-ink-soft) text-sm">무해한 사진과 글</p>
        {buttonRef && <div ref={buttonRef} />}
      </div>
    </div>
  );
}
