"use client";

import { cn } from "@/lib/utils";
import {
  TextureButton,
  UnifiedButtonProps
} from "@/components/ui/texture-button";
import { Avatar, AvatarImage } from "../ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from "../ui/dialog";
import { FeedbackForm } from "./feedback-form";
import { useShapeConfetti } from "@/hooks/use-shape-confetti";

interface CampaignProps {
  ctaText: string;
  onFeedbackBtnClick?: () => void;
  orgName: string;
  avatar: string;
}

export default function Campaign({
  ctaText,
  onFeedbackBtnClick,
  orgName,
  avatar
}: CampaignProps) {
  const triggerShapeConfetti = useShapeConfetti();

  return (
    <main
      className={cn(
        "w-full min-h-[100svh]",
        "flex justify-center items-center p-4"
      )}
      style={{
        background: "var(--pink-indigo)"
      }}
    >
      <div
        className={cn(
          "max-w-[550px]",
          "rounded-lg  w-full bg-gradient-to-bl from-background via-background/80 to-background",
          "border-2 p-6 sm:p-12 relative",
          "space-y-6"
        )}
      >
        <h1 className="text-2xl flex items-center gap-2">
          <Avatar>
            <AvatarImage src={avatar} alt="orbisdev logo" />
          </Avatar>
          {orgName}
        </h1>

        {/* <p className="text-2xl text-center py-8">
          Thank You for Your Feedback! 🙌
        </p> */}

        <p className="text-lg md:text-xl px-1">{ctaText}</p>

        <div className="flex">
          <div className="mx-auto">
            {onFeedbackBtnClick ? (
              <SubmitReviewBtn onClick={onFeedbackBtnClick} />
            ) : (
              <Dialog
                onOpenChange={(open) => {
                  if (!open) triggerShapeConfetti();
                }}
              >
                <DialogTrigger>
                  <SubmitReviewBtn />
                </DialogTrigger>
                <DialogContent className="overflow-y-auto max-h-[90svh]">
                  <DialogTitle className="sr-only">
                    Submit Review Dialog
                  </DialogTitle>
                  <FeedbackForm ratingComponent="star" />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* <FeedbackForm /> */}
        {/* <h1>OrbisDev</h1> */}
      </div>
    </main>
  );
}

const SubmitReviewBtn = ({ ...rest }: UnifiedButtonProps) => (
  <TextureButton {...rest}>Submit reviews</TextureButton>
);
