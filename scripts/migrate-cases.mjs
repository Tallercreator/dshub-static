// migrate-cases.mjs — переносит кейсы из старой Rails-базы (экспорт
// /tmp/cases_export.json) в новую JSON-схему DSHub (src/content/cases/*.json).
//
// Старая модель: набор HTML-полей (context, positioning, …, quotes).
// Новая модель: blocks[] типизированных блоков для ContentRenderer.
//
// Запуск: node scripts/migrate-cases.mjs

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC = '/tmp/cases_export.json';
const OUT_DIR = resolve(ROOT, 'src/content/cases');

// Порядок и заголовки контентных секций (= ApplicationHelper::CASE_SECTION_TITLES).
const SECTIONS = [
  ['tldr', 'Главное'],
  ['context', 'Контекст'],
  ['positioning', 'Позиционирование и цели'],
  ['composition', 'Состав системы'],
  ['processes', 'Процессы развития'],
  ['documentation', 'Документация'],
  ['design_code_sync', 'Синхронизация дизайна и кода'],
  ['quality', 'Контроль качества'],
  ['scaling', 'Масштабирование и внедрение'],
  ['unique_practices', 'Уникальные практики и «фишки» кейса'],
  ['conclusions', 'Выводы и принципы'],
  ['quotes', 'Избранные цитаты'],
];

// ─────────── транслитерация + slug ───────────
const TRANSLIT = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z',
  и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r',
  с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch',
  ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
};
function translit(s) {
  return s
    .toLowerCase()
    .split('')
    .map((ch) => (ch in TRANSLIT ? TRANSLIT[ch] : ch))
    .join('');
}
function slugify(s) {
  return translit(s)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

// ─────────── HTML → blocks ───────────
const ENTITIES = {
  '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'",
  '&nbsp;': ' ', '&laquo;': '«', '&raquo;': '»', '&mdash;': '—', '&ndash;': '–',
};
const decodeEntities = (s) => s.replace(/&[a-z#0-9]+;/gi, (m) => ENTITIES[m] ?? m);
const stripTags = (s) => decodeEntities(s.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();

// Буллеты «• a • b • c», схлопнутые в один узел при первой конвертации, → отдельные пункты.
const splitBullets = (text) =>
  text
    .split(/\s*[•·]\s+/)
    .map((t) => t.replace(/^[•·]\s*/, '').trim())
    .filter(Boolean);

const liItems = (inner) =>
  [...inner.matchAll(/<li>([\s\S]*?)<\/li>/g)].flatMap((m) => splitBullets(stripTags(m[1]))).filter(Boolean);

// Цитата вида "Заголовок<br>«…»" → { title, text }
function splitQuote(inner) {
  const parts = inner.split(/<br\s*\/?>/i);
  if (parts.length >= 2 && /»\s*$/.test(stripTags(parts.slice(1).join(' ')))) {
    return { title: stripTags(parts[0]), text: stripTags(parts.slice(1).join(' ')) };
  }
  return { text: stripTags(inner) };
}

function htmlToBlocks(html, { asQuotes = false } = {}) {
  const out = [];
  const re = /<(p|h1|h2|h3|blockquote|ul|ol)>([\s\S]*?)<\/\1>/gi;
  let m;
  let matchedAny = false;
  while ((m = re.exec(html))) {
    matchedAny = true;
    const tag = m[1].toLowerCase();
    const inner = m[2].trim();
    if (!stripTags(inner) && tag !== 'ul' && tag !== 'ol') continue;
    if (tag === 'p') {
      if (asQuotes) {
        out.push({ type: 'quote', ...splitQuote(inner) });
      } else {
        // Абзац-буллеты («текст • текст • текст») → список.
        const stripped = stripTags(inner);
        const bullets = splitBullets(stripped);
        if (bullets.length > 1 && /[•·]\s+\S/.test(stripped)) {
          out.push({ type: 'summary', items: bullets });
        } else {
          out.push({ type: 'paragraph', text: inner.trim() });
        }
      }
    } else if (tag === 'blockquote') {
      out.push({ type: 'quote', ...splitQuote(inner) });
    } else if (tag === 'h1' || tag === 'h2' || tag === 'h3') {
      out.push({ type: 'heading', level: 3, text: stripTags(inner) });
    } else if (tag === 'ul') {
      const items = liItems(inner);
      if (items.length) out.push({ type: 'summary', items });
    } else if (tag === 'ol') {
      const items = liItems(inner);
      if (items.length) out.push({ type: 'numbered-list', items });
    }
  }
  // Фолбэк: поле без блочных тегов — один абзац.
  if (!matchedAny && stripTags(html)) {
    out.push(asQuotes ? { type: 'quote', text: stripTags(html) } : { type: 'paragraph', text: html.trim() });
  }
  return out;
}

// ─────────── оценка времени чтения ───────────
function readingTime(blocks) {
  const words = blocks
    .map((b) => stripTags(b.text || (b.items ? b.items.join(' ') : '')))
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 170));
}

// ─────────── основной перенос ───────────
const cases = JSON.parse(readFileSync(SRC, 'utf8'));
mkdirSync(OUT_DIR, { recursive: true });

const seen = new Set();
let written = 0;

for (const c of cases) {
  const f = c.fields;

  const blocks = [];
  // intro — вводный абзац перед секциями
  if (f.intro?.trim()) blocks.push(...htmlToBlocks(f.intro));
  // контентные секции по порядку
  for (const [key, title] of SECTIONS) {
    const html = f[key];
    if (!html?.trim()) continue;
    blocks.push({ type: 'heading', level: 2, text: title });
    blocks.push(...htmlToBlocks(html, { asQuotes: key === 'quotes' }));
  }

  // slug — уникальный, из company + ds_name
  let slug = slugify(`${c.company} ${c.ds_name}`).slice(0, 60);
  if (seen.has(slug)) slug = `${slug}-${c.id}`;
  seen.add(slug);

  const focus = (c.tags || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  const out = {
    slug,
    title: c.card_title?.trim() || `${c.company} — ${c.ds_name}`,
    company: c.company,
    dsName: c.ds_name,
    companyType: c.industry || c.company_type || null,
    caseType: c.case_type || null,
    caseFormat: c.case_format || null,
    focus,
    accentColor: c.accent_color || null,
    cover: {
      brandWordmark: c.company,
      bg: c.accent_color || null,
    },
    sidebar: {
      focus: stripTags(f.focus_description || '') || null,
      speakerRole: stripTags(f.speaker_role || '') || null,
      artifacts: stripTags(f.artifacts || '') || null,
    },
    meta: {
      readingTime: readingTime(blocks),
    },
    published: c.published,
    blocks,
  };

  writeFileSync(resolve(OUT_DIR, `${slug}.json`), JSON.stringify(out, null, 2) + '\n', 'utf8');
  written += 1;
  console.log(`✓ ${slug}  (${blocks.length} блоков, ~${out.meta.readingTime} мин)`);
}

console.log(`\nГотово: ${written} кейсов → src/content/cases/`);
