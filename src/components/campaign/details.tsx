"use client";
import DashboardLayout from "@/components/layout/dashboard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ROUTES } from "@/lib/constants";
import Link from "next/link";
import { TextureButton } from "../ui/texture-button";
import { Brain, Copy, Download, Edit, ExternalLink, Trash } from "lucide-react";
import { CampaignFeedbackType, CampaignType } from "@/types";
import { useOrbiousAI } from "@/lib/orbious-ai";
import Balancer from "react-wrap-balancer";
import { reviewsSummarySystemInstruction } from "@/lib/orbious-ai/system";
import AreYouSure from "../shared/are-you-sure";
import { useRef, useState, useTransition } from "react";
import { deleteCampaign, exportCampaignReviewsCSV } from "@/server/actions/campaign";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CampaignAnalytics from "./analytics";
import { WidgetSettings } from "./widget-settings";
import { ReviewModeration } from "./review-moderation";

export default function CampaignDetails({
  campaign,
  feedbacks,
  slug,
}: {
  campaign: CampaignType;
  slug: string;
  feedbacks: CampaignFeedbackType[];
}) {
  const { response, prompt, loading } = useOrbiousAI({
    systemInstructions: reviewsSummarySystemInstruction,
  });

  const [deleting, startDeleteTransition] = useTransition();
  const [exporting, setExporting] = useState(false);
  const deleteBtnRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  const handleCopyCampaignId = () => {
    navigator.clipboard.writeText(slug);
    toast.success("Campaign ID copied to clipboard!");
  };

  const handleExportCSV = async () => {
    if (feedbacks.length === 0) {
      toast.error("No reviews to export");
      return;
    }

    setExporting(true);
    try {
      const result = await exportCampaignReviewsCSV(slug);

      // Create blob and download
      const blob = new Blob([result.csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute("download", result.filename);
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Reviews exported successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to export reviews");
    } finally {
      setExporting(false);
    }
  };

  return (
    <DashboardLayout>
      <AreYouSure
        onClick={() => {
          startDeleteTransition(async () => {
            await deleteCampaign(slug);
            router.push(ROUTES.dashboard);
          });
        }}
        ref={deleteBtnRef}
        isLoading={deleting}
      />
      <div className="space-y-6">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <h2 className="text-2xl font-bold">{campaign?.name}</h2>
              <p className="text-muted-foreground text-sm">
                {campaign?.description}
              </p>
            </div>

            <div className="flex gap-2">
              <Link href={`${ROUTES.campaign}/${slug}/edit`}>
                <TextureButton variant="secondary" size="sm">
                  <Edit className="w-4 h-4 mr-2" /> Edit
                </TextureButton>
              </Link>
              <TextureButton
                variant="destructive"
                size="sm"
                onClick={() => {
                  deleteBtnRef.current?.click();
                }}
                isLoading={deleting}
              >
                <Trash className="w-4 h-4 mr-2" />
                Delete
              </TextureButton>
            </div>
          </div>

          {/* Campaign ID and Actions Row */}
          <div className="flex items-center gap-2 flex-wrap border rounded-lg p-4 bg-muted/30">
            <div className="flex items-center gap-2 flex-1">
              <span className="text-sm text-muted-foreground font-medium">Campaign ID:</span>
              <code className="text-sm bg-background px-2 py-1 rounded border">{slug}</code>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyCampaignId}
                className="h-7 w-7 p-0"
              >
                <Copy className="w-3.5 h-3.5" />
              </Button>
            </div>

            <div className="flex gap-2">
              <TextureButton
                variant="secondary"
                size="sm"
                onClick={handleExportCSV}
                isLoading={exporting}
                disabled={feedbacks.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </TextureButton>

              <Link href={`${ROUTES.review}/${slug}`} target="_blank">
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Review Page
                </Button>
              </Link>

              <Link href={`/p/${slug}`} target="_blank">
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Public Page
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <Tabs defaultValue="reviews" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="widget">Widget Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="reviews" className="space-y-6">
            {feedbacks.length > 0 && (
              <div className="p-4 border rounded-md bg-card">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="space-y-1">
                    <h2 className="text-lg text-muted-foreground">
                      Reviews summary
                    </h2>
                    {response && (
                      <p className="flex-1 w-full text-[1rem]">
                        <Balancer>{response}</Balancer>
                      </p>
                    )}
                  </div>
                  <span className="ml-auto">
                    <TextureButton
                      variant="secondary"
                      onClick={() =>
                        prompt(
                          feedbacks
                            .map(
                              (feedback) =>
                                `rating: ${feedback.rating} - review: ${feedback.review}`
                            )
                            .join("\n---\n")
                        )
                      }
                      isLoading={loading}
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      Ask AI
                    </TextureButton>
                  </span>
                </div>
              </div>
            )}

            {feedbacks.length > 0 ? (
              <ReviewModeration feedbacks={feedbacks} campaignId={slug} />
            ) : (
              <div className="flex flex-col justify-center border-t items-center pt-8 gap-4">
                <p className="text-muted-foreground">
                  <Balancer>
                    No response so far, copy & share this link with your audience.
                  </Balancer>
                </p>
                <span className="flex">
                  <TextureButton
                    onClick={() => {
                      navigator.share({
                        title: "Reviews Plethora",
                        text: `${campaign.ctaText}`,
                        url: `${window.location.origin}${ROUTES.review}/${slug}`,
                      });
                    }}
                  >
                    <Copy className="w-4 h-4" /> Share Link
                  </TextureButton>
                </span>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <CampaignAnalytics feedbacks={feedbacks} />

            {feedbacks.length === 0 && (
              <div className="flex flex-col justify-center items-center py-12 gap-4">
                <p className="text-muted-foreground text-center">
                  <Balancer>
                    No data available yet. Start collecting reviews to see analytics.
                  </Balancer>
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="widget" className="space-y-6">
            <WidgetSettings
              campaignId={slug}
              initialDomains={campaign.whitelistedDomains || []}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
