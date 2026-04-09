import { Link, useNavigate, useRouteContext } from "@tanstack/react-router";
import ThemeToggle from "./ThemeToggle";
import { logoutFn } from "#/lib/server-fns";

export default function Header() {
  const { theme, isLoggedIn } = useRouteContext({ from: "__root__" });
  const navigate = useNavigate();

  return (
    <header>
      <div className="max-w-lg mx-auto flex items-center justify-between px-4 h-12">
        <Link to="/" className="text-base font-bold tracking-tight text-(--sea-ink) no-underline">
          inert
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {isLoggedIn ? (
            <>
              <Link
                to="/edit"
                className="text-(--sea-ink) hover:opacity-70 transition-opacity no-underline"
              >
                내 스틸
              </Link>
              <Link
                to="/edit/new"
                className="text-(--sea-ink) hover:opacity-70 transition-opacity no-underline"
              >
                + 새 스틸
              </Link>
              <Link
                to="/edit/profile"
                className="text-(--sea-ink) hover:opacity-70 transition-opacity no-underline"
              >
                프로필
              </Link>
              <button
                onClick={async () => {
                  await logoutFn();
                  navigate({ to: "/" });
                }}
                className="text-(--sea-ink-soft) hover:text-(--sea-ink) transition-colors cursor-pointer bg-transparent border-none p-0"
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-(--sea-ink) hover:opacity-70 transition-opacity no-underline"
            >
              로그인
            </Link>
          )}
          <ThemeToggle serverTheme={theme} />
        </nav>
      </div>
    </header>
  );
}
