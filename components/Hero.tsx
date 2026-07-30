"use client";

import { useRef } from "react";
import {
  gsap,
  ScrollTrigger,
  SplitText,
  useGSAP,
  prefersReduced,
} from "@/lib/gsap";
import CTAButton from "@/components/CTAButton";

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // старт: имя ниже, портрет закрыт маской
      const reveal = () => {
        const lines = gsap.utils.toArray<HTMLElement>(".hero-l");
        const splits = lines.map((l) => new SplitText(l, { type: "chars" }));

        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        tl.fromTo(
          ".hero-photo-mask",
          { clipPath: "inset(100% 0 0 0)" },
          { clipPath: "inset(0% 0 0 0)", duration: 1.1, ease: "power4.inOut" }
        )
          .from(
            ".hero-photo-img",
            { scale: 1.25, duration: 1.4, ease: "power3.out" },
            "<"
          )
          .from(
            ".hero-kicker",
            { yPercent: 120, opacity: 0, duration: 0.7 },
            "-=0.8"
          );

        splits.forEach((s, i) => {
          tl.from(
            s.chars,
            {
              yPercent: 120,
              opacity: 0,
              duration: 0.9,
              stagger: 0.028,
            },
            i === 0 ? "-=0.4" : "-=0.7"
          );
        });

        tl.from(".hero-cta", { y: 24, opacity: 0, duration: 0.7 }, "-=0.5").from(
          ".hero-meta",
          { opacity: 0, duration: 0.8 },
          "<"
        );
      };

      if (prefersReduced()) {
        gsap.set(".hero-photo-mask", { clipPath: "inset(0% 0 0 0)" });
        return;
      }

      document.fonts?.ready ? document.fonts.ready.then(reveal) : reveal();

      // лёгкий параллакс портрета
      gsap.to(".hero-photo-img", {
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: root }
  );

  return (
    <section
      id="top"
      ref={root}
      className="relative min-h-[100svh] bg-espresso text-paper overflow-hidden flex items-center pt-24 pb-14 lg:pt-24 lg:pb-0"
    >
      <div className="mx-auto max-w-[1500px] w-full px-5 sm:px-8">
        <div className="grid lg:grid-cols-[38%_1fr] items-center gap-8 lg:gap-0">
          {/* Портрет */}
          <div className="hero-photo group relative order-1 lg:order-none w-full">
            <div className="hero-photo-mask relative overflow-hidden rounded-[16px] aspect-[3/3.1] sm:aspect-[3/4] lg:aspect-[3/4.3] max-w-[420px] sm:max-w-[500px] w-full mx-auto lg:mx-0 ring-1 ring-paper/10">
              <img
                src="/portrait-hero.webp"
                alt="Вера Быстрова"
                className="hero-photo-img w-full h-full object-cover"
              />
            </div>

            {/* CTA на мобильных — под фотографией, во всю ширину */}
            <div className="hero-cta lg:hidden mt-7 max-w-[440px] mx-auto">
              <CTAButton
                arrow
                magnetic={false}
                className="w-full justify-center !px-8 !py-4.5 !text-base"
              >
                Заказать мероприятие
              </CTAButton>
            </div>

            <div className="hero-meta flex items-center justify-center lg:justify-start gap-3 mt-5 text-paper/60 text-sm">
              <span className="w-2 h-2 rounded-full bg-accent" />
              Свободна на сезон 2026 · выезд по РК
            </div>
          </div>

          {/* Имя + CTA (на десктопе перекрывает портрет) */}
          <div className="relative z-10 lg:-ml-[9%]">
            <div className="hero-kicker kicker text-paper/55 flex flex-wrap items-center gap-x-3 gap-y-1 mb-5 lg:mb-6 lg:pl-17">
              <span>Ведущая</span>
              <span className="text-accent">—</span>
              <span>Режиссёр</span>
              <span className="text-accent hidden sm:inline">—</span>
              <span className="hidden sm:inline">Амбассадор хорошего настроения</span>
            </div>

            <h1 className="name-mega select-none lg:pl-15">
              <span className="hero-l block text-accent text-[clamp(3.2rem,13vw,8rem)] leading-[0.9]">
                Вера
              </span>
              <span className="hero-l block text-paper text-[clamp(3.2rem,13vw,8rem)] leading-[0.82] -mt-1">
                Быстрова
              </span>
            </h1>

            {/* CTA на десктопе — под именем, как раньше */}
            <div className="hero-cta hidden lg:block mt-9 lg:mt-11 lg:pl-15">
              <CTAButton arrow className="!px-8 !py-5 !text-base">
                Заказать мероприятие
              </CTAButton>
            </div>
          </div>
        </div>
      </div>

      {/* тонкая нижняя линия-хайрлайн */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-paper/10" />
    </section>
  );
}
