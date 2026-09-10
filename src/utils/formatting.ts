export function formatNumber(num: number): string {
  return Math.round(num).toLocaleString('en-US');
}

export function formatGrams(grams: number): string {
  return `${Math.round(grams)} g`;
}

export function formatCalories(calories: number): string {
  return `${formatNumber(calories)} kcal`;
}

export function formatPercentage(percentage: number): string {
  return `${Math.round(percentage)}%`;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function formatTodayHeader(): string {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
  return now.toLocaleDateString('en-US', options);
}
