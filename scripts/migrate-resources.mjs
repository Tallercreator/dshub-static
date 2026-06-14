// migrate-resources.mjs — переносит ресурсы из старой базы
// (/tmp/resources_export.json) в src/content/resources/*.json по схеме
// { slug, title, source, type, url, description, tags }.
//
// Запуск: node scripts/migrate-resources.mjs

import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT_DIR = resolve(ROOT, 'src/content/resources');

const TRANSLIT = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z',
  и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r',
  с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch',
  ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
};
const translit = (s) => s.toLowerCase().split('').map((c) => (c in TRANSLIT ? TRANSLIT[c] : c)).join('');
const slugify = (s) => translit(s).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').replace(/-+/g, '-');

// Метка источника по домену (= ApplicationHelper::SOURCE_LABELS из Rails).
const SOURCE_LABELS = {
  'habr.com': 'Habr', 'vc.ru': 'VC.ru', 'youtube.com': 'YouTube', 'youtu.be': 'YouTube',
  'github.com': 'GitHub', 'figma.com': 'Figma', 'medium.com': 'Medium', 't.me': 'Telegram',
};
function sourceLabel(url) {
  try {
    const host = new URL(url).host.replace(/^www\./, '');
    for (const [domain, label] of Object.entries(SOURCE_LABELS)) if (host.includes(domain)) return label;
    const base = host.split('.')[0];
    return base ? base[0].toUpperCase() + base.slice(1) : null;
  } catch {
    return null;
  }
}

const resources = JSON.parse(readFileSync('/tmp/resources_export.json', 'utf8'));

rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

const seen = new Set();
let written = 0;

for (const r of resources) {
  let slug = slugify(r.title).slice(0, 60);
  if (!slug) slug = `resource-${written}`;
  if (seen.has(slug)) slug = `${slug}-${written}`;
  seen.add(slug);

  const out = {
    slug,
    title: r.title,
    source: sourceLabel(r.url),
    type: r.resource_type || null,
    url: r.url,
    description: r.description?.trim() || null,
    tags: (r.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
  };

  writeFileSync(resolve(OUT_DIR, `${slug}.json`), JSON.stringify(out, null, 2) + '\n', 'utf8');
  written += 1;
}

console.log(`Готово: ${written} ресурсов → src/content/resources/`);
