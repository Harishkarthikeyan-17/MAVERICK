
import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getAISuggestion = async (context: string, prompt: string) => {
  if (!ai) {
    console.warn("Gemini API Key is missing. AI features will be disabled.");
    return "AI features are currently unavailable. Please configure your API key.";
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [{ text: `Context: ${context}\n\nUser Question/Concern: ${prompt}` }]
        }
      ],
      config: {
        systemInstruction: "You are MAVERIC AI, a helpful and concise smart management assistant. Provide specific, actionable advice based on the data provided.",
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble analyzing that right now. Please try again later.";
  }
};

export const analyzeHealth = async (symptoms: string) => {
  return getAISuggestion("Health Monitoring", `User symptoms: ${symptoms}. Provide non-emergency health advice.`);
};

export const analyzeFinance = async (concern: string, data: any) => {
  return getAISuggestion("Finance Tracking", `User concern: ${concern}. Current Financials: ${JSON.stringify(data)}.`);
};

export const generateMealPlan = async (ingredients: string, profile: string) => {
  return getAISuggestion("Meal Planning", `Ingredients available: ${ingredients}. Health profile: ${profile}. Suggest a balanced meal.`);
};
