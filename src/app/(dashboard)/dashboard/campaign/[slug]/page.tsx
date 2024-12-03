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
import { TextureButton } from "@/components/ui/texture-button";
import { ROUTES } from "@/lib/constants";
import { getCampaignById } from "@/server/dal/campaign";
import { getCampaignFeedback } from "@/server/dal/campaign-feedback";
import { Edit, ExternalLink } from "lucide-react";
import Link from "next/link";

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

  return (
    <DashboardLayout>
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
          </div>
        </div>

        <Table className="mt-8">
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
      </div>
    </DashboardLayout>
  );
}
