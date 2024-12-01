import Campaign from "@/components/campaign";
import { clerkBackendClient } from "@/lib/clerk-sdk";
import { getCampaignById } from "@/server/dal/campaign";
import { unstable_cache } from "next/cache";

const fetchData = unstable_cache(
  async (slug: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const campaign = (await getCampaignById(slug)) as any;
    const user = await clerkBackendClient.users.getUser(campaign.userId);
    const sererDate = new Date();

    return {
      campaign,
      user,
      sererDate: sererDate.toUTCString(),
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
  const { campaign, user, sererDate } = await fetchData(slug);

  return (
    <>
      {sererDate}
      <Campaign
        ctaText={campaign.ctaText}
        avatar={user.imageUrl}
        orgName={
          user.fullName || `${user.firstName || ""} ${user.lastName || ""}`
        }
      />
    </>
  );
}
