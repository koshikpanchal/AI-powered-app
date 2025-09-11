import OpenAI from 'openai';
import { type Review } from '../generated/prisma';
import { reviewRespository } from '../repositories/review.repository';

// Hugging Face model endpoint via OpenAI SDK
const MODEL = 'HuggingFaceTB/SmolLM3-3B:hf-inference';

// Create a reusable client once
const client = new OpenAI({
   baseURL: 'https://router.huggingface.co/v1',
   apiKey: process.env.HUGGING_FACE_ACCESS_KEY,
});

export const reviewService = {
   async getReview(productId: number): Promise<Review[]> {
      return reviewRespository.getReviews(productId);
   },

   async summarizeReview(productId: number): Promise<string> {
      const reviews = await reviewRespository.getReviews(productId, 10);
      const joinedReviews = reviews.map((r) => r.content).join('\n\n');
      const prompt = `summarize the following customer reviews into a short paragraph highlighting key themes, both positive and negative:
      
      ${joinedReviews}`;

      const response = await client.responses.create({
         model: MODEL,
         input: prompt,
         temperature: 0.2,
         max_output_tokens: 500,
      });
      return response.output_text
         .replace(/<think>[\s\S]*?<\/think>/g, '')
         .trim();
   },
};
