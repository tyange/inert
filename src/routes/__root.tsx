import { HeadContent, Link, Scripts, createRootRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getAuthFn } from "#/lib/server-fns";
import appCss from "../styles.css?url";

const queryClient = new QueryClient();

const getTheme = createServerFn().handler(async () => {
  const theme = getCookie("theme");
  if (theme === "light" || theme === "dark") return theme;
  return null;
});

export const Route = createRootRoute({
  beforeLoad: async () => {
    const [theme, auth] = await Promise.all([getTheme(), getAuthFn()]);
    return { theme, isLoggedIn: auth.isLoggedIn };
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "inert" },
      { name: "description", content: "무해한 사진과 글" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
});

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-5xl font-light tracking-widest text-(--sea-ink)">404</h1>
        <p className="text-(--sea-ink-soft) text-sm">페이지를 찾을 수 없습니다</p>
        <Link
          to="/"
          className="text-sm text-(--sea-ink-soft) hover:text-(--sea-ink) no-underline mt-2"
        >
          ← 돌아가기
        </Link>
      </div>
    </div>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const { theme } = Route.useRouteContext();
  const resolved = theme ?? "light";

  return (
    <html
      lang="ko"
      className={resolved}
      data-theme={theme ?? undefined}
      style={{ colorScheme: resolved }}
    >
      <head>
        <HeadContent />
      </head>
      <body className="bg-(--bg-base) text-(--sea-ink) min-h-screen">
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}
