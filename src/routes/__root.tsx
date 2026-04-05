import { HeadContent, Scripts, createRootRoute, Outlet } from '@tanstack/react-router'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import appCss from '../styles.css?url'

const queryClient = new QueryClient()
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'inert' },
      { name: 'description', content: '무해한 사진과 글' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <HeadContent />
      </head>
      <body className="bg-black text-white min-h-screen">
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </GoogleOAuthProvider>
        <Scripts />
      </body>
    </html>
  )
}
