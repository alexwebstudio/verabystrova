import { siteConfig } from "@/config/site";

/*
  Микроразметка Schema.org (JSON-LD).

  Осознанно НЕ добавлены aggregateRating и review: на сайте нет
  настоящих отзывов, а разметка несуществующих оценок — прямое
  нарушение правил Google и повод для санкций. Появятся реальные
  отзывы — тогда и добавим.
*/
export default function JsonLd() {
  const { url, host, contacts } = siteConfig;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        url,
        name: host.agency,
        inLanguage: "ru-RU",
        publisher: { "@id": `${url}/#person` },
      },
      {
        "@type": "Person",
        "@id": `${url}/#person`,
        name: host.name,
        givenName: host.first,
        familyName: host.last,
        jobTitle: "Ведущая и режиссёр мероприятий",
        description:
          "Ведущая и режиссёр праздников в Караганде: свадьбы, юбилеи, корпоративы, выпускные и дни рождения по индивидуальной программе.",
        url,
        image: `${url}/og-image.jpg`,
        telephone: contacts.phone,
        sameAs: [contacts.instagram],
        knowsLanguage: "ru",
        worksFor: { "@id": `${url}/#business` },
      },
      {
        "@type": "EntertainmentBusiness",
        "@id": `${url}/#business`,
        name: host.agency,
        url,
        image: `${url}/og-image.jpg`,
        telephone: contacts.phone,
        priceRange: "$$",
        currenciesAccepted: "KZT",
        address: {
          "@type": "PostalAddress",
          streetAddress: "ул. Гудермеская, 45А",
          addressLocality: host.city,
          addressCountry: "KZ",
        },
        areaServed: [
          { "@type": "City", name: host.city },
          { "@type": "Country", name: "Казахстан" },
        ],
        founder: { "@id": `${url}/#person` },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Форматы мероприятий",
          itemListElement: [
            "Ведущая на свадьбу",
            "Ведущая на юбилей",
            "Ведущая корпоратива",
            "Ведущая выпускного",
            "Ведущая на день рождения",
          ].map((name) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name, provider: { "@id": `${url}/#business` } },
          })),
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
