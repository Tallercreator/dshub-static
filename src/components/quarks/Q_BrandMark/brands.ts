// brands.ts — реестр логотипов компаний (Figma Q_BrandMark, размер Medium).
// Файлы лежат в public/brands/ (SVG где есть вектор, иначе PNG-экспорт).
// Размеры — из Figma при ширине 150px.

export interface BrandDef {
  src: string;
  w: number;
  h: number;
  alt: string;
}

export const BRANDS: Record<string, BrandDef> = {
  otp: { src: '/brands/otp.svg', w: 150, h: 29, alt: 'ОТП Банк' },
  alfa: { src: '/brands/alfa.png', w: 150, h: 53, alt: 'Альфа-Банк' },
  dodo: { src: '/brands/dodo.png', w: 150, h: 52, alt: 'Dodo' },
  mts: { src: '/brands/mts.png', w: 150, h: 40, alt: 'МТС' },
  sber: { src: '/brands/sber.svg', w: 150, h: 23, alt: 'Сбер' },
  avito: { src: '/brands/avito.png', w: 150, h: 38, alt: 'Авито' },
};

export type BrandName = keyof typeof BRANDS;
