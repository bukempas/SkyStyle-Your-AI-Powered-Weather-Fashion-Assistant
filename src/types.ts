export interface WeatherData {
  current: {
    temp: number;
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    conditionCode: number;
  };
  daily: Array<{
    date: string;
    tempMax: number;
    tempMin: number;
    conditionCode: number;
  }>;
  location: string;
}

export type FashionStyle = 'classic' | 'casual' | 'smart casual' | 'sportive';

export interface FashionSuggestion {
  outfit: string;
  reasoning: string;
  accessories: string[];
  imagePrompt: string;
}
