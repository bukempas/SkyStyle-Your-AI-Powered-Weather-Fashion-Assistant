import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";
import { FashionSuggestion, FashionStyle } from "../types";

// Note: For gemini-3-pro-image-preview, we need to ensure the user has selected a key.
// We will check this in the UI.

export const getGeminiAI = () => {
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};

export async function getFashionSuggestions(weatherInfo: string, style: FashionStyle = 'casual'): Promise<FashionSuggestion> {
  const ai = getGeminiAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Based on this weather: ${weatherInfo}, suggest a stylish and practical outfit in a ${style} style. 
    Provide the response in JSON format with:
    - outfit: a detailed description of the main clothes following the ${style} aesthetic
    - reasoning: why this is good for the weather and fits the ${style} style
    - accessories: a list of 2-3 matching accessories
    - imagePrompt: a concise prompt for an image generator to visualize this ${style} outfit on a person in a nice setting.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          outfit: { type: Type.STRING },
          reasoning: { type: Type.STRING },
          accessories: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          imagePrompt: { type: Type.STRING }
        },
        required: ["outfit", "reasoning", "accessories", "imagePrompt"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function generateOutfitImage(prompt: string): Promise<string | null> {
  const ai = getGeminiAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: "1K"
        },
        tools: [{ googleSearch: {} }],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.error("Image generation failed:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes("Requested entity was not found")) {
        throw new Error("KEY_RESET_REQUIRED");
    }
  }
  return null;
}

export async function transcribeAudio(base64Audio: string): Promise<string> {
  const ai = getGeminiAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: "audio/wav",
              data: base64Audio
            }
          },
          { text: "Transcribe this audio accurately." }
        ]
      }
    ]
  });
  return response.text || "";
}

export async function analyzeOutfit(base64Image: string, mimeType: string, weatherInfo: string): Promise<string> {
  const ai = getGeminiAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          },
          { text: `Analyze this outfit in the context of the following weather: ${weatherInfo}. 
          Does it fit? Give specific advice on what to add or remove to stay comfortable and stylish. 
          Keep the tone helpful and encouraging.` }
        ]
      }
    ]
  });
  return response.text || "I couldn't analyze the outfit. Please try again.";
}

export async function askWeatherQuestion(question: string, weatherInfo: string): Promise<string> {
  const ai = getGeminiAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `The current weather is: ${weatherInfo}. 
    The user is asking: "${question}". 
    Provide a helpful, concise, and stylish response related to their weather or fashion query.`,
  });
  return response.text || "I'm sorry, I couldn't process that request.";
}
