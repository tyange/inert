import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, Share2 } from "lucide-react";

import { api, type StillResponse } from "../lib/api.ts";

export const Route = createFileRoute("/s/$slug")({
  component: StillPage,
  validateSearch: (search: Record<string, unknown>) => ({
    img: Number(search.img) || 0,
  }),
  loader: ({ params }) => api.stills.get(params.slug),
  head: ({ loaderData }) => {
    const still = loaderData as StillResponse | undefined;
    if (!still) return {};

    const title = still.display_name
      ? `${still.display_name}의 스틸 — inert`
      : `@${still.username}의 스틸 — inert`;
    const description = still.caption ? still.caption.slice(0, 200) : "inert에서 공유된 스틸";
    const image = still.images[0]?.image_url;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        ...(image ? [{ property: "og:image", content: image }] : []),
        { name: "twitter:card", content: image ? "summary_large_image" : "summary" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        ...(image ? [{ name: "twitter:image", content: image }] : []),
      ],
    };
  },
});

function StillPage() {
  const { slug } = Route.useParams();
  const { img } = Route.useSearch();
  const loaderData = Route.useLoaderData();

  const {
    data: still,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["still", slug],
    queryFn: () => api.stills.get(slug),
    initialData: loaderData,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-(--sea-ink-soft)">
        불러오는 중...
      </div>
    );
  }

  if (error || !still) {
    return (
      <div className="min-h-screen flex items-center justify-center text-(--sea-ink-soft)">
        찾을 수 없습니다
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-lg mx-auto relative">
        <div className="sticky top-0 z-30 flex items-center gap-2 px-4 py-3 lg:h-0 lg:p-0">
          <Link
            to="/"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-(--surface) backdrop-blur-sm text-(--sea-ink) hover:bg-(--surface-strong) border border-(--line) no-underline lg:absolute lg:top-4 lg:-left-12"
          >
            <ArrowLeft size={18} />
          </Link>
          <ShareButton
            title={
              still.display_name ? `${still.display_name}의 스틸` : `@${still.username}의 스틸`
            }
          />
        </div>

        <div className="relative">
          <DetailImageSlider
            images={still.images.map((img) => ({ url: img.image_url }))}
            initialIndex={img}
          />
        </div>

        <div className="px-6 sm:px-12 py-8 sm:py-12">
          <div className="prose prose-lg max-w-none text-(--sea-ink) font-serif">
            {(still.caption ?? "").split("\n\n").map((paragraph, i) => (
              <p key={i} className="text-base sm:text-lg leading-8 sm:leading-9 mb-6 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailImageSlider({
  images,
  initialIndex,
}: {
  images: { url: string }[];
  initialIndex: number;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    startIndex: initialIndex,
  });
  const [activeIndex, setActiveIndex] = useState(initialIndex);

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
                src={img.url}
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

function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      await navigator.share({ title, url });
      return;
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="flex items-center justify-center w-9 h-9 rounded-full bg-(--surface) backdrop-blur-sm text-(--sea-ink) hover:bg-(--surface-strong) border border-(--line) cursor-pointer lg:absolute lg:top-16 lg:-left-12"
    >
      {copied ? <span className="text-xs">✓</span> : <Share2 size={16} />}
    </button>
  );
}
