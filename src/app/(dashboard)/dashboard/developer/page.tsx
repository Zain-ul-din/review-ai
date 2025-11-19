"use client";

import DashboardLayout from "@/components/layout/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, Code, Globe } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function DevelopersPage() {
  const [copiedWidget, setCopiedWidget] = useState(false);
  const [copiedAPI, setCopiedAPI] = useState(false);

  const widgetCode = `<!-- Add this script tag to your <head> or before </body> -->
<script src="${typeof window !== 'undefined' ? window.location.origin : ''}/widget.js" async></script>

<!-- Add this div where you want the reviews to appear -->
<div data-reviews-plethora-campaign="YOUR_CAMPAIGN_ID"></div>`;

  const apiExample = `// Fetch reviews for your campaign
fetch('${typeof window !== 'undefined' ? window.location.origin : ''}/api/widget/YOUR_CAMPAIGN_ID')
  .then(response => response.json())
  .then(data => {
    console.log('Reviews:', data.reviews);
    console.log('Average Rating:', data.stats.averageRating);
  });`;

  const copyToClipboard = (text: string, type: 'widget' | 'api') => {
    navigator.clipboard.writeText(text);
    if (type === 'widget') {
      setCopiedWidget(true);
      setTimeout(() => setCopiedWidget(false), 2000);
    } else {
      setCopiedAPI(true);
      setTimeout(() => setCopiedAPI(false), 2000);
    }
    toast.success("Copied to clipboard!");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Developer Resources</h1>
          <p className="text-muted-foreground">
            Integrate Reviews Plethora into your website using our embeddable widget or API
          </p>
        </div>

        <Tabs defaultValue="widget" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="widget">
              <Code className="w-4 h-4 mr-2" />
              Widget
            </TabsTrigger>
            <TabsTrigger value="api">
              <Globe className="w-4 h-4 mr-2" />
              API
            </TabsTrigger>
          </TabsList>

          {/* Widget Tab */}
          <TabsContent value="widget" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Embeddable Review Widget</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Add your campaign reviews to any website with just two lines of code.
                </p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Installation Code</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(widgetCode, 'widget')}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {copiedWidget ? "Copied!" : "Copy"}
                    </Button>
                  </div>

                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{widgetCode}</code>
                  </pre>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">How to Use</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Copy the code above</li>
                    <li>Replace <code className="bg-muted px-1 py-0.5 rounded">YOUR_CAMPAIGN_ID</code> with your actual campaign ID</li>
                    <li>Paste the script tag in your HTML</li>
                    <li>Add the div where you want reviews to appear</li>
                    <li>The widget will load automatically!</li>
                  </ol>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
                    💡 Pro Tip
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    You can add multiple widgets on the same page for different campaigns.
                    Just add multiple divs with different campaign IDs!
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 dark:border-orange-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Domain Whitelisting (Security)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Control which websites can embed your review widget by whitelisting specific domains.
                </p>

                <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-orange-900 dark:text-orange-100">
                    🔒 Security Notice
                  </h4>
                  <p className="text-sm text-orange-800 dark:text-orange-200">
                    By default, your widget works on ALL domains. For production use, we strongly recommend
                    whitelisting only your authorized domains to prevent unauthorized use.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">How to Whitelist Domains</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Go to your campaign details page</li>
                    <li>Click on the &quot;Widget Settings&quot; tab</li>
                    <li>Add the full URLs of domains where you want to embed the widget (e.g., https://example.com)</li>
                    <li>Click &quot;Save Settings&quot;</li>
                    <li>The widget will only work on whitelisted domains</li>
                  </ol>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Example Whitelisted Domains</h3>
                  <pre className="bg-muted p-4 rounded-lg text-sm">
{`https://www.mywebsite.com
https://blog.mywebsite.com
https://mystore.com`}
                  </pre>
                </div>

                <div className="text-sm text-muted-foreground space-y-1">
                  <p><strong>Note:</strong> Include the full URL with protocol (https://)</p>
                  <p><strong>Tip:</strong> Each subdomain needs to be whitelisted separately</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Widget Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Responsive design - works on all devices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Dark mode compatible</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Displays average rating and star reviews</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Shows reviewer avatars and names</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Lightweight and fast loading</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>No dependencies required</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Tab */}
          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reviews API</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Fetch review data programmatically using our REST API.
                </p>

                <div className="space-y-2">
                  <h3 className="font-semibold">Endpoint</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <code className="text-sm">
                      GET {typeof window !== 'undefined' ? window.location.origin : ''}/api/widget/&#123;campaignId&#125;
                    </code>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Example Request</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(apiExample, 'api')}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {copiedAPI ? "Copied!" : "Copy"}
                    </Button>
                  </div>

                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{apiExample}</code>
                  </pre>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Response Format</h3>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "campaign": {
    "id": "campaign_id",
    "name": "Campaign Name",
    "description": "Description"
  },
  "stats": {
    "totalReviews": 42,
    "averageRating": 4.8
  },
  "reviews": [
    {
      "id": "review_id",
      "rating": 5,
      "title": "Great product!",
      "review": "Detailed review text...",
      "author": {
        "name": "John Doe",
        "avatar": "https://..."
      },
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>CORS enabled - respects domain whitelist settings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Cached for 5 minutes (fast response)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>JSON format - easy to parse</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>No authentication required for public campaigns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">⚠</span>
                    <span>Domain whitelisting applies to API requests too</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
