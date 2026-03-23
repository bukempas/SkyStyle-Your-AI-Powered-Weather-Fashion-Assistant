import React, { useState } from 'react';
import { MessageSquare, Send, Loader2 } from 'lucide-react';
import { askWeatherQuestion } from '../services/geminiService';
import { WeatherData } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';

interface WeatherChatProps {
  weather: WeatherData;
}

export const WeatherChat: React.FC<WeatherChatProps> = ({ weather }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    try {
      const weatherInfo = `${weather.current.temp}°C, ${weather.current.description}, humidity ${weather.current.humidity}%`;
      const result = await askWeatherQuestion(question, weatherInfo);
      setAnswer(result);
    } catch (error) {
      console.error('Chat failed:', error);
      setAnswer("Sorry, I couldn't get an answer right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/40 w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-xl">
          <MessageSquare className="text-blue-600 w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Ask SkyStyle</h2>
          <p className="text-sm text-gray-500">Ask anything about today's weather or what to wear.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative mb-6">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Should I bring an umbrella? Is it too cold for a skirt?"
          className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl py-4 pl-6 pr-14 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-gray-800"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 transition-all shadow-lg active:scale-95"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </button>
      </form>

      <AnimatePresence mode="wait">
        {answer && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100/50"
          >
            <div className="prose prose-sm max-w-none text-gray-700">
              <ReactMarkdown>{answer}</ReactMarkdown>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
