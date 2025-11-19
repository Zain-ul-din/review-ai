"use server";

// import { auth } from "@clerk/nextjs/server";
import { getDB } from "../db";
import { collections } from "../db/collections";
import { CampaignFeedbackType } from "@/types";

// Get all feedbacks for campaign owner (includes all statuses)
export async function getCampaignFeedback(campaignId: string) {
  // const { userId } = await auth();
  // { userId: { $eq: userId } },

  const db = await getDB();

  const feedbacks = (await db
    .collection(collections.campaignFeedbacks)
    .find({
      $and: [{ campaignId: { $eq: campaignId } }],
    })
    .sort({ createdAt: -1 })
    .toArray()) as never as CampaignFeedbackType[];

  return feedbacks;
}

// Get only approved feedbacks for public display (widget, public page)
export async function getApprovedCampaignFeedback(campaignId: string) {
  const db = await getDB();

  const feedbacks = (await db
    .collection(collections.campaignFeedbacks)
    .find({
      $and: [
        { campaignId: { $eq: campaignId } },
        {
          $or: [
            { status: { $eq: "approved" } },
            { status: { $exists: false } }, // For backward compatibility (old reviews without status)
          ],
        },
      ],
    })
    .sort({ createdAt: -1 })
    .toArray()) as never as CampaignFeedbackType[];

  return feedbacks;
}
