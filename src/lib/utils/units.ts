export type TempUnit = 'fahrenheit' | 'celsius';
export type WindUnit = 'mph' | 'kmh';

export function convertTemp(fahrenheit: number, unit: TempUnit): number {
  if (unit === 'celsius') return Math.round(((fahrenheit - 32) * 5) / 9);
  return Math.round(fahrenheit);
}

export function convertWind(mph: number, unit: WindUnit): number {
  if (unit === 'kmh') return Math.round(mph * 1.60934);
  return Math.round(mph);
}

export function tempLabel(unit: TempUnit): string {
  return unit === 'fahrenheit' ? '°F' : '°C';
}

export function windLabel(unit: WindUnit): string {
  return unit === 'mph' ? 'mph' : 'km/h';
}
