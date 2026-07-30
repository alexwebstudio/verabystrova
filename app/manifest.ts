import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.host.agency,
    short_name: siteConfig.host.name,
    description: "Ведущая и режиссёр мероприятий в Караганде",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f0e8",
    theme_color: "#221e1a",
    lang: "ru",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
