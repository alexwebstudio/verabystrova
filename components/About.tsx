"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, prefersReduced } from "@/lib/gsap";

/* Patch 1.2 — «Коротко о главном»: только текст, без иконок */
const FACTS: { lead: string; rest: string }[] = [
  { lead: "Школа КВН", rest: "4 года на сцене — юмор, находчивость и словесные баттлы с гостями" },
  { lead: "Диплом с отличием", rest: "по режиссуре мероприятий (2024) — в дополнение к трём высшим" },
  { lead: "Никаких пошлых конкурсов", rest: "и «тамадинских» шаблонов — только то, за что не стыдно" },
  { lead: "Аппаратура премиум-класса", rest: "звук на зал до 200 гостей, проектор, свет, дым, лазеры" },
  { lead: "Диджей в команде", rest: "музыка всех эпох, стилей и национальных традиций" },
  { lead: "Договор и сценарный план", rest: "с каждым заказчиком — всё по минутам, без импровизаций «на авось»" },
];

export default function About() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReduced()) return;
      const build = () => {
        const t = root.current?.querySelector<HTMLElement>(".ab-title");
        if (t) {
          const s = new SplitText(t, { type: "lines", mask: "lines" });
          gsap.from(s.lines, {
            yPercent: 120,
            duration: 1,
            stagger: 0.09,
            ease: "power4.out",
            scrollTrigger: { trigger: t, start: "top 82%" },
          });
        }
      };
      document.fonts?.ready ? document.fonts.ready.then(build) : build();

      // Плавное появление фотографий: маска раскрывается снизу вверх + лёгкий параллакс
      gsap.utils.toArray<HTMLElement>(".ab-photo").forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(12% 0 100% 0)" },
          {
            clipPath: "inset(0% 0 0% 0)",
            duration: 1.2,
            ease: "power4.inOut",
            scrollTrigger: { trigger: el, start: "top 88%" },
          }
        );
        gsap.to(el.querySelector("img"), {
          yPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      gsap.from(".ab-p", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: ".ab-copy", start: "top 82%" },
      });

      gsap.from(".ab-fact", {
        x: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: ".ab-facts", start: "top 84%" },
      });
    },
    { scope: root }
  );

  return (
    <section id="about" ref={root} className="py-24 sm:py-32 bg-bg-2">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        <div className="flex items-end justify-between gap-6 flex-wrap mb-14">
          <div>
            <h2 className="ab-title display text-[clamp(2.4rem,6.5vw,5.5rem)] mt-5 max-w-[30ch]">
              Я не «тамада». Я <span className="hl">режиссёр</span> вашего вечера.
            </h2>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-16 items-start">
          {/* Левая колонка: текст + два фото разного размера */}
          <div>
            <div className="ab-copy max-w-[560px] space-y-6">
              <p className="ab-p text-xl sm:text-2xl leading-snug font-medium">
                15 лет я организую праздники: планирую вечер по минутам, но
                помню, что праздник — не театр, и умею мгновенно перестроиться
                под настроение зала.
              </p>
              <p className="ab-p text-muted leading-relaxed">
                У праздника нет второго шанса — поэтому работаю с ювелирной
                точностью. С каждым заказчиком заключаю договор, где прописаны
                все нюансы, и составляю подробный сценарный план с таймингом.
                Не бывает двух похожих праздников — как не бывает двух
                одинаковых людей.
              </p>
              <p className="ab-p text-muted leading-relaxed">
                Я — ведущая с юмором: четыре года играла за команду
                университета в КВН, где отточила остроумие и находчивость.
                Обожаю словесные баттлы с гостями, а диджей всегда к месту
                добавит «звуковую фишку» или мем на экране.
              </p>
              <p className="ab-p text-muted leading-relaxed">
                Постоянно учусь у лучших ведущих и бизнес-тренеров праздников.
                В 2024 году с отличием закончила курс по режиссуре мероприятий —
                к трём дипломам о высшем образовании добавила четвёртый.
              </p>
            </div>

            <div className="grid grid-cols-[1.4fr_1fr] gap-4 sm:gap-6 mt-12">
              <div className="ab-photo group relative overflow-hidden rounded-[16px] aspect-[4/5]">
                <img
                  src="/portrait-about-1.png"
                  alt="Вера Быстрова"
                  className="w-full h-[112%] object-cover"
                />
              </div>
              <div className="ab-photo group relative overflow-hidden rounded-[16px] aspect-[3/5] mt-10">
                <img
                  src="/portrait-about-2.png"
                  alt="На мероприятии"
                  className="w-full h-[112%] object-cover"
                />
              </div>
            </div>
          </div>

          {/* Правая колонка: «Коротко о главном» — только типографика, без иконок */}
          <div className="ab-facts bg-paper rounded-[16px] p-7 sm:p-9 soft-shadow lg:sticky lg:top-24">
            <span className="kicker text-muted">Коротко о главном</span>
            <div className="mt-6 divide-y divide-line">
              {FACTS.map((f, i) => (
                <div key={i} className="ab-fact py-5 first:pt-4 last:pb-1">
                  <p className="leading-snug">
                    <span className="display block text-[1.15rem] sm:text-[1.28rem] text-ink">
                      {f.lead}
                    </span>
                    <span className="block text-muted text-sm sm:text-[0.95rem] mt-1.5 leading-relaxed">
                      {f.rest}
                    </span>
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-7 pt-6 border-t border-line text-ink-soft font-semibold leading-snug">
              Мы искренне любим свою работу —{" "}
              <span className="hl">и поэтому делаем её хорошо.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
