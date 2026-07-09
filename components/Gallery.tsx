"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, useGSAP, prefersReduced } from "@/lib/gsap";
import { X, ArrowLeft, ArrowRight, Play } from "lucide-react";

/*
  Живые кадры — сетка из 6 плиток.
  Слоты 5 и 6 — видео. Чтобы заменить: положи файлы в public/videos/
  и, по желанию, постеры (первый кадр) в public/ — путь указывается в poster.
  Видео на плитке идёт без звука, зациклено и стартует только когда попало
  в зону видимости; со звуком — при открытии в лайтбоксе.
*/
type Shot =
  | { kind: "image"; src: string; span: string }
  | { kind: "video"; src: string; poster: string; span: string };

const SHOTS: Shot[] = [
  { kind: "image", src: "/gallery-1.png", span: "lg:col-span-2 lg:row-span-2" },
  { kind: "image", src: "/gallery-2.png", span: "" },
  { kind: "image", src: "/services-3.png", span: "" },
  { kind: "image", src: "/gallery-4.png", span: "lg:row-span-2" },
  {
    kind: "video",
    src: "/reel-1.mp4",
    poster: "/gallery-5.svg",
    // на всех экранах во всю ширину сетки — иначе горизонтальный кадр режется в квадрат
    span: "col-span-2",
  },
  {
    kind: "video",
    src: "/reel-2.mp4",
    poster: "/gallery-6.svg",
    span: "",
  },
];

export default function Gallery() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const tiles = useRef<Map<number, HTMLVideoElement>>(new Map());
  const visible = useRef<Set<number>>(new Set());
  const lightboxOpen = useRef(false);

  const setTileRef = useCallback(
    (i: number) => (el: HTMLVideoElement | null) => {
      if (el) tiles.current.set(i, el);
      else tiles.current.delete(i);
    },
    []
  );

  useGSAP(
    () => {
      if (prefersReduced()) return;
      gsap.utils.toArray<HTMLElement>(".gal-item").forEach((el, i) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(14% 0 100% 0)", y: 30 },
          {
            clipPath: "inset(0% 0 0% 0)",
            y: 0,
            duration: 1.1,
            delay: (i % 4) * 0.07,
            ease: "power4.inOut",
            scrollTrigger: { trigger: el, start: "top 88%" },
          }
        );
      });
    },
    { scope: root }
  );

  // Плитки-видео играют только пока видны — экономим батарею и трафик
  useEffect(() => {
    if (prefersReduced()) return;
    const index = new Map<HTMLVideoElement, number>();
    tiles.current.forEach((v, i) => index.set(v, i));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const v = e.target as HTMLVideoElement;
          const i = index.get(v);
          if (i === undefined) return;
          if (e.isIntersecting) {
            visible.current.add(i);
            if (!lightboxOpen.current) v.play().catch(() => {});
          } else {
            visible.current.delete(i);
            v.pause();
          }
        });
      },
      { threshold: 0.25 }
    );
    tiles.current.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, []);

  // Пока открыт лайтбокс — плитки молчат. После закрытия оживают только видимые.
  useEffect(() => {
    lightboxOpen.current = active !== null;
    if (active !== null) {
      tiles.current.forEach((v) => v.pause());
    } else if (!prefersReduced()) {
      tiles.current.forEach((v, i) => {
        if (visible.current.has(i)) v.play().catch(() => {});
      });
    }
  }, [active]);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") setActive((a) => (a! + 1) % SHOTS.length);
      if (e.key === "ArrowLeft")
        setActive((a) => (a! - 1 + SHOTS.length) % SHOTS.length);
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [active]);

  const current = active !== null ? SHOTS[active] : null;

  return (
    <section id="gallery" ref={root} className="py-24 sm:py-32 bg-bg-2">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        <div className="flex items-end justify-between gap-6 flex-wrap mb-12">
          <h2 className="display text-[clamp(2.2rem,6vw,5rem)]">
            Живые <span className="hl">кадры</span> с вечеров
          </h2>
          <p className="text-muted max-w-[300px]">
            Нажмите на кадр — откроется крупно.
          </p>
        </div>

        <div className="gal-grid grid grid-cols-2 lg:grid-cols-4 auto-rows-[160px] sm:auto-rows-[210px] gap-3 sm:gap-4">
          {SHOTS.map((s, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`gal-item group relative overflow-hidden rounded-[14px] ${s.span}`}
              aria-label={
                s.kind === "video"
                  ? `Видео с мероприятия ${i + 1}`
                  : `Кадр с мероприятия ${i + 1}`
              }
            >
              {s.kind === "image" ? (
                <img
                  src={s.src}
                  alt={`Кадр с мероприятия ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-[900ms] ease-out"
                />
              ) : (
                <>
                  <video
                    ref={setTileRef(i)}
                    src={s.src}
                    poster={s.poster}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-[900ms] ease-out"
                  />
                  {/* Маркер «это видео» — иконка, не подпись */}
                  <span className="pointer-events-none absolute bottom-3 right-3 w-9 h-9 rounded-full bg-espresso/45 backdrop-blur-sm text-paper grid place-items-center">
                    <Play size={15} fill="currentColor" strokeWidth={0} />
                  </span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {current && (
        <div
          className="fixed inset-0 z-[90] bg-espresso/92 backdrop-blur-sm flex items-center justify-center p-4 sm:p-10"
          onClick={() => setActive(null)}
        >
          <button
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-paper/10 hover:bg-paper/20 text-paper grid place-items-center transition-colors"
            onClick={() => setActive(null)}
            aria-label="Закрыть"
          >
            <X size={20} />
          </button>
          <button
            className="absolute left-4 sm:left-8 w-12 h-12 rounded-full bg-paper/10 hover:bg-paper/20 text-paper grid place-items-center transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setActive((a) => (a! - 1 + SHOTS.length) % SHOTS.length);
            }}
            aria-label="Назад"
          >
            <ArrowLeft size={20} />
          </button>
          <figure
            className="max-w-[1000px] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {current.kind === "image" ? (
              <img
                src={current.src}
                alt={`Кадр с мероприятия ${active! + 1}`}
                className="w-full max-h-[76vh] object-contain rounded-[14px]"
              />
            ) : (
              <video
                key={current.src}
                src={current.src}
                poster={current.poster}
                controls
                autoPlay
                loop
                playsInline
                className="w-full max-h-[76vh] object-contain rounded-[14px] bg-black"
              />
            )}
            <figcaption className="text-paper/70 text-center mt-4 text-sm">
              {active! + 1} / {SHOTS.length}
            </figcaption>
          </figure>
          <button
            className="absolute right-4 sm:right-8 w-12 h-12 rounded-full bg-paper/10 hover:bg-paper/20 text-paper grid place-items-center transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setActive((a) => (a! + 1) % SHOTS.length);
            }}
            aria-label="Вперёд"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      )}
    </section>
  );
}
