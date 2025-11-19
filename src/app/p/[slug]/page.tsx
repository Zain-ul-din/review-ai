import { getPublicCampaignById } from "@/server/dal/campaign";
import { getApprovedCampaignFeedback } from "@/server/dal/campaign-feedback";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { VerifiedBadge } from "@/components/ui/verified-badge";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const campaign = await getPublicCampaignById(slug);

  if (!campaign) {
    return {
      title: "Campaign Not Found",
    };
  }

  const feedbacks = await getApprovedCampaignFeedback(slug);
  const averageRating = feedbacks.length
    ? feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length
    : 0;

  return {
    title: `${campaign.name} - Reviews | Reviews Plethora`,
    description: campaign.description || `Read ${feedbacks.length} reviews for ${campaign.name}. Average rating: ${averageRating.toFixed(1)}/5 stars.`,
    openGraph: {
      title: `${campaign.name} Reviews`,
      description: campaign.description || `${feedbacks.length} verified reviews`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${campaign.name} Reviews`,
      description: campaign.description || `${feedbacks.length} verified reviews`,
    },
  };
}

export default async function PublicCampaignPage({ params }: Props) {
  const { slug } = await params;
  const campaign = await getPublicCampaignById(slug);

  if (!campaign) {
    notFound();
  }

  const feedbacks = await getApprovedCampaignFeedback(slug);
  const averageRating = feedbacks.length
    ? feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length
    : 0;

  // Calculate rating distribution
  const ratingCounts = [1, 2, 3, 4, 5].map(
    (rating) => feedbacks.filter((f) => f.rating === rating).length
  );

  // Schema.org structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: campaign.name,
    description: campaign.description,
    aggregateRating: feedbacks.length
      ? {
          "@type": "AggregateRating",
          ratingValue: averageRating.toFixed(1),
          reviewCount: feedbacks.length,
          bestRating: "5",
          worstRating: "1",
        }
      : undefined,
    review: feedbacks.map((feedback) => ({
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: feedback.rating,
        bestRating: "5",
        worstRating: "1",
      },
      author: {
        "@type": "Person",
        name: feedback.userMeta.fullName,
      },
      datePublished: feedback.createdAt,
      reviewBody: feedback.review,
      name: feedback.title,
    })),
  };

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b">
          <div className="container max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-semibold">
              Reviews Plethora
            </Link>
            <Link href="/sign-up">
              <Button size="sm">Create Your Campaign</Button>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="container max-w-5xl mx-auto px-4 py-8">
          {/* Campaign Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {campaign.name}
            </h1>
            <p className="text-muted-foreground text-lg">
              {campaign.description}
            </p>
          </div>

          {/* Rating Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Rating Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Average Rating */}
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="text-5xl font-bold mb-2">
                    {averageRating.toFixed(1)}
                  </div>
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.round(averageRating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Based on {feedbacks.length} review
                    {feedbacks.length !== 1 ? "s" : ""}
                  </p>
                </div>

                {/* Rating Distribution */}
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-sm w-8">{rating} ★</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400"
                          style={{
                            width: `${
                              feedbacks.length
                                ? (ratingCounts[rating - 1] / feedbacks.length) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-sm w-8 text-right">
                        {ratingCounts[rating - 1]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reviews List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">All Reviews</h2>

            {feedbacks.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    No reviews yet. Be the first to leave a review!
                  </p>
                </CardContent>
              </Card>
            ) : (
              feedbacks.map((feedback) => (
                <Card key={feedback._id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={feedback.userMeta.imageUrl}
                          alt={feedback.userMeta.fullName}
                        />
                        <AvatarFallback>
                          {feedback.userMeta.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-semibold">
                            {feedback.userMeta.fullName}
                          </span>
                          <VerifiedBadge isAnonymous={feedback.isAnonymous} size="sm" />
                          <span className="text-sm text-muted-foreground">
                            {new Date(feedback.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= feedback.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>

                        <h3 className="font-semibold mb-2">{feedback.title}</h3>
                        <p className="text-muted-foreground whitespace-pre-wrap">
                          {feedback.review}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center py-8 border-t">
            <h3 className="text-xl font-semibold mb-2">
              Want to collect reviews like this?
            </h3>
            <p className="text-muted-foreground mb-4">
              Create your own review campaign in minutes
            </p>
            <Link href="/sign-up">
              <Button size="lg">Get Started Free</Button>
            </Link>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t mt-12">
          <div className="container max-w-5xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
            <p>
              Powered by{" "}
              <Link href="/" className="underline">
                Reviews Plethora
              </Link>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
