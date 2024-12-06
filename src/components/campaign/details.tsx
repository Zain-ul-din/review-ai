"use client";
import DashboardLayout from "@/components/layout/dashboard";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ROUTES } from "@/lib/constants";
import Link from "next/link";
import { TextureButton } from "../ui/texture-button";
import { Brain, Copy, Edit, ExternalLink, Trash } from "lucide-react";
import { CampaignFeedbackType, CampaignType } from "@/types";
import { useOrbiousAI } from "@/lib/orbious-ai";
import Balancer from "react-wrap-balancer";
import { reviewsSummarySystemInstruction } from "@/lib/orbious-ai/system";
import AreYouSure from "../shared/are-you-sure";
import { useRef, useTransition } from "react";
import { deleteCampaign } from "@/server/actions/campaign";
import { useRouter } from "next/navigation";

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
  const deleteBtnRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

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
        <div className="flex items-center flex-wrap gap-4">
          <div className="space-y-2">
            <h2 className="text-xl">{campaign?.name} Campaign response</h2>
            <p className="text-muted-foreground text-sm">
              {campaign?.description}
            </p>
          </div>
          <div className="sm:ml-auto flex gap-4 flex-wrap items-center">
            <Link href={`${ROUTES.campaign}/${slug}/edit`}>
              <TextureButton variant="secondary">
                <Edit className="w-4 h-4 mr-2" /> Edit
              </TextureButton>
            </Link>

            <Link href={`${ROUTES.review}/${slug}`}>
              <Button variant={"outline"} size="icon">
                <ExternalLink />
              </Button>
            </Link>

            <span>
              <TextureButton
                variant="destructive"
                onClick={() => {
                  deleteBtnRef.current?.click();
                }}
                isLoading={deleting}
              >
                <Trash className="w-4 h-4" />
                Delete
              </TextureButton>
            </span>
          </div>
        </div>
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
        <Table className="my-6">
          <TableHeader>
            <TableRow>
              <TableHead className="text-nowrap">Avatar</TableHead>
              <TableHead className="text-nowrap">User Name</TableHead>
              <TableHead className="text-nowrap">Rating</TableHead>
              <TableHead className="text-nowrap">Title</TableHead>
              <TableHead className="text-nowrap">Reviews</TableHead>
              <TableHead className="text-nowrap">Updated At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedbacks.map((feedback, i) => {
              return (
                <TableRow key={i}>
                  <TableCell>
                    <Avatar className="w-8 h-8">
                      <img
                        src={feedback.userMeta.imageUrl}
                        alt={feedback.userMeta.fullName}
                      />
                    </Avatar>
                  </TableCell>
                  <TableCell>{feedback.userMeta.fullName}</TableCell>
                  <TableCell>{feedback.rating}</TableCell>
                  <TableCell>{feedback.title}</TableCell>
                  <TableCell className="max-w-48">{feedback.review}</TableCell>
                  <TableCell>
                    {new Date(feedback.updatedAt).toDateString()}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {feedbacks.length === 0 && (
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
      </div>
    </DashboardLayout>
  );
}
