import { type Review } from '../generated/prisma';
import { reviewRespository } from '../repositories/review.repository';

export const reviewService = {
   getReview(productId: number): Promise<Review[]> {
      return reviewRespository.getReview(productId);
   },
};
