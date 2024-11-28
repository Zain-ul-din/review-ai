"use server";

import {
  campaignFormSchema,
  CampaignFormType
} from "@/shared/definitions/campaign";
import { auth } from "@clerk/nextjs/server";

export async function createCampaign(data: CampaignFormType) {
  const validateFields = campaignFormSchema.safeParse(data);

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors
    };
  }

  const { userId } = await auth();

  if (!userId) {
    throw new Error(`No user currently logged In`);
  }

  await new Promise((r) => setTimeout(r, 2000));

  // write data to db
  console.log(userId, " : ", data);
}
