const { GoogleGenerativeAI } = require("@google/generative-ai");

// Ensure API key exists
if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️ GEMINI_API_KEY is not set. Gemini AI features will not work.');
}

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

const getAISuggestion = async (context, prompt) => {
    if (!genAI) {
        console.warn("Gemini API Key is missing. AI features will be disabled.");
        return "AI features are currently unavailable. Please configure your API key.";
    }

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview",
            systemInstruction: "You are MAVERIC AI, a helpful and concise smart management assistant. Provide specific, actionable advice based on the data provided."
        });
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

module.exports = {
    getAISuggestion
};
