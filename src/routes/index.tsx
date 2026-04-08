import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useCallback, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { BookOpen, ArrowUp } from "lucide-react";
import Header from "../components/Header";

const DUMMY_STILLS = [
  {
    slug: "morning-walk-by-the-river",
    caption:
      "아침 산책길에 만난 강변 풍경. 안개가 살짝 걷히면서 수면 위로 빛이 번지기 시작했다. 매일 같은 길을 걷지만 같은 아침은 없다는 걸 다시 한번 느낀다. 오늘따라 유독 공기가 맑아서 멀리 산 능선까지 선명하게 보였다. 이런 날은 카메라를 들지 않을 수 없다.",
    images: [
      { url: "https://picsum.photos/seed/river1/800/600" },
      { url: "https://picsum.photos/seed/river2/800/600" },
      { url: "https://picsum.photos/seed/river3/800/600" },
    ],
  },
  {
    slug: "cafe-on-the-corner",
    caption:
      "골목 끝에 있는 작은 카페. 간판도 없고, 문도 닫혀 있는 것 같았는데 안에서 커피 향이 새어 나왔다. 들어가 보니 주인장이 혼자서 원두를 볶고 있었다. 여기는 예약제라고 했지만, 자리가 비어 있으니 앉아도 된다고 했다.",
    images: [
      { url: "https://picsum.photos/seed/cafe1/800/600" },
      { url: "https://picsum.photos/seed/cafe2/800/600" },
    ],
  },
  {
    slug: "old-bookstore-downtown",
    caption:
      "도심 한가운데 숨어 있는 헌책방. 문을 열면 종이 냄새가 먼저 맞아준다. 주인 할아버지는 항상 같은 자리에 앉아 책을 읽고 계신다. 여기서 시간은 조금 다르게 흐르는 것 같다. 30년 된 잡지를 뒤적이다가 어릴 적 봤던 만화 광고를 발견했다. 기억이라는 건 이상한 곳에 숨어 있다가 불쑥 나타난다.",
    images: [
      { url: "https://picsum.photos/seed/book1/800/600" },
      { url: "https://picsum.photos/seed/book2/800/600" },
      { url: "https://picsum.photos/seed/book3/800/600" },
      { url: "https://picsum.photos/seed/book4/800/600" },
    ],
  },
  {
    slug: "sunset-from-rooftop",
    caption:
      "옥상에서 본 일몰. 건물 사이로 해가 내려앉으면서 하늘이 분홍빛으로 물들었다. 바람이 제법 세서 머리카락이 자꾸 눈을 가렸지만, 그래도 계속 보고 있었다. 이 순간을 기록해 두지 않으면 내일이면 잊어버릴 것 같아서.",
    images: [
      { url: "https://picsum.photos/seed/sunset1/800/600" },
      { url: "https://picsum.photos/seed/sunset2/800/600" },
      { url: "https://picsum.photos/seed/sunset3/800/600" },
    ],
  },
  {
    slug: "rainy-day-window",
    caption:
      "비 오는 날 창가에 앉아서. 빗방울이 유리창을 따라 흘러내리는 걸 한참 동안 보고 있었다. 밖에서는 우산을 쓴 사람들이 바쁘게 지나가고, 안에서는 시간이 멈춘 것처럼 고요했다. 커피가 식어가는 것도 모르고.",
    images: [
      { url: "https://picsum.photos/seed/rain1/800/600" },
      { url: "https://picsum.photos/seed/rain2/800/600" },
    ],
  },
];

function ImageSlider({
  images,
  onIndexChange,
}: {
  images: { url: string }[];
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
    return <p className="text-sm leading-relaxed text-(--sea-ink) whitespace-pre-line">{text}</p>;
  }

  return (
    <p className="text-sm leading-relaxed text-(--sea-ink)">
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

  useEffect(() => {
    const onScroll = () => setShowTopBtn(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <Header />

      <div className="max-w-lg mx-auto flex flex-col divide-y divide-(--line)">
        {DUMMY_STILLS.map((still) => (
          <article key={still.slug} className="pb-4">
            <ImageSlider
              images={still.images}
              onIndexChange={(idx) => setImageIndices((prev) => ({ ...prev, [still.slug]: idx }))}
            />

            <div className="px-4 pt-3">
              <Caption text={still.caption} />
              <Link
                to="/s/$slug"
                params={{ slug: still.slug }}
                search={{ img: imageIndices[still.slug] ?? 0 }}
                className="inline-flex items-center gap-1 mt-2 text-xs text-(--sea-ink-soft) hover:text-(--sea-ink) no-underline font-sans"
              >
                <BookOpen size={13} />
                읽기
              </Link>
            </div>
          </article>
        ))}
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
