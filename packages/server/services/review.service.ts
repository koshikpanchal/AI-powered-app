import { reviewRespository } from '../repositories/review.repository';
import { llmClient } from '../llm/client';

export const reviewService = {
   async summarizeReview(productId: number): Promise<string> {
      const existingSummary =
         await reviewRespository.getReviewSummary(productId);

      if (existingSummary) {
         return existingSummary;
      }

      const reviews = await reviewRespository.getReviews(productId, 10);
      const joinedReviews = reviews.map((r) => r.content).join('\n\n');

      const response = await llmClient.summarizeReviewsViaOllma(joinedReviews);

      await reviewRespository.storeReviewSummary(productId, response);
      return response;
   },
};
