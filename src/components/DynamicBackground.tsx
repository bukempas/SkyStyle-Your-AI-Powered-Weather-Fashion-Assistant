import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils';

interface DynamicBackgroundProps {
  conditionCode?: number;
  children: React.ReactNode;
}

type WeatherTheme = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'night' | 'default';

export const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ conditionCode, children }) => {
  const theme = useMemo((): WeatherTheme => {
    if (conditionCode === undefined) return 'default';
    
    // Open-Meteo codes
    if ([0, 1].includes(conditionCode)) return 'sunny';
    if ([2, 3, 45, 48].includes(conditionCode)) return 'cloudy';
    if ([51, 53, 55, 61, 63, 65, 95].includes(conditionCode)) return 'rainy';
    if ([71, 73, 75].includes(conditionCode)) return 'snowy';
    
    return 'default';
  }, [conditionCode]);

  const themeStyles = {
    sunny: "bg-gradient-to-br from-amber-100 via-orange-50 to-blue-100",
    cloudy: "bg-gradient-to-br from-slate-200 via-gray-100 to-blue-50",
    rainy: "bg-gradient-to-br from-slate-400 via-blue-300 to-slate-500",
    snowy: "bg-gradient-to-br from-blue-50 via-white to-slate-100",
    night: "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800",
    default: "bg-[#f8fafc]"
  };

  return (
    <div className={cn("min-h-screen transition-colors duration-1000 relative overflow-hidden", themeStyles[theme])}>
      {/* Weather Effects Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {theme === 'rainy' && Array.from({ length: 50 }).map((_, i) => (
          <div 
            key={i} 
            className="rain-drop" 
            style={{ 
              left: `${Math.random() * 100}%`, 
              animationDuration: `${0.5 + Math.random() * 0.5}s`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: Math.random() * 0.5
            }} 
          />
        ))}
        {theme === 'snowy' && Array.from({ length: 40 }).map((_, i) => (
          <div 
            key={i} 
            className="snow-flake" 
            style={{ 
              left: `${Math.random() * 100}%`, 
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              animationDuration: `${3 + Math.random() * 5}s`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.4 + Math.random() * 0.6
            }} 
          />
        ))}
        {theme === 'sunny' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            className="absolute top-[-10%] right-[-10%] w-[40%] aspect-square bg-amber-200 rounded-full blur-[120px]"
          />
        )}
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
