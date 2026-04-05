import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { api } from '#/lib/api'
import { auth } from '#/lib/auth'

export const Route = createFileRoute('/')({ component: FeedPage })

function FeedPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['feed'],
    queryFn: () => api.stills.feed({ limit: 30 }),
  })

  return (
    <div className="max-w-[935px] mx-auto px-4">
      {/* 헤더 */}
      <header className="flex items-center justify-between py-4 border-b border-neutral-800 mb-6">
        <h1 className="text-xl font-semibold tracking-tight">inert</h1>
        <nav className="flex items-center gap-4 text-sm">
          {auth.isLoggedIn() ? (
            <Link to="/edit" className="hover:opacity-70 transition-opacity">편집</Link>
          ) : (
            <Link to="/login" className="hover:opacity-70 transition-opacity">로그인</Link>
          )}
        </nav>
      </header>

      {/* 피드 그리드 */}
      {isLoading ? (
        <div className="grid grid-cols-3 gap-1">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="aspect-square bg-neutral-900 animate-pulse" />
          ))}
        </div>
      ) : data?.stills.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-neutral-500">
          <p className="text-lg">아직 아무것도 없어요</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1">
          {data?.stills.map((still) => (
            <Link key={still.still_id} to="/s/$slug" params={{ slug: still.slug }}>
              <div className="aspect-square overflow-hidden bg-neutral-900 relative group">
                {still.images[0] ? (
                  <img
                    src={still.images[0].image_url}
                    alt={still.caption ?? ''}
                    className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-600 text-xs">
                    이미지 없음
                  </div>
                )}
                {still.images.length > 1 && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M2 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6zm16 0H4v12h14V6zM22 8v12a2 2 0 0 1-2 2H6v-2h14V8h2z"/>
                    </svg>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
