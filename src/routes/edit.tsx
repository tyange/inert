import { createFileRoute, Link, Outlet, useNavigate } from '@tanstack/react-router'
import { auth } from '#/lib/auth'

export const Route = createFileRoute('/edit')({ component: EditLayout })

function EditLayout() {
  const navigate = useNavigate()

  if (!auth.isLoggedIn()) {
    navigate({ to: '/login' })
    return null
  }

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between px-4 py-3 border-b border-(--line)">
        <Link to="/" className="text-(--sea-ink) hover:opacity-70 transition-opacity text-sm no-underline">
          ← inert
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/edit" className="text-(--sea-ink) hover:opacity-70 transition-opacity no-underline">내 스틸</Link>
          <Link to="/edit/new" className="text-(--sea-ink) hover:opacity-70 transition-opacity no-underline">+ 새 스틸</Link>
          <Link to="/edit/profile" className="text-(--sea-ink) hover:opacity-70 transition-opacity no-underline">프로필</Link>
          <button
            onClick={() => {
              auth.clearToken()
              navigate({ to: '/' })
            }}
            className="text-(--sea-ink-soft) hover:text-(--sea-ink) transition-colors cursor-pointer bg-transparent border-none p-0"
          >
            로그아웃
          </button>
        </nav>
      </header>
      <Outlet />
    </div>
  )
}
