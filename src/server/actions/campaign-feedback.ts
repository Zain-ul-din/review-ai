"use server";
import {
  CampaignFeedbackFormType,
  campaignFeedbackSchema,
} from "@/shared/definitions/campaign-feedback";
import { currentUser } from "@clerk/nextjs/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { getDB } from "../db";
import { collections } from "../db/collections";

export async function submitCampaignFeedback(data: CampaignFeedbackFormType) {
  const validatedFields = campaignFeedbackSchema.safeParse(data);
  if (validatedFields.error) {
    return validatedFields.error.flatten().fieldErrors;
  }

  const user = await currentUser();

  if (!user) {
    throw new Error("User must be logged in");
  }

  const db = await getDB();

  const _id = `${user.id}_${data.id}`; // make user submit only one response per form 🦄

  await db.collection(collections.campaignFeedbacks).updateOne(
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      _id: _id as any,
    },
    {
      $set: {
        ...data,
        userId: user.id,
        campaignId: data.id,
        userMeta: {
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          imageUrl: user.imageUrl,
          emailAddresses: user.emailAddresses,
          hasImage: user.hasImage,
          updatedAt: user.updatedAt,
          createdAt: user.createdAt,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
    {
      upsert: true,
    }
  );

  // Revalidate the campaign details page and feedback data
  revalidateTag("campaign-feedback");
  revalidatePath(`/dashboard/campaign/${data.id}`);
}
