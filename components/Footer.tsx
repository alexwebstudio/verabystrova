"use client";

import { ArrowUpRight } from "lucide-react";
import { scrollTo } from "@/providers/SmoothScroll";
import { useModal } from "@/providers/ModalProvider";
import { siteConfig } from "@/config/site";

const NAV = [
  { label: "Обо мне", id: "#about" },
  { label: "Проводим", id: "#services" },
  { label: "Галерея", id: "#gallery" },
  { label: "Контакты", id: "#contacts" },
];

export default function Footer() {
  const { open } = useModal();
  const { studio, contacts, host } = siteConfig;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-espresso text-paper pt-20 pb-8 overflow-hidden">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 pb-16">
          <div>
            <button
              onClick={() => scrollTo("#top")}
              className="name-mega text-[clamp(2.6rem,10vw,7rem)] leading-[0.82] text-left"
            >
              Вера
              <br />
              Быстрова<span className="text-accent">.</span>
            </button>
            <p className="text-paper/60 max-w-[420px] mt-7 leading-relaxed">
              {host.agency}. Ведущая и режиссёр событий в {host.city} — свадьбы,
              юбилеи, корпоративы, выпускные и дни рождения по индивидуальному
              сценарию.
            </p>
            <button className="btn btn-primary mt-8" onClick={() => open()}>
              Заказать мероприятие <ArrowUpRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="kicker text-paper/40 mb-5">Навигация</p>
              <ul className="space-y-3">
                {NAV.map((l) => (
                  <li key={l.id}>
                    <button
                      onClick={() => scrollTo(l.id, -60)}
                      className="ulink text-paper/80 hover:text-paper"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="kicker text-paper/40 mb-5">Контакты</p>
              <ul className="space-y-3 text-paper/80">
                <li>
                  <a className="ulink hover:text-paper" href={contacts.phoneHref}>
                    {contacts.phone}
                  </a>
                </li>
                <li>
                  <a
                    className="ulink hover:text-paper"
                    href={contacts.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    className="ulink hover:text-paper"
                    href={contacts.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Instagram
                  </a>
                </li>
                <li className="text-paper/60 pt-2 leading-snug">
                  {contacts.address},<br />
                  {contacts.addressNote}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-paper/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm">
          <p className="text-paper/50">
            © {year} {host.name} · Ведущая мероприятий
          </p>
          <a
            href={studio.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-paper/60 hover:text-paper transition-colors"
          >
            Разработано в веб-студии{" "}
            <span className="font-semibold text-paper">{studio.name}</span>
            <ArrowUpRight
              size={15}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
