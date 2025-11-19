import { auth } from "@clerk/nextjs/server";
import { getDB } from "../db";
import { collections } from "../db/collections";
import { ObjectId } from "mongodb";
import { CampaignType } from "@/types";

export async function getAllCampaigns() {
  const { userId } = await auth();

  const db = await getDB();
  const campaigns = await db
    .collection(collections.campaigns)
    .aggregate([
      { $match: { userId: { $eq: userId }, isDeleted: { $ne: true } } },
    ])
    .toArray();

  return campaigns;
}

export async function getCampaignById(id: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const db = await getDB();

  const campaign = await db
    .collection<CampaignType>(collections.campaigns)
    .findOne({
      _id: new ObjectId(id),
      userId: { $eq: userId },
      isDeleted: { $ne: true },
    });

  return campaign;
}
