"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReduced } from "@/lib/gsap";
import { ArrowUpRight } from "lucide-react";
import { useModal } from "@/providers/ModalProvider";

const ITEMS = [
  {
    title: "Свадьбы",
    preset: "Свадьба",
    desc: "Главный день — по минутам и по любви",
    img: "/services-1.webp",
    span: "lg:col-span-2 lg:row-span-2 min-h-[300px] lg:min-h-[440px]",
  },
  {
    title: "Юбилеи",
    preset: "Юбилей",
    desc: "Тёплый вечер про человека, а не про тосты",
    img: "/services-2.webp",
    span: "lg:row-span-2 min-h-[260px] lg:min-h-[440px]",
  },
  {
    title: "Корпоративы",
    preset: "Корпоратив",
    desc: "Драйв, который сплачивает команду",
    img: "/services-3.webp",
    span: "min-h-[240px]",
  },
  {
    title: "Выпускные",
    preset: "Выпускной",
    desc: "Финал, который запомнят на годы",
    img: "/services-4.webp",
    span: "min-h-[240px]",
  },
  {
    title: "Дни рождения",
    preset: "День рождения",
    desc: "Личный праздник с настроением именинника",
    img: "/gallery-2.webp",
    span: "min-h-[240px]",
  },
];

export default function Services() {
  const root = useRef<HTMLDivElement>(null);
  const { open } = useModal();

  useGSAP(
    () => {
      if (prefersReduced()) return;
      // Карточки «раскрываются» маской снизу вверх
      gsap.utils.toArray<HTMLElement>(".svc-card").forEach((el, i) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(12% 0 100% 0)", y: 34 },
          {
            clipPath: "inset(0% 0 0% 0)",
            y: 0,
            duration: 1.05,
            delay: (i % 3) * 0.08,
            ease: "power4.inOut",
            scrollTrigger: { trigger: el, start: "top 86%" },
          }
        );
      });
    },
    { scope: root }
  );

  return (
    <section id="services" ref={root} className="py-24 sm:py-32">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        <div className="flex items-end justify-between gap-6 flex-wrap mb-12">
          <div>
            <h2 className="display text-[clamp(2.2rem,6vw,5rem)] mt-5">
              Форматы, <span className="hl">которые</span> веду
            </h2>
          </div>
          <p className="text-muted max-w-[320px]">
            Нажмите на формат — подберём программу под ваш повод и бюджет.
          </p>
        </div>

        <div className="svc-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 grid-flow-dense">
          {ITEMS.map((it) => (
            <button
              key={it.title}
              onClick={() => open(it.preset)}
              className={`svc-card group relative overflow-hidden rounded-[16px] text-left ${it.span}`}
            >
              <img
                src={it.img}
                alt={it.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-[900ms] ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/25 to-espresso/5" />

              <div className="relative h-full flex flex-col justify-end p-6 sm:p-7 text-paper">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="display text-[clamp(1.5rem,3vw,2.4rem)] leading-none">
                    {it.title}
                  </h3>
                  <span className="w-10 h-10 rounded-full bg-accent text-espresso grid place-items-center shrink-0 translate-y-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                    <ArrowUpRight size={19} strokeWidth={2.2} />
                  </span>
                </div>
                <p className="text-paper/70 text-sm sm:text-base mt-2 max-w-[34ch]">
                  {it.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
