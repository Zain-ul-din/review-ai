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
      ctaText,
      description,
      name,
      ratingComponentType,
      updateAt: new Date().toISOString(),
    } as CampaignFormType
  );
}
