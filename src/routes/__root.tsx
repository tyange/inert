import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import appCss from "../styles.css?url";

const queryClient = new QueryClient();

const getTheme = createServerFn().handler(async () => {
  const theme = getCookie("theme");
  if (theme === "light" || theme === "dark") return theme;
  return null;
});

export const Route = createRootRoute({
  beforeLoad: async () => {
    const theme = await getTheme();
    return { theme };
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
});

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
