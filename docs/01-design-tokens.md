# DSHub — дизайн-токены

Два слоя: **core** (примитивы, сырые значения) и **semantic** (роли, ссылаются на core).
В коде → CSS-переменные. Машиночитаемые версии — в `/tokens` (Tokens Studio + Figma Variables).

## CORE

### Цвет · Neutral
`0 #FFFFFF` · `10 #F3F4F6` · `20 #E8EAED` · `30 #DEDFE1` · `40 #D3D3D4` · `50 #C3C3C3` · `60 #B3B2B2` · `70 #ABABAB` · `80 #909090` · `90 #717171` · `100 #525252` · `110 #404040` · `120 #2A2A2A` · `130 #1F1F1F` · `140 #181818` · `150 #0D0D0D` · `160 #000000`

### Цвет · Pink (бренд-акцент)
`10 #FFECEF` · `20 #FFD0D7` · `30 #FFB0BB` · `40 #FF8D9C` · `50 #FF6B7E` · `60 #FF4D63` (база) · `70 #E63A50` · `80 #C22C40` · `90 #7A1A27`

### Цвет · Lime (вторичный акцент)
`0 #F2FECB` · `10 #BDF70D` · `20 #ADE307` · `30 #82BF00`

### Opacity
`black rgba(0,0,0,.24)` · `white rgba(255,255,255,.24)`

### Spacing (внутренние отступы/гэпы)
`2xs 2` · `xs 4` · `sm 6` · `md 8` · `lg 12` · `xl 16` · `2xl 20` · `3xl 24`

### Layout (крупные отступы секций)
`xs 32` · `sm 40` · `md 48` · `lg 56` · `xl 64` · `2xl 80` · `3xl 96` · `4xl 120` · `5xl 160` · `6xl 200`

### Size
- icon: `xs 12 · sm 16 · md 20 · lg 24 · xl 32`
- control (высота кнопок/полей): `sm 28 · md 32 · lg 36 · xl 40 · 2xl 48 · 3xl 56`
- media (обложки/иллюстрации): `sm 64 · md 80 · lg 96 · xl 120 · 2xl 160 · 3xl 200`

### Radius
`2xs 2 · xs 4 · sm 8 · md 12 · lg 16 · xl 20 · 2xl 24 · 3xl 32 · 4xl 40 · 5xl 48 · pill 200`

### Border
`hairline 1 · thin 2`

### Font
- family: `base = Inter`, `display = Inter` ⚠️ замени display на выбранный округлый шрифт (Onest) при финализации лого/заголовков
- weight: `regular 400 · medium 500 · semibold 600 · bold 700`
- size: `xs 12 · sm 14 · md 16 · lg 20 · xl 24 · 2xl 32 · 3xl 40 · 4xl 48 · 5xl 64`
- line: `tight 105% · snug 120% · normal 140% · relaxed 150%`
- tracking: `tight -2% · normal 0%`

### Breakpoint
`mobile 360 · tablet 768 · laptop 1024 · desktop 1280 · wide 1440`

### Duration (анимации — держать в коде, не в Figma-переменных)
`fast 150 · base 250 · slow 400`

## SEMANTIC (роли → ссылаются на core)

### surface
`page → neutral.10` · `card → neutral.0` · `inverse → neutral.140` · `inverse-active → neutral.150`
`accent → pink.60` · `accent-hover → pink.70` · `accent-pressed → pink.80` · `accent-subtle → pink.10`
`accent2 → lime.10` · `accent2-subtle → lime.0`

### text
`primary → neutral.150` · `secondary → neutral.120` · `tertiary → neutral.100` · `disabled → neutral.70`
`inverse-primary → neutral.0` · `inverse-secondary → neutral.50` · `inverse-tertiary → neutral.10`
`accent → pink.80` · `on-accent → neutral.160` · `on-accent2 → neutral.160`

### icons
`primary → neutral.140` · `secondary → neutral.120` · `tertiary → neutral.100` · `disabled → neutral.80` · `inverse → neutral.0` · `accent → pink.60`

### stroke
`subtle → neutral.20` · `default → neutral.30` · `strong → neutral.50` · `accent → pink.60`

### typography (композиты)
| роль | family | weight | size | line | tracking |
|---|---|---|---|---|---|
| display | display | bold | 5xl (64) | tight | tight |
| h1 | display | bold | 4xl (48) | snug | tight |
| h2 | base | semibold | 3xl (40) | snug | tight |
| title | base | semibold | lg (20) | snug | normal |
| body | base | regular | md (16) | normal | normal |
| caption | base | medium | sm (14) | normal | normal |
| button | base | medium | md (16) | snug | normal |

## Заметки для кода
- Семантику биндить на core, а компоненты — только на семантику (не на сырой core). В коде компонент берёт `var(--surface-accent)` и т.п. из своего `Component.module.css`.
- Брейкпоинты, duration, easing держать в коде, не в Figma-переменных.
- line-height в %: в CSS переводить в множитель (105% → 1.05).
