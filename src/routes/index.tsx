import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useCallback, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import useEmblaCarousel from "embla-carousel-react";
import { BookOpen, ArrowUp } from "lucide-react";
import { api } from "#/lib/api";
import Header from "../components/Header";

function ImageSlider({
  images,
  onIndexChange,
}: {
  images: { image_url: string }[];
  onIndexChange?: (index: number) => void;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [activeIndex, setActiveIndex] = useState(0);
  const onIndexChangeRef = useRef(onIndexChange);
  onIndexChangeRef.current = onIndexChange;

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    setActiveIndex(index);
    onIndexChangeRef.current?.(index);
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
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <span
              key={i}
              className={`block w-1.5 h-1.5 rounded-full transition-colors ${
                i === activeIndex ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: FeedPage,
});

const CAPTION_CHAR_LIMIT = 150;

function Caption({ text }: { text: string }) {
  const isLong = text.length > CAPTION_CHAR_LIMIT;
  const [expanded, setExpanded] = useState(false);

  if (!isLong || expanded) {
    return (
      <p className="font-serif text-sm leading-relaxed text-(--sea-ink) whitespace-pre-line">
        {text}
      </p>
    );
  }

  return (
    <p className="font-serif text-sm leading-relaxed text-(--sea-ink)">
      {text.slice(0, CAPTION_CHAR_LIMIT).trimEnd()}...{" "}
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="text-(--sea-ink-soft) font-medium cursor-pointer bg-transparent border-none p-0 text-sm"
      >
        더 보기
      </button>
    </p>
  );
}

function FeedPage() {
  const [imageIndices, setImageIndices] = useState<Record<string, number>>({});
  const [showTopBtn, setShowTopBtn] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["feed"],
    queryFn: () => api.stills.feed({ limit: 50 }),
  });

  useEffect(() => {
    const onScroll = () => setShowTopBtn(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const stills = data?.stills ?? [];

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-(--line) border-t-(--sea-ink) rounded-full animate-spin" />
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="max-w-lg mx-auto flex flex-col divide-y divide-(--line)">
        {stills.length === 0 ? (
          <div className="text-center py-24 text-(--sea-ink-soft) text-sm">
            아직 스틸이 없습니다.
          </div>
        ) : (
          stills.map((still) => (
            <article key={still.still_id} className="pb-4">
              {still.images.length > 0 ? (
                <ImageSlider
                  images={still.images}
                  onIndexChange={(idx) =>
                    setImageIndices((prev) => ({ ...prev, [still.slug]: idx }))
                  }
                />
              ) : (
                <div className="w-full aspect-4/3 flex items-center justify-center bg-(--surface) text-(--sea-ink-soft) text-xs">
                  이미지 없음
                </div>
              )}

              <div className="px-4 pt-3">
                <Link
                  to="/u/$username"
                  params={{ username: still.username }}
                  className="text-xs font-medium text-(--sea-ink) no-underline hover:underline"
                >
                  {still.username}
                </Link>
                {still.caption && <Caption text={still.caption} />}
                <Link
                  to="/s/$slug"
                  params={{ slug: still.slug }}
                  search={{ img: imageIndices[still.slug] ?? 0 }}
                  className="inline-flex items-center gap-1 mt-2 text-xs text-(--sea-ink-soft) hover:text-(--sea-ink) no-underline"
                >
                  <BookOpen size={13} />
                  읽기
                </Link>
              </div>
            </article>
          ))
        )}
      </div>

      {showTopBtn && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-30 flex items-center justify-center w-10 h-10 rounded-full bg-(--surface) backdrop-blur-sm text-(--sea-ink) hover:bg-(--surface-strong) cursor-pointer border border-(--line)"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </>
  );
}
