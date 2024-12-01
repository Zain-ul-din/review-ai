import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface StarRatingProps {
  rating?: number;
  onRate?: (rating: number) => void;
}

export default function StarRating({ rating, onRate }: StarRatingProps) {
  const [hoverIdx, setHoverIdx] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const timeOutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSelectedRating(rating || 0);
  }, [rating]);

  return (
    <div className="flex gap-2">
      {new Array(5).fill(0).map((v, i) => {
        return (
          <span
            key={i}
            className={cn(
              "bg-muted p-2 border cursor-pointer border-muted-foreground/40 rounded-md"
            )}
            onMouseOver={() => {
              if (timeOutRef.current) {
                clearTimeout(timeOutRef.current);
              }
              setHoverIdx(i + 1);
            }}
            onMouseLeave={() => {
              if (timeOutRef.current) {
                clearTimeout(timeOutRef.current);
              }
              timeOutRef.current = setTimeout(() => {
                setHoverIdx(0);
              }, 250);
            }}
            onClick={() => {
              if (onRate) onRate(i + 1);
              setSelectedRating(i + 1);
            }}
          >
            <Star
              className={cn(
                "transition-all duration-200 text-muted-foreground",
                (i < selectedRating || i < hoverIdx) &&
                  "text-yellow-500 fill-yellow-300"
              )}
            />
          </span>
        );
      })}
    </div>
  );
}
