# RESUME — точка входа после очистки чата

Краткий контекст, чтобы продолжить работу с нуля. Полная история компонентов и
решений — в [SESSION-HANDOFF.md](./SESSION-HANDOFF.md). Здесь — состояние + **текущая
задача**.

## Где мы сейчас (что готово)
Сайт DSHub (Astro 4 SSG + React-острова, CSS Modules + токены, без Tailwind). Собрано:
- **Главная** (`src/pages/index.astro`): S_Hero → S_CasesSection → S_TermsSection →
  S_ResourcesSection → S_Form. Глобальные O_Header (sticky, белый) + O_Footer (BaseLayout).
- **Страница кейсов** `/cases` (`src/pages/cases/index.astro`): S_PageHero + S_CasesGrid
  (фильтр-сайдбар + сетка) + S_Form. **Фильтры рабочие** (vanilla JS: чипы/чекбоксы,
  счётчик, бар «Выбрано», сброс, URL `?company/type/focus`, `?focus=` предвыбор).
- **Форма «Предложить кейс»** → Telegram через Netlify Function `netlify/functions/submit-case.mjs`
  (токен в env, не в коде). Локально: `.env` (gitignored) + `netlify dev`. Бот @formfordshubbot.
- **Обложки кейсов**: 17/17 в `public/covers/<slug>.png` (3x, 1170×840), прописаны в
  `cover.image`. 8 тёмных помечены `cover.darkBadge:true` → белый бейдж (проп `badgeVariant`).
- Контент: 17 кейсов, 121 термин (31 с определением), 24 ресурса — JSON в `src/content/`.

### Git
- Закоммичено до `a47b8aa` (Главная + страница кейсов). Рабочее дерево было чистым.
- ⚠️ **`.env` с токеном бота — в .gitignore, НЕ коммитить.** `.claude/settings.local.json` тоже.
- `src/styles/tokens.css` — генерируется (`npm run tokens`), gitignored.

### Запуск / превью
- `npm run dev` → http://localhost:4321. Превью-сервер заведён в `.claude/launch.json`.
- Скриншот-тул превью капризный (мельчит/скейлит) — **проверять числа через `getComputedStyle`/
  `getBoundingClientRect`**, а не только глазами. Для скрина секции в самом низу — приём «спрятать
  соседей»: `[...document.body.children].forEach(el=>{if(el!==target)el.style.display='none'})`.

## ТЕКУЩАЯ ЗАДАЧА: страница кейса T_CasePage
Figma: `node-id=34-4960` (символ **T_CasePage** на странице Template `34:4169`).
Страница длинная (1440×**4766**) и формируется из JSON кейса.

### ⚠️ Важно по процессу
- **`get_design_context` всей страницы ТАЙМАУТИТ** (слишком большой узел). Символы темплейтов
  не раскрывают детей в `get_metadata`. Поэтому:
- **Договорённость с пользователем: он присылает компоненты ПО ОДНОМУ** (ссылка на ноду) →
  верстаем 1:1, сверяем скриншотом → следующий → в конце собираем всю страницу.

### Структура страницы (сверху вниз, по обзорному скриншоту)
1. **Hero** — ghost-текст имени бренда (как S_PageHero) + крупная иллюстрация бренда по центру.
2. **Заголовок H1** + **мета-сайдбар слева** (Тип компании / Формат / фокус-теги / источники и т.п.).
3. **Контент-блоки** из JSON (`ContentRenderer`): paragraph, heading, numbered-list, summary, quote, code, links, image, quiz.
4. **«К следующему кейсу»** — CTA-карточка (розовая, со стрелкой).
5. **«По совету эксперта»** — рекомендация ресурса (≈ O_ResourceCard).
6. **«Термины из кейса»** — ряд карточек терминов (≈ O_TermCard / W_TermsGrid).
7. **S_Form** «Хотите поделиться своим кейсом?» + **O_Footer**.

### Что переиспользуем (НЕ верстать заново)
- `ContentRenderer` (`src/lib/ContentRenderer.astro`) + блок-организмы `O_Heading/O_Paragraph/
  O_Quote/O_NumberedList/O_SummaryBox/O_Code/O_Links/O_Image/O_Quiz` — все есть. Стиль блоков
  сверить с макетом, поправить при расхождении.
- `S_PageHero` (пропы `ghostLines[]`, `illustration`, `illustrationAlt`).
- `O_TermCard` (variant pink/lime/image), `O_ResourceCard` (size large/medium).
- `S_Form`, `O_Footer` — готовы/глобальны.

### Вероятно новое (соберём по присланным макетам)
- Мета-сайдбар кейса (можно назвать напр. `O_CaseMeta` / `W_CaseSidebar`).
- CTA «К следующему кейсу» (`O_NextCase` / похоже на O_CaseCard, но горизонтальная розовая).
- Шаблон сборки `T_Case` → переписать `src/pages/cases/[slug].astro` (сейчас он базовый:
  только заголовок + ContentRenderer, помечен «следующая волна»).

### Схема JSON кейса (поля для сайдбара/hero)
`slug, title, company, dsName, companyType, caseType, caseFormat, focus[], accentColor,
cover{brandWordmark,bg,image,darkBadge?}, sidebar{focus,speakerRole,artifacts}, meta{readingTime},
published, blocks[]`. Пример: Додо — 53 блока (heading, numbered-list, paragraph, quote, summary).

### Прочие темплейты (на потом, та же страница Template)
T_Cases `34:7599` (✅ готов), T_Resources `36:7507`, T_Glossary `36:14854`, T_Term `36:15116`,
T_MainPage `36:4495`. Для их hero — переиспользовать `S_PageHero`.

## Правила проекта (выстраданные — соблюдать)
- Имя в Figma = имя в коде. Состояния (hover/pressed) = CSS, не пропсы. Стиль — в `*.module.css`,
  ТОЛЬКО semantic-токены. Презентационное — `.astro` (zero-JS); интерактив — острова или vanilla `<script>`.
- Шкала Figma ≠ наша: Figma `size/4xl`=32px, у нас `--font-size-4xl`=48px (32px = `--font-size-2xl`).
  Сверять ЗНАЧЕНИЕ, а не имя ступени.
- `[hidden]{display:none!important}` в base.css (иначе `display` из классов перебивает hidden).
- Обложки/иллюстрации тянуть рендером ноды (`get_screenshot`) или `download_assets defaultScale:3`
  (высокое качество). Сырые asset-URL из get_design_context часто = маски, не финальный рендер.
- Единая сетка-контейнер: `max-width:1440 + padding-inline:var(--layout-xs)(32) + margin auto`.
