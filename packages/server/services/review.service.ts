import { type Review } from '../generated/prisma';
import { reviewRespository } from '../repositories/review.repository';
import { llmClient } from '../llm/client';
import template from '../prompts/summarize-reviews.txt';

export const reviewService = {
   async getReview(productId: number): Promise<Review[]> {
      return reviewRespository.getReviews(productId);
   },

   async summarizeReview(productId: number): Promise<string> {
      const reviews = await reviewRespository.getReviews(productId, 10);
      const joinedReviews = reviews.map((r) => r.content).join('\n\n');
      const prompt = template.replace('{{reviews}}', joinedReviews);

      const response = await llmClient.generateText({
         prompt,
      });

      return response.text;
   },
};
