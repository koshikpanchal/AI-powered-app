import { PrismaClient, type Review } from '../generated/prisma';
const prisma = new PrismaClient();

export const reviewRespository = {
   async getReviews(productId: number, limit?: number): Promise<Review[]> {
      return prisma.review.findMany({
         where: { productId },
         orderBy: { createdAt: 'desc' },
         take: limit,
      });
   },

   getReviewSummary(productId: number) {
      return prisma.summary.findUnique({
         where: { productId },
      });
   },
};
