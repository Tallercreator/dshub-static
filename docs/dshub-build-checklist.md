# DSHub — чек-лист сборки компонентов (с привязкой к местам)

Снизу вверх: токены → квАрки → атомы → молекулы → организмы → обёртки → суперорганизмы → шаблоны.
Правило: не начинай компонент, пока не готово всё, из чего он «состоит из».
Формат: `компонент ← состоит из · где: страница, место`.

---

## 0. Токены (готово)
- [x] Цвета, типографика, отступы, радиусы, границы, брейкпоинты

## 1. КвАрки (Q_)
- [ ] Q_Logo (lockup / icon / mono / inverse) · где: шапка — все страницы; футер — puffy-версия
- [ ] Q_Icon — библиотека иконок · где: везде (стрелки, иконки в кнопках/тегах/нав)
- [ ] Q_Illustration — puffy-ассеты · где: герой Главной (сердце), обложки кейсов, футер (слово)
- [ ] Q_BrandMark — логотипы компаний · где: лого-стена Главной, обложки кейсов
- [ ] Q_BrandWordmark — ghost-имя бренда · где: обложки кейсов (M_CasePreview)

## 2. Атомы (A_)
- [x] A_Text — текст-стили (готово) · где: везде
- [ ] A_Icon — обёртка ← Q_Icon + size/color (в Figma можно = Q_Icon) · где: везде
- [ ] A_Button — primary/secondary/ghost/dark ← A_Text (+ Q_Icon) · где: шапка («Предложить кейс»), лого-стена («Смотреть кейсы»), форма («Отправить заявку»), Ресурсы («Перейти в раздел»), фильтр Кейсов («Сбросить все»)
- [ ] A_Tag — бейдж типа/источника ← A_Text · где: карточка кейса (тип компании, оверлей на обложке); Ресурсы (тип источника)
- [ ] A_CategoryTag — категория ← A_Text (+ Q_Icon) · где: карточка кейса, над заголовком («↗ Токены»)
- [ ] A_Input — поле ввода ← A_Text · где: форма (низ всех страниц); поиск в Словаре/Кейсах
- [ ] A_Checkbox — матрица состояний ← box + Q_Icon · где: форма (согласие); фильтр Кейсов (группы)
- [ ] A_Link ← A_Text (+ Q_Icon) · где: шапки секций («Перейти к разделу» в превью Глоссария)
- [ ] A_SegmentItem — пункт ← A_Text · где: навигация в шапке; фильтр-табы Ресурсов
- [ ] A_FilterChip — чип-тоггл (default/active/disabled) ← A_Text · где: Кейсы — сайдбар фильтра (верх)
- [ ] A_RemovableTag — применённый фильтр ← A_Text + Q_Icon(×) · где: Кейсы — бар над гридом
- [ ] A_Dropdown — сортировка ← A_Text + Q_Icon(chevron) · где: Кейсы — бар над гридом
- [ ] A_Avatar · где: Кейс — мета статьи (автор)
- [ ] A_Badge — числовой ← A_Text · где: Кейс — нумерованный список в статье

## 3. Молекулы (M_)
- [ ] M_Segment ← A_SegmentThumb + A_SegmentItem ×N · где: навигация в шапке (все страницы); фильтр-табы Ресурсов
- [ ] M_LogoItem ← фон-карточка + Q_BrandMark · где: Главная — лого-стена под героем
- [ ] M_CasePreview — обложка ← фон-токены + Q_BrandWordmark + Q_Illustration + Q_BrandMark · где: внутри O_CaseCard (Главная, Кейсы, Термин)
- [ ] M_CaseTags ← A_CategoryTag ×N · где: карточка кейса, под обложкой
- [ ] M_SourceTag ← A_Tag + источник (A_Text/лого) · где: Ресурсы — карточка ресурса
- [ ] M_FormField ← A_Input + label + ошибка · где: форма (низ всех страниц)
- [ ] M_Consent ← A_Checkbox + A_Text · где: форма (галочка согласия)
- [ ] M_MetaRow ← A_Text(label) + A_Text(value) · где: футер (Куратор / Автор)
- [ ] M_FilterOption ← A_Checkbox + A_Text · где: Кейсы — сайдбар, группы фильтра
- [ ] M_FilterChips ← A_FilterChip ×N · где: Кейсы — сайдбар (верх)
- [ ] M_AppliedFilters ← A_RemovableTag ×N + A_Button + A_Dropdown · где: Кейсы — бар над гридом
- [ ] M_CollapseToggle — «Дополнительно» ← A_Text + Q_Icon · где: Кейсы — сайдбар
- [ ] M_ResultsHeader ← A_Text(«Выбрано») + A_Text(«Найдено N») · где: Кейсы — бар над гридом
- [ ] M_TermChip ← dot/Q_Icon + A_Text · где: Термин — блок «Изучать ещё»
- [ ] M_ArticleMeta ← A_Avatar + A_Text · где: Кейс — под заголовком статьи (автор/дата/время)
- [ ] M_TermMeta ← колонки A_Text · где: Термин — герой (Определение / Где используется / Связано с)
- [ ] M_NumberedItem ← A_Badge + A_Text · где: Кейс — нумерованный список в статье
- [ ] M_CheckItem ← A_Icon(✓) + A_Text · где: Кейс — блок «Выводы»
- [ ] M_QuizOption (будущее) ← A_Checkbox/radio + A_Text · где: Термин — тест «Проверь себя»
- [ ] M_ShareActions (будущее) ← A_Button ×2 · где: Кейс — действия PDF/Telegram

## 4. Организмы (O_)
- [ ] O_Header ← Q_Logo + M_Segment + A_Button · где: верх всех страниц
- [ ] O_LogoWall ← M_LogoItem ×6 + A_Button · где: Главная — под героем
- [ ] O_CaseCard ← M_CasePreview + A_Tag + M_CaseTags + A_Text · где: Главная (секция кейсов), Кейсы (грид), Термин (mini «Взято из кейса»)
- [ ] O_GlossaryCard ← A_TermDemo(по visualType) + Q_Icon + A_Text ×2 · где: Главная (превью Глоссария), Словарь (грид)
- [ ] O_ResourceCard ← M_SourceTag + превью + A_Text · где: Главная (секция ресурсов), Ресурсы (грид)
- [ ] O_Form ← M_FormField ×4 + M_Consent + A_Button · где: низ всех страниц
- [ ] O_Footer ← A_Text + M_MetaRow ×2 + Q_Illustration · где: низ всех страниц
- [ ] O_FilterSidebar ← M_FilterChips + W_FilterGroup(M_FilterOption) + M_CollapseToggle + A_Button · где: Кейсы — слева
- [ ] O_FilterBar ← M_AppliedFilters + M_ResultsHeader · где: Кейсы — над гридом
- [ ] O_CategoryFilter · где: Словарь — фильтр категорий над гридом
- [ ] O_ArticleHero ← ghost A_Text + Q_Illustration + A_Tag + A_Text(H1) + M_ArticleMeta · где: Кейс — верх статьи
- [ ] O_Heading / O_Paragraph / O_Quote / O_Code / O_Image / O_Links — блоки статьи (из JSON по type) · где: Кейс — тело статьи
- [ ] O_NumberedList ← M_NumberedItem ×N · где: Кейс — тело статьи
- [ ] O_SummaryBox ← M_CheckItem ×N · где: Кейс — блок «Выводы»
- [ ] O_ComponentDemo — живой компонент на surface · где: Термин — демо-блок «Пример использования»
- [ ] O_RelatedCases ← O_CaseCard(mini) ×N · где: Термин — «Взято из кейса»
- [ ] O_RelatedTerms ← M_TermChip ×N · где: Термин — «Изучать ещё»
- [ ] O_TermHero ← A_Text(H1) + ghost + M_TermMeta · где: Термин — верх
- [ ] O_Quiz (будущее) ← A_Text(вопрос) + M_QuizOption ×N + A_Button · где: Термин — «Проверь себя»

## 5. Обёртки (W_)
- [ ] W_PageContainer · где: все страницы (макс-ширина, поля)
- [ ] W_SectionHeader ← A_Text(title) + A_Text(subtitle) + A_Link · где: заголовки секций (Главная, Словарь, Ресурсы)
- [ ] W_CardGrid (featured + standard) · где: секции с карточками (Главная, Кейсы, Словарь, Ресурсы)
- [ ] W_HeroLayout · где: герой (Главная + шапки-герои Кейсов/Словаря/Ресурсов)
- [ ] W_FilterGroup ← A_Text(title) + M_FilterOption ×N · где: Кейсы — сайдбар, одна группа фильтра

## 6. Суперорганизмы (S_)
- [ ] S_Hero ← W_HeroLayout + ghost + Q_Illustration + A_Text(H1) · где: верх Главной (и шапки-герои др. страниц)
- [ ] S_CasesSection ← W_SectionHeader + W_CardGrid(O_CaseCard) · где: Главная
- [ ] S_GlossaryPreview ← W_SectionHeader + O_GlossaryCard ×4 · где: Главная
- [ ] S_ResourcesSection ← W_SectionHeader + W_CardGrid(O_ResourceCard) + A_Button · где: Главная
- [ ] S_FormSection ← A_Text(H2) + O_Form · где: низ всех страниц (перед футером)
- [ ] S_CasesGrid ← O_FilterSidebar + O_FilterBar + W_CardGrid(O_CaseCard) · где: страница Кейсы
- [ ] S_GlossaryGrid ← O_CategoryFilter + W_CardGrid(O_GlossaryCard) · где: страница Словарь
- [ ] S_ResourcesGrid ← M_Segment(фильтр-табы) + W_CardGrid(O_ResourceCard) · где: страница Ресурсы
- [ ] S_CaseArticle ← O_ArticleHero + блоки статьи (+ M_ShareActions будущее) · где: страница Кейс
- [ ] S_TermBody ← O_TermHero + O_ComponentDemo + O_RelatedCases + O_RelatedTerms (+ O_Quiz будущее) · где: страница Термин

## 7. Шаблоны (T_)
- [ ] T_Home ← O_Header + S_Hero + O_LogoWall + S_CasesSection + S_GlossaryPreview + S_ResourcesSection + S_FormSection + O_Footer
- [ ] T_Cases ← O_Header + S_Hero + S_CasesGrid + S_FormSection + O_Footer
- [ ] T_CasePage ← O_Header + S_CaseArticle + S_FormSection + O_Footer
- [ ] T_Glossary ← O_Header + S_Hero + S_GlossaryGrid + S_FormSection + O_Footer
- [ ] T_TermPage ← O_Header + S_TermBody + S_FormSection + O_Footer
- [ ] T_Resources ← O_Header + S_Hero + S_ResourcesGrid + S_FormSection + O_Footer
- [ ] T_About (будущее)

---

## Заметки
- **Переиспользование:** A_Button, A_Text, M_Segment, O_CaseCard, W_SectionHeader, W_CardGrid, A_Tag, A_Checkbox, O_Header/O_Footer/O_Form — строишь один раз, дальше инстансы на всех страницах.
- **Сначала состояния, потом сборка:** у A_Button, A_Input, A_Checkbox, A_FilterChip сделай default/hover/pressed/disabled до сборки организмов.
- **Глоссарий-демо отдельным батчем:** живые виджеты для `component`/`interactive`-терминов (Modal, Tooltip, Slider, Switch, Table…) — когда дойдёшь до демо Словаря; для каркаса страниц не нужны.
- **Сквозной нейминг:** имя в Figma = класс/компонент в коде, не переименовывать на хэндофе.
