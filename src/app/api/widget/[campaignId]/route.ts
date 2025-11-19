import { getPublicCampaignById } from "@/server/dal/campaign";
import { getCampaignFeedback } from "@/server/dal/campaign-feedback";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> }
) {
  try {
    const { campaignId } = await params;

    // Get campaign and reviews
    const campaign = await getPublicCampaignById(campaignId);

    if (!campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    const feedbacks = await getCampaignFeedback(campaignId);

    // Calculate average rating
    const averageRating = feedbacks.length
      ? feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length
      : 0;

    // Return widget data
    const widgetData = {
      campaign: {
        id: campaign._id,
        name: campaign.name,
        description: campaign.description,
      },
      stats: {
        totalReviews: feedbacks.length,
        averageRating: parseFloat(averageRating.toFixed(1)),
      },
      reviews: feedbacks.map((feedback) => ({
        id: feedback._id,
        rating: feedback.rating,
        title: feedback.title,
        review: feedback.review,
        author: {
          name: feedback.userMeta.fullName,
          avatar: feedback.userMeta.imageUrl,
        },
        createdAt: feedback.createdAt,
      })),
    };

    return NextResponse.json(widgetData, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Widget API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
      },
    }
  );
}
