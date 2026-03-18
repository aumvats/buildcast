import { HourlyData } from '@/types/weather';
import { Verdict, ActivityType } from '@/types/rules';
import { evaluateConcrete } from './concrete';
import { evaluatePainting } from './painting';
import { evaluateRoofing } from './roofing';
import { evaluateCrane } from './crane';
import { evaluateExcavation } from './excavation';
import { evaluateGeneral } from './general';

type EvaluateFn = (dayHours: HourlyData[], allHours: HourlyData[], dayIndex: number) => Verdict;

const evaluators: Record<ActivityType, EvaluateFn> = {
  concrete: evaluateConcrete,
  painting: evaluatePainting,
  roofing: evaluateRoofing,
  crane: evaluateCrane,
  excavation: evaluateExcavation,
  general: evaluateGeneral,
};

export function getWorkHours(hours: HourlyData[]): HourlyData[] {
  return hours.filter((h) => {
    const hour = new Date(h.time).getHours();
    return hour >= 8 && hour <= 17;
  });
}

export function getDayHours(allHours: HourlyData[], dayIndex: number): HourlyData[] {
  const dayStart = dayIndex * 24;
  const dayEnd = dayStart + 24;
  return allHours.slice(dayStart, Math.min(dayEnd, allHours.length));
}

export function runRules(
  allHours: HourlyData[],
  activity: ActivityType,
  days: string[]
): Verdict[] {
  const evaluator = evaluators[activity];
  return days.map((date, dayIndex) => {
    const dayHours = getDayHours(allHours, dayIndex);
    if (dayHours.length === 0) {
      return { status: 'red', reason: 'No forecast data available', date };
    }
    const verdict = evaluator(dayHours, allHours, dayIndex);
    return { ...verdict, date };
  });
}
