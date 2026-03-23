<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/9df9028c-7a8c-43f4-91a0-2029042b10a1

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

✨ Key Features
🌦️ Smart Weather Intelligence
•	Real-time Forecasts: Precise weather data (temperature, humidity, wind, and conditions) powered by the Open-Meteo API.
•	7-Day Outlook: Detailed weekly forecast with condition icons and descriptions.
•	Dynamic Atmosphere: An immersive UI that transforms its background and animations (Rain, Snow, Sun, Clouds) based on live weather conditions.
👗 AI Fashion Curation
•	Personalized Suggestions: Gemini 3 Pro analyzes current conditions to suggest the perfect outfit, complete with reasoning and accessory matching.
•	Style Profiles: Choose your aesthetic—Casual, Classic, Smart Casual, or Sportive—and get tailored recommendations.
•	Visual Inspiration: High-quality outfit visualizations generated in real-time using Gemini 3 Pro Image.
🛠️ Interactive Styling Tools
•	Outfit Analyzer: Upload a photo of your planned outfit, and the AI will analyze its suitability for the current weather.
•	Ask SkyStyle (Chat): A dedicated weather-aware chat interface to ask specific questions like "Is it too cold for a silk skirt today?".
•	Voice Search: Hands-free city searching using advanced audio transcription.
🚀 Tech Stack
•	Frontend: React 18, TypeScript, Tailwind CSS
•	Animations: Motion (Framer Motion)
•	AI Engine: Google Gemini 3 Pro (Text & Vision), Gemini 3 Pro Image, Gemini 3 Flash
•	APIs: Open-Meteo (Weather), Nominatim (Geocoding)
•	Icons: Lucide React
