"use client";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TextureButton } from "@/components/ui/texture-button";
import { useToast } from "@/hooks/use-toast";
import { submitFeedback } from "@/server/actions/feedback";
import {
  FeedbackFormType,
  feedbackSchema,
} from "@/shared/definitions/feedback";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import Balancer from "react-wrap-balancer";

export default function FeedbackPage() {
  const form = useForm<FeedbackFormType>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      email: "",
      feedback: "",
    },
  });

  const [loading, startTransition] = useTransition();
  const { toast } = useToast();

  return (
    <div className="h-[100svh]">
      <div className="flex w-full h-full flex-col items-center justify-center">
        <div className="max-w-lg space-y-6 p-6 w-full bg-card rounded-lg border">
          <div className="space-y-2">
            <h1 className="text-2xl">Submit Feedback</h1>
            <p className="text-sm text-muted-foreground">
              <Balancer>
                Help us improve our product by giving your valuable feedback.
              </Balancer>
            </p>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => {
                startTransition(async () => {
                  submitFeedback(data);
                  form.reset();
                  toast({
                    title: "✔ Response has been submitted",
                  });
                });
              })}
              className="space-y-6"
            >
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => {
                  return (
                    <Input
                      placeholder="email"
                      type="email"
                      required
                      {...field}
                    />
                  );
                }}
              />
              <FormField
                name="feedback"
                control={form.control}
                render={({ field }) => {
                  return (
                    <Textarea
                      placeholder="your feedback"
                      className="max-h-[200px] min-h-[100px]"
                      {...field}
                      required
                    />
                  );
                }}
              />
              <TextureButton
                variant={"secondary"}
                type="submit"
                isLoading={loading}
              >
                Submit
              </TextureButton>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
