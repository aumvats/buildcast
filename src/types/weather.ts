export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    precipitation: number[];
    windspeed_10m: number[];
    windgusts_10m: number[];
    relativehumidity_2m: number[];
    dewpoint_2m: number[];
    cloudcover: number[];
    visibility: number[];
    weathercode: number[];
  };
  daily: {
    time: string[];
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    windspeed_10m_max: number[];
  };
}

export interface HourlyData {
  time: string;
  temperature: number;
  precipitationProbability: number;
  precipitation: number;
  windSpeed: number;
  windGusts: number;
  humidity: number;
  dewpoint: number;
  cloudCover: number;
  visibility: number;
  weatherCode: number;
}

export interface DailyData {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitationSum: number;
  windSpeedMax: number;
}

export function parseHourlyData(raw: OpenMeteoResponse): HourlyData[] {
  return raw.hourly.time.map((time, i) => ({
    time,
    temperature: raw.hourly.temperature_2m[i],
    precipitationProbability: raw.hourly.precipitation_probability[i],
    precipitation: raw.hourly.precipitation[i],
    windSpeed: raw.hourly.windspeed_10m[i],
    windGusts: raw.hourly.windgusts_10m[i],
    humidity: raw.hourly.relativehumidity_2m[i],
    dewpoint: raw.hourly.dewpoint_2m[i],
    cloudCover: raw.hourly.cloudcover[i],
    visibility: raw.hourly.visibility[i],
    weatherCode: raw.hourly.weathercode[i],
  }));
}

export function parseDailyData(raw: OpenMeteoResponse): DailyData[] {
  return raw.daily.time.map((date, i) => ({
    date,
    weatherCode: raw.daily.weathercode[i],
    tempMax: raw.daily.temperature_2m_max[i],
    tempMin: raw.daily.temperature_2m_min[i],
    precipitationSum: raw.daily.precipitation_sum[i],
    windSpeedMax: raw.daily.windspeed_10m_max[i],
  }));
}
