import fs from 'fs';
import path from 'path';
import { conversationRepository } from '../repositories/conversation.repository';
import template from '../llm/prompts/chatbot.txt';
import { llmClient } from '../llm/client';

const parkInfo = fs.readFileSync(
   path.join(__dirname, '..', 'llm', 'prompts', 'WonderWorld.md'),
   'utf-8'
);

const instructions = template.replace('{{parkInfo}}', parkInfo);

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
      const response = await llmClient.generateText({
         instructions,
         prompt,
         max_output_tokens: 1000,
         previousResponseId:
            conversationRepository.getLastConversationId(conversationId),
      });

      conversationRepository.setLastConversationId(conversationId, response.id);

      return { id: response.id, message: response.text };
   },
};
