import { getPublicCampaignById } from "@/server/dal/campaign";
import { getApprovedCampaignFeedback } from "@/server/dal/campaign-feedback";
import { NextRequest, NextResponse } from "next/server";

// Helper function to extract domain from URL
function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.origin;
  } catch {
    return "";
  }
}

// Helper function to check if origin is allowed
function isOriginAllowed(origin: string | null, whitelistedDomains?: string[]): boolean {
  // Allow null origin (local file testing) if no whitelist is set
  if (!origin || origin === 'null') {
    return !whitelistedDomains || whitelistedDomains.length === 0;
  }

  // If no whitelist is set, allow all origins (backward compatibility)
  if (!whitelistedDomains || whitelistedDomains.length === 0) {
    return true;
  }

  // Extract domain from origin
  const originDomain = extractDomain(origin);

  // Check if origin matches any whitelisted domain
  return whitelistedDomains.some(domain => {
    const whitelistedDomain = extractDomain(domain);
    return originDomain === whitelistedDomain;
  });
}

// Helper function to get CORS headers
function getCorsHeaders(origin: string | null) {
  // If origin is null or "null", use "*"
  const allowOrigin = (origin && origin !== "null") ? origin : "*";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> }
) {
  const origin = request.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  try {
    const { campaignId } = await params;

    // Get campaign and reviews
    const campaign = await getPublicCampaignById(campaignId);

    if (!campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    // Check CORS origin
    const whitelistedDomains = campaign.whitelistedDomains;

    if (!isOriginAllowed(origin, whitelistedDomains)) {
      return NextResponse.json(
        { error: "Domain not whitelisted. Please add your domain to the campaign's whitelist." },
        { status: 403, headers: corsHeaders }
      );
    }

    const feedbacks = await getApprovedCampaignFeedback(campaignId);

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
      customization: campaign.widgetCustomization || {
        primaryColor: "#000000",
        backgroundColor: "#ffffff",
        textColor: "#333333",
        headerText: "Customer Reviews",
        layout: "list",
        showAvatars: true,
        showDates: true,
        showTitles: true,
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
        ...corsHeaders,
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Widget API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  return NextResponse.json({}, { headers: corsHeaders });
}
