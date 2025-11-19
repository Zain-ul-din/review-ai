"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { submitMagicLinkReview } from "@/server/actions/magic-links";
import { CheckCircle, Link as LinkIcon, Package } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

const magicLinkReviewSchema = z.object({
  rating: z.coerce.number().refine((n) => n >= 1 && n <= 5, {
    message: "Please select a rating",
  }),
  title: z.string().min(1, { message: "Title is required" }),
  review: z.string().min(1, { message: "Review is required" }),
});

type MagicLinkReviewFormType = z.infer<typeof magicLinkReviewSchema>;

interface MagicLinkReviewFormProps {
  token: string;
  campaignId: string;
  campaignName: string;
  campaignDescription: string;
  customerName: string;
  customerEmail: string;
  orderId?: string;
  ratingComponent: "star" | "emoji";
}

export function MagicLinkReviewForm({
  token,
  campaignName,
  campaignDescription,
  customerName,
  customerEmail,
  orderId,
  ratingComponent,
}: MagicLinkReviewFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<MagicLinkReviewFormType>({
    resolver: zodResolver(magicLinkReviewSchema),
    defaultValues: {
      rating: 0,
      title: "",
      review: "",
    },
  });

  const onSubmit = (data: MagicLinkReviewFormType) => {
    setError(null);
    startTransition(async () => {
      try {
        const result = await submitMagicLinkReview(token, data);
        if (result?.error) {
          setError(result.error);
        } else {
          setIsSubmitted(true);
        }
      } catch {
        setError("Failed to submit review. Please try again.");
      }
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--pink-indigo)" }}>
        <Card className="max-w-md w-full">
          <CardContent className="pt-12 pb-12">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="rounded-full bg-green-100 dark:bg-green-900 p-3">
                  <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">Thank You! 🎉</h1>
                <p className="text-lg text-muted-foreground">
                  Your review has been submitted successfully
                </p>
              </div>
              <div className="pt-4">
                <Link href={ROUTES.home}>
                  <Button>
                    Visit Reviews Plethora
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--pink-indigo)" }}>
      <Card className="max-w-2xl w-full">
        <CardHeader className="space-y-4">
          <div className="space-y-2">
            <CardTitle className="text-2xl md:text-3xl">
              {campaignName}
            </CardTitle>
            <CardDescription className="text-base">
              {campaignDescription}
            </CardDescription>
          </div>

          {/* Customer Info */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <LinkIcon className="h-4 w-4" />
              <span>Reviewing as: <strong className="text-foreground">{customerName}</strong></span>
            </div>
            {orderId && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="h-4 w-4" />
                <span>Order: <strong className="text-foreground">#{orderId}</strong></span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Rating */}
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">How would you rate your experience? *</FormLabel>
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

              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Review Title *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Summarize your experience in one sentence"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Review */}
              <FormField
                control={form.control}
                name="review"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Your Review *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about your experience in detail..."
                        className="min-h-[150px]"
                        {...field}
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
                className="w-full text-lg h-12"
                disabled={isPending}
                isLoading={isPending}
              >
                Submit Review
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Your review will be visible at {customerEmail}
              </p>
            </form>
          </Form>
        </CardContent>

        <div className="border-t px-6 py-4">
          <p className="text-xs text-center text-muted-foreground">
            Powered by{" "}
            <Link href={ROUTES.home} className="underline">
              Reviews Plethora
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
