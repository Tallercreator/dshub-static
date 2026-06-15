// brands.ts — реестр логотипов компаний (Figma Q_BrandMark, размер Medium).
// Файлы лежат в public/brands/ (SVG где есть вектор, иначе PNG-экспорт).
// Размеры — из Figma при ширине 150px.

export interface BrandDef {
  src: string;
  w: number;
  h: number;
  alt: string;
  caseSlug: string; // кейс бренда (для ссылок лого-стены на Главной)
}

export const BRANDS: Record<string, BrandDef> = {
  otp: { src: '/brands/otp.svg', w: 150, h: 29, alt: 'ОТП Банк', caseSlug: 'otp-bank-dizayn-sistema-otp' },
  alfa: { src: '/brands/alfa.png', w: 150, h: 53, alt: 'Альфа-Банк', caseSlug: 'alfa-dizayn-sistema-alfy' },
  dodo: { src: '/brands/dodo.png', w: 150, h: 52, alt: 'Dodo', caseSlug: 'dodo-brands-dui-dodo-user-interface' },
  mts: { src: '/brands/mts.png', w: 150, h: 40, alt: 'МТС', caseSlug: 'mts-finteh-astra' },
  sber: { src: '/brands/sber.svg', w: 150, h: 23, alt: 'Сбер', caseSlug: 'sber-dizayn-sistema-kanala-b2e' },
  avito: { src: '/brands/avito.png', w: 150, h: 38, alt: 'Авито', caseSlug: 'avito-avito-design-system' },
};

export type BrandName = keyof typeof BRANDS;
