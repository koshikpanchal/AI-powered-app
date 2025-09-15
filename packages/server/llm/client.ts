import OpenAI from 'openai';
import { InferenceClient } from '@huggingface/inference';
import summarizePrompt from './prompts/summarize-reviews.txt';

// Hugging Face model endpoint via OpenAI SDK
const MODEL = 'HuggingFaceTB/SmolLM3-3B:hf-inference';

// Create a reusable client once
const openAIClient = new OpenAI({
   baseURL: 'https://router.huggingface.co/v1',
   apiKey: process.env.HUGGING_FACE_ACCESS_KEY,
});

const infrenceClient = new InferenceClient(process.env.HUGGING_FACE_ACCESS_KEY);

type GenerateTextOptions = {
   model?: string;
   instructions?: string;
   prompt: string;
   temperature?: number;
   max_output_tokens?: number;
   previousResponseId?: string;
};

type GenerateTextResult = {
   id: string;
   text: string;
};

export const llmClient = {
   async generateText({
      model = MODEL,
      prompt,
      temperature = 0.2,
      max_output_tokens = 500,
      instructions,
      previousResponseId,
   }: GenerateTextOptions): Promise<GenerateTextResult> {
      const response = await openAIClient.responses.create({
         model,
         input: prompt,
         temperature,
         instructions,
         max_output_tokens,
         previous_response_id: previousResponseId,
      });

      const output = response.output_text
         .replace(/<think>[\s\S]*?<\/think>/g, '')
         .trim();

      return { id: response.id, text: output };
   },

   async summarizeReviews(reviews: string) {
      const chatCompletion = await infrenceClient.chatCompletion({
         provider: 'cerebras',
         model: 'meta-llama/Llama-3.1-8B-Instruct',
         messages: [
            {
               role: 'system',
               content: summarizePrompt,
            },
            {
               role: 'user',
               content: reviews,
            },
         ],
      });

      return chatCompletion.choices[0]?.message.content || '';
   },
};
