'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { HourlyData } from '@/types/weather';

interface HourlyChartsProps {
  hourly: HourlyData[];
}

function formatHour(time: string) {
  const d = new Date(time);
  const h = d.getHours();
  if (h === 0) return '12am';
  if (h === 12) return '12pm';
  return h > 12 ? `${h - 12}pm` : `${h}am`;
}

export function HourlyCharts({ hourly }: HourlyChartsProps) {
  const data = hourly.map((h) => ({
    time: formatHour(h.time),
    temp: Math.round(h.temperature),
    wind: Math.round(h.windSpeed),
    humidity: Math.round(h.humidity),
    precip: h.precipitation,
    precipProb: h.precipitationProbability,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ChartPanel title="Temperature (°F)" dataKey="temp" data={data} color="#1D4ED8" thresholds={[{ value: 40, label: '40°F', color: '#EF4444' }]} />
      <ChartPanel title="Wind (mph)" dataKey="wind" data={data} color="#D97706" thresholds={[{ value: 25, label: '25 mph', color: '#EF4444' }]} />
      <ChartPanel title="Humidity (%)" dataKey="humidity" data={data} color="#10B981" thresholds={[{ value: 85, label: '85%', color: '#EF4444' }]} />
      <ChartPanel title="Precipitation (in)" dataKey="precip" data={data} color="#6366F1" />
    </div>
  );
}

interface Threshold {
  value: number;
  label: string;
  color: string;
}

function ChartPanel({
  title,
  dataKey,
  data,
  color,
  thresholds = [],
}: {
  title: string;
  dataKey: string;
  data: Record<string, string | number>[];
  color: string;
  thresholds?: Threshold[];
}) {
  return (
    <div className="bg-bg rounded-md p-3">
      <h4 className="text-xs font-medium text-text-secondary mb-2">{title}</h4>
      <ResponsiveContainer width="100%" height={140}>
        <LineChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fill: '#64748B' }}
            interval="preserveStartEnd"
            tickLine={false}
          />
          <YAxis tick={{ fontSize: 10, fill: '#64748B' }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '6px',
              fontSize: '12px',
            }}
          />
          {thresholds.map((t) => (
            <ReferenceLine
              key={t.label}
              y={t.value}
              stroke={t.color}
              strokeDasharray="4 4"
              label={{ value: t.label, position: 'right', fontSize: 10, fill: t.color }}
            />
          ))}
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
