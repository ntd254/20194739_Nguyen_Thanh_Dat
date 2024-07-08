import { CourseDetailDto } from '@/client-sdk';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Rating from '@/components/ui/rating';
import { timeFromNow } from '@/lib/utils/time-from-now';
import { useGetReviews } from './hooks/use-get-reviews';
import { Button } from '@/components/ui/button';
import { convertRating } from '@/lib/utils/convert-rating';
import { useReviewDetail } from './hooks/use-review-detail';
import { useFirstRender } from '@/lib/hooks/use-first-render';
import { useRouter } from 'next/router';

type CourseReviewsProps = {
  course: CourseDetailDto;
};

const CourseReviews: React.FC<CourseReviewsProps> = ({ course }) => {
  const router = useRouter();
  const reviewId = router.query.reviewId as string | undefined;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetReviews();

  // Prevent the page from flashing because of reviewId
  const { firstRender } = useFirstRender();
  const { review, isError } = useReviewDetail();

  if (isError) {
    router.push('/404');
  }
  if (firstRender) return null;

  return (
    <div className="mt-9">
      <h3 className="mb-2 text-2xl font-semibold">Ratings & Reviews</h3>

      <div className="flex items-center">
        <svg
          className="ms-3 h-8 w-8 text-yellow-300"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 22 20"
        >
          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
        </svg>

        <p className="ms-2 text-lg font-medium dark:text-white">
          {course.sumRating &&
            (course.sumRating / course.totalRating).toFixed(1)}
          /5
        </p>
        <span className="mx-1.5 h-[6px] w-[6px] rounded-full bg-gray-500" />
        <p className="text-lg font-medium">
          {course.totalRating} lượt đánh giá
        </p>
      </div>

      <div className="mt-4 space-y-3">
        {!reviewId &&
          data?.pages
            .flatMap((page) => page.results)
            .map((review) => (
              <div key={review.id} className="rounded-md border p-3">
                <div>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={review.user.avatar || undefined} />
                      <AvatarFallback>avatar</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{review.user.name}</p>
                      <div className="flex items-center gap-2 text-sm capitalize text-muted-foreground">
                        <Rating rating={convertRating(review.rating)} />
                        {timeFromNow(review.createdAt)}
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 whitespace-pre-line">{review.content}</p>
                </div>
              </div>
            ))}

        {reviewId && (
          <div
            className="rounded-md border p-3"
            ref={(element) => {
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <div>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={review?.user.avatar || undefined} />
                  <AvatarFallback>avatar</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{review?.user.name}</p>
                  <div className="flex items-center gap-2 text-sm capitalize text-muted-foreground">
                    {review && <Rating rating={convertRating(review.rating)} />}
                    {review && timeFromNow(review.createdAt)}
                  </div>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-line">{review?.content}</p>
            </div>
          </div>
        )}
      </div>

      {hasNextPage && !reviewId && (
        <div className="mt-4 text-center">
          <Button
            loading={isFetchingNextPage}
            variant="outline"
            className="text-base font-medium"
            onClick={() => fetchNextPage()}
          >
            Xem thêm
          </Button>
        </div>
      )}
    </div>
  );
};

export default CourseReviews;
