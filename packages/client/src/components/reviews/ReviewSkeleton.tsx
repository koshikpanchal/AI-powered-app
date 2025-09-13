import Skeleton from 'react-loading-skeleton';

const ReviewSkeleton = () => {
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
};

export default ReviewSkeleton;
