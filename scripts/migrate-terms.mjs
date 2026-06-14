// migrate-terms.mjs — собирает 121 термин глоссария в src/content/terms/*.json.
// Источник списка/визуала: docs/05-glossary-visual-map.json (slug/term/category/
// visualType/visualNote). Определения подтягиваются из старой базы (32 термина,
// /tmp/terms_export.json) по нормализованному совпадению имени (ДС↔DS, без скобок).
//
// Запуск: node scripts/migrate-terms.mjs

import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT_DIR = resolve(ROOT, 'src/content/terms');

const TRANSLIT = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z',
  и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r',
  с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch',
  ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
};
const translit = (s) => s.toLowerCase().split('').map((c) => (c in TRANSLIT ? TRANSLIT[c] : c)).join('');
const slugify = (s) => translit(s).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').replace(/-+/g, '-');

// Нормализация для сопоставления имён: ДС→DS, убрать скобки и не-буквы.
const norm = (s) =>
  s.toLowerCase().replace(/дс/g, 'ds').replace(/\([^)]*\)/g, '').replace(/[^a-zа-яё0-9]/gi, '');

const map = JSON.parse(readFileSync(resolve(ROOT, 'docs/05-glossary-visual-map.json'), 'utf8'));
const oldTerms = JSON.parse(readFileSync('/tmp/terms_export.json', 'utf8'));

const oldByNorm = new Map();
for (const t of oldTerms) oldByNorm.set(norm(t.term), t);

// Очищаем каталог, чтобы не осталось старых seed-файлов.
rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

const seen = new Set();
let written = 0;
let withDef = 0;

for (const m of map) {
  let slug = slugify(m.term).slice(0, 60);
  if (seen.has(slug)) slug = `${slug}-${written}`;
  seen.add(slug);

  const old = oldByNorm.get(norm(m.term));
  if (old?.definition) withDef += 1;

  const out = {
    slug,
    term: m.term,
    category: m.category,
    visualType: m.visualType,
    visualNote: m.visualNote || null,
    definition: old?.definition?.trim() || '',
    meta: {
      usedIn: old?.context?.trim() || old?.purpose?.trim() || null,
      relatedTo: [],
    },
    sources: old?.sources?.trim() || null,
    relatedCases: [],
    relatedTerms: [],
  };

  writeFileSync(resolve(OUT_DIR, `${slug}.json`), JSON.stringify(out, null, 2) + '\n', 'utf8');
  written += 1;
}

console.log(`Готово: ${written} терминов → src/content/terms/  (с определением: ${withDef}, пустых: ${written - withDef})`);
