import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle2, AlertCircle, Loader2, Camera } from 'lucide-react';
import { analyzeOutfit } from '../services/geminiService';
import { WeatherData } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';

interface OutfitAnalyzerProps {
  weather: WeatherData;
}

export const OutfitAnalyzer: React.FC<OutfitAnalyzerProps> = ({ weather }) => {
  const [image, setImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setMimeType(file.type);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const base64 = image.split(',')[1];
      const weatherInfo = `${weather.current.temp}°C, ${weather.current.description}`;
      const result = await analyzeOutfit(base64, mimeType, weatherInfo);
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setImage(null);
    setAnalysis(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-xl">
          <Camera className="text-purple-600 w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Outfit Check</h2>
          <p className="text-sm text-gray-500">Upload a photo to see if it fits the weather.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          {!image ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="aspect-[3/4] border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all group"
            >
              <div className="p-4 bg-gray-50 rounded-full group-hover:bg-purple-100 transition-colors mb-4">
                <Upload className="w-8 h-8 text-gray-400 group-hover:text-purple-500" />
              </div>
              <p className="text-gray-500 font-medium">Click to upload photo</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG or WebP</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          ) : (
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-lg group">
              <img src={image} alt="Upload" className="w-full h-full object-cover" />
              <button 
                onClick={clear}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-colors"
              >
                <X size={20} />
              </button>
              {!analysis && !loading && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                    onClick={handleAnalyze}
                    className="px-8 py-3 bg-white text-gray-900 font-bold rounded-full shadow-xl hover:scale-105 transition-transform"
                  >
                    Analyze Now
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center py-12"
              >
                <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Analyzing your style...</p>
              </motion.div>
            ) : analysis ? (
              <motion.div 
                key="analysis"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-1 space-y-6"
              >
                <div className="flex items-center gap-2 text-green-600 font-bold">
                  <CheckCircle2 size={20} />
                  <span>Analysis Complete</span>
                </div>
                <div className="prose prose-sm max-w-none text-gray-600 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <ReactMarkdown>{analysis}</ReactMarkdown>
                </div>
                <button 
                  onClick={clear}
                  className="w-full py-3 border-2 border-gray-100 text-gray-500 font-bold rounded-2xl hover:bg-gray-50 transition-colors"
                >
                  Check Another Outfit
                </button>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-100 rounded-3xl">
                <AlertCircle className="w-12 h-12 text-gray-300 mb-4" />
                <h3 className="font-bold text-gray-800 mb-2">Ready for Analysis</h3>
                <p className="text-sm text-gray-500">
                  Upload a photo of your outfit to get personalized feedback based on current weather conditions.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
