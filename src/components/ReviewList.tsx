import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { StarRating } from './StarRating';
import { Review } from '@/types';

interface ReviewListProps {
  reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm sm:text-base truncate">
                  {review.clientName}
                </div>
                <div className="text-xs sm:text-sm text-gray-500 mt-1">
                  {formatDate(review.createdAt)}
                </div>
              </div>
              <div className="flex-shrink-0">
                <StarRating rating={review.rating} size="sm" showNumber={false} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              {review.comment}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}