import { useEffect, useState } from 'react';
import axios from 'axios';
import StarRating from './StarRating';
import Skeleton from 'react-loading-skeleton';

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

const ReviewList = ({ productId }: Props) => {
   const [reviewData, setReviewData] = useState<GetReviewsResponse>();
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [error, setError] = useState('');

   const fetchReviews = async () => {
      try {
         setIsLoading(true);
         const { data } = await axios.get(`/api/products/${productId}/reviews`);
         setReviewData(data);
         setIsLoading(false);
      } catch (er) {
         console.error(er);
         setError('Could not fetch the review, try again!');
         setIsLoading(false);
      }
   };

   useEffect(() => {
      fetchReviews();
   }, []);

   if (isLoading) {
      return (
         <div className="flex flex-col gap-5">
            {[1, 2, 3].map((i) => (
               <div key={i}>
                  <Skeleton width={800} />
                  <Skeleton width={400} />
                  <Skeleton width={200} />
               </div>
            ))}
         </div>
      );
   }

   if (error) {
      return <p className="text-red-500">{error}</p>;
   }

   return (
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
   );
};

export default ReviewList;
