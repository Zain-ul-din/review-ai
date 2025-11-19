"use server";

import {
  campaignFormSchema,
  CampaignFormType,
} from "@/shared/definitions/campaign";
import { auth } from "@clerk/nextjs/server";
import { getDB } from "../db";
import { ROUTES } from "@/lib/constants";
import { redirect } from "next/navigation";
import { collections } from "../db/collections";
import { ObjectId } from "mongodb";
import { revalidateTag } from "next/cache";
import { getCampaignById } from "../dal/campaign";
import { getCampaignFeedback } from "../dal/campaign-feedback";
import { CampaignFeedbackType } from "@/types";

export async function createCampaign(data: CampaignFormType) {
  const validateFields = campaignFormSchema.safeParse(data);

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
    };
  }

  const { userId } = await auth();

  if (!userId) {
    throw new Error(`No user currently logged In`);
  }

  const db = await getDB();
  await db.collection(collections.campaigns).insertOne({
    ...data,
    userId,
    createdAt: new Date().toISOString(),
    updateAt: new Date().toISOString(),
  });

  redirect(ROUTES.dashboard);
}

export async function deleteCampaign(id: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error(`No user currently logged In`);
  }

  const db = await getDB();

  await db.collection(collections.campaigns).updateOne(
    {
      _id: new ObjectId(id),
    },
    {
      $set: {
        isDeleted: true,
      },
    }
  );

  revalidateTag("campaign");
}

export async function updateCampaign(id: string, data: CampaignFormType) {
  const validateFields = campaignFormSchema.safeParse(data);

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
    };
  }

  const { userId } = await auth();

  if (!userId) {
    throw new Error(`No user currently logged In`);
  }

  const db = await getDB();

  const { ctaText, description, name, ratingComponentType } = data;
  await db.collection(collections.campaigns).updateOne(
    {
      _id: new ObjectId(id),
    },
    {
      $set: {
        ctaText,
        description,
        name,
        ratingComponentType,
        updateAt: new Date().toISOString(),
      } as CampaignFormType,
    }
  );

  revalidateTag("campaign");
}

export async function exportCampaignReviewsCSV(campaignId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  // Verify campaign ownership
  const campaign = await getCampaignById(campaignId);
  if (!campaign) {
    throw new Error("Campaign not found or unauthorized");
  }

  // Get all reviews for this campaign
  const reviews = await getCampaignFeedback(campaignId);

  if (!reviews || reviews.length === 0) {
    throw new Error("No reviews to export");
  }

  // Convert reviews to CSV
  const csvHeader = [
    "Review ID",
    "Rating",
    "Title",
    "Review",
    "Reviewer Name",
    "Reviewer Email",
    "Submitted Date",
  ].join(",");

  const csvRows = reviews.map((review: CampaignFeedbackType) => {
    const reviewerEmail = review.userMeta?.emailAddresses?.[0] || "";
    const reviewerName = review.userMeta?.fullName || "";
    const submittedDate = new Date(review.createdAt).toLocaleString();

    // Escape CSV fields that might contain commas or quotes
    const escapeCSV = (field: string) => {
      if (!field) return '""';
      const stringField = String(field);
      if (stringField.includes(",") || stringField.includes('"') || stringField.includes("\n")) {
        return `"${stringField.replace(/"/g, '""')}"`;
      }
      return `"${stringField}"`;
    };

    return [
      escapeCSV(review._id),
      review.rating,
      escapeCSV(review.title),
      escapeCSV(review.review),
      escapeCSV(reviewerName),
      escapeCSV(reviewerEmail),
      escapeCSV(submittedDate),
    ].join(",");
  });

  const csv = [csvHeader, ...csvRows].join("\n");

  return {
    csv,
    filename: `${campaign.name.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_reviews_${new Date().toISOString().split("T")[0]}.csv`,
  };
}
