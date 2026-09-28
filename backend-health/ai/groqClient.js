const Groq = require('groq-sdk');

// Ensure API key exists
if (!process.env.GROQ_API_KEY) {
    console.warn('⚠️ GROQ_API_KEY is not set. AI features will not work.');
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateCompletion = async (systemPrompt, userPrompt, config = {}) => {
    try {
        const messages = [];
        if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
        if (userPrompt) messages.push({ role: 'user', content: userPrompt });

        const completion = await groq.chat.completions.create({
            model: config.model || 'llama-3.3-70b-versatile',
            messages,
            max_tokens: config.maxTokens || 1000,
            temperature: config.temperature || 0.7,
        });

        return completion.choices[0].message.content.trim();
    } catch (err) {
        console.error('❌ Groq API Error:', err.message);
        throw err;
    }
};

const generateChat = async (messages, config = {}) => {
    try {
        const completion = await groq.chat.completions.create({
            model: config.model || 'llama-3.3-70b-versatile',
            messages,
            max_tokens: config.maxTokens || 1000,
            temperature: config.temperature || 0.7,
        });

        return completion.choices[0].message.content.trim();
    } catch (err) {
        console.error('❌ Groq API Error:', err.message);
        throw err;
    }
};

module.exports = {
    groq,
    generateCompletion,
    generateChat
};
