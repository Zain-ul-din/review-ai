import CampaignForm from "@/components/forms/campaign";

export default function NewCampaignPage() {
  return (
    <div className="p-6 max-w-screen-lg mx-auto">
      <h1 className="text-2xl font-medium mb-8">Create New Campaign</h1>
      <CampaignForm />
    </div>
  );
}
