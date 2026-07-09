"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, prefersReduced } from "@/lib/gsap";

/* Patch 1.2 — блок доверия: ровно четыре карточки */
const FACTS: {
  big: string;
  small: string;
  count?: { to: number; suffix: string };
}[] = [
  { big: "15 лет", small: "организации мероприятий", count: { to: 15, suffix: " лет" } },
  { big: "1000+", small: "проведённых вечеров", count: { to: 1000, suffix: "+" } },
  { big: "Авторский", small: "сценарий под каждую пару" },
  { big: "Караганда", small: "выезд по РК" },
];

export default function Manifesto() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReduced()) return;
      const build = () => {
        const t = root.current?.querySelector<HTMLElement>(".mf-title");
        if (t) {
          const s = new SplitText(t, { type: "lines", mask: "lines" });
          gsap.from(s.lines, {
            yPercent: 120,
            duration: 1,
            stagger: 0.1,
            ease: "power4.out",
            scrollTrigger: { trigger: t, start: "top 80%" },
          });
        }
      };
      document.fonts?.ready ? document.fonts.ready.then(build) : build();

      gsap.from(".mf-fact", {
        y: 26,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: ".mf-facts", start: "top 85%" },
      });

      // Анимация цифр: значения «накручиваются» при появлении блока
      gsap.utils.toArray<HTMLElement>(".mf-num").forEach((el) => {
        const to = Number(el.dataset.to || 0);
        const suffix = el.dataset.suffix || "";
        const obj = { v: 0 };
        gsap.to(obj, {
          v: to,
          duration: to > 100 ? 1.8 : 1.2,
          ease: "power2.out",
          scrollTrigger: { trigger: ".mf-facts", start: "top 85%" },
          onUpdate() {
            el.textContent = `${Math.round(obj.v)}${suffix}`;
          },
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        <h2 className="mf-title display text-[clamp(2rem,6vw,5rem)] max-w-[30ch]">
          Веду вечер так, чтобы гостям было <span className="hl">тепло</span>, а
          вам — <span className="hl">спокойно</span>.
        </h2>

        <div className="mf-facts mt-16 sm:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-x-6 sm:gap-x-8 gap-y-12 border-t border-line pt-12">
          {FACTS.map(({ big, small, count }, i) => (
            <div key={i} className="mf-fact">
              <span className="block w-8 h-[3px] bg-accent mb-5" />
              <div className="display text-[clamp(1.5rem,2.6vw,2.2rem)] leading-tight">
                {count ? (
                  <span
                    className="mf-num"
                    data-to={count.to}
                    data-suffix={count.suffix}
                  >
                    {big}
                  </span>
                ) : (
                  big
                )}
              </div>
              <div className="text-muted mt-1.5 text-sm sm:text-base">
                {small}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
