/**
 * ─────────────────────────────────────────────────────────────
 *  ОСНОВНОЙ КОНФИГ САЙТА
 *  Здесь меняешь контакты, ссылки и данные ведущей.
 *  Код трогать не нужно — только значения ниже.
 * ─────────────────────────────────────────────────────────────
 *  ВАЖНО: BOT_TOKEN и CHAT_ID лежат отдельно в config/telegram.ts
 *  (их нельзя держать здесь — этот файл попадает в браузер).
 */

export const siteConfig = {
  /*
    Домен сайта. Используется в SEO: canonical, sitemap, Open Graph,
    structured data. При смене домена правится ТОЛЬКО здесь.
  */
  url: "https://verabystrova.site",

  host: {
    name: "Вера Быстрова",
    first: "Вера",
    last: "Быстрова",
    agency: "Агентство праздников Веры Быстровой",
    city: "Караганда",
  },

  contacts: {
    phone: "+7 701 669 1219",
    phoneHref: "tel:+77016691219",

    whatsapp: "https://wa.me/77016691219",
    whatsappLabel: "+7 701 669 1219",

    instagram: "https://www.instagram.com/vera_bystrova_kz",
    instagramLabel: "@vera_bystrova_kz",

    address: "г. Караганда, ул. Гудермеская 45А",
    addressNote: "2 этаж, первая дверь слева",

    // Карта. Замени на свою ссылку из «Поделиться» Яндекс/Google Карт.
    mapEmbed:
      "https://yandex.ru/map-widget/v1/?text=Караганда%2C%20улица%20Гудермеская%2045%D0%90&z=16",
  },

  // Подвал — веб-студия
  studio: {
    name: "AlexWebStudio",
    url: "https://alexwebstudio.netlify.app",
    telegram: "https://t.me/sanyamaster200",
    telegramLabel: "@sanyamaster200",
  },
} as const;

export type SiteConfig = typeof siteConfig;
