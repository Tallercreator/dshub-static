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
9. **Атрибут `hidden` перебивается `display` из классов** (напр. `.card{display:flex}`) — поэтому в base.css есть `[hidden]{display:none!important}`. Любая JS-фильтрация через `el.hidden` полагается на это правило.

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
- **Q_Icon** — инлайн-SVG по имени из реестра `icons.ts` (13 иконок из Figma: chevron-right/down, arrow-left/right, heart, plus, cross-small, check, filter, loupe, rotate-arrows, upright-arrow, **send** — солид-самолётик, fill-иконка). ⚠️ `send` добавлена в icons.ts ВРУЧНУЮ (полный регэн `build-icons.mjs` сейчас падает — asset-URL старых иконок протухли; URL для send занесён в скрипт на будущее). Цвет = currentColor, ориентация = CSS transform из Figma (порядок `rotate() scale()` как в Tailwind — иначе несимметричные глифы зеркалятся). Скрипт `scripts/build-icons.mjs` (asset-URL Figma живут ~7 дней). Добавить иконки: расширить ICONS, перезапустить скрипт.
- **Q_Logo** — логотип ДС Хаб, реконструирован инлайн-SVG (скруглённый фон + сетка 2×2 из 3 тёмных + 1 розового квадрата + белая точка + лаймовый росчерк rotate 18.34°). Варианты `lockup` / `icon`.
- **Q_BrandMark** — логотипы компаний из реестра `brands.ts`, файлы в `public/brands/` (otp.svg, sber.svg векторные; alfa/dodo/mts/avito.png растровые). Есть 6 из 17 компаний (Medium-размер). Остальные (Озон, Яндекс, ВК, Касперски, Ростелеком, IVI, Контур, Парадигм, Скиллаз, Нова) — в Figma как Large, добавить тем же способом.

### Атомы (`atoms/`)
A_Text (роли типографики display/h1/h2/title/body/caption/button), A_Button (contentType icon/text/text-righticon/primary/neutral × size sm/md/lg, neutral=XL-пилл, loading), A_Tag (black/white × sm/md, иконка справа), A_CategoryTag («↗ Категория»), A_SegmentItem (таб sm/md/lg, selected), A_Link (подчёркнутый + ↗, hover→лайм), A_Checkbox (нативный input, галочка=Q_Icon check), A_Input (поле с подписью внутри + описание).

### Молекулы (`molecules/`)
M_Segment (контейнер ← A_SegmentItem), M_LogoItem (плитка ← Q_BrandMark, проп `brand`), M_Consent (чекбокс+текст 14px), M_FilterOption (чекбокс+текст 16px), M_MetaRow (label+value), M_FilterChips (сетка ← A_Tag), M_CollapseToggle (текст+шеврон, **кликабельный** через vanilla `<script>`, проп `controls=id` сворачивает целевой блок), M_AppliedFilters («Выбрано:» + чипы + «Сбросить все»), M_QuizOption (React, вариант ответа), **M_CasePreview** (обложка карточки кейса, 280px; `coverImage` → `<img>`, иначе плейсхолдер-тинт по `accentColor`. ✅ Реальные обложки: `public/covers/<slug>.png` (17/17 из Figma 21:777 + IVI 36:16468, выгружены в **3x = 1170×840** через `download_assets defaultScale:3` — резко на retina; ~600KB/шт, кандидат на webp), в `cover.image` кейсов. Тёмные обложки (8: +IVI) помечены `cover.darkBadge:true` → белый бейдж, см. O_CaseCard), **M_SourceLink** (верх карточки ресурса: A_Tag-тип + источник-ссылка A_Link с ↗ и лайм-hover; источник — настоящая ссылка-СЕСТРА растянутой ссылки карточки (z-index поверх), без вложенных `<a>`).

### Организмы (`organisms/`)
- Блоки статьи (для ContentRenderer): O_Heading, O_Paragraph, O_Quote, O_NumberedList, O_SummaryBox, O_Code, O_Links, O_Image, **O_Quiz** (React-остров, single/multiple).
- **O_Header** — ✅ ГОТОВ, в `BaseLayout` на всех страницах. Q_Logo + M_Segment(навигация) + A_Button «Предложить кейс». Sticky, сплошной белый фон (Surface/card, без стекла — сливается с белым первым экраном; серый Surface/page — только у пилюли M_Segment), активный пункт по URL. Навигация скрыта на ≤1024px (мобильное меню — TODO).
- **O_LogoWall** — ряд из 6 M_LogoItem + XL-кнопка «Смотреть все кейсы» (= Figma W_TitleCards 29:4082).
- **O_FilterSidebar** — ✅ ГОТОВ (вёрстка), сайдбар фильтров Кейсов (Figma 32:4717): M_FilterChips (companyType, 5 чипов) → W_FilterGroup «Тип кейса» (caseType) → W_FilterGroup «Фокус» (focus-теги ≥2) → «Сбросить все». Содержимое — из данных кейсов (в Figma плейсхолдеры). data-атрибуты заложены под клиентскую фильтрацию (пока НЕ фильтрует).
- **O_Footer** — ✅ ГОТОВ, футер (Figma 31:7823). Глобальный (в `BaseLayout` после `<slot>`, на всех страницах). Белый фон + лаймовый градиент снизу + пухлые 3D-буквы «ДС хаб» (картинка `public/illustrations/footer-dshub.png`, object-fit cover, anchored низ через object-position) + описание медиа (слева) + 2× M_MetaRow (Куратор/Автор, справа, пропы `curator`/`author`). ⚠️ Картинка 686KB — кандидат на оптимизацию (webp).
- **O_CaseCard** — ✅ ГОТОВ, карточка кейса (Figma 29:3736). M_CasePreview + бейдж `companyType` (A_Tag, поверх обложки; проп `badgeVariant` black/white — white на тёмных обложках по `cover.darkBadge`, тёмные определены анализом яркости зоны бейджа) + теги `focus[]` (A_CategoryTag, до 2) + заголовок (Suisse Book 20). **Паттерн «растянутой ссылки»:** карточка = `<article>`, на кейс ведёт только заголовок (.titleLink), его `::after` растянут на всю карточку. Сделано ради будущих тегов-фильтров (без вложенных `<a>`) и чище для скринридеров (имя ссылки = заголовок). Hover-подъём, focus-visible на всю карточку. Пропы: href/title/label/focus/accentColor/coverImage.
  - ✅ **Теги `focus[]` — ссылки-фильтры:** ведут на `/cases?focus=<значение>` (A_CategoryTag href + `.cats` z-index поверх растянутой ссылки). Страница `/cases` читает `?focus=` и предвыбирает фильтр. Работает для любого тега (редкие, без чекбокса в сайдбаре, фильтруют через `extraFocus` + показываются в баре «Выбрано»).
- **O_ResourceCard** — ✅ ГОТОВ, карточка ресурса (Figma 30:4664/4665). `size`: **large** (span 2 — Label-тип + заголовок слева, обложка-картинка справа) / **medium** (M_SourceLink сверху + заголовок снизу + декоративная иллюстрация фоном). Маппинг: Label=`type`, источник=`source`+`url`, заголовок=`title`. Вся карточка — внешняя ссылка на `url` (растянутая ссылка, target=_blank). Обложки/иллюстрации — плейсхолдеры, зальём через `coverImage`.
- **O_TermCard** — ✅ ГОТОВ, карточка термина глоссария (Figma O_CardTerms 29:4297). Варианты `variant`: **lime** (лёгкие термины), **pink** (сложные), **image** (конкретные компоненты — слот под иллюстрацию, заливаем картинкой позже через проп `image`). Hover = CSS (subtle-градиент → solid: pink→`--surface-accent` белый текст, lime→`--surface-accent2` тёмный текст; image → `--surface-inverse` тёмный фон). Иконка `send` (солид-самолётик) сверху-справа, заголовок Suisse Book 24, описание Inter 16. Растянутая ссылка (как O_CaseCard). Пропы: variant/term/definition/href/image.

### Обёртки (`wrappers/`)
- **W_SectionHeader** — заголовок секции (size display/h2/h3, **align left/center**, опц. label/A_Link/labelRight). Переиспользуемый.
- **W_CardGrid** — адаптивная сетка карточек (Figma 29:3840): desktop 3 кол / ≤1024 2 / ≤640 1, gap 24. Контент слотом.
- **W_TermsGrid** — ряд из 4 равных карточек терминов (Figma 30:4445): desktop 4 кол / ≤1024 2 / ≤640 1, gap 24. Контент слотом.
- **W_ResourcesGrid** — бенто-сетка ресурсов (Figma 30:4839): 3 кол, ряды по 280px, gap 24; карточка size=large занимает 2 кол (`grid-column: span 2`). ≤1024 2 кол / ≤640 1. Контент слотом.
- **W_FilterGroup** — группа фильтра в сайдбаре Кейсов (Figma 32:4408): заголовок (Suisse 20) + список M_FilterOption (слотом).
- **W_PageContainer** — белый контейнер + панель-слот. Проп **`type`**: `linear` (Figma 31:5789 — градиент neutral/10→white + скруглённый верх 48px, «наезжает» на герой, первая секция) / `solid` (Figma 31:5967 — плоский белый, последующие секции) / `solid-gray` (Figma 31:7326 — серая панель surface/page, скругление 48 по всем углам, отдельный блок: ресурсы). Оборачивает секции Главной.

### Суперорганизмы (`superorganisms/`)
- **S_PageHero** — ✅ ГОТОВ, переиспользуемый хедер-полоса раздела (Figma S_hero 34:7335 + O_LogoWall type=Cases). Ghost-текст раздела (Stapel 308px, opacity 0.08) + белая радиальная вуаль + центральная иллюстрация. Пропы: `ghostLines[]`, `illustration`, `illustrationAlt`. На /cases: «Кейсы Кейсы Кейс» ×2 + `switch-green.png`. Для /glossary, /resources — свой ghost + иллюстрация.
- **S_CasesGrid** — ✅ ГОТОВ, основная зона страницы Кейсов (Figma 34:7336): full-width белый фон + O_FilterSidebar (320px) + результаты (M_AppliedFilters «Выбрано» + счётчик + W_CardGrid cols=2). **Фильтрация рабочая** (vanilla `<script>`): чипы companyType + чекбоксы caseType/focus → AND между группами, OR внутри; счётчик/бар/URL (`?company=&type=&focus=`) синхронятся; «Сбросить все» (сайдбар и бар); удаление чипа ×; чтение `?focus=` на загрузке; пустое состояние. H1 «Кейсы» — sr-only. Инжект-чипы бара стилизованы глобально (`.js-applied-chip`).
- **S_Hero** — ✅ ГОТОВ, сверен с Figma (28:3259). Слои (z снизу вверх): белый фон → ghost-band (Stapel 308px, opacity 0.07) → радиальная белая вуаль → пухлое сердце (`public/illustrations/heart.png`) → контент (H1 внизу слева + O_LogoWall). O_Header в герой НЕ входит — он глобальный sticky в BaseLayout (в Figma шапка внутри фрейма), поэтому вертикаль строим пропорциями (clamp), не пиксельными top.
- **S_Form** — ✅ ГОТОВ (вёрстка), форма «Предложить кейс» (Figma 30:5338). Центр-заголовок (Suisse 48) + `<form>` (343px): A_Input ×4 (Ваше имя/Telegram/Другой контакт/Название компании) + M_Consent + A_Button submit «Отправить заявку». По бокам декоративные иллюстрации `form-lime.png`/`form-pink.png` + мягкие свечения (CSS-радиалы lime/pink, по Figma-обновлению 30:5338), скрыты ≤1024. Секция **full-bleed** (рендерится напрямую в index, НЕ в W_PageContainer) — чтобы иллюстрации были полностью в кадре у краёв и не обрезались паддингом контейнера. **A11y:** подпись поля = placeholder + `aria-label`. **Отправка ✅ подключена → Telegram** через Netlify Function `netlify/functions/submit-case.mjs` (токен бота — секрет в env функции, не в клиенте). Форма шлёт AJAX (vanilla `<script>`), honeypot-поле от ботов, инлайн-статус (pending/ok/error, aria-live). **Нужно для работы:** задать `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` в env (Netlify UI на проде; `.env` + `netlify dev` локально — см. `.env.example`). В `astro dev` функции нет → форма покажет ошибку (это норма). **TODO:** «обработку персональных данных» — пока подчёркнутый span, сделать ссылкой на политику (M_Consent — `<label>`, выносить аккуратно, чтобы клик не переключал чекбокс).
- **S_ResourcesSection** — ✅ ГОТОВ, секция ресурсов Главной (Figma 30:4991). W_SectionHeader («Ресурсы» + подпись справа `labelRight`) + W_ResourcesGrid (бенто: 1 large + 4 medium) + кнопка «Перейти к разделу ›». Принимает `items[]` ({type, title, source, url, coverImage}); первая карточка — large. В `W_PageContainer type="solid-gray"`. Обложки/иллюстрации зальём позже.
- **S_TermsSection** — ✅ ГОТОВ, секция глоссария Главной (Figma S_TermsSection 30:4487). W_SectionHeader («Глоссарий» + подпись + «Перейти к разделу ↗») + W_TermsGrid из O_TermCard. Принимает готовые карточки `items[]` ({term, definition, variant, href, image}); в `W_PageContainer type="solid"`. **TODO маппинг:** в данных терминов нет поля сложности — на Главной варианты карточек заданы явно (демо `['pink','image','lime','pink']`). Нужно решить: lime=лёгкий / pink=сложный (поле `level`?), image=компонент (поле `visualType`?).
- **S_CasesSection** — ✅ ГОТОВ, секция кейсов Главной (Figma S_CasesSection 32:6734). Центрированный W_SectionHeader («Что внутри систем сегодня») + W_CardGrid из O_CaseCard. Пропы: `cases[]`, `limit` (по умолч. 6), `offsetFirst` (пустая первая ячейка-спейсер → «лесенка» как в Figma: верхний ряд 2 карточки, нижний 3; спейсер только на desktop, на ≤1024 убирается). На Главной: `limit=5 offsetFirst`. Ширина 1212, центрирована. На Главной обёрнута в W_PageContainer. **Обложки — плейсхолдеры по accentColor; реальные картинки зальём позже в `cover.image`** (проп `coverImage` уже проброшен по цепочке).

### Прочее
- `lib/ContentRenderer.astro` — switch по `block.type` → нужный организм (квиз = остров).
- `layouts/BaseLayout.astro` — глобальные стили + шрифты + O_Header.
- `pages/index.astro` — ✅ чистая Главная (T_Home): S_Hero → S_CasesSection → S_TermsSection → S_ResourcesSection → S_Form (+ глобальные O_Header/O_Footer из BaseLayout). Styleguide убран (был временный демо-каркас).
- `pages/cases/index.astro` — ✅ ГОТОВА, страница списка Кейсов (T_Cases 34:7599): S_PageHero + S_CasesGrid (сайдбар+сетка, **фильтрация рабочая**) + S_Form. Фасеты фильтров из данных. Чипы companyType = Medium 40px.
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

## ✅ ЗАВЕРШЕНО: S_Hero приведён к Figma (28:3259)

Сделано: добавлено пухлое сердце (`public/illustrations/heart.png`, 234×246 1x), H1 заменён на «Лучшие практики дизайн-систем в российских цифровых продуктах», ghost-band + радиальная вуаль, фон героя — белый (neutral-0). Сверено скриншотами Figma vs dev — совпадает.

### Принятые решения и находки (важно для дальнейшей вёрстки)
1. **Нейминг O_LogoWall — осознанное отклонение от «Figma=код».** В Figma `28:2793` назван `O_LogoWall` (= ghost-фон), а ряд логотипов+CTA назван `W_TitleCards` (`29:4082`). В коде наоборот: наш `O_LogoWall` = ряд логотипов (семантически «стена логотипов» — точнее, чем у Figma). Оставлено как есть; ghost-фон — инлайн внутри S_Hero (нигде не переиспользуется).
2. **⚠️ Шкала размеров Figma ≠ наша шкала токенов.** Figma `size/4xl` = **32px**, а наш `--font-size-4xl` = **48px** (32px у нас = `--font-size-2xl`). При переносе из Figma ВСЕГДА сверять числовое значение, а не имя ступени.
3. **⚠️ Разрыв типо-ролей `A_Text` ↔ текст-стили Figma (для аудита design-system).** Напр. Figma «Heading/H2» = Suisse Int'l **Book 32px** (tracking −0.04em), а наш `A_Text.h2` = Inter **semibold 40px**. Ни один вариант A_Text не даёт «Suisse Book 32px», поэтому H1 героя отрисован локальным классом `.title` (исключение для display-приёма). Нужен аудит: сверить варианты A_Text с текст-стилями Figma и согласовать.
4. **Сердце 1x (234px при показе 226px).** Figma отдаёт ноду в натуральном размере, апскейл недоступен. На retina чуть мягкое — при необходимости перезалить 2x (export/download_assets из Figma).
5. Tracking display-заголовков (−0.04em) — токена нет, задан литералом (как в ghost). Кандидат на новый токен при аудите.
6. **Единая сетка-контейнер: `max-width: 1440px` + `padding-inline: var(--layout-xs)` (32px) + `margin-inline: auto`.** Так выровнены O_Header (`.inner`) и S_Hero (`.content`): лого↔H1 по левому краю, CTA шапки↔CTA лого-стены по правому. **Все секции Главной верстать в этом же контейнере** (кандидат на общий токен `--container-max` / утилиту при следующем заходе).

Файлы: `src/components/superorganisms/S_Hero/S_Hero.{astro,module.css}`.

---

## Что дальше (после героя)
- ✅ Главная собрана и причёсана (T_Home): S_Hero → S_CasesSection → S_TermsSection → S_ResourcesSection → S_Form + глобальные O_Header/O_Footer. Styleguide-каркас убран из index.astro.
- ✅ Обложки кейсов выгружены (**17/17**, `public/covers/`, 3x 1170×840, в `cover.image`; 8 тёмным проставлен `darkBadge`). При желании — конвертация covers в webp (сейчас ~10MB PNG).
- **Обложки/иллюстрации ресурсов:** залить картинки (large — обложка справа, medium — декоративная иллюстрация фоном) через `coverImage` в `resources/*.json`.
- ✅ Форма «Предложить кейс»: отправка в Telegram через Netlify Function (см. S_Form). Осталось: задать env-секреты (`TELEGRAM_BOT_TOKEN`/`TELEGRAM_CHAT_ID`) и протестировать на проде/`netlify dev`. Кнопка «Предложить кейс» в шапке (`#share-case`) должна скроллить к форме (сейчас просто якорь).
- **Решение зафиксировано:** форма → **Telegram-бот** (а не Formspree/Web3Forms) через бессерверную Netlify Function `submit-case`.
- **Глоссарий — маппинг term→variant:** решить, как определять lime (лёгкий) / pink (сложный) / image (компонент). Кандидат: поле `level: easy|complex` + `visualType: component` в `terms/*.json`. Пока на Главной заданы вручную для демо.
- **Страница `/glossary`** — 121 термин + фильтр категорий (туда ведут карточки и «Перейти к разделу»).
- **Обложки кейсов: залить картинки в высоком качестве** → добавить поле `cover.image` в `cases/*.json`; O_CaseCard/M_CasePreview уже принимают `coverImage` и заменят плейсхолдер на `<img>`. Бейдж карточки = `companyType` (решение).
- O_Footer (Q_Logo + M_MetaRow + форма).
- Страницы-списки: ✅ `/cases` (сетка + рабочие фильтры) готова. Осталось: `/glossary` (121 термин + фильтр категорий), `/resources` (фильтр-табы M_Segment). Для их хедеров — переиспользовать S_PageHero (свой ghost + иллюстрация).
  - ✅ `/cases` читает `?focus=<тег>` и предвыбирает фильтр + фильтрует выдачу (целевая ссылка тегов focus[] из O_CaseCard — реализовано).
- Форма «Предложить кейс» → Formspree/Web3Forms (выбран внешний сервис, см. решения).
- Дозаполнить 90 определений терминов.
- Остальные иконы Q_Icon по мере надобности; недостающие Q_BrandMark.
- Мобильное меню в O_Header.

## Принятые решения (зафиксированы)
- Архитектура: **Astro + React-острова** (не SPA).
- Форма: **Telegram-бот** через бессерверную **Netlify Function** (`submit-case`). Токен — секрет в env.
- Контент: **перенесён в новую JSON-схему**.
- Хостинг: **Netlify** (есть `netlify.toml`).
