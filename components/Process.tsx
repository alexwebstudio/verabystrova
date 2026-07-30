"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReduced } from "@/lib/gsap";

const STEPS = [
  ["01", "Оставляете заявку", "Пройдите короткий квиз на сайте или напишите в WhatsApp и Instagram — как вам удобнее. Отвечаю в течение дня."],
  ["02", "Созваниваемся", "Знакомимся: я задаю вопросы про вас, ваших гостей и повод — из этих деталей рождается идея вечера."],
  ["03", "Обсуждаем программу", "Собираем структуру вечера: форматы, игры, музыку, трогательные моменты и точный тайминг по минутам."],
  ["04", "Подготавливаем сценарий", "Пишу авторский сценарий под вашу пару или компанию, согласую его до мелочей и закрепляю договором, где прописаны все нюансы."],
  ["05", "Проводим мероприятие", "Держу вечер от первой минуты до финального танца. Вам остаётся самое приятное — быть гостем на собственном празднике."],
  ["06", "Остаются эмоции", "Те самые, ради которых всё и затевалось. Помогу подобрать и артистов, фотографа, видеографа, декораторов — всех подрядчиков праздника."],
];

export default function Process() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReduced()) return;
      gsap.fromTo(
        ".proc-fill",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".proc-list",
            start: "top 70%",
            end: "bottom 75%",
            scrub: true,
          },
        }
      );
      gsap.from(".proc-step", {
        y: 34,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: ".proc-list", start: "top 78%" },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="py-24 sm:py-32">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        <div className="mb-16">
          <h2 className="display text-[clamp(2.2rem,6vw,5rem)] mt-5">
            От заявки до <span className="hl">эмоций</span>
          </h2>
        </div>

        <div className="proc-list relative pl-14 sm:pl-24">
          {/* линия */}
          <div className="absolute left-[19px] sm:left-[35px] top-3 bottom-3 w-px bg-line" />
          <div className="proc-fill absolute left-[19px] sm:left-[35px] top-3 bottom-3 w-px bg-accent origin-top" />

          {STEPS.map(([n, t, d]) => (
            <div key={n} className="proc-step relative pb-12 last:pb-0">
              <div className="absolute -left-14 sm:-left-24 top-0 flex items-center justify-center">
                <span className="w-10 h-10 sm:w-[70px] sm:h-[70px] rounded-full bg-bg border border-line grid place-items-center">
                  <span className="display text-base sm:text-2xl text-accent-deep">
                    {n}
                  </span>
                </span>
              </div>
              <h3 className="display text-[clamp(1.5rem,3vw,2.4rem)]">{t}</h3>
              <p className="text-muted mt-2 text-base sm:text-lg max-w-[960px] leading-relaxed">
                {d}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
