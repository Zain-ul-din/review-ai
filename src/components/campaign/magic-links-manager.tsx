"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Copy, Trash, Link as LinkIcon, TrendingUp, Clock, CheckCircle2, XCircle } from "lucide-react";
import {
  generateMagicLink,
  getCampaignMagicLinks,
  deleteMagicLink,
  getMagicLinkStats,
} from "@/server/actions/magic-links";
import type { MagicLink } from "@/types";

const generateLinkSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().email("Invalid email address"),
  orderId: z.string().optional(),
  expiresInDays: z.string().default("7"),
});

type GenerateLinkFormType = z.infer<typeof generateLinkSchema>;

interface MagicLinksManagerProps {
  campaignId: string;
}

export function MagicLinksManager({ campaignId }: MagicLinksManagerProps) {
  const [links, setLinks] = useState<MagicLink[]>([]);
  const [stats, setStats] = useState<{
    total: number;
    pending: number;
    used: number;
    expired: number;
    conversionRate: number;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<GenerateLinkFormType>({
    resolver: zodResolver(generateLinkSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      orderId: "",
      expiresInDays: "7",
    },
  });

  // Load magic links and stats
  const loadData = async () => {
    try {
      const [linksData, statsData] = await Promise.all([
        getCampaignMagicLinks(campaignId),
        getMagicLinkStats(campaignId),
      ]);
      setLinks(linksData);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load magic links:", error);
      toast.error("Failed to load magic links");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [campaignId]);

  const onSubmit = async (data: GenerateLinkFormType) => {
    setIsGenerating(true);
    try {
      const result = await generateMagicLink({
        campaignId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        orderId: data.orderId || undefined,
        expiresInDays: parseInt(data.expiresInDays),
      });

      // Copy URL to clipboard
      await navigator.clipboard.writeText(result.url);
      toast.success("Magic link generated and copied to clipboard!");

      // Reset form
      form.reset();

      // Reload data
      await loadData();
    } catch (error) {
      console.error("Failed to generate magic link:", error);
      toast.error("Failed to generate magic link");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = async (token: string) => {
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/r/${token}`;
    await navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  const handleDelete = async (linkId: string) => {
    if (!confirm("Are you sure you want to delete this magic link?")) {
      return;
    }

    try {
      await deleteMagicLink(linkId, campaignId);
      toast.success("Magic link deleted");
      await loadData();
    } catch (error) {
      console.error("Failed to delete magic link:", error);
      toast.error("Failed to delete magic link");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case "used":
        return (
          <Badge variant="default" className="gap-1 bg-green-500">
            <CheckCircle2 className="h-3 w-3" />
            Used
          </Badge>
        );
      case "expired":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Expired
          </Badge>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-xs text-muted-foreground">Total Links</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.used}</div>
                <div className="text-xs text-muted-foreground">Submitted</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
                <div className="text-xs text-muted-foreground">Expired</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold flex items-center justify-center gap-1">
                  <TrendingUp className="h-5 w-5" />
                  {stats.conversionRate}%
                </div>
                <div className="text-xs text-muted-foreground">Conversion</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Generate Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            Generate Magic Link
          </CardTitle>
          <CardDescription>
            Create a personalized review link for a customer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Email *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="orderId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order ID (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="#12345" {...field} />
                      </FormControl>
                      <FormDescription>
                        Reference to track which order this review is for
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expiresInDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expires In</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select expiry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="3">3 days</SelectItem>
                          <SelectItem value="7">7 days</SelectItem>
                          <SelectItem value="14">14 days</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isGenerating}
                isLoading={isGenerating}
              >
                Generate & Copy Link
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Links Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Magic Links</CardTitle>
          <CardDescription>
            Manage and track your generated magic links
          </CardDescription>
        </CardHeader>
        <CardContent>
          {links.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No magic links generated yet
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {links.map((link) => (
                    <TableRow key={link._id}>
                      <TableCell className="font-medium">
                        {link.customerName}
                      </TableCell>
                      <TableCell>{link.customerEmail}</TableCell>
                      <TableCell>
                        {link.orderId ? (
                          <span className="text-sm">#{link.orderId}</span>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(link.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(link.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(link.expiresAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          {link.status === "pending" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyLink(link.tokenHash)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(link._id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
