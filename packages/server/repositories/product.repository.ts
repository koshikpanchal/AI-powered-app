import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

export const productRepository = {
   getProductRepository(productId: number) {
      return prisma.product.findUnique({
         where: { id: productId },
      });
   },
};
