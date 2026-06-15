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

## ✅ T_CasePage СОБРАН (2026-06-14) — `src/pages/cases/[slug].astro`
Figma: `node-id=34-4960`. Сборка: **S_PageHero** (ghost-имя бренда + иллюстрация) →
**S_CaseArticle** → **S_Form** (+ глобальные O_Header/O_Footer). Build зелёный, 17/17 маршрутов.

**Что сделано (1:1 с Figma, сверено скриншотами):**
- **Hero** = переиспользован `S_PageHero`: ghost = `company`×3 в 2 строки, иллюстрация =
  `/brand-illustrations/<brandKey>.png`. ⚠️ Пока выгружен **только `dodo.png`** (495×516, 3x);
  остальные 16 → fallback `switch-green.png`. Дозалить бренд-иллюстрации (Q_BrandMark Large из Figma).
- **W_ArticleLayout** (`wrappers/W_ArticleLayout`, Figma 34:3304) — 2 колонки в контейнере
  `width:min(1160px, 100%-64px)` центр: сайдбар **300px** (`M_CaseMeta`, **sticky** `top:88px`) +
  gap **64** + контент **796px**. H1 = Suisse Bold 48. Слот `footer` (в контент-колонке).
  На ≤900px колонки складываются, сайдбар становится `static`.
- **M_CaseMeta** (`molecules/M_CaseMeta`, Figma 34:2964) — мета-сайдбар: верх = кнопка «назад»
  (ТОЛЬКО стрелка `‹`, серая `neutral-20`, chevron-right + `rotate(180deg)`) + чёрный тег темы
  (`A_Tag black`, = `companyType`); поля Фокус кейса/Артефакты в кейсе/Роль эксперта (label
  `text-disabled` 14 + value `text-primary` 14, ← `kase.sidebar.{focus,artifacts,speakerRole}`,
  пустые скрыты); низ = кнопка **«Поделиться кейсом»** (серая + иконка `link`, vanilla `<script>`:
  Web Share API → иначе `clipboard.writeText` + фидбэк «Ссылка скопирована»).
  ✅ sidebar-поля **дозаполнены во всех 17 кейсах** (focus/artifacts у всех; speakerRole — у
  интервью; у открытых кейсов speakerRole=null → поле скрыто). Тексты синтезированы из контента
  кейсов (ресёрч сабагентами) и отредактированы. Стиль: строчные, через запятую, как у Dodo.
  Иконка **`link`** добавлена в `icons.ts` вручную (Figma link_line_16x16, node 15:2541).
- **S_CaseArticle** (`superorganisms/S_CaseArticle`, Figma 34:4174) = W_ArticleLayout + ContentRenderer
  + в `footer`: W_NextCase / W_ResourceExpert / W_CaseTerms (все в контент-колонке 796, как в Figma-фрейме).
- **Блок-организмы выровнены по Figma:** O_Quote (серая плашка `surface-page` + лаймовая верхняя
  граница 2px, radius 12, p24, Inter Medium **italic** 16, опц. title/author) · O_Paragraph (Inter 16
  reg, text-secondary, lh1.4) · O_SummaryBox (серый бокс `surface-page` radius24 p24 + нумер. список) ·
  O_NumberedList (нумер. список) · O_Heading (Suisse Bold, H2=32/H3=24).
- **W_NextCase** (`wrappers/W_NextCase`, Figma 34:4749) — серая плашка radius24 p24 шир.796, цветное
  свечение в правом нижнем углу (variant **pink**|lime, CSS-радиал), kicker «К следующему кейсу:»
  (Suisse 32) + теги фокуса (A_CategoryTag) + заголовок след. кейса + тёмная кнопка «Перейти»
  190×110 (Q_Icon `send`). Вся карточка — ссылка. Данные: следующий кейс по порядку (с зацикливанием).
- **W_ResourceExpert** (`wrappers/W_ResourceExpert`, Figma 36:16755) = заголовок «По совету эксперта:»
  (Suisse 32) + 1× `O_ResourceCard size=medium`. Ресурс выбирается по пересечению тегов с `focus[]`.
- **W_CaseTerms** (`wrappers/W_CaseTerms`, Figma 36:12486) = заголовок «Термины из кейса:» + сетка
  `O_TermCard` (auto-fill minmax 232 → 3 в колонке 796), варианты pink/lime по очереди. До 3 терминов:
  `relatedCases`==slug, иначе термины с определением.

### ⚠️ ДОРАБОТАТЬ (данные/контент, не вёрстка)
- **Бренд-иллюстрации героя** для 16 кейсов → `public/brand-illustrations/<brandKey>.png` (Q_BrandMark Large).
- ~~`sidebar.{focus,artifacts,speakerRole}`~~ ✅ дозаполнены во всех 17 кейсах.
- **numbered-list: title+описание склеены в одну строку** в данных миграции (напр. «…токеновВ базовой…»).
  Надёжно не разделить (iOS/GitHub). Сейчас рендерим как читаемый абзац 16px. Двухуровневый Figma-вид
  (жирный заголовок 20 + описание 16) включится, когда данные станут `{title, text}` — задача доразметки.
- **Связь кейс↔термины/ресурс** сейчас эвристика (теги/наличие определения). Можно завести явные поля.
- Скриншот-тул превью капризничает на dpr2/после reload (мельчит) — viewport сбрасывается в нативные
  318px; **перед скрином всегда `preview_resize 1280×900` и сверять числа через `getBoundingClientRect`**.

## (архив задачи) исходная структура T_CasePage
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

### ✅ T_Resources собран (2026-06-14) — `src/pages/resources/index.astro`
Figma `36:7507`. Сборка: **S_PageHero** (ghost «Ресурсы» + жёлтая звезда
`/illustrations/star-yellow.png`, выгружена кропом из рендера, native 1x как heart) →
**W_PageContainer type=solid-gray** (серая панель radius 48) → **S_ResourcesGrid** → **S_Form**.
- **S_ResourcesGrid** (`superorganisms/S_ResourcesGrid`) — центрированные фильтр-табы по типу
  (`M_Segment` + `A_SegmentItem`: Все/Статьи/Сайты/Видео, по данным) + бенто-сетка
  `W_ResourcesGrid` из `O_ResourceCard` (large = span 2 на каждой 5-й позиции `i%5`, иначе medium).
  Фильтрация — vanilla `<script>`: клик по табу → `aria-current` + `card.hidden` по `data-type`,
  пустое состояние. Активный таб (белая пилюля) — глобальный `!important` по `[aria-current=page]`
  (перебивает scoped A_SegmentItem). `grid-auto-flow:row dense` в W_ResourcesGrid подбивает пропуски.
- Правки переиспользуемого: `O_ResourceCard` теперь спредит `...rest` (для `data-type`).
- ⚠️ Обложки/иллюстрации ресурсов НЕ залиты → large-карточки показывают серый плейсхолдер cover,
  medium — пустую зону иллюстрации. Залить через `coverImage` в `resources/*.json` (как и на Главной).

### ✅ T_Glossary собран (2026-06-14) — `src/pages/glossary/index.astro`
Figma `36:14854`. Сборка: **S_PageHero** (ghost «Глоссарий» + зелёная галочка
`/illustrations/check-green.png`, кроп из рендера) → **S_GlossaryGrid** → **S_Form**.
- **S_GlossaryGrid** (`superorganisms/S_GlossaryGrid`) — зеркалит S_CasesGrid, но фасет один —
  **категория**. Слева sticky-сайдбар: `W_FilterGroup «Категория»` + `M_FilterOption` (12 категорий
  из данных, со счётчиками) + «Сбросить все». Справа: бар «Выбрано:» (`M_AppliedFilters` + чипы) +
  счётчик «Найдено N терминов» + `W_CardGrid cols=3` из `O_TermCard`. **121 термин** (все, не только
  с определениями; пустые показывают только заголовок). Фильтрация — vanilla `<script>` (мультивыбор
  категорий, OR, чипы, URL `?category=`, как на /cases). `.js-applied-chip` глобальные стили
  продублированы (на /glossary нет S_CasesGrid).
- **Маппинг term→variant РЕШЁН** (`termVariant(category)`): **lime** — «Компонент · *» / Инструменты /
  Команда (прикладное); **pink** — Архитектура/Процесс/Инфраструктура/Метрики/Термины DS (абстрактное).
  `image` НЕ используем (нет иллюстраций). Вышло lime 51 / pink 70. ⚠️ На Главной S_TermsSection всё
  ещё хардкодит варианты — можно перевести на этот же хелпер.
- Правка переиспользуемого: `O_TermCard` теперь спредит `...rest` (для `data-category`).
- ⚠️ Карточки терминов href = `/glossary` (self, дефолт) — детальной страницы термина пока нет.
  Когда соберём **T_Term `36:15116`** → проставить `href={/glossary/<slug>}` + завести маршрут.

### ✅ T_Term собран (2026-06-14) — `src/pages/glossary/[slug].astro`
Figma `36:15116`. **121 маршрут** (Cyrillic-slug'и работают). Сборка:
- **S_TermHero** (`superorganisms/S_TermHero`) — кнопка «назад» (стрелка) + ghost-имя термина +
  H1 + ряд из 3 фактов: **Определение** (check) / **Для чего нужен** (heart) / **Где используется**
  (loupe). Пустые факты скрыты.
- **«Взято из кейса»** — `O_CaseCard` по `relatedCases` (имена компаний → slug кейса через карту
  `CASE_BY_NAME` в `[slug].astro`).
- **«Проверь себя»** — `O_Quiz` (React-остров `client:visible`), если у термина есть `quiz`.
  Маппинг: `type:single→single / multi→multiple`, `answerIndex(es)→correct`. ⚠️ Интерактив квиза
  **не проверить в превью-движке** (React-острова там не гидрируются даже с `client:load`; рендер и
  данные верные, интеграция `@astrojs/react` на месте, build чистый → в реальном браузере работает).
- **«Изучать ещё»** — `W_TermsGrid` из `O_TermCard` (термины той же категории, до 4).
- Галочку героя глоссария брал ранее; для термина hero — ghost = имя термина (Stapel).

**⚠️ Контент терминов ПЕРЕГЕНЕРИРОВАН** из `~/Downloads/квизыитест/dshub-terms-data.json` (прислал
пользователь). Новая схема: `slug, term, category, visualType, definition, purpose, usage,
relatedCases[], quiz`. Старые 121 файла (ASCII-slug'и, 90 пустых определений) **заменены** на 121
новый (Cyrillic-slug'и, все с определениями, 62 с квизами). Источник правды теперь — этот JSON.
- `termVariant(category)` вынесён в **`src/lib/termVariant.ts`** (общий для S_GlossaryGrid и T_Term).
- `O_TermCard` спредит `...rest`; карточки глоссария теперь ведут на `/glossary/<slug>`.

### Прочие темплейты (на потом, та же страница Template)
T_Cases `34:7599` (✅), T_Resources `36:7507` (✅), T_Glossary `36:14854` (✅),
T_Term `36:15116` (✅), T_MainPage `36:4495`. Для их hero — переиспользовать `S_PageHero`.

## Правила проекта (выстраданные — соблюдать)
- Имя в Figma = имя в коде. Состояния (hover/pressed) = CSS, не пропсы. Стиль — в `*.module.css`,
  ТОЛЬКО semantic-токены. Презентационное — `.astro` (zero-JS); интерактив — острова или vanilla `<script>`.
- Шкала Figma ≠ наша: Figma `size/4xl`=32px, у нас `--font-size-4xl`=48px (32px = `--font-size-2xl`).
  Сверять ЗНАЧЕНИЕ, а не имя ступени.
- `[hidden]{display:none!important}` в base.css (иначе `display` из классов перебивает hidden).
- Обложки/иллюстрации тянуть рендером ноды (`get_screenshot`) или `download_assets defaultScale:3`
  (высокое качество). Сырые asset-URL из get_design_context часто = маски, не финальный рендер.
- Единая сетка-контейнер: `max-width:1440 + padding-inline:var(--layout-xs)(32) + margin auto`.
