// Refactored to use backend proxy for Gemini calls

export const getAISuggestion = async (context: string, prompt: string) => {
  // This function is kept for backward compatibility if any components used it directly,
  // but the specific analyze methods below use the backend proxy routes.
  // Actually, since this is specific to context and prompt, we might need a generic route.
  // But let's just make it throw or return a generic message as the specialized endpoints handle the real data.
  return "Please use the specialized methods for health, finance, or meal planning.";
};

export const analyzeHealth = async (symptoms: string) => {
  try {
    const response = await fetch('/api/ai/gemini/health', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ symptoms }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble analyzing that right now. Please try again later.";
  }
};

export const analyzeFinance = async (concern: string, data: any) => {
  try {
    const response = await fetch('/api/ai/gemini/finance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ concern, data }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData.reply;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble analyzing that right now. Please try again later.";
  }
};

export const generateMealPlan = async (ingredients: string, profile: string) => {
  try {
    const response = await fetch('/api/ai/gemini/meal-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ingredients, profile }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble analyzing that right now. Please try again later.";
  }
};
