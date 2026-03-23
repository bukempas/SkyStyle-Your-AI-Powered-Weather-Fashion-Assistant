import React, { useState, useEffect } from 'react';
import { Sparkles, Shirt, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { WeatherData, FashionSuggestion, FashionStyle } from '../types';
import { getFashionSuggestions, generateOutfitImage } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils';

interface FashionAssistantProps {
  weather: WeatherData;
}

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

const STYLES: FashionStyle[] = ['casual', 'classic', 'smart casual', 'sportive'];

export const FashionAssistant: React.FC<FashionAssistantProps> = ({ weather }) => {
  const [suggestion, setSuggestion] = useState<FashionSuggestion | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<FashionStyle>('casual');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsKey, setNeedsKey] = useState(false);

  const fetchSuggestion = async (styleOverride?: FashionStyle) => {
    setLoading(true);
    setError(null);
    const style = styleOverride || selectedStyle;
    try {
      const weatherInfo = `${weather.current.temp}°C, ${weather.current.description}, humidity ${weather.current.humidity}%`;
      const result = await getFashionSuggestions(weatherInfo, style);
      setSuggestion(result);
      
      // Try to generate image if key is available
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (hasKey) {
        generateImage(result.imagePrompt);
      } else {
        setNeedsKey(true);
      }
    } catch (err) {
      setError("Failed to get suggestions. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateImage = async (prompt: string) => {
    setImageLoading(true);
    try {
      const imgUrl = await generateOutfitImage(prompt);
      setImage(imgUrl);
      setNeedsKey(false);
    } catch (err: any) {
      if (err.message === "KEY_RESET_REQUIRED") {
        setNeedsKey(true);
      }
      console.error(err);
    } finally {
      setImageLoading(false);
    }
  };

  const handleOpenKey = async () => {
    await window.aistudio.openSelectKey();
    if (suggestion) {
      generateImage(suggestion.imagePrompt);
    }
  };

  const handleStyleChange = (style: FashionStyle) => {
    setSelectedStyle(style);
    fetchSuggestion(style);
  };

  useEffect(() => {
    fetchSuggestion();
  }, [weather.location]);

  return (
    <div className="w-full max-w-2xl space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="text-amber-500" />
            <h2 className="text-2xl font-bold text-gray-800">SkyStyle Assistant</h2>
          </div>
          <button 
            onClick={() => fetchSuggestion()}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <RefreshCw className={cn("w-5 h-5 text-gray-500", loading && "animate-spin")} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {STYLES.map((style) => (
            <button
              key={style}
              onClick={() => handleStyleChange(style)}
              disabled={loading}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                selectedStyle === style
                  ? "bg-blue-600 text-white shadow-md scale-105"
                  : "bg-white/50 text-gray-600 hover:bg-white border border-white/40"
              )}
            >
              {style.charAt(0).toUpperCase() + style.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12 bg-white/50 rounded-3xl border border-dashed border-gray-300"
          >
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Curating your perfect look...</p>
          </motion.div>
        ) : suggestion ? (
          <motion.div 
            key="content"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-100 rounded-xl">
                    <Shirt className="text-amber-600 w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg">Today's Outfit</h3>
                </div>
                <p className="text-gray-600 leading-relaxed mb-4">{suggestion.outfit}</p>
                <div className="flex flex-wrap gap-2">
                  {suggestion.accessories.map((acc, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full uppercase tracking-wider">
                      {acc}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-blue-600 p-6 rounded-3xl shadow-lg text-white">
                <h3 className="font-bold text-lg mb-2">Why this works?</h3>
                <p className="text-blue-100 text-sm leading-relaxed">{suggestion.reasoning}</p>
              </div>
            </div>

            <div className="relative aspect-square bg-gray-100 rounded-3xl overflow-hidden shadow-inner group">
              {imageLoading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
                  <p className="text-xs text-gray-400 font-medium">Generating visual...</p>
                </div>
              ) : image ? (
                <>
                  <img 
                    src={image} 
                    alt="Suggested Outfit" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <button 
                    onClick={() => suggestion && generateImage(suggestion.imagePrompt)}
                    className="absolute bottom-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                    title="Regenerate Visual"
                  >
                    <RefreshCw className="w-4 h-4 text-gray-600" />
                  </button>
                </>
              ) : needsKey ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-amber-50">
                  <AlertCircle className="w-10 h-10 text-amber-500 mb-4" />
                  <h4 className="font-bold text-gray-800 mb-2">Visual Inspiration</h4>
                  <p className="text-sm text-gray-600 mb-6">
                    Connect your Gemini 3 Pro API key to see visual outfit suggestions.
                  </p>
                  <button 
                    onClick={handleOpenKey}
                    className="px-6 py-2 bg-amber-500 text-white font-bold rounded-full hover:bg-amber-600 transition-all shadow-lg hover:shadow-amber-200 active:scale-95"
                  >
                    Connect API Key
                  </button>
                  <a 
                    href="https://ai.google.dev/gemini-api/docs/billing" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-4 text-xs text-amber-600 hover:underline"
                  >
                    Learn about billing
                  </a>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-6 text-center">
                  <p className="text-sm mb-4">No image generated</p>
                  <button 
                    onClick={() => suggestion && generateImage(suggestion.imagePrompt)}
                    className="px-4 py-2 bg-gray-200 text-gray-600 rounded-full text-xs font-bold hover:bg-gray-300 transition-colors"
                  >
                    Try Generating
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
