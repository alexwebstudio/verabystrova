"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, prefersReduced } from "@/lib/gsap";
import { X, ArrowLeft, ArrowRight, Play } from "lucide-react";

/*
  ЖИВЫЕ КАДРЫ — фотографии + видео YouTube в одной сетке.
  Видео стоит в последнем слоте (правый нижний угол).
  До клика грузится только обложка, плеер подключается по клику.
*/

const YOUTUBE_URL = "https://youtu.be/bDOY8Fj2B40?feature=shared";

function youtubeId(raw: string): string | null {
  const s = (raw || "").trim();
  if (!s) return null;
  if (/^[\w-]{11}$/.test(s)) return s;
  const m = s.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/
  );
  return m ? m[1] : null;
}

const YT_ID = youtubeId(YOUTUBE_URL);

const SHOTS = [
  { src: "/gallery-1.webp", span: "lg:col-span-2 lg:row-span-2" },
  { src: "/gallery-2.webp", span: "" },
  { src: "/services-3.webp", span: "" },
  { src: "/gallery-4.webp", span: "lg:row-span-2" },
  { src: "/gallery-photo-3.webp", span: "lg:col-span-2" },
];

export default function Gallery() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);

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

  return (
    <section id="gallery" ref={root} className="py-24 sm:py-32 bg-bg-2">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        <div className="flex items-end justify-between gap-6 flex-wrap mb-12">
          <h2 className="display text-[clamp(2.2rem,6vw,5rem)]">
            Живые <span className="hl">кадры</span> с вечеров
          </h2>
          <p className="text-muted max-w-[300px]">
            Нажмите на снимок — откроется крупно.
          </p>
        </div>

        <div className="gal-grid grid grid-cols-2 lg:grid-cols-4 auto-rows-[160px] sm:auto-rows-[210px] gap-3 sm:gap-4">
          {/* Фотографии */}
          {SHOTS.map((s, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`gal-item group relative overflow-hidden rounded-[14px] ${s.span}`}
              aria-label={`Открыть кадр ${i + 1} крупно`}
            >
              <img
                src={s.src}
                alt={`Кадр с мероприятия ${i + 1}`}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-[900ms] ease-out"
              />
            </button>
          ))}

          {/* Видео — последний слот в сетке (правый нижний угол) */}
          {YT_ID && (
            <div className="gal-item relative overflow-hidden rounded-[14px] bg-espresso">
              {playing ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${YT_ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                  title="Видео с мероприятия"
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <button
                  onClick={() => setPlaying(true)}
                  className="group absolute inset-0 w-full h-full"
                  aria-label="Смотреть видео с мероприятия"
                >
                  <img
                    src={`https://i.ytimg.com/vi/${YT_ID}/maxresdefault.jpg`}
                    alt=""
                    loading="lazy"
                    onError={(e) => {
                      const img = e.currentTarget;
                      if (img.dataset.fallback) return;
                      img.dataset.fallback = "1";
                      img.src = `https://i.ytimg.com/vi/${YT_ID}/hqdefault.jpg`;
                    }}
                    className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-[900ms] ease-out"
                  />
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="w-[52px] h-[52px] sm:w-[62px] sm:h-[62px] rounded-full bg-accent text-espresso grid place-items-center transition-transform duration-500 group-hover:scale-110">
                      <Play
                        size={20}
                        fill="currentColor"
                        strokeWidth={0}
                        className="translate-x-[1px]"
                      />
                    </span>
                  </span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox для фотографий */}
      {active !== null && (
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
            <img
              src={SHOTS[active].src}
              alt={`Кадр с мероприятия ${active + 1}`}
              className="w-full max-h-[76vh] object-contain rounded-[14px]"
            />
            <figcaption className="text-paper/70 text-center mt-4 text-sm">
              {active + 1} / {SHOTS.length}
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
