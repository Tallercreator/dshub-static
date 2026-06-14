# DSHub (static) — хэндофф сессии

Проект-перезапуск старого Rails-сайта DSHub на статике. Онлайн-медиа о дизайн-системах:
кейсы, глоссарий, ресурсы. Дизайн-система в коде по UDF из Figma.

## Координаты
- **Проект:** `~/Documents/dshub_static` (отдельный git-репозиторий, ветка main, коммитим локально)
- **Старый Rails-проект:** `~/Desktop/ДС Хаб/ds_hub` (источник контента для миграции, ещё жив)
- **Стек:** Astro 4.16 (SSG) + React-острова, CSS Modules + дизайн-токены, **без Tailwind**. Деплой — Netlify.
- **Node:** v18.17.1 (поэтому Astro 4, не 5). Позже можно поднять Node 20 + Astro 5.
- **Dev:** `npm run dev` → http://localhost:4321 · **Build:** `npm run build` (сначала генерит токены)
- **Figma file:** key `8iqoWPy7I1bhv2C4AEFHUa`, есть подключённый Figma MCP (читает по fileKey+nodeId)

## Запуск/сборка
```
cd ~/Documents/dshub_static
npm install
npm run dev          # http://localhost:4321
npm run build        # npm run tokens + astro build → dist/
npm run tokens       # генерит src/styles/tokens.css из tokens/dshub-tokens.json
```

---

## Архитектура UDF (снизу вверх)
`Q_` квАрки → `A_` атомы → `M_` молекулы → `O_` организмы → `W_` обёртки → `S_` суперорганизмы → `T_` шаблоны.
**Сквозной нейминг: имя в Figma = имя компонента в коде.** Подробности — `docs/02-udf-system.md`, чек-лист `docs/03-build-checklist.md`.

### Правила (выстраданные — соблюдать!)
1. **Состояния (hover/pressed/disabled) — это CSS, не пропсы.** Пропсы только смысловые (variant/size/selected).
2. **Презентационные компоненты — `.astro` (zero-JS).** Интерактив — React-острова (`client:visible`) ИЛИ лёгкий vanilla `<script>` (как M_CollapseToggle).
3. **Стиль компонента — в `Component.module.css`** рядом, ссылается ТОЛЬКО на semantic-токены (не на сырой core).
4. **Иконки наследуют цвет:** `Q_Icon` имеет scoped `.q-icon { color: inherit }` с `[data-astro-cid]` — у него специфичность (0,2,0), выше обычного класса. **Цвет иконки задавать на РОДИТЕЛЕ** (через `color`), а не классом-конкурентом. (Из-за этого галочка чекбокса была невидимой.)
5. **A_Button нельзя рендерить внутри React-острова** (это .astro). В островах — нативная кнопка со стилями button-токенов.
6. **Иконки в кнопках/тегах — СПРАВА** (`A_Button` contentType `text-righticon`; `A_Tag` иконка после текста). Figma переключили с left на right.
7. Чтобы клик попадал в скрытый `<input>` под визуальной коробкой — `pointer-events: none` на коробке (A_Checkbox).
8. `scrollbar-gutter: stable` на `<html>` — иначе страницы скачут по горизонтали при переходе.

---

## Дизайн-токены
- **Источник правды:** `tokens/dshub-tokens.json` (формат Tokens Studio: `core` примитивы + `semantic` роли с алиасами `{pink.60}`).
- **Генератор:** `scripts/build-tokens.mjs` → `src/styles/tokens.css` (~150+ переменных). core = сырые значения, semantic = `var()` на core (двухуровневость сохранена). **tokens.css в .gitignore — генерируется при build.**
- Правки токенов → в JSON, потом `npm run tokens`.
- Семантика кнопки: `--surface-button/-hover/-pressed/-disabled`, `--surface-cta*`, `--text-on-button*`.
- Состояния квиза: `--surface-success-subtle/-error-subtle`, `--stroke-success/-error`.

## Шрифты (самохостинг, `src/styles/fonts.css`, файлы в `public/fonts/`)
- **base** = `Inter Display` (токен), пока fallback на `Inter` из Google Fonts (в BaseLayout). Inter Display специально не подключён.
- **display** = `Suisse Int'l` — Book(400-450)/Medium(500)/Bold(600-700), сконвертированы из TTF в woff2 (fontTools+brotli).
- **decorate** = `Stapel Condensed` — Medium(500), woff2. Для ghost-текста героя.
- Исходники у пользователя: `~/Desktop/Suisse Int'l` (TTF), `~/Desktop/Stapel` (woff2).

---

## Что построено (всё в `src/components/`)

### КвАрки (`quarks/`)
- **Q_Icon** — инлайн-SVG по имени из реестра `icons.ts` (12 иконок из Figma: chevron-right/down, arrow-left/right, heart, plus, cross-small, check, filter, loupe, rotate-arrows, upright-arrow). Цвет = currentColor, ориентация = CSS transform из Figma (порядок `rotate() scale()` как в Tailwind — иначе несимметричные глифы зеркалятся). Скрипт `scripts/build-icons.mjs` (asset-URL Figma живут ~7 дней). Добавить иконки: расширить ICONS, перезапустить скрипт.
- **Q_Logo** — логотип ДС Хаб, реконструирован инлайн-SVG (скруглённый фон + сетка 2×2 из 3 тёмных + 1 розового квадрата + белая точка + лаймовый росчерк rotate 18.34°). Варианты `lockup` / `icon`.
- **Q_BrandMark** — логотипы компаний из реестра `brands.ts`, файлы в `public/brands/` (otp.svg, sber.svg векторные; alfa/dodo/mts/avito.png растровые). Есть 6 из 17 компаний (Medium-размер). Остальные (Озон, Яндекс, ВК, Касперски, Ростелеком, IVI, Контур, Парадигм, Скиллаз, Нова) — в Figma как Large, добавить тем же способом.

### Атомы (`atoms/`)
A_Text (роли типографики display/h1/h2/title/body/caption/button), A_Button (contentType icon/text/text-righticon/primary/neutral × size sm/md/lg, neutral=XL-пилл, loading), A_Tag (black/white × sm/md, иконка справа), A_CategoryTag («↗ Категория»), A_SegmentItem (таб sm/md/lg, selected), A_Link (подчёркнутый + ↗, hover→лайм), A_Checkbox (нативный input, галочка=Q_Icon check), A_Input (поле с подписью внутри + описание).

### Молекулы (`molecules/`)
M_Segment (контейнер ← A_SegmentItem), M_LogoItem (плитка ← Q_BrandMark, проп `brand`), M_Consent (чекбокс+текст 14px), M_FilterOption (чекбокс+текст 16px), M_MetaRow (label+value), M_FilterChips (сетка ← A_Tag), M_CollapseToggle (текст+шеврон, **кликабельный** через vanilla `<script>`, проп `controls=id` сворачивает целевой блок), M_AppliedFilters («Выбрано:» + чипы + «Сбросить все»), M_QuizOption (React, вариант ответа).

### Организмы (`organisms/`)
- Блоки статьи (для ContentRenderer): O_Heading, O_Paragraph, O_Quote, O_NumberedList, O_SummaryBox, O_Code, O_Links, O_Image, **O_Quiz** (React-остров, single/multiple).
- **O_Header** — ✅ ГОТОВ, в `BaseLayout` на всех страницах. Q_Logo + M_Segment(навигация) + A_Button «Предложить кейс». Sticky, стеклянный фон, активный пункт по URL. Навигация скрыта на ≤1024px (мобильное меню — TODO).
- **O_LogoWall** — ряд из 6 M_LogoItem + XL-кнопка «Смотреть все кейсы» (= Figma W_TitleCards 29:4082).

### Обёртки (`wrappers/`)
- **W_SectionHeader** — заголовок секции (size display/h2/h3, опц. label/A_Link/labelRight). Переиспользуемый.

### Суперорганизмы (`superorganisms/`)
- **S_Hero** — ⚠️ ЧЕРНОВИК, НЕ совпадает с Figma (см. «Текущая задача»).

### Прочее
- `lib/ContentRenderer.astro` — switch по `block.type` → нужный организм (квиз = остров).
- `layouts/BaseLayout.astro` — глобальные стили + шрифты + O_Header.
- `pages/index.astro` — пока styleguide (демо всех компонентов) + S_Hero сверху. Станет T_Home.
- `pages/cases/[slug].astro` — страница кейса (ContentRenderer по blocks). 17 маршрутов.
- `pages/404.astro`.

---

## Контент (мигрирован из Rails → JSON в `src/content/`)
- **Кейсы:** 17 шт (`cases/*.json`). Схема: slug, title, company, dsName, companyType, caseType, caseFormat, focus[], accentColor, cover, sidebar, meta, blocks[]. Скрипт `scripts/migrate-cases.mjs` (HTML-секции → типизированные блоки).
- **Термины:** 121 шт (`terms/*.json`). 31 с определением (подтянуты из старых 32 по нормализованному имени ДС↔DS), **90 пустых** — ждут текста. Скрипт `scripts/migrate-terms.mjs`.
- **Ресурсы:** 24 шт (`resources/*.json`). Скрипт `scripts/migrate-resources.mjs`.
- Блочная схема контента и `ContentRenderer` согласованы с примером одногруппника — `docs/04-content-model.md`. Типы блоков: heading, paragraph, quote, numbered-list, summary, code, links, image, quiz-single, quiz-multiple.

---

## Figma MCP — рабочий процесс
- Тулы `mcp__5f247e1b-..._get_design_context / get_metadata / get_screenshot / get_variable_defs`.
- Вызывать с `fileKey: "8iqoWPy7I1bhv2C4AEFHUa"` + `nodeId` (из URL `node-id=28-3169` → `28:3169`).
- `get_design_context` (excludeScreenshot:true) → React+Tailwind код + asset-URL. Конвертировать в наш стек (CSS Modules + токены), НЕ ставить Tailwind.
- `get_screenshot` → URL, скачать `curl`, прочитать как изображение для сверки.
- **Asset-URL живут ~7 дней.** SVG/PNG скачивать и коммитить сразу.
- Иконки/лого крутятся CSS-обёрткой над общим вектором — повороты НЕ запечены, хранить transform отдельно.

---

## ⚠️ ТЕКУЩАЯ ЗАДАЧА (на чём остановились): починить S_Hero под Figma

Сверка со скриншотом Figma (node **28:3259**) показала: мой `S_Hero` отличается. Надо привести к Figma:

1. **Добавить розовое пухлое сердце** (Q_Illustration) — центральный фокус, по центру сверху. Сейчас его НЕТ. Забрать ассет из Figma (искать ноду Q_Illustration внутри 28:3259 через get_metadata, скачать PNG/SVG в `public/illustrations/`).
2. **Заголовок неверный.** Сейчас «Что внутри систем сегодня» (это заголовок ДРУГОЙ секции — W_SectionHeader 29:3998). **Должно быть: «Лучшие практики дизайн-систем в российских цифровых продуктах»** — H1, внизу слева героя, ~40px display.
3. **Раскладка героя (сверху вниз):** ghost-текст «ДИЗАЙН-СИСТЕМЫ / БЕСТ ПРАКТИС» в верхней зоне (за сердцем) → сердце по центру-сверху → заголовок H1 внизу слева → O_LogoWall (лого-стена) в самом низу. Сейчас у меня ghost по центру вертикально и нет сердца.
4. **Фон:** центр белый с радиальной вуалью к краям, страница светло-серая (neutral-10). Возможно, стоит сделать фон страницы белым (neutral-0) — уточнить.

Файлы героя: `src/components/superorganisms/S_Hero/S_Hero.{astro,module.css}`. Лого-стена `O_LogoWall` и `W_SectionHeader` готовы и переиспользуемы.

---

## Что дальше (после героя)
- Секции Главной: S_CasesSection, S_GlossaryPreview, S_ResourcesSection (← W_SectionHeader + W_CardGrid + карточки O_CaseCard/O_GlossaryCard/O_ResourceCard).
- O_Footer (Q_Logo + M_MetaRow + форма).
- Страницы-списки: `/cases` (сетка + фильтры — O_FilterSidebar из готовых M_FilterChips/M_FilterOption/M_CollapseToggle/M_AppliedFilters), `/glossary` (121 термин + фильтр категорий), `/resources` (фильтр-табы M_Segment).
- Форма «Предложить кейс» → Formspree/Web3Forms (выбран внешний сервис, см. решения).
- Дозаполнить 90 определений терминов.
- Обложки кейсов (Large Q_BrandMark / Q_Illustration).
- Остальные иконы Q_Icon по мере надобности; недостающие Q_BrandMark.
- Мобильное меню в O_Header.

## Принятые решения (зафиксированы)
- Архитектура: **Astro + React-острова** (не SPA).
- Форма: **внешний сервис** (Formspree/Web3Forms).
- Контент: **перенесён в новую JSON-схему**.
- Хостинг: **Netlify** (есть `netlify.toml`).
