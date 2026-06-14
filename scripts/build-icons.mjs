// build-icons.mjs — скачивает SVG иконок из Figma (asset-URL живут ~7 дней)
// и собирает самодостаточный реестр src/components/quarks/Q_Icon/icons.ts.
//
// Повороты в Figma заданы CSS-обёрткой над общим вектором (chevron-down =
// chevron повёрнутый на 90°), поэтому храним transform отдельно — Q_Icon
// применит его. Цвет → currentColor (иконка наследует цвет родителя).
//
// Запуск (пока asset-URL не истекли): node scripts/build-icons.mjs

import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../src/components/quarks/Q_Icon/icons.ts');

// name → { url, transform }. transform = CSS из Figma-обёртки (orientation).
const ICONS = {
  // ВАЖНО: порядок как в Tailwind/Figma — rotate ПЕРЕД scale в CSS-строке.
  // Иначе несимметричные глифы (check) зеркалятся неправильно.
  'chevron-right': { url: 'cc6a2e47-6076-4e26-910d-54bd04f535c6', transform: 'scaleY(-1)' },
  'chevron-down': { url: '2b94097c-cf07-4204-80a2-8ca40457482b', transform: 'rotate(90deg) scaleY(-1)' },
  'arrow-right': { url: '2621f99c-fdf3-43b7-8298-a416016e0a7b', transform: 'rotate(90deg)' },
  'arrow-left': { url: 'b0cc642c-58c1-48ea-8157-3a3129ff8a5e', transform: '' },
  heart: { url: '6ef69540-8257-4ab4-ab9a-1dc2c4eda6da', transform: 'rotate(180deg) scaleY(-1)' },
  plus: { url: '106206aa-04c0-49b4-a0c2-4429af897a44', transform: '' },
  'cross-small': { url: 'ec2673e6-03c7-45f9-9981-77ad6e8807fc', transform: '' },
  check: { url: '4b70d070-4024-4780-a408-933b9d29929d', transform: 'rotate(90deg) scaleY(-1)' },
  filter: { url: 'ea2470d1-4dc9-48aa-a60e-5a4485e1b5c2', transform: '' },
  loupe: { url: 'a75f69a9-4eee-4b7b-9668-45f8cc85b0b8', transform: 'rotate(180deg)' },
  'rotate-arrows': { url: 'ac2b7a2d-5659-4566-92b5-9b1f84a28c16', transform: '' },
  'upright-arrow': { url: '971c52df-55a3-40be-8735-b9a6c814704b', transform: '' },
};

const ASSET = (id) => `https://www.figma.com/api/mcp/asset/${id}`;

// Заменяем заданные цвета на currentColor (кроме fill="none").
function recolor(s) {
  return s
    .replace(/(stroke|fill)="var\([^"]*\)"/g, '$1="currentColor"')
    .replace(/(stroke|fill)="#[0-9a-fA-F]{3,8}"/g, '$1="currentColor"');
}

const registry = {};

for (const [name, { url, transform }] of Object.entries(ICONS)) {
  const res = await fetch(ASSET(url));
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
  const svg = await res.text();
  const viewBox = (svg.match(/viewBox="([^"]*)"/) || [])[1] || '0 0 24 24';
  let body = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').trim();
  body = recolor(body);
  registry[name] = { viewBox, transform, body };
  console.log(`✓ ${name}  viewBox="${viewBox}"${transform ? `  transform="${transform}"` : ''}`);
}

const header = `// icons.ts — СГЕНЕРИРОВАН scripts/build-icons.mjs из Figma Q_Icon_16/24.
// Не редактировать вручную. Реестр иконок для Q_Icon: name → { viewBox, transform, body }.
// body — внутренние пути SVG (цвет = currentColor). transform — ориентация из Figma.

export interface IconDef {
  viewBox: string;
  transform: string;
  body: string;
}

export const ICONS: Record<string, IconDef> = ${JSON.stringify(registry, null, 2)};

export type IconName = keyof typeof ICONS;
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, header, 'utf8');
console.log(`\nГотово: ${Object.keys(registry).length} иконок → ${OUT.split('/').slice(-3).join('/')}`);
