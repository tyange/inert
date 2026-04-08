import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '#/lib/api'

export const Route = createFileRoute('/edit/')({ component: EditIndexPage })

function EditIndexPage() {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['stills', 'mine'],
    queryFn: () => api.stills.mine({ limit: 50 }),
  })

  const deleteMutation = useMutation({
    mutationFn: (stillId: string) => api.stills.delete(stillId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stills', 'mine'] }),
  })

  if (isLoading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 border-2 border-(--line) border-t-(--sea-ink) rounded-full animate-spin" />
    </div>
  )

  const stills = data?.stills ?? []

  return (
    <div className="max-w-[935px] mx-auto px-4 py-6">
      {stills.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-(--sea-ink-soft)">
          <p>아직 스틸이 없어요</p>
          <Link
            to="/edit/new"
            className="text-(--sea-ink) text-sm border border-(--line) px-4 py-2 hover:border-(--sea-ink-soft) transition-colors no-underline"
          >
            첫 스틸 올리기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1">
          {stills.map((still) => (
            <div key={still.still_id} className="aspect-square overflow-hidden bg-(--surface) relative group">
              {still.images[0] ? (
                <img
                  src={still.images[0].image_url}
                  alt={still.caption ?? ''}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-(--sea-ink-soft) text-xs">
                  이미지 없음
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <Link
                  to="/s/$slug"
                  params={{ slug: still.slug }}
                  className="text-white text-xs border border-white/50 px-3 py-1.5 hover:bg-white/10 transition-colors no-underline"
                >
                  보기
                </Link>
                <button
                  onClick={() => {
                    if (confirm('이 스틸을 삭제할까요?')) {
                      deleteMutation.mutate(still.still_id)
                    }
                  }}
                  disabled={deleteMutation.isPending}
                  className="text-red-400 text-xs border border-red-400/50 px-3 py-1.5 hover:bg-red-400/10 transition-colors disabled:opacity-50 cursor-pointer bg-transparent"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
