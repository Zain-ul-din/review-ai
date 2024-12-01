import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TextureButton } from "../ui/texture-button";
import { cn } from "@/lib/utils";
import StarRating from "../ui/star-rating";
import EmojiRating from "../ui/emoji-rating";
import { useStarsConfetti } from "@/hooks/use-stars-confetti";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CampaignFeedbackFormType,
  campaignFeedbackSchema,
} from "@/shared/definitions/campaign-feedback";
import { submitCampaignFeedback } from "@/server/actions/campaign-feedback";
import { useTransition } from "react";

export type FeedbackFormProps = {
  className?: string;
  readonly?: boolean;
  ratingComponent: "star" | "emoji";
  id?: string;
  onSubmit?: () => void;
};

export const FeedbackForm = ({
  className,
  ratingComponent,
  readonly,
  id,
  onSubmit,
}: FeedbackFormProps) => {
  const form = useForm<CampaignFeedbackFormType>({
    resolver: zodResolver(campaignFeedbackSchema),
    defaultValues: {
      rating: 0,
      title: "",
      review: "",
      id,
    },
  });

  const triggerStarConfetti = useStarsConfetti();
  const [loading, startTransition] = useTransition();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          startTransition(async () => {
            await submitCampaignFeedback(data);
            if (onSubmit) onSubmit();
          });
        })}
        className={cn("space-y-8", className)}
      >
        {/* 👋 Hello PHP in react world */}
        <FormField
          name="id"
          control={form.control}
          defaultValue={id}
          render={({ field }) => {
            return (
              <Input
                {...field}
                value={id || ""}
                className="hidden"
                readOnly
                hidden
              />
            );
          }}
        />

        <FormField
          name="rating"
          control={form.control}
          render={() => {
            return (
              <FormItem className="space-y-4">
                <FormLabel className="text-2xl font-medium">
                  Overall Rating
                </FormLabel>

                {(() => {
                  switch (ratingComponent) {
                    case "star":
                      return (
                        <StarRating
                          onRate={(rating) => {
                            if (rating == 5 && !readonly) triggerStarConfetti();
                            form.setValue("rating", rating);
                          }}
                        />
                      );
                    case "emoji":
                      return (
                        <EmojiRating
                          onRate={(rating) => {
                            form.setValue("rating", rating);
                          }}
                        />
                      );
                  }
                })()}
              </FormItem>
            );
          }}
        />

        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Review title</FormLabel>
              <Input
                placeholder="Give a title to your review"
                className="py-6"
                {...field}
              />
            </FormItem>
          )}
        />

        <FormField
          name="review"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Review</FormLabel>
              {/* <div className="flex flex-wrap items-end text-lg ">
                Since bought this{" "}
                <input
                  placeholder="product"
                  className="ml-2 outline-0 text-inherit w-[100px] focus:border-b"
                />{" "}
                im feeling happy.
              </div> */}
              <Textarea
                placeholder="Share your thoughts here..."
                className="py-4 max-h-[200px]"
                {...field}
              />
            </FormItem>
          )}
        />

        {!readonly && (
          <>
            <TextureButton type="submit" size="lg" isLoading={loading}>
              Submit
            </TextureButton>
          </>
        )}
      </form>
    </Form>
  );
};
