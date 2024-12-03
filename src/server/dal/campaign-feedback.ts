"use server";

import { auth } from "@clerk/nextjs/server";
import { getDB } from "../db";
import { collections } from "../db/collections";
import { CampaignFeedbackType } from "@/types";

export async function getCampaignFeedback(campaignId: string) {
  const { userId } = await auth();

  const db = await getDB();

  const feedbacks = (await db
    .collection(collections.campaignFeedbacks)
    .find({
      $and: [{ userId: { $eq: userId } }, { campaignId: { $eq: campaignId } }],
    })
    .toArray()) as never as CampaignFeedbackType[];

  return feedbacks;
}
