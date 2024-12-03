import { z } from "zod";

export const feedbackSchema = z.object({
  email: z.string().email({ message: "invalid email" }),
  feedback: z.string().min(1, {
    message: "feedback is required field",
  }),
});

export type FeedbackFormType = z.infer<typeof feedbackSchema>;
