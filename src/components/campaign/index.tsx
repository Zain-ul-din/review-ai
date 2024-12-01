import { CampaignType } from "@/types";
import { CampaignIntro } from "./intro";
import { User } from "@clerk/backend";

interface CampaignProps {
  campaign: CampaignType;
  owner: User;
}

export default function Campaign({ campaign, owner }: CampaignProps) {
  return (
    <CampaignIntro
      ctaText={campaign.ctaText}
      avatar={owner.imageUrl}
      orgName={
        owner.fullName || `${owner.firstName || ""} ${owner.lastName || ""}`
      }
      formProps={{
        ratingComponent: campaign.ratingComponentType,
        id: campaign._id as string,
      }}
    />
  );
}
