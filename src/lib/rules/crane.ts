import { HourlyData } from '@/types/weather';
import { Verdict } from '@/types/rules';
import { getWorkHours } from './engine';

const THUNDERSTORM_CODES = [95, 96, 99];

export function evaluateCrane(
  dayHours: HourlyData[],
  _allHours: HourlyData[],
  _dayIndex: number
): Verdict {
  const workHours = getWorkHours(dayHours);
  if (workHours.length === 0) {
    return { status: 'red', reason: 'No work hour data available', date: '' };
  }

  // Check wind
  const maxWind = Math.max(...workHours.map((h) => h.windSpeed));
  if (maxWind >= 20) {
    return { status: 'red', reason: `Wind ${Math.round(maxWind)} mph — exceeds crane safe operating limit`, date: '' };
  }

  // Check gusts
  const maxGusts = Math.max(...workHours.map((h) => h.windGusts));
  if (maxGusts >= 30) {
    return { status: 'red', reason: `Gusts to ${Math.round(maxGusts)} mph — exceeds crane gust limit`, date: '' };
  }

  // Check thunderstorm codes
  const hasThunderstorm = workHours.some((h) => THUNDERSTORM_CODES.includes(h.weatherCode));
  if (hasThunderstorm) {
    return { status: 'red', reason: 'Thunderstorm forecast — crane operations prohibited', date: '' };
  }

  // Check visibility
  const minVisibility = Math.min(...workHours.map((h) => h.visibility));
  if (minVisibility < 1000) {
    return { status: 'red', reason: `Visibility ${Math.round(minVisibility)}m — below crane minimum`, date: '' };
  }

  // Yellow zones
  if (maxWind >= 15 && maxWind < 20) {
    return { status: 'yellow', reason: `Wind ${Math.round(maxWind)} mph — approaching crane limit`, date: '' };
  }
  if (maxGusts >= 25 && maxGusts < 30) {
    return { status: 'yellow', reason: `Gusts to ${Math.round(maxGusts)} mph — monitor conditions`, date: '' };
  }
  // QA: fixed — missing visibility yellow zone per spec (within 10% of 1000m threshold)
  if (minVisibility >= 1000 && minVisibility <= 1100) {
    return { status: 'yellow', reason: `Visibility ${Math.round(minVisibility)}m — near crane minimum`, date: '' };
  }

  return { status: 'green', reason: 'All conditions clear for crane operations', date: '' };
}
