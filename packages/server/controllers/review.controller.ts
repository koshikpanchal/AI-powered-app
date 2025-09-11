import type { Request, Response } from 'express';
import { reviewService } from '../services/review.service';

export const reviewController = {
   async fetchReviews(req: Request, res: Response) {
      const productId = Number(req.params.id);

      if (isNaN(productId)) {
         res.status(400).json({ error: 'Invalid Product ID' });
      }

      const reviews = await reviewService.getReview(productId);

      res.json(reviews);
   },
};
