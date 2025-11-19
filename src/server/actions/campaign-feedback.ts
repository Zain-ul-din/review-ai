"use server";
import {
  CampaignFeedbackFormType,
  campaignFeedbackSchema,
} from "@/shared/definitions/campaign-feedback";
import { currentUser } from "@clerk/nextjs/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { getDB } from "../db";
import { collections } from "../db/collections";
import { getCampaignById } from "../dal/campaign";
import { triggerCampaignWebhooks } from "./webhooks";

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
        status: "approved", // Auto-approve new reviews by default
        flagged: false,
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

  // Trigger webhook for review.created event
  await triggerCampaignWebhooks(data.id, "review.created", {
    review: {
      id: _id,
      rating: data.rating,
      title: data.title,
      review: data.review,
      author: {
        name: user.fullName || "Anonymous",
        email: user.emailAddresses[0]?.emailAddress,
      },
      createdAt: new Date().toISOString(),
    },
  }).catch(console.error); // Don't block on webhook failures

  // Revalidate the campaign details page and feedback data
  revalidateTag("campaign-feedback");
  revalidatePath(`/dashboard/campaign/${data.id}`);
}

export async function deleteCampaignFeedback(reviewId: string, campaignId: string) {
  // Verify campaign ownership
  const campaign = await getCampaignById(campaignId);

  if (!campaign) {
    throw new Error("Campaign not found or unauthorized");
  }

  const db = await getDB();

  // Delete the review
  await db.collection(collections.campaignFeedbacks).deleteOne({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _id: reviewId as any,
    campaignId: campaignId,
  });

  // Revalidate the campaign details page
  revalidateTag("campaign-feedback");
  revalidatePath(`/dashboard/campaign/${campaignId}`);

  return { success: true };
}

export async function updateReviewStatus(
  reviewId: string,
  campaignId: string,
  status: "pending" | "approved" | "rejected"
) {
  // Verify campaign ownership
  const campaign = await getCampaignById(campaignId);

  if (!campaign) {
    throw new Error("Campaign not found or unauthorized");
  }

  const db = await getDB();

  // Get the review before updating for webhook payload
  const review = await db.collection(collections.campaignFeedbacks).findOne({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _id: reviewId as any,
    campaignId: campaignId,
  });

  // Update review status
  await db.collection(collections.campaignFeedbacks).updateOne(
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      _id: reviewId as any,
      campaignId: campaignId,
    },
    {
      $set: {
        status,
        updatedAt: new Date().toISOString(),
      },
    }
  );

  // Trigger webhooks for status changes
  if (review && status === "approved") {
    const reviewDoc = review as unknown as { rating: number; title: string; review: string };
    await triggerCampaignWebhooks(campaignId, "review.approved", {
      review: {
        id: reviewId,
        rating: reviewDoc.rating,
        title: reviewDoc.title,
        review: reviewDoc.review,
        status: "approved",
      },
    }).catch(console.error);
  } else if (review && status === "rejected") {
    const reviewDoc = review as unknown as { rating: number; title: string; review: string };
    await triggerCampaignWebhooks(campaignId, "review.rejected", {
      review: {
        id: reviewId,
        rating: reviewDoc.rating,
        title: reviewDoc.title,
        review: reviewDoc.review,
        status: "rejected",
      },
    }).catch(console.error);
  }

  // Revalidate the campaign details page
  revalidateTag("campaign-feedback");
  revalidatePath(`/dashboard/campaign/${campaignId}`);
  revalidatePath(`/p/${campaignId}`); // Also revalidate public page

  return { success: true };
}

export async function flagReview(
  reviewId: string,
  campaignId: string,
  flagged: boolean,
  reason?: string
) {
  // Verify campaign ownership
  const campaign = await getCampaignById(campaignId);

  if (!campaign) {
    throw new Error("Campaign not found or unauthorized");
  }

  const db = await getDB();

  // Get the review before updating for webhook payload
  const review = await db.collection(collections.campaignFeedbacks).findOne({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _id: reviewId as any,
    campaignId: campaignId,
  });

  // Flag/unflag the review
  await db.collection(collections.campaignFeedbacks).updateOne(
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      _id: reviewId as any,
      campaignId: campaignId,
    },
    {
      $set: {
        flagged,
        flagReason: flagged ? reason : undefined,
        updatedAt: new Date().toISOString(),
      },
    }
  );

  // Trigger webhook for flagged review
  if (review && flagged) {
    const reviewDoc = review as unknown as { rating: number; title: string; review: string };
    await triggerCampaignWebhooks(campaignId, "review.flagged", {
      review: {
        id: reviewId,
        rating: reviewDoc.rating,
        title: reviewDoc.title,
        review: reviewDoc.review,
        flagged: true,
        flagReason: reason,
      },
    }).catch(console.error);
  }

  // Revalidate the campaign details page
  revalidateTag("campaign-feedback");
  revalidatePath(`/dashboard/campaign/${campaignId}`);

  return { success: true };
}
