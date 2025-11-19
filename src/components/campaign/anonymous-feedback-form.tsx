"use client";

import { useState, useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import StarRating from "@/components/ui/star-rating";
import EmojiRating from "@/components/ui/emoji-rating";
import { cn } from "@/lib/utils";
import {
  anonymousCampaignFeedbackSchema,
  AnonymousCampaignFeedbackFormType,
} from "@/shared/definitions/campaign-feedback";
import { submitAnonymousCampaignFeedback } from "@/server/actions/campaign-feedback";

interface AnonymousFeedbackFormProps {
  campaignId: string;
  ratingComponent: "star" | "emoji";
  className?: string;
  onSuccess?: () => void;
}

export function AnonymousFeedbackForm({
  campaignId,
  ratingComponent,
  className,
  onSuccess,
}: AnonymousFeedbackFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);

  const form = useForm<AnonymousCampaignFeedbackFormType>({
    resolver: zodResolver(anonymousCampaignFeedbackSchema),
    defaultValues: {
      id: campaignId,
      title: "",
      review: "",
      rating: 0,
      name: "",
      email: "",
      captchaToken: "",
    },
  });

  const onSubmit = (data: AnonymousCampaignFeedbackFormType) => {
    setError(null);
    startTransition(async () => {
      try {
        const result = await submitAnonymousCampaignFeedback(data);
        if (result?.error) {
          setError(result.error);
          captchaRef.current?.resetCaptcha();
          form.setValue("captchaToken", "");
        } else {
          onSuccess?.();
        }
      } catch {
        setError("Failed to submit review. Please try again.");
        captchaRef.current?.resetCaptcha();
        form.setValue("captchaToken", "");
      }
    });
  };

  const handleCaptchaVerify = (token: string) => {
    form.setValue("captchaToken", token);
  };

  const handleCaptchaExpire = () => {
    form.setValue("captchaToken", "");
  };

  return (
    <div className={cn("space-y-6", className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Name *</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Rating Field */}
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating *</FormLabel>
                <FormControl>
                  {ratingComponent === "star" ? (
                    <StarRating
                      rating={field.value}
                      onRate={field.onChange}
                    />
                  ) : (
                    <EmojiRating
                      rating={field.value}
                      onRate={field.onChange}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Review Title *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Summarize your experience"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Review Field */}
          <FormField
            control={form.control}
            name="review"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Review *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Share your detailed feedback..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* hCaptcha */}
          <FormField
            control={form.control}
            name="captchaToken"
            render={() => (
              <FormItem>
                <FormControl>
                  <HCaptcha
                    ref={captchaRef}
                    sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || "10000000-ffff-ffff-ffff-000000000001"}
                    onVerify={handleCaptchaVerify}
                    onExpire={handleCaptchaExpire}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
            isLoading={isPending}
          >
            Submit Review
          </Button>
        </form>
      </Form>
    </div>
  );
}
