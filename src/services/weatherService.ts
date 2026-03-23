import { WeatherData } from "../types";

export const WEATHER_CODES: Record<number, { description: string; icon: string }> = {
  0: { description: "Clear sky", icon: "Sun" },
  1: { description: "Mainly clear", icon: "Sun" },
  2: { description: "Partly cloudy", icon: "CloudSun" },
  3: { description: "Overcast", icon: "Cloud" },
  45: { description: "Foggy", icon: "CloudFog" },
  48: { description: "Depositing rime fog", icon: "CloudFog" },
  51: { description: "Light drizzle", icon: "CloudDrizzle" },
  53: { description: "Moderate drizzle", icon: "CloudDrizzle" },
  55: { description: "Dense drizzle", icon: "CloudDrizzle" },
  61: { description: "Slight rain", icon: "CloudRain" },
  63: { description: "Moderate rain", icon: "CloudRain" },
  65: { description: "Heavy rain", icon: "CloudRain" },
  71: { description: "Slight snow", icon: "CloudSnow" },
  73: { description: "Moderate snow", icon: "CloudSnow" },
  75: { description: "Heavy snow", icon: "CloudSnow" },
  95: { description: "Thunderstorm", icon: "CloudLightning" },
};

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
  
  const response = await fetch(url);
  const data = await response.json();

  // Reverse geocoding to get location name
  const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
  const geoResponse = await fetch(geoUrl);
  const geoData = await geoResponse.json();
  const location = geoData.address.city || geoData.address.town || geoData.address.village || "Unknown Location";

  return {
    current: {
      temp: data.current.temperature_2m,
      description: WEATHER_CODES[data.current.weather_code]?.description || "Unknown",
      icon: WEATHER_CODES[data.current.weather_code]?.icon || "Cloud",
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      conditionCode: data.current.weather_code,
    },
    daily: data.daily.time.map((time: string, i: number) => ({
      date: time,
      tempMax: data.daily.temperature_2m_max[i],
      tempMin: data.daily.temperature_2m_min[i],
      conditionCode: data.daily.weather_code[i],
    })),
    location,
  };
}
