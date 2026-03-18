import { HourlyData } from '@/types/weather';
import { Verdict } from '@/types/rules';
import { getWorkHours } from './engine';

export function evaluateExcavation(
  dayHours: HourlyData[],
  allHours: HourlyData[],
  dayIndex: number
): Verdict {
  const workHours = getWorkHours(dayHours);
  if (workHours.length === 0) {
    return { status: 'red', reason: 'No work hour data available', date: '' };
  }

  // Check active precipitation during work
  const hasActivePrecip = workHours.some((h) => h.precipitation > 0);
  if (hasActivePrecip) {
    return { status: 'red', reason: 'Active precipitation — excavation area will flood', date: '' };
  }

  // Check prior 24h heavy precipitation
  const startIdx = dayIndex * 24 + 8;
  const prior24h = allHours.slice(Math.max(0, startIdx - 24), startIdx);
  const totalPriorPrecip = prior24h.reduce((sum, h) => sum + h.precipitation, 0);
  if (totalPriorPrecip > 0.5) {
    return { status: 'red', reason: `${totalPriorPrecip.toFixed(1)} inches rain in prior 24h — ground too saturated`, date: '' };
  }

  // Check temp (frozen ground)
  const minTemp = Math.min(...workHours.map((h) => h.temperature));
  if (minTemp < 32) {
    return { status: 'red', reason: `Low of ${Math.round(minTemp)}°F — ground may be frozen`, date: '' };
  }

  // Yellow zones
  if (totalPriorPrecip > 0.1 && totalPriorPrecip <= 0.5) {
    return { status: 'yellow', reason: `Light rain in prior 24h (${totalPriorPrecip.toFixed(1)} in) — check soil conditions`, date: '' };
  }
  if (minTemp >= 32 && minTemp <= 36) {
    return { status: 'yellow', reason: `Low of ${Math.round(minTemp)}°F — possible frost, check ground conditions`, date: '' };
  }

  return { status: 'green', reason: 'All conditions clear for excavation work', date: '' };
}
