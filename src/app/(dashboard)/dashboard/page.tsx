import { Button } from "@/components/ui/button";
import { getAllCampaigns } from "@/server/dal/campaign";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import DashboardLayout from "@/components/layout/dashboard";

export default async function Dashboard() {
  const campaigns = await getAllCampaigns();

  if (campaigns.length === 0) {
    return (
      <div className="p-8 h-[100svh] flex items-center justify-center">
        <Link href={ROUTES.newCampaign}>
          <Button>Create New Campaign</Button>
        </Link>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="sm:columns-2 md:columns-3">
        {campaigns.map((campaign, i) => (
          <Link
            href={`/review/${campaign._id}`}
            className="break-inside-avoid"
            key={i}
          >
            <Card className="break-inside-avoid hover:bg-card/20 mb-2" key={i}>
              <CardHeader>
                <CardTitle className="text-xl">{campaign.name}</CardTitle>
                <CardDescription>{campaign.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
}
