import CampaignDetails from "@/components/campaign/details";
import { ROUTES } from "@/lib/constants";
import { getCampaignById } from "@/server/dal/campaign";
import { getCampaignFeedback } from "@/server/dal/campaign-feedback";
import { redirect } from "next/navigation";

export default async function Campaign({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [campaign, feedbacks] = await Promise.all([
    getCampaignById(slug),
    getCampaignFeedback(slug),
  ]);

  if (campaign == null) redirect(ROUTES.dashboard);

  return (
    <CampaignDetails
      slug={slug}
      campaign={JSON.parse(JSON.stringify(campaign))}
      feedbacks={JSON.parse(JSON.stringify(feedbacks))}
    />
  );
}
