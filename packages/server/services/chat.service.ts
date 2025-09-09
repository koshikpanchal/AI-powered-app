import OpenAI from 'openai';
import { conversationRepository } from '../repositories/conversation.repository';

// Hugging Face model endpoint via OpenAI SDK
const MODEL = 'HuggingFaceTB/SmolLM3-3B:hf-inference';

// Create a reusable client once
const client = new OpenAI({
   baseURL: 'https://router.huggingface.co/v1',
   apiKey: process.env.HUGGING_FACE_ACCESS_KEY,
});

type ChatResponse = {
   id: string;
   message: string;
};

//public interface
export const chatService = {
   async sendMessage(
      prompt: string,
      conversationId: string
   ): Promise<ChatResponse> {
      const response = await client.responses.create({
         model: MODEL,
         input: prompt,
         temperature: 0.2,
         previous_response_id:
            conversationRepository.getLastConversationId(conversationId),
      });

      conversationRepository.setLastConversationId(conversationId, response.id);

      let output = response.output_text
         .replace(/<think>[\s\S]*?<\/think>/g, '')
         .trim();

      return { id: response.id, message: response.output_text };
   },
};
