import { z } from "zod";

export const composedCampaignSchema = {
  metadata: z.object({
    name: z.string().min(1, { message: "Name is a required field" }),
    description: z
      .string()
      .min(1, { message: "Description is a required field" }),
  }),
  homePage: z.object({
    ctaText: z.string().min(1, { message: "CTA text is required field." }),
  }),
  feedbackForm: z.object({
    ratingComponentType: z.enum(["star", "emoji"]).default("star"),
  }),
};

export const campaignFormSchema = z.object({
  ...composedCampaignSchema.metadata.shape,
  ...composedCampaignSchema.homePage.shape,
  ...composedCampaignSchema.feedbackForm.shape,
});

export type CampaignFormType = z.infer<typeof campaignFormSchema>;
