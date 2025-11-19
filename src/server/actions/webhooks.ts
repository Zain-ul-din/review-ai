"use server";

import { auth } from "@clerk/nextjs/server";
import { getDB } from "../db";
import { collections } from "../db/collections";
import { ObjectId } from "mongodb";
import { revalidateTag } from "next/cache";
import { getCampaignById } from "../dal/campaign";
import { WebhookEvent, Webhook } from "@/types";
import crypto from "crypto";

export async function addWebhook(
  campaignId: string,
  url: string,
  events: WebhookEvent[]
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  // Verify campaign ownership
  const campaign = await getCampaignById(campaignId);
  if (!campaign) throw new Error("Campaign not found or unauthorized");

  // Validate URL
  try {
    new URL(url);
  } catch {
    throw new Error("Invalid webhook URL");
  }

  if (events.length === 0) {
    throw new Error("At least one event must be selected");
  }

  const db = await getDB();
  const webhook: Omit<Webhook, "_id"> = {
    url,
    events,
    secret: crypto.randomBytes(32).toString("hex"),
    enabled: true,
    createdAt: new Date().toISOString(),
  };

  await db.collection(collections.campaigns).updateOne(
    { _id: new ObjectId(campaignId) },
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      $push: { webhooks: { _id: new ObjectId().toString(), ...webhook } as any },
      $set: { updateAt: new Date().toISOString() },
    }
  );

  revalidateTag("campaign");
  return { success: true };
}

export async function updateWebhook(
  campaignId: string,
  webhookId: string,
  url: string,
  events: WebhookEvent[],
  enabled: boolean
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const campaign = await getCampaignById(campaignId);
  if (!campaign) throw new Error("Campaign not found or unauthorized");

  // Validate URL
  try {
    new URL(url);
  } catch {
    throw new Error("Invalid webhook URL");
  }

  if (events.length === 0) {
    throw new Error("At least one event must be selected");
  }

  const db = await getDB();
  await db.collection(collections.campaigns).updateOne(
    {
      _id: new ObjectId(campaignId),
      "webhooks._id": webhookId
    },
    {
      $set: {
        "webhooks.$.url": url,
        "webhooks.$.events": events,
        "webhooks.$.enabled": enabled,
        updateAt: new Date().toISOString(),
      },
    }
  );

  revalidateTag("campaign");
  return { success: true };
}

export async function deleteWebhook(campaignId: string, webhookId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const campaign = await getCampaignById(campaignId);
  if (!campaign) throw new Error("Campaign not found or unauthorized");

  const db = await getDB();
  await db.collection(collections.campaigns).updateOne(
    { _id: new ObjectId(campaignId) },
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      $pull: { webhooks: { _id: webhookId } as any },
      $set: { updateAt: new Date().toISOString() },
    }
  );

  revalidateTag("campaign");
  return { success: true };
}

export async function testWebhook(campaignId: string, webhookId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const campaign = await getCampaignById(campaignId);
  if (!campaign) throw new Error("Campaign not found or unauthorized");

  const webhook = campaign.webhooks?.find((w) => w._id === webhookId);
  if (!webhook) throw new Error("Webhook not found");

  // Send test payload
  const testPayload = {
    event: "review.created",
    campaignId,
    timestamp: new Date().toISOString(),
    data: {
      review: {
        id: "test-review-id",
        rating: 5,
        title: "Test Review",
        review: "This is a test webhook payload",
        author: {
          name: "Test User",
        },
      },
    },
  };

  try {
    await triggerWebhook(webhook, testPayload);
    return { success: true, message: "Test webhook sent successfully" };
  } catch (error) {
    throw new Error(`Webhook test failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// Helper function to trigger webhooks
export async function triggerWebhook(webhook: Webhook, payload: unknown) {
  if (!webhook.enabled) return;

  const signature = crypto
    .createHmac("sha256", webhook.secret || "")
    .update(JSON.stringify(payload))
    .digest("hex");

  const response = await fetch(webhook.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Webhook-Signature": signature,
      "X-Webhook-Event": payload.event,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Webhook delivery failed: ${response.status} ${response.statusText}`);
  }
}

// Helper function to trigger webhooks for an event
export async function triggerCampaignWebhooks(
  campaignId: string,
  event: WebhookEvent,
  data: unknown
) {
  const campaign = await getCampaignById(campaignId);
  if (!campaign || !campaign.webhooks) return;

  const payload = {
    event,
    campaignId,
    timestamp: new Date().toISOString(),
    data,
  };

  // Trigger all webhooks that are enabled and listening for this event
  const relevantWebhooks = campaign.webhooks.filter(
    (webhook) => webhook.enabled && webhook.events.includes(event)
  );

  // Fire all webhooks in parallel (don't wait for them to complete)
  await Promise.allSettled(
    relevantWebhooks.map((webhook) => triggerWebhook(webhook, payload))
  );
}
