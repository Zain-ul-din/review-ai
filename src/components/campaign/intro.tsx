"use client";

import { cn } from "@/lib/utils";
import {
  TextureButton,
  UnifiedButtonProps,
} from "@/components/ui/texture-button";
import { Avatar, AvatarImage } from "../ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { FeedbackForm, FeedbackFormProps } from "./feedback-form";
// import { useShapeConfetti } from "@/hooks/use-shape-confetti";
import { ArrowLeftRight, ArrowRight } from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  useUser,
} from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

interface CampaignProps {
  ctaText: string;
  onFeedbackBtnClick?: () => void;
  orgName: string;
  avatar: string;
  formProps?: FeedbackFormProps;
}

export function CampaignIntro({
  ctaText,
  onFeedbackBtnClick,
  orgName,
  avatar,
  formProps,
}: CampaignProps) {
  // const triggerShapeConfetti = useShapeConfetti();
  const pathname = usePathname();
  const user = useUser();

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  return (
    <main
      className={cn(
        "w-full min-h-[100svh]",
        "flex justify-center items-center p-4"
      )}
      style={{
        background: "var(--pink-indigo)",
      }}
    >
      <div
        className={cn(
          "max-w-[550px]",
          "rounded-lg  w-full bg-gradient-to-bl from-background via-background/80 to-background",
          "border p-6 sm:p-12 relative",
          "space-y-6"
        )}
      >
        <h1 className="text-2xl flex items-center gap-2">
          <Avatar>
            <AvatarImage src={avatar} alt="orbisdev logo" />
          </Avatar>
          {orgName}
        </h1>

        <p className="text-lg md:text-xl px-1">{ctaText}</p>

        {!onFeedbackBtnClick && (
          <SignedIn>
            <div className="bg-muted text-muted-foreground flex text-sm p-2 items-center border border-border/70 rounded-md">
              Submit Response as {`'`}
              {user.user?.fullName}
              {`'`}
              <SignOutButton redirectUrl={`${pathname}`}>
                <Button size={"icon"} variant={"ghost"} className="ml-auto">
                  <ArrowLeftRight className="w-4 h-4" />
                </Button>
              </SignOutButton>
            </div>
          </SignedIn>
        )}

        <SignedOut>
          <SignInButton forceRedirectUrl={`${pathname}`}>
            <div className="bg-accent text-muted-foreground max-sm:p-2 max-sm:text-sm hover:bg-accent/60 flex group cursor-pointer items-center border border-border/70 p-4 rounded-md">
              This form required you to login
              <ArrowRight className="ml-auto group-hover:translate-x-1 w-4 h-4 transition-all duration-200 -translate-x-1" />
            </div>
          </SignInButton>
        </SignedOut>

        <p
          className={cn("text-2xl text-center py-6", !isSubmitted && "hidden")}
        >
          Thank You for Your Feedback! 🙌
        </p>

        <div className={cn("flex", isSubmitted && "hidden")}>
          <div className="mx-auto">
            {/* button for server rendering */}
            <SubmitReviewBtn
              className={cn((user.isLoaded || user.isSignedIn) && "hidden")}
            />

            {onFeedbackBtnClick ? (
              <SubmitReviewBtn onClick={onFeedbackBtnClick} />
            ) : (
              <>
                <SignedOut>
                  <SignInButton forceRedirectUrl={`${pathname}`}>
                    <SubmitReviewBtn />
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <Dialog
                    open={openDialog}
                    onOpenChange={(open) => setOpenDialog(open)}
                    // onOpenChange={(open) => {
                    //   if (!open) triggerShapeConfetti();
                    // }}
                  >
                    <DialogTrigger disabled={!user.isSignedIn}>
                      <SubmitReviewBtn />
                    </DialogTrigger>
                    <DialogContent className="overflow-y-auto max-h-[90svh]">
                      <DialogTitle className="sr-only">
                        Submit Review Dialog
                      </DialogTitle>
                      <FeedbackForm
                        ratingComponent="star"
                        {...formProps}
                        onSubmit={() => {
                          setOpenDialog(false);
                          setIsSubmitted(true);
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                </SignedIn>
              </>
            )}
          </div>
        </div>
        <footer className="text-center text-xs text-muted-foreground">
          Powered by{" "}
          <Link
            href={ROUTES.home}
            target="_blank"
            className="underline underline-offset-1"
          >
            {" "}
            Reviews Plethora
          </Link>
        </footer>
      </div>
    </main>
  );
}

const SubmitReviewBtn = ({ ...rest }: UnifiedButtonProps) => (
  <TextureButton {...rest}>Submit reviews</TextureButton>
);
