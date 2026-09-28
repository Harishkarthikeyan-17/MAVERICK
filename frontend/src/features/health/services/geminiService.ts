
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.API_KEY || "";
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const getAISuggestion = async (context: string, prompt: string) => {
  if (!genAI) {
    console.warn("Gemini API Key is missing. AI features will be disabled.");
    return "AI features are currently unavailable. Please configure your API key.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
    const response = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: `Context: ${context}\n\nUser Question/Concern: ${prompt}` }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
      },
    });
    return response.response.text();
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
