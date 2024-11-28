import DashboardLayout from "@/components/layout/dashboard";

export default async function Campaign({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-xl">Campaign response</h2>
        <div>{slug}</div>
      </div>
    </DashboardLayout>
  );
}
