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
  widgetSettings: z.object({
    whitelistedDomains: z
      .array(z.string().url({ message: "Must be a valid URL" }))
      .default([])
      .optional(),
  }),
  widgetCustomization: z.object({
    primaryColor: z.string().default("#000000").optional(),
    backgroundColor: z.string().default("#ffffff").optional(),
    textColor: z.string().default("#333333").optional(),
    headerText: z.string().default("Customer Reviews").optional(),
    layout: z.enum(["list", "grid", "carousel"]).default("list").optional(),
    showAvatars: z.boolean().default(true).optional(),
    showDates: z.boolean().default(true).optional(),
    showTitles: z.boolean().default(true).optional(),
    brandingText: z.string().default("Powered by Reviews Plethora").optional(),
  }),
};

export const campaignFormSchema = z.object({
  ...composedCampaignSchema.metadata.shape,
  ...composedCampaignSchema.homePage.shape,
  ...composedCampaignSchema.feedbackForm.shape,
  ...composedCampaignSchema.widgetSettings.shape,
  ...composedCampaignSchema.widgetCustomization.shape,
});

export type CampaignFormType = z.infer<typeof campaignFormSchema>;
