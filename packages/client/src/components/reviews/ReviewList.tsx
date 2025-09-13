import axios from 'axios';
import StarRating from './StarRating';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { useState } from 'react';
import ReviewSkeleton from './ReviewSkeleton';

type Props = {
   productId: number;
};

type Review = {
   id: number;
   author: string;
   content: string;
   rating: number;
   createdAt: string;
};

type GetReviewsResponse = {
   summary: string | null;
   reviews: Review[];
};

type SummarizeResponse = {
   summary: string;
};

const ReviewList = ({ productId }: Props) => {
   const {
      data: reviewData,
      isLoading,
      error,
   } = useQuery<GetReviewsResponse>({
      queryKey: ['reviews', productId],
      queryFn: () => fetchReviews(),
   });

   const [summary, setSummarize] = useState('');
   const [isSummaryLoading, setIsSummaryLoading] = useState<boolean>(false);

   const fetchReviews = async () => {
      const { data } = await axios.get(`/api/products/${productId}/reviews`);
      return data;
   };

   const handleSummary = async () => {
      setIsSummaryLoading(true);

      const { data } = await axios.post<SummarizeResponse>(
         `/api/products/${productId}/reviews/summarize`
      );

      setSummarize(data.summary);
      setIsSummaryLoading(false);
   };

   const currentSummary = reviewData?.summary || summary;

   if (isLoading) {
      <ReviewSkeleton />;
   }

   if (error) {
      return (
         <p className="text-red-500">Could not fetch reviews, try again!</p>
      );
   }

   if (!reviewData?.reviews.length) {
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
                     onClick={handleSummary}
                     disabled={isSummaryLoading}
                  >
                     Summarize
                  </Button>
                  {isSummaryLoading && (
                     <div className="py-3">
                        <ReviewSkeleton />
                     </div>
                  )}
               </div>
            )}
         </div>
         <div className="flex flex-col gap-5">
            {reviewData?.reviews.map((review) => (
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
