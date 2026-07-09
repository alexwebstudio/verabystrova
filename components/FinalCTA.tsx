"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, prefersReduced } from "@/lib/gsap";
import CTAButton from "@/components/CTAButton";

export default function FinalCTA() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReduced()) return;
      const build = () => {
        const t = root.current?.querySelector<HTMLElement>(".cta-title");
        if (t) {
          const s = new SplitText(t, { type: "lines", mask: "lines" });
          gsap.from(s.lines, {
            yPercent: 120,
            duration: 1,
            stagger: 0.1,
            ease: "power4.out",
            scrollTrigger: { trigger: t, start: "top 78%" },
          });
        }
      };
      document.fonts?.ready ? document.fonts.ready.then(build) : build();

      gsap.from(".cta-fade", {
        y: 22,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
    },
    { scope: root }
  );

  return (
    <section className="px-4 sm:px-8 pb-8">
      <div
        ref={root}
        className="relative overflow-hidden rounded-[18px] bg-espresso text-paper py-24 sm:py-36 px-6 text-center"
      >
        <p className="cta-fade kicker text-paper/45 mb-7">Ваша дата ждёт</p>
        <h2 className="cta-title display text-[clamp(2.4rem,7.5vw,6rem)] max-w-[16ch] mx-auto">
          Давайте сделаем вечер, который{" "}
          <span className="text-accent">не захочется</span> заканчивать
        </h2>
        <p className="cta-fade text-paper/70 text-lg max-w-[520px] mx-auto mt-7 leading-relaxed">
          Расскажите о вашем событии — подскажу, свободна ли дата, и предложу,
          как сделать праздник по-настоящему вашим.
        </p>
        <div className="cta-fade mt-10 flex justify-center">
          <CTAButton variant="primary" arrow className="!px-8 !py-5 !text-base">
            Заказать мероприятие
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
