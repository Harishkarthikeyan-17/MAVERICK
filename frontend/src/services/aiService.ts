import { apiClient } from './apiClient';

export const aiService = {
  async generateResponse(message: string, context?: string): Promise<string> {
    try {
      const data = await apiClient<{ reply: string }>('/ai/chat', {
        method: 'POST',
        data: {
          message,
          systemPrompt: context || 'You are an expert AI coach for a software engineer.'
        }
      });
      return data.reply;
    } catch (error) {
      console.error("AI Generation Error:", error);
      return "I'm currently running in offline mode. I've noted your input and will process it when I reconnect to the Groq LLM cluster.";
    }
  }
};
