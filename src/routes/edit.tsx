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
    <div className="min-h-screen bg-black">
      <header className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
        <Link to="/" className="text-white hover:opacity-70 transition-opacity text-sm">
          ← inert
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/edit" className="hover:opacity-70 transition-opacity">내 스틸</Link>
          <Link to="/edit/new" className="hover:opacity-70 transition-opacity">+ 새 스틸</Link>
          <button
            onClick={() => {
              auth.clearToken()
              navigate({ to: '/' })
            }}
            className="text-neutral-500 hover:text-white transition-colors"
          >
            로그아웃
          </button>
        </nav>
      </header>
      <Outlet />
    </div>
  )
}
