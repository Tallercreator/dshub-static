import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// DSHub — статический сайт (SSG) с React-островами для интерактива.
// Деплой на Netlify. SEO-критичен → рендерим страницы статически.
export default defineConfig({
  site: 'https://dshub.netlify.app',
  integrations: [react()],
  // Глобальные стили подключаются в BaseLayout; CSS Modules — на уровне компонента.
  vite: {
    css: {
      // Стабильные, читаемые имена классов в CSS Modules (UDF-нейминг виден в DOM).
      modules: {
        generateScopedName: '[name]__[local]',
      },
    },
  },
});
