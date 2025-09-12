import type { Request, Response } from 'express';
import { reviewService } from '../services/review.service';
import { productRepository } from '../repositories/product.repository';
import { reviewRespository } from '../repositories/review.repository';

export const reviewController = {
   async getReviews(req: Request, res: Response) {
      const productId = Number(req.params.id);

      if (isNaN(productId)) {
         res.status(400).json({ error: 'Invalid Product ID' });
      }

      const product = await productRepository.getProduct(productId);

      if (!product) {
         res.status(404).json({ error: "product doesn't exist" });
         return;
      }

      const reviews = await reviewRespository.getReviews(productId, 1);

      if (!reviews) {
         res.status(400).json({ error: "review doesn't exist" });
         return;
      }

      const summary = await reviewRespository.getReviewSummary(productId);
      const allReviews = await reviewRespository.getReviews(productId);

      res.json({ summary, reviews: allReviews });
   },

   async summarizeReviews(req: Request, res: Response) {
      const productId = Number(req.params.id);

      if (isNaN(productId)) {
         res.status(400).json({ error: 'Invalid Product ID' });
      }

      const summary = await reviewService.summarizeReview(productId);

      res.json({ summary });
   },
};
