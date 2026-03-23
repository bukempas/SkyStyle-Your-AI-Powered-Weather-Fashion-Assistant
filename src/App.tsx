/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Cloud, Search, MapPin, Loader2, Sparkles, ThermometerSun } from 'lucide-react';
import { WeatherCard } from './components/WeatherCard';
import { FashionAssistant } from './components/FashionAssistant';
import { OutfitAnalyzer } from './components/OutfitAnalyzer';
import { VoiceInput } from './components/VoiceInput';
import { DynamicBackground } from './components/DynamicBackground';
import { WeatherChat } from './components/WeatherChat';
import { fetchWeather } from './services/weatherService';
import { WeatherData } from './types';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const data = await fetchWeather(position.coords.latitude, position.coords.longitude);
            setWeather(data);
          } catch (err) {
            setError("Failed to fetch weather for your location.");
          } finally {
            setLoading(false);
          }
        },
        () => {
          // Default to London if permission denied
          handleSearch('London');
        }
      );
    } else {
      handleSearch('London');
    }
  };

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      // Simple geocoding
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
      const geoData = await geoRes.json();
      if (geoData.length > 0) {
        const data = await fetchWeather(parseFloat(geoData[0].lat), parseFloat(geoData[0].lon));
        setWeather(data);
      } else {
        setError("Location not found.");
      }
    } catch (err) {
      setError("An error occurred while searching.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <DynamicBackground conditionCode={weather?.current.conditionCode}>
      <div className="min-h-screen text-gray-900 font-sans selection:bg-blue-100">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/40 backdrop-blur-md border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-xl">
                <Cloud className="text-white w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-gray-800">SkyStyle</h1>
            </div>

            <div className="flex-1 max-w-md mx-8 hidden md:block">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="text"
                  placeholder="Search city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                  className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <VoiceInput onTranscription={(text) => {
                setSearchQuery(text);
                handleSearch(text);
              }} />
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-32"
              >
                <div className="relative">
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                  <Sparkles className="absolute -top-2 -right-2 text-amber-400 animate-pulse" />
                </div>
                <p className="mt-4 text-gray-500 font-medium">Reading the sky...</p>
              </motion.div>
            ) : error ? (
              <motion.div 
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50/80 backdrop-blur-sm border border-red-100 p-6 rounded-3xl text-center max-w-md mx-auto"
              >
                <p className="text-red-600 font-medium">{error}</p>
                <button 
                  onClick={getLocation}
                  className="mt-4 px-6 py-2 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </motion.div>
            ) : weather ? (
              <motion.div 
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-12"
              >
                {/* Hero Section */}
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                  <div className="flex-1 w-full">
                    <div className="mb-8">
                      <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Weather Today</h2>
                      <p className="text-gray-500">Real-time forecast and smart styling advice.</p>
                    </div>
                    <WeatherCard data={weather} />
                  </div>

                  <div className="flex-[1.5] w-full space-y-8">
                    <FashionAssistant weather={weather} />
                    <WeatherChat weather={weather} />
                  </div>
                </div>

                {/* Outfit Analyzer Section */}
                <div className="pt-12 border-t border-gray-900/5">
                  <div className="mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Personal Stylist</h2>
                    <p className="text-gray-500">Upload your own outfit to see if it's right for today.</p>
                  </div>
                  <OutfitAnalyzer weather={weather} />
                </div>

                {/* Features Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-gray-900/5">
                  <div className="p-6 bg-white/60 backdrop-blur-md rounded-3xl shadow-sm border border-white/40">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                      <ThermometerSun className="text-blue-600" />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">Smart Forecast</h3>
                    <p className="text-sm text-gray-500">Hyper-local weather data powered by Open-Meteo for precision accuracy.</p>
                  </div>
                  <div className="p-6 bg-white/60 backdrop-blur-md rounded-3xl shadow-sm border border-white/40">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                      <Sparkles className="text-amber-600" />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">AI Stylist</h3>
                    <p className="text-sm text-gray-500">Gemini 3 Pro analyzes conditions to suggest the perfect outfit for your comfort.</p>
                  </div>
                  <div className="p-6 bg-white/60 backdrop-blur-md rounded-3xl shadow-sm border border-white/40">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                      <MapPin className="text-purple-600" />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">Visual Inspiration</h3>
                    <p className="text-sm text-gray-500">See your suggested look come to life with Gemini 3 Pro Image generation.</p>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </main>

        <footer className="bg-white/40 backdrop-blur-md border-t border-white/20 py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-400 text-sm">© 2026 SkyStyle Assistant. Powered by Gemini AI.</p>
          </div>
        </footer>
      </div>
    </DynamicBackground>
  );
}
