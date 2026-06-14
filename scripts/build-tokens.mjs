// build-tokens.mjs — генерирует src/styles/tokens.css из tokens/dshub-tokens.json
// (формат Tokens Studio: core = примитивы, semantic = роли со ссылками {group.key}).
//
// Принцип: core → CSS-переменные с сырыми значениями; semantic → переменные,
// ссылающиеся на core через var(). Так в коде сохраняется двухуровневая система
// токенов (компонент видит только семантику, та ведёт на примитив).
//
// Запуск: node scripts/build-tokens.mjs   (или npm run tokens)

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC = resolve(ROOT, 'tokens/dshub-tokens.json');
const OUT = resolve(ROOT, 'src/styles/tokens.css');

const tokens = JSON.parse(readFileSync(SRC, 'utf8'));

// --- единицы по типу токена -------------------------------------------------
function withUnit(value, type) {
  const v = String(value).trim();
  switch (type) {
    case 'spacing':
    case 'sizing':
    case 'borderRadius':
    case 'borderWidth':
    case 'fontSizes':
      return `${v}px`;
    case 'lineHeights':
      // 105% → 1.05 (множитель — корректнее для line-height)
      return v.endsWith('%') ? String(parseFloat(v) / 100) : v;
    case 'letterSpacing':
      // -2% → -0.02em
      return v.endsWith('%') ? `${parseFloat(v) / 100}em` : v;
    case 'number':
      // breakpoint → px, duration → ms (различаем по группе снаружи)
      return v;
    default:
      return v; // color, fontWeights, fontFamilies — как есть
  }
}

// Перевод пути алиаса "{neutral.10}" → "var(--neutral-10)"
function resolveAlias(value) {
  return String(value).replace(/\{([^}]+)\}/g, (_, path) => {
    return `var(--${path.split('.').join('-')})`;
  });
}

const lines = [];
lines.push('/* tokens.css — СГЕНЕРИРОВАН из tokens/dshub-tokens.json.');
lines.push(' * Не редактировать вручную: правь JSON и запускай `npm run tokens`.');
lines.push(' * = Figma Variables один-в-один (core примитивы + semantic роли). */');
lines.push('');
lines.push(':root {');

// --- CORE -------------------------------------------------------------------
const core = tokens.core;

function emitColorGroup(name, group) {
  lines.push(`  /* core · ${name} */`);
  for (const [key, tok] of Object.entries(group)) {
    if (!tok || typeof tok !== 'object' || !('value' in tok)) continue;
    lines.push(`  --${name}-${key}: ${tok.value};`);
  }
}

emitColorGroup('neutral', core.neutral);
emitColorGroup('pink', core.pink);
emitColorGroup('lime', core.lime);
lines.push(`  --opacity-black: ${core.opacity.black.value};`);
lines.push(`  --opacity-white: ${core.opacity.white.value};`);
lines.push('');

// spacing → --space-*, layout → --layout-*
lines.push('  /* core · spacing / layout */');
for (const [k, t] of Object.entries(core.spacing)) lines.push(`  --space-${k}: ${withUnit(t.value, t.type)};`);
for (const [k, t] of Object.entries(core.layout)) lines.push(`  --layout-${k}: ${withUnit(t.value, t.type)};`);
lines.push('');

// size.<sub>.<key> → --size-<sub>-<key>
lines.push('  /* core · size (icon / control / media) */');
for (const [sub, group] of Object.entries(core.size)) {
  for (const [k, t] of Object.entries(group)) lines.push(`  --size-${sub}-${k}: ${withUnit(t.value, t.type)};`);
}
lines.push('');

// radius, border
lines.push('  /* core · radius / border */');
for (const [k, t] of Object.entries(core.radius)) lines.push(`  --radius-${k}: ${withUnit(t.value, t.type)};`);
for (const [k, t] of Object.entries(core.border)) lines.push(`  --border-${k}: ${withUnit(t.value, t.type)};`);
lines.push('');

// font
lines.push('  /* core · font */');
for (const [k, t] of Object.entries(core.font.family)) lines.push(`  --font-family-${k}: ${t.value};`);
for (const [k, t] of Object.entries(core.font.weight)) lines.push(`  --font-weight-${k}: ${t.value};`);
for (const [k, t] of Object.entries(core.font.size)) lines.push(`  --font-size-${k}: ${withUnit(t.value, t.type)};`);
for (const [k, t] of Object.entries(core.font.line)) lines.push(`  --line-${k}: ${withUnit(t.value, t.type)};`);
for (const [k, t] of Object.entries(core.font.tracking)) lines.push(`  --tracking-${k}: ${withUnit(t.value, t.type)};`);
lines.push('');

// breakpoint (px) / duration (ms)
lines.push('  /* core · breakpoint / duration */');
for (const [k, t] of Object.entries(core.breakpoint)) lines.push(`  --breakpoint-${k}: ${t.value}px;`);
for (const [k, t] of Object.entries(core.duration)) lines.push(`  --duration-${k}: ${t.value}ms;`);
lines.push('');

// --- SEMANTIC ---------------------------------------------------------------
const sem = tokens.semantic;
lines.push('  /* ───────────── SEMANTIC (роли → ссылки на core) ───────────── */');
for (const groupName of ['surface', 'text', 'icons', 'stroke']) {
  const group = sem[groupName];
  if (!group) continue;
  lines.push(`  /* semantic · ${groupName} */`);
  for (const [role, tok] of Object.entries(group)) {
    if (!tok || !('value' in tok)) continue;
    lines.push(`  --${groupName}-${role}: ${resolveAlias(tok.value)};`);
  }
  lines.push('');
}

lines.push('}');
lines.push('');

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, lines.join('\n'), 'utf8');

const varCount = lines.filter((l) => l.trim().startsWith('--')).length;
console.log(`✓ tokens.css сгенерирован: ${varCount} переменных → ${OUT.replace(ROOT + '/', '')}`);
