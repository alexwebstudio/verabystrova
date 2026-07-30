import type { Metadata, Viewport } from "next";
import "@fontsource-variable/comfortaa";
import "./globals.css";
import SmoothScroll from "@/providers/SmoothScroll";
import ModalProvider from "@/providers/ModalProvider";
import JsonLd from "@/components/JsonLd";
import { siteConfig } from "@/config/site";

const { url, host } = siteConfig;

const TITLE = "Вера Быстрова — ведущая мероприятий в Караганде";
const DESCRIPTION =
  "Ведущая и режиссёр праздников в Караганде. Свадьбы, юбилеи, корпоративы, выпускные — программа под ваш повод. 15 лет опыта, выезд по Казахстану.";

export const metadata: Metadata = {
  /*
    metadataBase обязателен: от него считаются canonical и абсолютные
    адреса картинок Open Graph. Раньше здесь стоял домен веб-студии —
    из-за этого превью ссылки в мессенджерах вело не на тот сайт.
  */
  metadataBase: new URL(url),

  title: {
    default: TITLE,
    template: `%s — ${host.name}`,
  },
  description: DESCRIPTION,

  keywords: [
    "ведущая мероприятий",
    "ведущая на свадьбу",
    "ведущая корпоративов",
    "ведущая юбилеев",
    "ведущая праздников",
    "организация мероприятий",
    "Вера Быстрова ведущая",
    "ведущая Караганда",
    "тамада Караганда",
  ],

  authors: [{ name: host.name }],
  creator: host.name,
  publisher: host.agency,
  applicationName: host.name,

  alternates: { canonical: "/" },

  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    siteName: host.agency,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${host.name} — ведущая и режиссёр мероприятий в ${host.city}`,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  category: "Организация мероприятий",
  formatDetection: { telephone: true, address: true },
  other: { "geo.region": "KZ-KAR", "geo.placename": host.city },
};

export const viewport: Viewport = {
  themeColor: "#f4f0e8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <link
          rel="preload"
          href="/fonts/display.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* Плеер YouTube подключается только по клику — прогреваем соединение заранее */}
        <link rel="preconnect" href="https://www.youtube-nocookie.com" />
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
        <JsonLd />
      </head>
      <body>
        <SmoothScroll>
          <ModalProvider>{children}</ModalProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
