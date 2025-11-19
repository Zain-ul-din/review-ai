"use server";

import jwt from "jsonwebtoken";
import crypto from "crypto";
import { auth } from "@clerk/nextjs/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { getDB } from "../db";
import { collections } from "../db/collections";
import { getCampaignById } from "../dal/campaign";
import { triggerCampaignWebhooks } from "./webhooks";
import type { MagicLinkPayload, MagicLink } from "@/types";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

/**
 * Generate a magic link for a customer to submit a review
 */
export async function generateMagicLink(data: {
  campaignId: string;
  customerName: string;
  customerEmail: string;
  orderId?: string;
  expiresInDays?: number;
}) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Verify campaign ownership
  const campaign = await getCampaignById(data.campaignId);
  if (!campaign || campaign.userId !== userId) {
    throw new Error("Campaign not found or unauthorized");
  }

  const expiresInDays = data.expiresInDays || 7;
  const expiresAt = Date.now() + expiresInDays * 24 * 60 * 60 * 1000;

  // Create JWT token
  const payload: MagicLinkPayload = {
    campaignId: data.campaignId,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    orderId: data.orderId,
    exp: Math.floor(expiresAt / 1000),
  };

  const token = jwt.sign(payload, JWT_SECRET);
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  // Store in database
  const db = await getDB();
  const result = await db.collection(collections.magicLinks).insertOne({
    campaignId: data.campaignId,
    tokenHash,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    orderId: data.orderId,
    status: "pending",
    createdAt: new Date().toISOString(),
    expiresAt: new Date(expiresAt).toISOString(),
  });

  // Generate URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const magicUrl = `${baseUrl}/r/${token}`;

  revalidateTag("magic-links");

  return {
    id: result.insertedId.toString(),
    token,
    url: magicUrl,
    expiresAt: new Date(expiresAt).toISOString(),
  };
}

/**
 * Verify if a magic link token is valid
 */
export async function verifyMagicLink(token: string) {
  try {
    // Verify JWT
    const payload = jwt.verify(token, JWT_SECRET) as MagicLinkPayload;

    // Check if token has been used
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const db = await getDB();

    const link = await db
      .collection(collections.magicLinks)
      .findOne({ tokenHash });

    if (!link) {
      return { valid: false, error: "Invalid link" };
    }

    if (link.status === "used") {
      return { valid: false, error: "This link has already been used" };
    }

    if (link.status === "expired") {
      return { valid: false, error: "This link has expired" };
    }

    // Check if expired
    const now = new Date();
    const expiresAt = new Date(link.expiresAt as string);
    if (now > expiresAt) {
      // Mark as expired
      await db.collection(collections.magicLinks).updateOne(
        { tokenHash },
        { $set: { status: "expired" } }
      );
      return { valid: false, error: "This link has expired" };
    }

    return {
      valid: true,
      data: payload,
    };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return { valid: false, error: "This link has expired" };
    }
    return { valid: false, error: "Invalid link" };
  }
}

/**
 * Submit a review using a magic link
 */
export async function submitMagicLinkReview(
  token: string,
  data: {
    rating: number;
    title: string;
    review: string;
  }
) {
  // Verify token
  const verification = await verifyMagicLink(token);
  if (!verification.valid) {
    return { error: verification.error };
  }

  const payload = verification.data!;
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const db = await getDB();

  // Create review
  const reviewId = crypto.randomBytes(12).toString("hex");

  try {
    await db.collection(collections.campaignFeedbacks).insertOne({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      _id: reviewId as any,
      campaignId: payload.campaignId,
      title: data.title,
      review: data.review,
      rating: data.rating,
      status: "approved",
      flagged: false,
      isMagicLink: true,
      magicLinkToken: tokenHash,
      magicLinkMetadata: {
        orderId: payload.orderId,
        generatedAt: new Date().toISOString(),
        usedAt: new Date().toISOString(),
        sentVia: "manual",
      },
      userMeta: {
        firstName: payload.customerName.split(" ")[0] || payload.customerName,
        lastName: payload.customerName.split(" ").slice(1).join(" ") || "",
        fullName: payload.customerName,
        imageUrl: "",
        emailAddresses: [payload.customerEmail],
        hasImage: "",
        updatedAt: Date.now(),
        createdAt: Date.now(),
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Mark token as used
    await db.collection(collections.magicLinks).updateOne(
      { tokenHash },
      {
        $set: {
          status: "used",
          usedAt: new Date().toISOString(),
          reviewId,
        },
      }
    );

    // Trigger webhooks
    await triggerCampaignWebhooks(payload.campaignId, "review.created", {
      review: {
        id: reviewId,
        rating: data.rating,
        title: data.title,
        review: data.review,
        author: {
          name: payload.customerName,
          email: payload.customerEmail,
        },
        isMagicLink: true,
        orderId: payload.orderId,
        createdAt: new Date().toISOString(),
      },
    }).catch(console.error);

    // Revalidate
    revalidateTag("campaign-feedback");
    revalidateTag("magic-links");
    revalidatePath(`/dashboard/campaign/${payload.campaignId}`);
    revalidatePath(`/p/${payload.campaignId}`);

    return { success: true };
  } catch (error) {
    console.error("Error submitting magic link review:", error);
    return { error: "Failed to submit review. Please try again." };
  }
}

/**
 * Get all magic links for a campaign
 */
export async function getCampaignMagicLinks(campaignId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Verify campaign ownership
  const campaign = await getCampaignById(campaignId);
  if (!campaign || campaign.userId !== userId) {
    throw new Error("Campaign not found or unauthorized");
  }

  const db = await getDB();
  const links = await db
    .collection(collections.magicLinks)
    .find({ campaignId })
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray();

  return links as unknown as MagicLink[];
}

/**
 * Delete a magic link
 */
export async function deleteMagicLink(linkId: string, campaignId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Verify campaign ownership
  const campaign = await getCampaignById(campaignId);
  if (!campaign || campaign.userId !== userId) {
    throw new Error("Campaign not found or unauthorized");
  }

  const db = await getDB();
  await db.collection(collections.magicLinks).deleteOne({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _id: linkId as any,
    campaignId,
  });

  revalidateTag("magic-links");

  return { success: true };
}

/**
 * Get magic link statistics for a campaign
 */
export async function getMagicLinkStats(campaignId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Verify campaign ownership
  const campaign = await getCampaignById(campaignId);
  if (!campaign || campaign.userId !== userId) {
    throw new Error("Campaign not found or unauthorized");
  }

  const db = await getDB();

  const [total, pending, used, expired] = await Promise.all([
    db.collection(collections.magicLinks).countDocuments({ campaignId }),
    db.collection(collections.magicLinks).countDocuments({ campaignId, status: "pending" }),
    db.collection(collections.magicLinks).countDocuments({ campaignId, status: "used" }),
    db.collection(collections.magicLinks).countDocuments({ campaignId, status: "expired" }),
  ]);

  const conversionRate = total > 0 ? (used / total) * 100 : 0;

  return {
    total,
    pending,
    used,
    expired,
    conversionRate: Math.round(conversionRate * 10) / 10,
  };
}
