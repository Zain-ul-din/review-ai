import { CampaignFormType } from "@/shared/definitions/campaign";
import { CampaignFeedbackFormType } from "@/shared/definitions/campaign-feedback";
import { ObjectId } from "mongodb";

export type CampaignType = CampaignFormType & {
  createdAt: string;
  updateAt: string;
  userId: string;
  _id: string | ObjectId;
  isDeleted?: boolean;
};

type UserMeta = {
  firstName: string;
  lastName: string;
  fullName: string;
  imageUrl: string;
  emailAddresses: string[];
  hasImage: string;
  updatedAt: number;
  createdAt: number;
};

export type CampaignFeedbackType = CampaignFeedbackFormType & {
  _id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  userMeta: UserMeta;
  campaignId: string;
  status?: "pending" | "approved" | "rejected";
  flagged?: boolean;
  flagReason?: string;
};
