import StarRating from './StarRating';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '../ui/button';
import ReviewSkeleton from './ReviewSkeleton';
import {
   reviewsApi,
   type GetReviewsResponse,
   type SummarizeResponse,
} from './ReviewsApi';

type Props = {
   productId: number;
};

const ReviewList = ({ productId }: Props) => {
   const reviewsQuery = useQuery<GetReviewsResponse>({
      queryKey: ['reviews', productId],
      queryFn: () => reviewsApi.fetchReviews(productId),
   });

   const summaryMutation = useMutation<SummarizeResponse>({
      mutationFn: () => reviewsApi.summarizeReviews(productId),
   });

   const currentSummary =
      reviewsQuery.data?.summary || summaryMutation.data?.summary;

   if (reviewsQuery.isLoading) {
      <ReviewSkeleton />;
   }

   if (reviewsQuery.isError) {
      return (
         <p className="text-red-500">Could not fetch reviews, try again!</p>
      );
   }

   if (!reviewsQuery.data?.reviews.length) {
      return null;
   }

   return (
      <div>
         <div>
            {currentSummary ? (
               <p>{currentSummary}</p>
            ) : (
               <div>
                  <Button
                     className="cursor-pointer"
                     onClick={() => summaryMutation.mutate()}
                     disabled={summaryMutation.isPending}
                  >
                     Summarize
                  </Button>
                  {summaryMutation.isPending && (
                     <div className="py-3">
                        <ReviewSkeleton />
                     </div>
                  )}
                  {summaryMutation.isError && (
                     <p className="text-red-500">
                        Could not summarize review, try again !
                     </p>
                  )}
               </div>
            )}
         </div>
         <div className="flex flex-col gap-5">
            {reviewsQuery.data?.reviews.map((review) => (
               <div key={review.id}>
                  <div className="font-semibold">{review.author}</div>
                  <div>
                     <StarRating value={review.rating} />
                  </div>
                  <p className="py-2">{review.content}</p>
               </div>
            ))}
         </div>
      </div>
   );
};

export default ReviewList;
