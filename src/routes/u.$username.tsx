import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useCallback, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import useEmblaCarousel from "embla-carousel-react";
import { BookOpen } from "lucide-react";
import { api } from "#/lib/api";
import Header from "../components/Header";

export const Route = createFileRoute("/u/$username")({
  component: UserPage,
});

const CAPTION_CHAR_LIMIT = 150;

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

function UserPage() {
  const { username } = Route.useParams();
  const [imageIndices, setImageIndices] = useState<Record<string, number>>({});

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["users", username, "profile"],
    queryFn: () => api.users.profile(username),
  });

  const { data: stillsData, isLoading: stillsLoading } = useQuery({
    queryKey: ["users", username, "stills"],
    queryFn: () => api.stills.userStills(username, { limit: 50 }),
  });

  if (profileLoading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-(--line) border-t-(--sea-ink) rounded-full animate-spin" />
        </div>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Header />
        <div className="max-w-lg mx-auto px-4 py-24 text-center text-(--sea-ink-soft)">
          사용자를 찾을 수 없습니다.
        </div>
      </>
    );
  }

  const stills = stillsData?.stills ?? [];

  return (
    <>
      <Header />

      <div className="max-w-lg mx-auto px-4 py-8">
        {/* 프로필 영역 */}
        <div className="flex items-start gap-4 mb-8">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.username}
              className="w-14 h-14 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-(--surface) shrink-0 flex items-center justify-center text-(--sea-ink-soft) text-lg font-medium">
              {profile.username[0]?.toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-base font-medium text-(--sea-ink) leading-tight">
              {profile.display_name ?? profile.username}
            </h1>
            <p className="text-xs text-(--sea-ink-soft) mt-0.5">@{profile.username}</p>
            {profile.bio && (
              <p className="text-sm text-(--sea-ink) mt-2 leading-relaxed">{profile.bio}</p>
            )}
          </div>
        </div>

        {/* 스틸 영역 */}
        {stillsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-(--line) border-t-(--sea-ink) rounded-full animate-spin" />
          </div>
        ) : stills.length === 0 ? (
          <div className="text-center py-12 text-(--sea-ink-soft) text-sm">
            아직 스틸이 없습니다.
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-(--line) -mx-4">
            {stills.map((still) => (
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
            ))}
          </div>
        )}
      </div>
    </>
  );
}
