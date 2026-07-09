"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { scrollTo } from "@/providers/SmoothScroll";
import { useModal } from "@/providers/ModalProvider";
import { siteConfig } from "@/config/site";
import { Instagram, MessageCircle } from "lucide-react";

const LINKS = [
  { label: "Обо мне", id: "#about" },
  { label: "Проводим", id: "#services" },
  { label: "Галерея", id: "#gallery" },
  { label: "Контакты", id: "#contacts" },
];

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState(false);
  const overlay = useRef<HTMLDivElement>(null);
  const { open } = useModal();
  const { contacts } = siteConfig;

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = menu ? "hidden" : "";
  }, [menu]);

  useGSAP(
    () => {
      if (!overlay.current) return;
      const items = overlay.current.querySelectorAll<HTMLElement>(".ov-item");
      if (menu) {
        gsap.set(overlay.current, { display: "flex" });
        gsap.fromTo(
          overlay.current,
          { clipPath: "inset(0 0 100% 0)" },
          { clipPath: "inset(0 0 0% 0)", duration: 0.8, ease: "power4.inOut" }
        );
        gsap.fromTo(
          items,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.07, delay: 0.25, duration: 0.7, ease: "power3.out" }
        );
      } else {
        gsap.to(overlay.current, {
          clipPath: "inset(0 0 100% 0)",
          duration: 0.6,
          ease: "power4.inOut",
          onComplete: () => gsap.set(overlay.current, { display: "none" }),
        });
      }
    },
    { dependencies: [menu] }
  );

  const go = (id: string) => {
    setMenu(false);
    setTimeout(() => scrollTo(id, -60), menu ? 500 : 0);
  };

  // цвет контента: светлый поверх тёмного hero, тёмный после скролла
  const light = !solid && !menu;
  const txt = light ? "text-paper" : "text-ink";
  const sub = light ? "text-paper/70 hover:text-paper" : "text-ink-soft hover:text-ink";

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          solid
            ? "bg-bg/85 backdrop-blur-md border-b border-line/70"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <nav className="mx-auto max-w-[1500px] px-5 sm:px-8 h-[74px] flex items-center justify-between">
          <button
            onClick={() => go("#top")}
            className={`display text-[1.15rem] tracking-tight ${txt}`}
          >
            Вера&nbsp;Быстрова<span className="text-accent">.</span>
          </button>

          <div className="hidden lg:flex items-center gap-9">
            {LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className={`ulink text-sm font-medium ${sub}`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className={`hidden sm:flex items-center gap-3 ${sub}`}>
              <a
                href={contacts.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:scale-110 transition-transform"
              >
                <Instagram size={19} strokeWidth={1.7} />
              </a>
              <a
                href={contacts.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="hover:scale-110 transition-transform"
              >
                <MessageCircle size={19} strokeWidth={1.7} />
              </a>
            </div>

            <button
              className="hidden sm:inline-flex btn btn-primary !py-2.5 !px-5 !text-sm"
              onClick={() => open()}
            >
              Заказать
            </button>

            <button
              className="lg:hidden w-11 h-11 -mr-2 grid place-items-center"
              aria-label="Меню"
              onClick={() => setMenu((m) => !m)}
            >
              <span className="relative block w-6 h-4">
                <span
                  className={`absolute left-0 h-[1.5px] w-6 transition-all duration-300 ${
                    menu ? "top-1/2 rotate-45 bg-ink" : light ? "top-0 bg-paper" : "top-0 bg-ink"
                  }`}
                />
                <span
                  className={`absolute left-0 top-1/2 h-[1.5px] w-6 transition-all duration-300 ${
                    menu ? "opacity-0" : light ? "opacity-100 bg-paper" : "opacity-100 bg-ink"
                  }`}
                />
                <span
                  className={`absolute left-0 h-[1.5px] w-6 transition-all duration-300 ${
                    menu ? "top-1/2 -rotate-45 bg-ink" : light ? "bottom-0 bg-paper" : "bottom-0 bg-ink"
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <div
        ref={overlay}
        className="fixed inset-0 z-40 hidden flex-col justify-center px-8 bg-bg-2"
        style={{ display: "none" }}
      >
        <div className="flex flex-col gap-1">
          {LINKS.map((l, i) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className="ov-item text-left display text-[14vw] leading-[1.08] text-ink"
            >
              <span className="text-accent-deep text-[0.32em] align-middle mr-3 font-sans">
                0{i + 1}
              </span>
              {l.label}
            </button>
          ))}
        </div>
        <button
          className="ov-item btn btn-primary mt-12 self-start"
          onClick={() => {
            setMenu(false);
            setTimeout(() => open(), 500);
          }}
        >
          Заказать мероприятие
        </button>
      </div>
    </>
  );
}
