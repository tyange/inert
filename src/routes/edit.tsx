import { createFileRoute, Link, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { getAuthFn, logoutFn } from "#/lib/server-fns";

export const Route = createFileRoute("/edit")({
  beforeLoad: async () => {
    const { isLoggedIn } = await getAuthFn();
    if (!isLoggedIn) {
      throw redirect({ to: "/login" });
    }
  },
  component: EditLayout,
});

function EditLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <header>
        <div className="max-w-lg mx-auto flex items-center justify-between px-4 h-12">
          <Link to="/" className="text-base font-bold tracking-tight text-(--sea-ink) no-underline">
            inert
          </Link>
          <nav className="flex items-center gap-4 text-sm">
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
          </nav>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
