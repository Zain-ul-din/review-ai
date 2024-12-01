import { z } from "zod";

export const campaignFeedbackSchema = z.object({
  title: z.string().min(1, {
    message: "title is required field",
  }),
  review: z.string().min(1, {
    message: "review is required filed",
  }),
  rating: z.coerce
    .number()
    .refine((n) => n >= 1 && n <= 5, { message: "Invalid rating" }),
  id: z.string().min(1, {
    message: "id is required field",
  }),
});

export type CampaignFeedbackFormType = z.infer<typeof campaignFeedbackSchema>;
