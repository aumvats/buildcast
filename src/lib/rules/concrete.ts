import { HourlyData } from '@/types/weather';
import { Verdict } from '@/types/rules';
import { getWorkHours } from './engine';

export function evaluateConcrete(
  dayHours: HourlyData[],
  allHours: HourlyData[],
  dayIndex: number
): Verdict {
  const workHours = getWorkHours(dayHours);
  if (workHours.length === 0) {
    return { status: 'red', reason: 'No work hour data available', date: '' };
  }

  // Check wind during work hours
  const maxWind = Math.max(...workHours.map((h) => h.windSpeed));
  if (maxWind >= 25) {
    return { status: 'red', reason: `Wind ${Math.round(maxWind)} mph during work hours — unsafe for pour`, date: '' };
  }

  // Check 48h temp after pour (8am start)
  const pourStart = dayIndex * 24 + 8;
  const cureEnd = pourStart + 48;
  const cureHours = allHours.slice(pourStart, Math.min(cureEnd, allHours.length));

  if (cureHours.length < 48) {
    // Can't verify full cure window
    const minTemp = cureHours.length > 0 ? Math.min(...cureHours.map((h) => h.temperature)) : 0;
    if (minTemp < 40) {
      return { status: 'red', reason: `Temp drops to ${Math.round(minTemp)}°F during cure window — concrete won't cure`, date: '' };
    }
    // QA: fixed — dayIndex >= 5 guard was too narrow; any incomplete cure window should warn
    return { status: 'yellow', reason: 'Cure window extends beyond forecast range — verify manually', date: '' };
  }

  const minCureTemp = cureHours.length > 0 ? Math.min(...cureHours.map((h) => h.temperature)) : 0;
  if (minCureTemp < 40) {
    const coldHour = cureHours.find((h) => h.temperature < 40);
    const coldTime = coldHour ? new Date(coldHour.time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, weekday: 'short' }) : '';
    return { status: 'red', reason: `Temp drops to ${Math.round(minCureTemp)}°F ${coldTime} — concrete won't cure`, date: '' };
  }

  // Check 24h precip after pour
  const precipEnd = pourStart + 24;
  const precipHours = allHours.slice(pourStart, Math.min(precipEnd, allHours.length));
  const maxPrecip = precipHours.length > 0 ? Math.max(...precipHours.map((h) => h.precipitation)) : 0;

  if (maxPrecip > 0.1) {
    return { status: 'red', reason: `Precipitation expected within 24h of pour — risk of surface damage`, date: '' };
  }

  // Yellow zones
  if (minCureTemp >= 40 && minCureTemp <= 45) {
    return { status: 'yellow', reason: `Cure temp marginal — low of ${Math.round(minCureTemp)}°F in 48h window`, date: '' };
  }

  const maxPrecipProb = Math.max(...workHours.map((h) => h.precipitationProbability));
  if (maxPrecipProb >= 30 && maxPrecipProb <= 50) {
    return { status: 'yellow', reason: `${Math.round(maxPrecipProb)}% chance of precipitation — monitor closely`, date: '' };
  }

  if (maxWind >= 20) {
    return { status: 'yellow', reason: `Wind speed ${Math.round(maxWind)} mph — may affect surface finish`, date: '' };
  }

  return { status: 'green', reason: 'All conditions clear for concrete pour', date: '' };
}
