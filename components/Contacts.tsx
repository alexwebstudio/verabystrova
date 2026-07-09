"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReduced } from "@/lib/gsap";
import { Phone, MessageCircle, Instagram, MapPin } from "lucide-react";
import CTAButton from "@/components/CTAButton";
import { siteConfig } from "@/config/site";

export default function Contacts() {
  const root = useRef<HTMLDivElement>(null);
  const c = siteConfig.contacts;

  const rows = [
    { icon: Phone, label: "Телефон", value: c.phone, href: c.phoneHref },
    { icon: MessageCircle, label: "WhatsApp", value: c.whatsappLabel, href: c.whatsapp },
    { icon: Instagram, label: "Instagram", value: c.instagramLabel, href: c.instagram },
  ];

  useGSAP(
    () => {
      if (prefersReduced()) return;
      gsap.from(".ct-row", {
        y: 24,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: ".ct-list", start: "top 85%" },
      });
      gsap.from(".ct-map", {
        opacity: 0,
        scale: 0.97,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".ct-map", start: "top 86%" },
      });
    },
    { scope: root }
  );

  return (
    <section id="contacts" ref={root} className="py-24 sm:py-32 bg-bg-2">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        <div className="mb-14">
          <span className="kicker text-muted">Контакты</span>
          <h2 className="display text-[clamp(2.2rem,6vw,5rem)] mt-5 max-w-[14ch]">
            Напишите — и всё <span className="hl">начнётся</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-start">
          <div>
            <div className="ct-list divide-y divide-line border-y border-line">
              {rows.map((r) => {
                const Icon = r.icon;
                return (
                  <a
                    key={r.label}
                    href={r.href}
                    target={r.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="ct-row group flex items-center gap-3 sm:gap-5 py-5"
                  >
                    <span className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-paper grid place-items-center text-accent-deep group-hover:bg-accent group-hover:text-espresso transition-colors duration-400 shrink-0">
                      <Icon size={20} strokeWidth={1.8} />
                    </span>
                    <span className="text-sm text-muted w-16 sm:w-24 shrink-0">
                      {r.label}
                    </span>
                    <span className="font-semibold text-base sm:text-lg min-w-0 break-words group-hover:text-accent-deep transition-colors">
                      {r.value}
                    </span>
                  </a>
                );
              })}

              {/* адрес */}
              <div className="ct-row flex items-start gap-3 sm:gap-5 py-5">
                <span className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-paper grid place-items-center text-accent-deep shrink-0">
                  <MapPin size={20} strokeWidth={1.8} />
                </span>
                <span className="text-sm text-muted w-16 sm:w-24 shrink-0 pt-1">
                  Адрес
                </span>
                <span className="font-semibold text-base sm:text-lg leading-snug min-w-0 break-words">
                  {c.address}
                  <span className="block text-muted font-normal text-sm mt-1">
                    {c.addressNote}
                  </span>
                </span>
              </div>
            </div>

            <p className="text-muted mt-6 text-sm">
              {siteConfig.host.agency}
            </p>

            <div className="mt-8">
              <CTAButton arrow className="!px-8 !py-5 !text-base">
                Заказать мероприятие
              </CTAButton>
            </div>
          </div>

          <div className="ct-map relative rounded-[16px] overflow-hidden aspect-[4/3] lg:aspect-auto lg:h-[460px] soft-shadow bg-bg-3">
            <iframe
              src={c.mapEmbed}
              className="w-full h-full"
              loading="lazy"
              title="Карта — Агентство праздников Веры Быстровой"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
