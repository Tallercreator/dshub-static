# DSHub — контент-модель (JSON + ContentRenderer)

Кейсы и термины — это данные (JSON), а не вёрстка. Один `ContentRenderer` проходит по массиву
блоков и по полю `type` выбирает компонент. Тот же принцип — у глоссария по полю `visualType`.

## ContentRenderer (паттерн)
```js
function ContentRenderer({ blocks }) {
  return blocks.map((b) => {
    switch (b.type) {
      case "heading":      return <O_Heading {...b} />;
      case "paragraph":    return <O_Paragraph {...b} />;
      case "quote":        return <O_Quote {...b} />;
      case "code":         return <O_Code {...b} />;
      case "image":        return <O_Image {...b} />;
      case "links":        return <O_Links {...b} />;
      case "numbered-list":return <O_NumberedList {...b} />;
      case "summary":      return <O_SummaryBox {...b} />;
      case "quiz-single":  return <O_Quiz {...b} />;   // будущее
      default:             return null;
    }
  });
}
```

## Типы блоков (для кейса/статьи)
| type | поля | компонент |
|---|---|---|
| heading | level, text | O_Heading |
| paragraph | text (rich) | O_Paragraph |
| quote | text, author? | O_Quote (пулл-цитата с мазками) |
| code | lang, code | O_Code |
| image | src, alt, caption? | O_Image |
| links | items[{label,url}] | O_Links |
| numbered-list | items[] | O_NumberedList (M_NumberedItem) |
| summary | items[] | O_SummaryBox (M_CheckItem) |
| quiz-single | question, options[], answerIndex | O_Quiz (будущее) |

## Схема кейса (cases/*.json)
```json
{
  "slug": "ecommerce-catalog",
  "title": "E-commerce: дизайн-система для каталога и покупок",
  "company": "Ozon",
  "companyType": "Ecom",
  "focus": ["Документация", "Токены"],
  "cover": {
    "brandWordmark": "OZON",
    "illustration": "puffy-arc",
    "brandMark": "/brands/ozon.svg",
    "bg": "#E6F1FB"
  },
  "meta": { "author": "Имя Фамилия", "role": "Design Lead", "date": "2026-04-01", "readingTime": 8 },
  "blocks": [
    { "type": "heading", "level": 2, "text": "Контекст" },
    { "type": "paragraph", "text": "…" },
    { "type": "quote", "text": "…", "author": "…" },
    { "type": "numbered-list", "items": ["…", "…"] },
    { "type": "summary", "items": ["…", "…"] }
  ]
}
```
Используется в: `O_CaseCard` (превью — берёт title/company/companyType/focus/cover), `T_CasePage` (blocks).

## Схема термина (terms/*.json)
```json
{
  "slug": "design-token",
  "term": "Дизайн-токен",
  "category": "Архитектура",
  "visualType": "interactive",
  "visualNote": "Песочница токенов: меняешь значение — меняется компонент",
  "definition": "…",
  "meta": { "usedIn": "Формы, фильтры…", "relatedTo": ["Семантический токен", "Тема"] },
  "demo": { "kind": "playground", "props": {} },
  "relatedCases": ["ecommerce-catalog"],
  "relatedTerms": ["semantic-token", "theme"],
  "quiz": { "question": "…", "options": ["…"], "answerIndex": 0 }
}
```
`visualType` ∈ `component | interactive | anatomy | diagram | example | text` — см. `05-glossary-visual-map.*`.
Демо-слот рендерится по `visualType` (как ContentRenderer по type): text → только определение, diagram → SVG-схема, interactive → модуль, и т.д.

## Схема ресурса (resources/*.json)
```json
{ "slug": "...", "title": "...", "source": "Habr", "type": "Статья", "url": "https://…", "cover": "…" }
```
Используется в `O_ResourceCard`; фильтр-табы Ресурсов фильтруют по `type`.

## Принцип
Компонент один — данные разные. `O_CaseCard` не знает про Ozon; он получает `case` и заполняет слоты.
Это и есть «компонент + данные»: добавление кейса/термина = новый JSON, без правки вёрстки.
