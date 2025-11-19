"use client";

import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";

interface RatingBreakdownProps {
  feedbacks: Array<{ rating: number }>;
}

export function RatingBreakdown({ feedbacks }: RatingBreakdownProps) {
  // Calculate rating distribution
  const ratingCounts = feedbacks.reduce(
    (acc, feedback) => {
      acc[feedback.rating] = (acc[feedback.rating] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>
  );

  const totalReviews = feedbacks.length;

  // Calculate average rating
  const averageRating =
    totalReviews > 0
      ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalReviews
      : 0;

  // Get percentage for each rating
  const getRatingData = (rating: number) => {
    const count = ratingCounts[rating] || 0;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { count, percentage };
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-1">Rating Overview</h3>
        <p className="text-sm text-muted-foreground">
          See how customers rate your product or service
        </p>
      </div>

      {/* Average Rating Display */}
      <div className="flex items-center gap-6 p-6 border rounded-lg bg-muted/30">
        <div className="text-center">
          <div className="text-5xl font-bold mb-2">{averageRating.toFixed(1)}</div>
          <div className="flex gap-1 mb-2 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(averageRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            {totalReviews} review{totalReviews !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const { count, percentage } = getRatingData(rating);
            return (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium">{rating}</span>
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                </div>
                <Progress value={percentage} className="flex-1 h-2" />
                <div className="w-16 text-right">
                  <span className="text-sm text-muted-foreground">
                    {count} ({percentage.toFixed(0)}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
