import { auth } from "@clerk/nextjs/server";
import { getDB } from "../db";
import { collections } from "../db/collections";

export async function getAllCampaigns() {
  const { userId } = await auth();

  const db = await getDB();
  const campaigns = await db
    .collection(collections.campaigns)
    .aggregate([{ $match: userId }])
    .toArray();

  return campaigns;
}
