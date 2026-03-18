import { HourlyData } from '@/types/weather';
import { Verdict } from '@/types/rules';
import { getWorkHours } from './engine';

const ICE_CODES = [56, 57, 66, 67, 77];

export function evaluateRoofing(
  dayHours: HourlyData[],
  _allHours: HourlyData[],
  _dayIndex: number
): Verdict {
  const workHours = getWorkHours(dayHours);
  if (workHours.length === 0) {
    return { status: 'red', reason: 'No work hour data available', date: '' };
  }

  // Check precipitation
  const hasPrecip = workHours.some((h) => h.precipitation > 0);
  if (hasPrecip) {
    return { status: 'red', reason: 'Precipitation during work hours — unsafe on roof', date: '' };
  }

  // Check wind
  const maxWind = Math.max(...workHours.map((h) => h.windSpeed));
  if (maxWind >= 25) {
    return { status: 'red', reason: `Wind ${Math.round(maxWind)} mph — unsafe on pitched roof`, date: '' };
  }

  // Check temp
  const minTemp = Math.min(...workHours.map((h) => h.temperature));
  if (minTemp < 35) {
    return { status: 'red', reason: `Low of ${Math.round(minTemp)}°F — shingles become brittle`, date: '' };
  }

  // Check ice codes
  const hasIce = workHours.some((h) => ICE_CODES.includes(h.weatherCode));
  if (hasIce) {
    return { status: 'red', reason: 'Ice/frost conditions — unsafe on roof', date: '' };
  }

  // Yellow zones
  if (maxWind >= 20 && maxWind < 25) {
    return { status: 'yellow', reason: `Wind ${Math.round(maxWind)} mph — caution on exposed roofs`, date: '' };
  }
  if (minTemp >= 35 && minTemp <= 40) {
    return { status: 'yellow', reason: `Low of ${Math.round(minTemp)}°F — shingle adhesion may be reduced`, date: '' };
  }

  return { status: 'green', reason: 'All conditions clear for roofing work', date: '' };
}
