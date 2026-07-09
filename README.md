# Вера Быстрова — сайт ведущей мероприятий

Премиальный продающий сайт (Next.js). Тёплый editorial-минимализм, GSAP-анимации,
плавный скролл, заявки уходят в Telegram.

## Стек
Next.js 15 · React 19 · TypeScript · Tailwind CSS v4 · GSAP (ScrollTrigger + SplitText) ·
Lenis · Framer Motion · Lucide Icons. Шрифты вшиты локально (Santa Maria Sans — заголовки,
Comfortaa — текст) — CDN не нужен.

## Patch 1.2 — что нового
- Заявка теперь через **квиз** (5 шагов: тип события → гости → дата → способ связи → контакты).
  В Telegram приходят все ответы квиза.
- **Шрифт заголовков — Santa Maria Sans Black** (`public/fonts/display.woff2`, 28 КБ,
  полная кириллица). Подключён через `@font-face` в `app/globals.css` и preload в `app/layout.tsx`.
  Второстепенный шрифт остался Comfortaa. Лицензия: `public/fonts/COPYRIGHT.txt`
  (© 1994 Gareth Hague / Alias) — перед коммерческим запуском проверь лицензию у правообладателя.
- Блок доверия — 4 карточки с анимацией цифр; «Коротко о главном» — без иконок;
  форматы: свадьбы, юбилеи, корпоративы, выпускные, дни рождения (форумы убраны);
  фотографии показываются сразу в цвете; галерея без подписей; hero переработан под мобильные.
- В «Живых кадрах» слоты 5 и 6 — **видео** (`public/videos/reel-1.mp4`, `reel-2.mp4`).
  Сейчас там плейсхолдеры, инструкция по замене — `public/videos/README.txt`.

### Заменить шрифт заголовков
Положи новый `.woff2` как `public/fonts/display.woff2` — больше ничего менять не нужно.
Если начертание не Black, поправь `font-weight` у `.display` и `.name-mega` в `app/globals.css`.

---

## Запуск

    npm install
    npm run dev      # http://localhost:3000

Продакшн:

    npm run build
    npm start

---

## 1. Telegram — куда падают заявки  (главное)

Открой **config/telegram.ts** и впиши два значения (код менять не нужно):

    export const telegramConfig = {
      BOT_TOKEN: "1234567890:AA....",   // от @BotFather
      CHAT_ID:   "123456789",           // твой id от @userinfobot (или id группы)
    };

- BOT_TOKEN — создай бота у @BotFather, он выдаст токен.
- CHAT_ID — напиши @userinfobot, он пришлёт твой id. Для группы — добавь бота
  в группу админом и возьми id группы.
- Файл помечен server-only — токен виден только на сервере, в браузер не попадает.

Альтернатива — переменные окружения (приоритетнее): TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
(см. .env.example).

Пока токен не вписан, форма не роняет сайт — вежливо попросит написать в мессенджер.

---

## 2. Контакты, соцсети, карта

Всё в одном файле — **config/site.ts**: имя, телефон, Telegram, WhatsApp,
Instagram, адрес и ссылка на карту (mapEmbed).
Карта: Яндекс/Google Maps → «Поделиться» → скопируй ссылку из iframe в mapEmbed.

---

## 3. Замена фотографий

Сейчас стоят плейсхолдеры в public/ (svg). Замени своими:

- public/portrait-hero.svg   — портрет в hero
- public/portrait-about.svg  — фото в блоке «О Вере»
- public/gallery-1…6.svg     — галерея работ
- public/avatar-1…4.svg      — аватары в отзывах

Проще всего положить свои jpg/webp и заменить пути в компонентах
(components/Hero.tsx, About.tsx, Gallery.tsx, Reviews.tsx). Пропорции сохрани.

---

## 4. Тексты и цвет

- Тексты секций — массивы вверху файлов в components/ (легко править).
- Акцентный цвет всего сайта — переменная --color-accent в app/globals.css (@theme).

---

## 5. Деплой

- Vercel — из коробки, заявки работают сразу.
- Netlify — с официальным Next.js Runtime (SSR). Форме нужен серверный роут /api/lead,
  поэтому НЕ используй статический экспорт.

Токен лучше держать в переменных окружения хостинга, а не в коде.

---

Разработано в веб-студии AlexWebStudio · https://alexwebstudio.netlify.app · @sanyamaster200
