import type { Request, Response } from 'express';
import { reviewService } from '../services/review.service';
import { productRepository } from '../repositories/product.repository';
import { reviewRespository } from '../repositories/review.repository';

export const reviewController = {
   async fetchReviews(req: Request, res: Response) {
      const productId = Number(req.params.id);

      if (isNaN(productId)) {
         res.status(400).json({ error: 'Invalid Product ID' });
      }

      const product = await productRepository.getProductRepository(productId);

      if (!product) {
         res.status(400).json({ error: "product doesn't exist" });
         return;
      }

      const reviews = reviewRespository.getReviews(productId, 1);

      if (!reviews) {
         res.status(400).json({ error: "review doesn't exist" });
         return;
      }

      const summary = await reviewService.getReview(productId);

      res.json(summary);
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
