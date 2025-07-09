export function formatCompensation(comp) {
  if (!comp?.value) return { value: 'Не указано', currency: '' };
  const currencyMap = { rur: 'руб.', usd: '$', eur: '€' };
  return {
    value: typeof comp.value === 'number'
      ? comp.value.toLocaleString('ru-RU')
      : comp.value,
    currency: currencyMap[comp.currency] || '',
  };
}
