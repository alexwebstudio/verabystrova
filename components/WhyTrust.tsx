"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, prefersReduced } from "@/lib/gsap";

const REASONS = [
  ["01", "Держу зал", "От тёплых слёз до танцпола — веду эмоцию, а не просто объявляю блоки."],
  ["02", "Без пошлых конкурсов", "Никаких «тамадинских» шаблонов, за которые потом неловко перед гостями."],
  ["03", "Всегда в работе", "Никаких перекуров и прогулок по залу без дела — весь вечер я рядом с гостями."],
  ["04", "Живой юмор", "Смешно и по-доброму — так, что не стыдно ни перед боссом, ни перед бабушкой."],
];

export default function WhyTrust() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReduced()) return;
      const build = () => {
        const t = root.current?.querySelector<HTMLElement>(".why-title");
        if (t) {
          const s = new SplitText(t, { type: "lines", mask: "lines" });
          gsap.from(s.lines, {
            yPercent: 120,
            duration: 1,
            stagger: 0.1,
            ease: "power4.out",
            scrollTrigger: { trigger: t, start: "top 82%" },
          });
        }
      };
      document.fonts?.ready ? document.fonts.ready.then(build) : build();

      gsap.from(".why-row", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".why-list", start: "top 82%" },
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="py-24 sm:py-32 bg-espresso text-paper overflow-hidden"
    >
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        <span className="kicker text-paper/45">Почему выбирают меня</span>
        <h2 className="why-title display text-[clamp(2.4rem,7vw,6rem)] mt-5 max-w-[30ch]">
          Четыре причины доверить вечер <span className="text-accent">мне</span>
        </h2>

        <div className="why-list mt-16 border-t border-paper/15">
          {REASONS.map(([n, t, d]) => (
            <div
              key={n}
              className="why-row group grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-x-8 gap-y-3 items-baseline py-8 sm:py-10 border-b border-paper/15"
            >
              <span className="name-mega text-transparent text-[clamp(2.5rem,7vw,5rem)] leading-none [-webkit-text-stroke:1.4px_rgba(250,247,241,0.35)] group-hover:[-webkit-text-stroke:1.4px_var(--color-accent)] transition-all duration-500">
                {n}
              </span>
              <div className="max-w-[720px]">
                <h3 className="display text-[clamp(1.6rem,3.4vw,2.8rem)] group-hover:text-accent transition-colors duration-400">
                  {t}
                </h3>
                <p className="text-paper/60 mt-3 text-base sm:text-lg leading-relaxed">
                  {d}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
