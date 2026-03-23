import React from 'react';
import { Sun, Cloud, CloudSun, CloudRain, CloudSnow, CloudFog, CloudDrizzle, CloudLightning, Wind, Droplets, MapPin } from 'lucide-react';
import { WeatherData } from '../types';
import { motion } from 'motion/react';
import { WEATHER_CODES } from '../services/weatherService';

const IconMap: Record<string, any> = {
  Sun, Cloud, CloudSun, CloudRain, CloudSnow, CloudFog, CloudDrizzle, CloudLightning
};

export const WeatherCard: React.FC<{ data: WeatherData }> = ({ data }) => {
  const Icon = IconMap[data.current.icon] || Cloud;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/20 w-full max-w-md"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <MapPin size={16} />
            <span className="text-sm font-medium">{data.location}</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-800">{data.current.temp}°C</h2>
          <p className="text-lg text-gray-600 capitalize">{data.current.description}</p>
        </div>
        <Icon size={64} className="text-blue-500" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-2xl flex items-center gap-3">
          <Droplets className="text-blue-500" />
          <div>
            <p className="text-xs text-gray-500">Humidity</p>
            <p className="font-semibold text-gray-800">{data.current.humidity}%</p>
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-2xl flex items-center gap-3">
          <Wind className="text-blue-500" />
          <div>
            <p className="text-xs text-gray-500">Wind</p>
            <p className="font-semibold text-gray-800">{data.current.windSpeed} km/h</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">7-Day Forecast</h3>
        <div className="space-y-4">
          {data.daily.slice(1, 8).map((day, i) => {
            const dayInfo = WEATHER_CODES[day.conditionCode] || { description: 'Unknown', icon: 'Cloud' };
            const DayIcon = IconMap[dayInfo.icon] || Cloud;
            
            return (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-3 w-24">
                  <span className="text-sm font-medium text-gray-600">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <DayIcon size={20} className="text-blue-400 group-hover:scale-110 transition-transform" />
                </div>
                
                <span className="text-xs text-gray-400 flex-1 truncate px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {dayInfo.description}
                </span>

                <div className="flex items-center gap-2 w-16 justify-end">
                  <span className="text-sm font-bold text-gray-800">{Math.round(day.tempMax)}°</span>
                  <span className="text-sm text-gray-400">{Math.round(day.tempMin)}°</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
