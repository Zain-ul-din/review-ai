import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface StarRatingProps {
  rating?: number;
  onRate?: (rating: number) => void;
}

export default function EmojiRating({ rating, onRate }: StarRatingProps) {
  const [hoverIdx, setHoverIdx] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const timeOutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSelectedRating(rating || 0);
  }, [rating]);

  useEffect(() => {
    if (!onRate) return;
    onRate(selectedRating);
  }, [selectedRating, onRate]);

  return (
    <div className="flex gap-2">
      {["😠", "😟", "😐", "🙂", "😍"].map((v, i) => {
        return (
          <span
            key={i}
            className={cn(
              "bg-muted p-2 border cursor-pointer border-muted-foreground/40 rounded-md text-xl",
              (i < selectedRating || i < hoverIdx) && "bg-yellow-100"
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
              setSelectedRating(i + 1);
            }}
          >
            {v}
          </span>
        );
      })}
    </div>
  );
}
