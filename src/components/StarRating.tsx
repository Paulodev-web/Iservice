import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  reviewCount?: number;
}

export function StarRating({ 
  rating, 
  maxRating = 5, 
  size = 'md', 
  showNumber = true,
  reviewCount 
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4', 
    lg: 'w-5 h-5'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[...Array(maxRating)].map((_, index) => (
          <Star
            key={index}
            className={`${sizeClasses[size]} ${
              index < Math.floor(rating)
                ? 'fill-amber-400 text-amber-400'
                : index < rating
                ? 'fill-amber-400/50 text-amber-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      {showNumber && (
        <span className={`${textSizes[size]} font-medium text-gray-700`}>
          {rating.toFixed(1)}
          {reviewCount && (
            <span className="text-gray-500 ml-1">({reviewCount})</span>
          )}
        </span>
      )}
    </div>
  );
}