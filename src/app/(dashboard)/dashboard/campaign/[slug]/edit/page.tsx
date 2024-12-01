import CampaignForm from "@/components/forms/campaign";
import { getCampaignById } from "@/server/dal/campaign";

export default async function CampaignEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const campaign = await getCampaignById(slug);
  return (
    <CampaignForm
      defaultValues={JSON.parse(JSON.stringify(campaign)) || undefined}
    />
  );
}
