import Campaign from "@/components/campaign";
import { getCampaignById } from "@/server/dal/campaign";

export default async function ReviewPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const campaign = (await getCampaignById(slug)) as any;

  return <Campaign ctaText={campaign.ctaText} avatar="" orgName="" />;
}
