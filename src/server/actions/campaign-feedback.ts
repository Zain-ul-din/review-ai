"use server";
import {
  CampaignFeedbackFormType,
  campaignFeedbackSchema,
  AnonymousCampaignFeedbackFormType,
  anonymousCampaignFeedbackSchema,
} from "@/shared/definitions/campaign-feedback";
import { currentUser } from "@clerk/nextjs/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { headers } from "next/headers";
import crypto from "crypto";
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

// Helper function to verify hCaptcha token
async function verifyHCaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.HCAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.error("HCAPTCHA_SECRET_KEY is not configured");
    return false;
  }

  try {
    const response = await fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `response=${token}&secret=${secretKey}`,
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error("hCaptcha verification error:", error);
    return false;
  }
}

// Helper function to get client IP
function getClientIP(headersList: Headers): string {
  return (
    headersList.get("x-forwarded-for")?.split(",")[0] ||
    headersList.get("x-real-ip") ||
    "unknown"
  );
}

// Helper function to check rate limit
async function checkRateLimit(
  ip: string,
  campaignId: string
): Promise<{ allowed: boolean; error?: string }> {
  const db = await getDB();
  const rateLimitKey = crypto
    .createHash("sha256")
    .update(`${ip}_${campaignId}`)
    .digest("hex");

  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // Count submissions from this IP for this campaign in last 24 hours
  const count = await db
    .collection(collections.campaignFeedbacks)
    .countDocuments({
      ipHash: rateLimitKey,
      campaignId: campaignId,
      createdAt: { $gte: oneDayAgo.toISOString() },
    });

  // Allow max 3 anonymous reviews per IP per campaign per day
  if (count >= 3) {
    return {
      allowed: false,
      error: "Rate limit exceeded. Maximum 3 reviews per day.",
    };
  }

  return { allowed: true };
}

export async function submitAnonymousCampaignFeedback(
  data: AnonymousCampaignFeedbackFormType
) {
  // Validate input
  const validatedFields = anonymousCampaignFeedbackSchema.safeParse(data);
  if (validatedFields.error) {
    return { error: "Invalid form data" };
  }

  // Verify hCaptcha
  const captchaValid = await verifyHCaptcha(data.captchaToken);
  if (!captchaValid) {
    return { error: "Captcha verification failed. Please try again." };
  }

  // Get client IP for rate limiting
  const headersList = await headers();
  const clientIP = getClientIP(headersList);

  // Check rate limit
  const rateLimit = await checkRateLimit(clientIP, data.id);
  if (!rateLimit.allowed) {
    return { error: rateLimit.error };
  }

  const db = await getDB();

  // Generate unique ID for anonymous review (hash of IP + campaign + timestamp)
  const reviewId = crypto
    .createHash("sha256")
    .update(`${clientIP}_${data.id}_${Date.now()}`)
    .digest("hex")
    .substring(0, 24);

  const ipHash = crypto
    .createHash("sha256")
    .update(`${clientIP}_${data.id}`)
    .digest("hex");

  try {
    await db.collection(collections.campaignFeedbacks).insertOne({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      _id: reviewId as any,
      campaignId: data.id,
      title: data.title,
      review: data.review,
      rating: data.rating,
      status: "approved", // Auto-approve anonymous reviews by default
      flagged: false,
      isAnonymous: true,
      ipHash: ipHash, // Store hashed IP for rate limiting
      userMeta: {
        firstName: data.name.split(" ")[0] || data.name,
        lastName: data.name.split(" ").slice(1).join(" ") || "",
        fullName: data.name,
        imageUrl: "", // No image for anonymous users
        emailAddresses: data.email ? [data.email] : [],
        hasImage: false,
        updatedAt: Date.now(),
        createdAt: Date.now(),
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Trigger webhook for review.created event
    await triggerCampaignWebhooks(data.id, "review.created", {
      review: {
        id: reviewId,
        rating: data.rating,
        title: data.title,
        review: data.review,
        author: {
          name: data.name,
          email: data.email || undefined,
        },
        isAnonymous: true,
        createdAt: new Date().toISOString(),
      },
    }).catch(console.error);

    // Revalidate the campaign details page and feedback data
    revalidateTag("campaign-feedback");
    revalidatePath(`/dashboard/campaign/${data.id}`);
    revalidatePath(`/p/${data.id}`); // Also revalidate public page

    return { success: true };
  } catch (error) {
    console.error("Error submitting anonymous feedback:", error);
    return { error: "Failed to submit review. Please try again." };
  }
}
