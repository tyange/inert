import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { api } from '#/lib/api'
import { useState } from 'react'

export const Route = createFileRoute('/s/$slug')({ component: StillPage })

function StillPage() {
  const { slug } = Route.useParams()
  const { data: still, isLoading } = useQuery({
    queryKey: ['still', slug],
    queryFn: () => api.stills.get(slug),
  })
  const [imageIndex, setImageIndex] = useState(0)

  if (isLoading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-neutral-700 border-t-white rounded-full animate-spin" />
    </div>
  )

  if (!still) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-neutral-500">
      찾을 수 없습니다
    </div>
  )

  return (
    <div className="min-h-screen bg-black">
      <header className="flex items-center px-4 py-3 border-b border-neutral-800">
        <Link to="/" className="text-white hover:opacity-70 transition-opacity mr-4">
          ←
        </Link>
        <span className="text-sm font-medium">{still.username}</span>
      </header>

      <div className="max-w-[600px] mx-auto">
        {/* 이미지 */}
        <div className="relative bg-neutral-900">
          {still.images[imageIndex] ? (
            <img
              src={still.images[imageIndex].image_url}
              alt={still.caption ?? ''}
              className="w-full object-contain max-h-[600px]"
            />
          ) : (
            <div className="aspect-square flex items-center justify-center text-neutral-600">
              이미지 없음
            </div>
          )}

          {/* 여러 이미지일 때 인디케이터 */}
          {still.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {still.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setImageIndex(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i === imageIndex ? 'bg-white' : 'bg-neutral-500'
                  }`}
                />
              ))}
            </div>
          )}

          {/* 이전/다음 버튼 */}
          {still.images.length > 1 && (
            <>
              {imageIndex > 0 && (
                <button
                  onClick={() => setImageIndex(i => i - 1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  ‹
                </button>
              )}
              {imageIndex < still.images.length - 1 && (
                <button
                  onClick={() => setImageIndex(i => i + 1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  ›
                </button>
              )}
            </>
          )}
        </div>

        {/* 캡션 + 메타 */}
        <div className="px-4 py-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-semibold">{still.display_name ?? still.username}</span>
            {still.caption && (
              <span className="text-sm text-neutral-300">{still.caption}</span>
            )}
          </div>
          <time className="text-xs text-neutral-500">
            {new Date(still.published_at).toLocaleDateString('ko-KR', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          </time>
        </div>
      </div>
    </div>
  )
}
