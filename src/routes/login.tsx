import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { GoogleLogin } from '@react-oauth/google'
import { api } from '#/lib/api'
import { auth } from '#/lib/auth'

export const Route = createFileRoute('/login')({ component: LoginPage })

function LoginPage() {
  const navigate = useNavigate()

  if (auth.isLoggedIn()) {
    navigate({ to: '/' })
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-3xl font-light tracking-widest text-white">inert</h1>
        <p className="text-neutral-500 text-sm">무해한 사진과 글</p>
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            try {
              if (!credentialResponse.credential) throw new Error('credential 없음')
              const data = await api.auth.loginGoogle(credentialResponse.credential)
              auth.setToken(data.access_token)
              navigate({ to: '/edit' })
            } catch (e) {
              console.error('로그인 실패:', e)
            }
          }}
          onError={() => console.error('Google 로그인 오류')}
          theme="filled_black"
          shape="pill"
          text="continue_with"
          locale="ko"
        />
      </div>
    </div>
  )
}
