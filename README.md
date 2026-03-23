<div align="center">

<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

  <h1>Built with AI Studio</h2>

  <p>The fastest path from prompt to production with Gemini.</p>

  <a href="https://aistudio.google.com/apps">Start building</a>

</div>

SkyStyle: Your AI-Powered Weather & Fashion Assistant
SkyStyle is a sophisticated, full-stack web application that bridges the gap between hyper-local weather forecasting and personal styling. Powered by the latest Gemini 3 Pro AI models, SkyStyle ensures you never step out underdressed or unprepared for the elements.
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
🛠️ Setup & Installation
1.	Clone the repository:
codeBash
git clone https://github.com/your-username/skystyle.git
cd skystyle
2.	Install dependencies:
codeBash
npm install
3.	Environment Variables:
Create a .env file and add your Gemini API Key:
codeEnv
GEMINI_API_KEY=your_api_key_here
4.	Run the development server:
codeBash
npm run dev
________________________________________
SkyStyle — Because looking good shouldn't depend on the forecast.
