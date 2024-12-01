import Campaign from "@/components/campaign";
import { clerkBackendClient } from "@/lib/clerk-sdk";
import { getCampaignById } from "@/server/dal/campaign";
import { CampaignType } from "@/types";
import { unstable_cache } from "next/cache";

const fetchData = unstable_cache(
  async (slug: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const campaign = (await getCampaignById(slug)) as CampaignType;
    const user = await clerkBackendClient.users.getUser(campaign.userId);

    return {
      campaign,
      user,
    };
  },
  ["campaign"],
  { revalidate: 3600 }
);

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { campaign, user } = await fetchData(slug);
  return <Campaign campaign={campaign} owner={user} />;
}
