import { CampaignFormType } from "@/shared/definitions/campaign";
import { ObjectId } from "mongodb";

export type CampaignType = CampaignFormType & {
  createdAt: string;
  updateAt: string;
  userId: string;
  _id: string | ObjectId;
};
