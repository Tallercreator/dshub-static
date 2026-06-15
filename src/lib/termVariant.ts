// termVariant — карта «категория термина → вариант карточки O_TermCard».
// lime — прикладное (компоненты, инструменты, команда); pink — абстрактное
// (архитектура, процесс, инфраструктура, метрики, термины DS).
// image не используем (нет иллюстраций). Используется в S_GlossaryGrid и на
// странице термина (Изучать ещё).
export function termVariant(category?: string): 'pink' | 'lime' {
  if (!category) return 'pink';
  if (category.startsWith('Компонент') || category === 'Инструменты' || category === 'Команда')
    return 'lime';
  return 'pink';
}
