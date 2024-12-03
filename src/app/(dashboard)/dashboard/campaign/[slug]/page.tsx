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
import { getCampaignById } from "@/server/dal/campaign";
import { getCampaignFeedback } from "@/server/dal/campaign-feedback";
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
        <div className="space-y-2">
          <h2 className="text-xl">{campaign?.name} Campaign response</h2>
          <p className="text-muted-foreground text-sm">
            {campaign?.description}
          </p>
        </div>
        <div className="flex gap-4 flex-wrap">
          <Link href={`${ROUTES.campaign}/${slug}/edit`}>
            <Button>Edit Campaign</Button>
          </Link>

          <Link href={`${ROUTES.review}/${slug}`}>
            <Button>Public page</Button>
          </Link>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Avatar</TableHead>
              <TableHead>User Name</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Reviews</TableHead>
              <TableHead>Updated At</TableHead>
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
                  <TableCell>{feedback.review}</TableCell>
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
