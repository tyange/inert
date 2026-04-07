import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft } from "lucide-react";

const DUMMY_STILLS: Record<string, { caption: string; images: { url: string }[] }> = {
  "morning-walk-by-the-river": {
    caption:
      "아침 산책길에 만난 강변 풍경. 안개가 살짝 걷히면서 수면 위로 빛이 번지기 시작했다. 매일 같은 길을 걷지만 같은 아침은 없다는 걸 다시 한번 느낀다. 오늘따라 유독 공기가 맑아서 멀리 산 능선까지 선명하게 보였다. 이런 날은 카메라를 들지 않을 수 없다.\n\n강둑을 따라 걸으면 갈대밭이 나온다. 바람이 불 때마다 갈대가 한쪽으로 쏠리면서 은빛 물결을 만든다. 그 사이로 백로 한 마리가 조용히 서 있었다. 사람이 지나가도 꿈쩍하지 않는 걸 보면 이 근처에 자주 오는 녀석인 모양이다.\n\n돌아오는 길에 다리 위에서 한참을 멈춰 섰다. 물 위에 비친 하늘이 실제 하늘보다 더 파랗게 보였다. 이런 순간들이 쌓여서 하루가 되고, 하루가 쌓여서 계절이 된다.",
    images: [
      { url: "https://picsum.photos/seed/river1/800/600" },
      { url: "https://picsum.photos/seed/river2/800/600" },
      { url: "https://picsum.photos/seed/river3/800/600" },
    ],
  },
  "cafe-on-the-corner": {
    caption:
      "골목 끝에 있는 작은 카페. 간판도 없고, 문도 닫혀 있는 것 같았는데 안에서 커피 향이 새어 나왔다. 들어가 보니 주인장이 혼자서 원두를 볶고 있었다. 여기는 예약제라고 했지만, 자리가 비어 있으니 앉아도 된다고 했다.\n\n벽에는 오래된 LP판들이 걸려 있었고, 턴테이블에서는 재즈가 흘러나왔다. 메뉴판 같은 건 없었다. 주인장이 그날 볶은 원두로 내려주는 한 종류뿐이라고 했다. 잔을 받아 들고 한 모금 마시니, 쓴맛 뒤에 은은한 과일 향이 남았다.\n\n창밖으로 골목이 보였다. 낡은 담벼락에 덩굴이 자라고 있었고, 고양이 한 마리가 양지바른 곳에서 낮잠을 자고 있었다. 이런 곳이 아직 남아 있다는 게 신기했다.",
    images: [
      { url: "https://picsum.photos/seed/cafe1/800/600" },
      { url: "https://picsum.photos/seed/cafe2/800/600" },
    ],
  },
  "old-bookstore-downtown": {
    caption:
      "도심 한가운데 숨어 있는 헌책방. 문을 열면 종이 냄새가 먼저 맞아준다. 주인 할아버지는 항상 같은 자리에 앉아 책을 읽고 계신다. 여기서 시간은 조금 다르게 흐르는 것 같다. 30년 된 잡지를 뒤적이다가 어릴 적 봤던 만화 광고를 발견했다. 기억이라는 건 이상한 곳에 숨어 있다가 불쑥 나타난다.\n\n책장 사이를 걷다 보면 바닥이 삐걱거린다. 천장까지 닿을 듯한 선반에 책이 빼곡히 꽂혀 있고, 위쪽 책은 사다리를 타고 올라가야 꺼낼 수 있다. 할아버지에게 이 책들을 다 읽으셨냐고 물었더니, 웃으시면서 '절반도 못 읽었어'라고 하셨다.\n\n오래된 시집 한 권을 샀다. 누군가 밑줄을 그어 놓은 부분이 있었다. 그 사람은 이 구절을 읽으며 무슨 생각을 했을까. 책은 사람에서 사람으로 건너가면서 이야기가 덧붙여지는 것 같다.\n\n가게를 나오면서 뒤를 돌아보니, 유리문 너머로 할아버지가 여전히 같은 자세로 책을 읽고 계셨다.",
    images: [
      { url: "https://picsum.photos/seed/book1/800/600" },
      { url: "https://picsum.photos/seed/book2/800/600" },
      { url: "https://picsum.photos/seed/book3/800/600" },
      { url: "https://picsum.photos/seed/book4/800/600" },
    ],
  },
  "sunset-from-rooftop": {
    caption:
      "옥상에서 본 일몰. 건물 사이로 해가 내려앉으면서 하늘이 분홍빛으로 물들었다. 바람이 제법 세서 머리카락이 자꾸 눈을 가렸지만, 그래도 계속 보고 있었다. 이 순간을 기록해 두지 않으면 내일이면 잊어버릴 것 같아서.\n\n도시의 일몰은 자연 속의 일몰과는 다르다. 건물들의 유리창에 석양이 반사되면서 온 세상이 금빛으로 빛난다. 그 순간만큼은 콘크리트 숲도 아름답다.\n\n해가 완전히 지고 나서도 한참을 서 있었다. 하늘이 남색으로 바뀌면서 하나둘 불이 켜지기 시작했다. 낮과 밤 사이의 그 짧은 시간, 블루아워. 도시가 가장 고요한 순간이다.",
    images: [
      { url: "https://picsum.photos/seed/sunset1/800/600" },
      { url: "https://picsum.photos/seed/sunset2/800/600" },
      { url: "https://picsum.photos/seed/sunset3/800/600" },
    ],
  },
  "rainy-day-window": {
    caption:
      "비 오는 날 창가에 앉아서. 빗방울이 유리창을 따라 흘러내리는 걸 한참 동안 보고 있었다. 밖에서는 우산을 쓴 사람들이 바쁘게 지나가고, 안에서는 시간이 멈춘 것처럼 고요했다. 커피가 식어가는 것도 모르고.\n\n비가 세차게 내리다가 잠깐 멈추고, 다시 부슬부슬 내리기를 반복했다. 창밖 나뭇잎에 맺힌 물방울이 햇살에 반짝이는 순간이 있었다. 비 온 뒤의 빛은 평소보다 선명하다.\n\n누군가 옆 테이블에서 노트북을 펴고 글을 쓰고 있었다. 가끔 창밖을 바라보다가 다시 타자를 치곤 했다. 비 오는 날에는 모두가 조금씩 느려지는 것 같다. 그리고 그 느림 속에서 평소에 놓쳤던 것들이 보이기 시작한다.",
    images: [
      { url: "https://picsum.photos/seed/rain1/800/600" },
      { url: "https://picsum.photos/seed/rain2/800/600" },
    ],
  },
};

export const Route = createFileRoute("/s/$slug")({
  component: StillPage,
  validateSearch: (search: Record<string, unknown>) => ({
    img: Number(search.img) || 0,
  }),
});

function StillPage() {
  const { slug } = Route.useParams();
  const { img } = Route.useSearch();
  const still = DUMMY_STILLS[slug];

  if (!still) {
    return (
      <div className="min-h-screen flex items-center justify-center text-(--sea-ink-soft)">
        찾을 수 없습니다
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto relative">
        <div className="sticky top-0 z-30 h-0">
          <Link
            to="/"
            className="absolute top-4 -left-12 flex items-center justify-center w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 no-underline"
          >
            <ArrowLeft size={18} />
          </Link>
        </div>

        <div className="relative">
          <DetailImageSlider images={still.images} initialIndex={img} />
        </div>

        <div className="px-6 sm:px-12 py-8 sm:py-12">
          <div className="prose prose-lg max-w-none text-(--sea-ink)">
            {still.caption.split("\n\n").map((paragraph, i) => (
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
