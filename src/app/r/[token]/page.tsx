import { verifyMagicLink } from "@/server/actions/magic-links";
import { getPublicCampaignById } from "@/server/dal/campaign";
import { MagicLinkReviewForm } from "@/components/magic-link-review-form";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { AlertCircle } from "lucide-react";

type Props = {
  params: Promise<{ token: string }>;
};

export default async function MagicLinkReviewPage({ params }: Props) {
  const { token } = await params;
  const verification = await verifyMagicLink(token);

  if (!verification.valid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--pink-indigo)" }}>
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <AlertCircle className="h-12 w-12 text-destructive" />
              </div>
              <h1 className="text-2xl font-bold">Invalid or Expired Link</h1>
              <p className="text-muted-foreground">{verification.error}</p>
              <p className="text-sm text-muted-foreground">
                Please contact the person who sent you this link for a new one.
              </p>
              <div className="pt-4">
                <Link href={ROUTES.home} className="text-primary underline underline-offset-4">
                  Go to Homepage
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data } = verification;

  // Type guard - data should exist when valid is true
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--pink-indigo)" }}>
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold">Invalid Link</h1>
              <p className="text-muted-foreground">
                This link appears to be invalid. Please contact the sender for a new link.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get campaign details
  const campaign = await getPublicCampaignById(data.campaignId);

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--pink-indigo)" }}>
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold">Campaign Not Found</h1>
              <p className="text-muted-foreground">
                The campaign associated with this link could not be found.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <MagicLinkReviewForm
      token={token}
      campaignId={data.campaignId}
      campaignName={campaign.name}
      campaignDescription={campaign.description}
      customerName={data.customerName}
      customerEmail={data.customerEmail}
      orderId={data.orderId}
      ratingComponent={campaign.ratingComponentType || "star"}
    />
  );
}
