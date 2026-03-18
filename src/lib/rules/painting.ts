import { HourlyData } from '@/types/weather';
import { Verdict } from '@/types/rules';
import { getWorkHours } from './engine';

export function evaluatePainting(
  dayHours: HourlyData[],
  allHours: HourlyData[],
  dayIndex: number
): Verdict {
  const workHours = getWorkHours(dayHours);
  if (workHours.length === 0) {
    return { status: 'red', reason: 'No work hour data available', date: '' };
  }

  // Check humidity
  const maxHumidity = Math.max(...workHours.map((h) => h.humidity));
  if (maxHumidity >= 85) {
    return { status: 'red', reason: `Humidity ${Math.round(maxHumidity)}% — paint won't adhere properly`, date: '' };
  }

  // Check temp range 50-90°F
  const minTemp = Math.min(...workHours.map((h) => h.temperature));
  const maxTemp = Math.max(...workHours.map((h) => h.temperature));
  if (minTemp < 50) {
    return { status: 'red', reason: `Low of ${Math.round(minTemp)}°F — too cold for exterior paint`, date: '' };
  }
  if (maxTemp > 90) {
    return { status: 'red', reason: `High of ${Math.round(maxTemp)}°F — paint will dry too fast`, date: '' };
  }

  // Check wind
  const maxWind = Math.max(...workHours.map((h) => h.windSpeed));
  if (maxWind >= 25) {
    return { status: 'red', reason: `Wind ${Math.round(maxWind)} mph — affects spray application`, date: '' };
  }

  // Precip check covers work hours (8am) through hour 22 (10pm) via slice(startIdx, dryEnd)
  const startIdx = dayIndex * 24 + 8;
  const dryEnd = dayIndex * 24 + 23;
  const precipWindow = allHours.slice(startIdx, Math.min(dryEnd, allHours.length));
  const hasPrecip = precipWindow.some((h) => h.precipitation > 0);
  if (hasPrecip) {
    return { status: 'red', reason: 'Rain expected during work or drying window — paint needs dry time', date: '' };
  }

  // Yellow zones
  if (maxHumidity >= 75 && maxHumidity < 85) {
    return { status: 'yellow', reason: `Humidity ${Math.round(maxHumidity)}% — near paint adhesion limit`, date: '' };
  }
  if (minTemp >= 50 && minTemp <= 55) {
    return { status: 'yellow', reason: `Low of ${Math.round(minTemp)}°F — paint may dry slowly`, date: '' };
  }
  if (maxTemp >= 85 && maxTemp <= 90) {
    return { status: 'yellow', reason: `High of ${Math.round(maxTemp)}°F — work in shade if possible`, date: '' };
  }
  // QA: fixed — missing wind yellow zone per spec (within 10% of 25 mph threshold)
  if (maxWind >= 22.5 && maxWind < 25) {
    return { status: 'yellow', reason: `Wind ${Math.round(maxWind)} mph — near spray application limit`, date: '' };
  }

  return { status: 'green', reason: 'All conditions clear for exterior painting', date: '' };
}
