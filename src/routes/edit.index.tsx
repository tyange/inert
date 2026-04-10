import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useCallback, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useEmblaCarousel from "embla-carousel-react";
import { BookOpen, Trash2 } from "lucide-react";
import { api } from "#/lib/api";

export const Route = createFileRoute("/edit/")({ component: EditIndexPage });

function ImageSlider({ images }: { images: { image_url: string }[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [activeIndex, setActiveIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y touch-pinch-zoom">
          {images.map((img, i) => (
            <div key={i} className="min-w-0 grow-0 shrink-0 basis-full">
              <img
                src={img.image_url}
                alt=""
                className="w-full aspect-4/3 object-cover"
                loading="lazy"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 rounded-full bg-black/20 px-2 py-1.5">
          {images.map((_, i) => (
            <span
              key={i}
              className={`block w-1.5 h-1.5 rounded-full transition-colors ${
                i === activeIndex ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EditIndexPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["stills", "mine"],
    queryFn: () => api.stills.mine({ limit: 50 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (stillId: string) => api.stills.delete(stillId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["stills", "mine"] }),
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-(--line) border-t-(--sea-ink) rounded-full animate-spin" />
      </div>
    );

  const stills = data?.stills ?? [];

  return (
    <div className="max-w-lg mx-auto flex flex-col divide-y divide-(--line)">
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
        stills.map((still) => (
          <article key={still.still_id} className="pb-4">
            {still.images.length > 0 ? (
              <ImageSlider images={still.images} />
            ) : (
              <div className="w-full aspect-4/3 flex items-center justify-center bg-(--surface) text-(--sea-ink-soft) text-xs">
                이미지 없음
              </div>
            )}
            <div className="px-4 pt-3">
              {still.caption && (
                <p className="font-serif text-sm leading-relaxed text-(--sea-ink) whitespace-pre-line">
                  {still.caption}
                </p>
              )}
              <div className="flex items-center gap-3 mt-2">
                <Link
                  to="/s/$slug"
                  params={{ slug: still.slug }}
                  search={{ img: 0 }}
                  className="inline-flex items-center gap-1 text-xs text-(--sea-ink-soft) hover:text-(--sea-ink) no-underline"
                >
                  <BookOpen size={13} />
                  보기
                </Link>
                <button
                  onClick={() => {
                    if (confirm("이 스틸을 삭제할까요?")) {
                      deleteMutation.mutate(still.still_id);
                    }
                  }}
                  disabled={deleteMutation.isPending}
                  className="inline-flex items-center gap-1 text-xs text-(--sea-ink-soft) hover:text-red-500 transition-colors disabled:opacity-50 cursor-pointer bg-transparent border-none p-0"
                >
                  <Trash2 size={13} />
                  삭제
                </button>
              </div>
            </div>
          </article>
        ))
      )}
    </div>
  );
}
