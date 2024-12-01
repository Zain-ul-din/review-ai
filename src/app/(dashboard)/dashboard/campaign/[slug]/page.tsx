import DashboardLayout from "@/components/layout/dashboard";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import Link from "next/link";

export default async function Campaign({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-xl">Campaign response</h2>
        <div>{slug}</div>
        <div className="flex gap-4 flex-wrap">
          <Link href={`${ROUTES.campaign}/${slug}/edit`}>
            <Button>Edit Campaign</Button>
          </Link>

          <Link href={`${ROUTES.review}/${slug}`}>
            <Button>Public page</Button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
