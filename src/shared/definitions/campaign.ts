import { z } from "zod";

export const campaignFormSchema = z.object({
  ctaText: z.string().min(1, { message: "CTA text is required field." }),
  ratingComponentType: z.enum(["star", "emoji"]).default("star")
});

export type CampaignFormType = z.infer<typeof campaignFormSchema>;
