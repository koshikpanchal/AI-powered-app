import { reviewRespository } from '../repositories/review.repository';
import { llmClient } from '../llm/client';
import template from '../prompts/summarize-reviews.txt';

export const reviewService = {
   async summarizeReview(productId: number): Promise<string> {
      const existingSummary =
         await reviewRespository.getReviewSummary(productId);

      if (existingSummary) {
         return existingSummary;
      }

      const reviews = await reviewRespository.getReviews(productId, 10);
      const joinedReviews = reviews.map((r) => r.content).join('\n\n');
      const prompt = template.replace('{{reviews}}', joinedReviews);

      const response = await llmClient.generateText({
         prompt,
      });

      const summary = response.text;
      await reviewRespository.storeReviewSummary(productId, summary);
      return summary;
   },
};
