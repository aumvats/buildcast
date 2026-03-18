import { HourlyData } from '@/types/weather';
import { Verdict } from '@/types/rules';
import { getWorkHours } from './engine';

const SEVERE_CODES = [95, 96, 99, 56, 57, 66, 67, 75, 77];

export function evaluateGeneral(
  dayHours: HourlyData[],
  _allHours: HourlyData[],
  _dayIndex: number
): Verdict {
  const workHours = getWorkHours(dayHours);
  if (workHours.length === 0) {
    return { status: 'red', reason: 'No work hour data available', date: '' };
  }

  // Check severe weather codes
  const hasSevere = workHours.some((h) => SEVERE_CODES.includes(h.weatherCode));
  if (hasSevere) {
    return { status: 'red', reason: 'Severe weather conditions — all outdoor work should stop', date: '' };
  }

  // Check active precipitation
  const hasPrecip = workHours.some((h) => h.precipitation > 0);
  if (hasPrecip) {
    const precipHour = workHours.find((h) => h.precipitation > 0);
    const startTime = precipHour
      ? new Date(precipHour.time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })
      : '';
    return { status: 'red', reason: `Precipitation expected${startTime ? ` starting ${startTime}` : ''} — outdoor work disrupted`, date: '' };
  }

  // Check temp
  const minTemp = Math.min(...workHours.map((h) => h.temperature));
  if (minTemp < 32) {
    return { status: 'red', reason: `Low of ${Math.round(minTemp)}°F — unsafe working conditions`, date: '' };
  }

  // Check wind
  const maxWind = Math.max(...workHours.map((h) => h.windSpeed));
  if (maxWind >= 30) {
    return { status: 'red', reason: `Wind ${Math.round(maxWind)} mph — unsafe for most outdoor work`, date: '' };
  }

  // Yellow zones
  const maxPrecipProb = Math.max(...workHours.map((h) => h.precipitationProbability));
  if (maxPrecipProb >= 30 && maxPrecipProb <= 50) {
    return { status: 'yellow', reason: `${Math.round(maxPrecipProb)}% chance of precipitation — have cover plan ready`, date: '' };
  }
  if (maxWind >= 25 && maxWind < 30) {
    return { status: 'yellow', reason: `Wind ${Math.round(maxWind)} mph — secure loose materials`, date: '' };
  }
  // QA: fixed — missing temp yellow zone per spec (within 10% of 32°F threshold)
  if (minTemp >= 32 && minTemp <= 35) {
    return { status: 'yellow', reason: `Low of ${Math.round(minTemp)}°F — near freezing, monitor conditions`, date: '' };
  }

  return { status: 'green', reason: 'All conditions clear for general construction', date: '' };
}
