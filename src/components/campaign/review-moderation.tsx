"use client";

import { useState, useMemo } from "react";
import { CampaignFeedbackType } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  X,
  Trash,
  Flag,
  Search,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import {
  updateReviewStatus,
  deleteCampaignFeedback,
  flagReview,
} from "@/server/actions/campaign-feedback";

interface ReviewModerationProps {
  feedbacks: CampaignFeedbackType[];
  campaignId: string;
}

export function ReviewModeration({ feedbacks, campaignId }: ReviewModerationProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // Filter and search logic
  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((feedback) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        feedback.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.review.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.userMeta.fullName.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "approved" && (feedback.status === "approved" || !feedback.status)) ||
        (statusFilter === "pending" && feedback.status === "pending") ||
        (statusFilter === "rejected" && feedback.status === "rejected") ||
        (statusFilter === "flagged" && feedback.flagged);

      // Rating filter
      const matchesRating =
        ratingFilter === "all" || feedback.rating.toString() === ratingFilter;

      return matchesSearch && matchesStatus && matchesRating;
    });
  }, [feedbacks, searchTerm, statusFilter, ratingFilter]);

  const handleApprove = async (reviewId: string) => {
    setLoadingAction(reviewId);
    try {
      await updateReviewStatus(reviewId, campaignId, "approved");
      toast.success("Review approved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to approve review");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleReject = async (reviewId: string) => {
    setLoadingAction(reviewId);
    try {
      await updateReviewStatus(reviewId, campaignId, "rejected");
      toast.success("Review rejected");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to reject review");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review? This action cannot be undone.")) {
      return;
    }

    setLoadingAction(reviewId);
    try {
      await deleteCampaignFeedback(reviewId, campaignId);
      toast.success("Review deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete review");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleFlag = async (reviewId: string, currentlyFlagged: boolean) => {
    setLoadingAction(reviewId);
    try {
      await flagReview(reviewId, campaignId, !currentlyFlagged, "Flagged by moderator");
      toast.success(currentlyFlagged ? "Flag removed" : "Review flagged");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to flag review");
    } finally {
      setLoadingAction(null);
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status || status === "approved") {
      return <Badge variant="default" className="bg-green-500">Approved</Badge>;
    }
    if (status === "pending") {
      return <Badge variant="secondary">Pending</Badge>;
    }
    if (status === "rejected") {
      return <Badge variant="destructive">Rejected</Badge>;
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="flagged">Flagged</SelectItem>
          </SelectContent>
        </Select>

        {/* Rating Filter */}
        <Select value={ratingFilter} onValueChange={setRatingFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
            <SelectItem value="4">4 Stars</SelectItem>
            <SelectItem value="3">3 Stars</SelectItem>
            <SelectItem value="2">2 Stars</SelectItem>
            <SelectItem value="1">1 Star</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredFeedbacks.length} of {feedbacks.length} reviews
      </div>

      {/* Reviews Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Avatar</TableHead>
              <TableHead>User</TableHead>
              <TableHead className="w-20">Rating</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="w-32">Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-48 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFeedbacks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No reviews found
                </TableCell>
              </TableRow>
            ) : (
              filteredFeedbacks.map((feedback) => (
                <TableRow key={feedback._id}>
                  <TableCell>
                    <Avatar className="w-8 h-8">
                      <img
                        src={feedback.userMeta.imageUrl}
                        alt={feedback.userMeta.fullName}
                      />
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{feedback.userMeta.fullName}</span>
                      <VerifiedBadge isAnonymous={feedback.isAnonymous} size="sm" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">{feedback.rating}</span>/5
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {feedback.title}
                    {feedback.flagged && (
                      <Flag className="inline-block w-3 h-3 ml-2 text-red-500" />
                    )}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(feedback.status)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      {/* Approve */}
                      {feedback.status !== "approved" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => handleApprove(feedback._id)}
                          disabled={loadingAction === feedback._id}
                          title="Approve"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}

                      {/* Reject */}
                      {feedback.status !== "rejected" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                          onClick={() => handleReject(feedback._id)}
                          disabled={loadingAction === feedback._id}
                          title="Reject"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}

                      {/* Flag */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 ${
                          feedback.flagged
                            ? "text-red-600 hover:text-red-700 hover:bg-red-50"
                            : "text-muted-foreground hover:text-red-600 hover:bg-red-50"
                        }`}
                        onClick={() => handleFlag(feedback._id, !!feedback.flagged)}
                        disabled={loadingAction === feedback._id}
                        title={feedback.flagged ? "Unflag" : "Flag"}
                      >
                        <Flag className="h-4 w-4" />
                      </Button>

                      {/* Delete */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(feedback._id)}
                        disabled={loadingAction === feedback._id}
                        title="Delete"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
