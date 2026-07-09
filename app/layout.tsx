import type { Metadata, Viewport } from "next";
import "@fontsource-variable/comfortaa";
import "./globals.css";
import SmoothScroll from "@/providers/SmoothScroll";
import ModalProvider from "@/providers/ModalProvider";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Вера Быстрова — ведущая и режиссёр мероприятий в Караганде",
  description:
    "Агентство праздников Веры Быстровой в Караганде. Свадьбы, юбилеи, корпоративы, выпускные и дни рождения под авторский сценарий. Оставьте заявку — узнайте, свободна ли ваша дата.",
  keywords: [
    "ведущая",
    "ведущая на свадьбу",
    "ведущая Караганда",
    "ведущий мероприятий",
    "Вера Быстрова",
  ],
  openGraph: {
    title: "Вера Быстрова — ведущая мероприятий",
    description:
      "Вечер, который помнят не по фото, а по ощущению. Свадьбы, юбилеи, корпоративы.",
    type: "website",
    locale: "ru_RU",
  },
  metadataBase: new URL(siteConfig.studio.url),
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
      </head>
      <body>
        <SmoothScroll>
          <ModalProvider>{children}</ModalProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
