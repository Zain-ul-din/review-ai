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

export const anonymousCampaignFeedbackSchema = z.object({
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
  name: z.string().min(1, {
    message: "name is required field",
  }),
  email: z.string().email({ message: "Invalid email address" }).optional().or(z.literal("")),
  captchaToken: z.string().min(1, {
    message: "Please complete the captcha verification",
  }),
});

export type CampaignFeedbackFormType = z.infer<typeof campaignFeedbackSchema>;
export type AnonymousCampaignFeedbackFormType = z.infer<typeof anonymousCampaignFeedbackSchema>;
