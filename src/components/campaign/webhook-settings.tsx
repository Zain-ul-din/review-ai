"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash, Edit, Send, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  addWebhook,
  updateWebhook,
  deleteWebhook,
  testWebhook,
} from "@/server/actions/webhooks";
import { Webhook, WebhookEvent } from "@/types/index.d";

interface WebhookSettingsProps {
  campaignId: string;
  initialWebhooks: Webhook[];
}

const WEBHOOK_EVENTS: { value: WebhookEvent; label: string; description: string }[] = [
  { value: "review.created", label: "Review Created", description: "Triggered when a new review is submitted" },
  { value: "review.approved", label: "Review Approved", description: "Triggered when a review is approved" },
  { value: "review.rejected", label: "Review Rejected", description: "Triggered when a review is rejected" },
  { value: "review.flagged", label: "Review Flagged", description: "Triggered when a review is flagged" },
];

export function WebhookSettings({ campaignId, initialWebhooks }: WebhookSettingsProps) {
  const [webhooks, setWebhooks] = useState<Webhook[]>(initialWebhooks || []);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Form state
  const [url, setUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<WebhookEvent[]>(["review.created"]);
  const [enabled, setEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setUrl("");
    setSelectedEvents(["review.created"]);
    setEnabled(true);
    setEditingWebhook(null);
  };

  const handleAddWebhook = async () => {
    setIsLoading(true);
    try {
      await addWebhook(campaignId, url, selectedEvents);
      toast.success("Webhook added successfully!");
      setIsAddDialogOpen(false);
      resetForm();
      // Refresh page to get updated webhooks
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add webhook");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateWebhook = async () => {
    if (!editingWebhook) return;

    setIsLoading(true);
    try {
      await updateWebhook(campaignId, editingWebhook._id, url, selectedEvents, enabled);
      toast.success("Webhook updated successfully!");
      setIsEditDialogOpen(false);
      resetForm();
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update webhook");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteWebhook = async (webhookId: string) => {
    if (!confirm("Are you sure you want to delete this webhook?")) return;

    try {
      await deleteWebhook(campaignId, webhookId);
      toast.success("Webhook deleted successfully!");
      setWebhooks(webhooks.filter((w) => w._id !== webhookId));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete webhook");
    }
  };

  const handleTestWebhook = async (webhookId: string) => {
    try {
      await testWebhook(campaignId, webhookId);
      toast.success("Test webhook sent successfully! Check your endpoint.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send test webhook");
    }
  };

  const handleEditClick = (webhook: Webhook) => {
    setEditingWebhook(webhook);
    setUrl(webhook.url);
    setSelectedEvents(webhook.events);
    setEnabled(webhook.enabled);
    setIsEditDialogOpen(true);
  };

  const handleEventToggle = (event: WebhookEvent) => {
    setSelectedEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]
    );
  };

  const WebhookForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="webhook-url">Webhook URL</Label>
        <Input
          id="webhook-url"
          type="url"
          placeholder="https://example.com/webhooks"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          The URL where webhook payloads will be sent
        </p>
      </div>

      <div className="space-y-3">
        <Label>Events</Label>
        <p className="text-xs text-muted-foreground mb-2">
          Select which events should trigger this webhook
        </p>
        {WEBHOOK_EVENTS.map((event) => (
          <div key={event.value} className="flex items-start space-x-3">
            <Checkbox
              id={event.value}
              checked={selectedEvents.includes(event.value)}
              onCheckedChange={() => handleEventToggle(event.value)}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor={event.value}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {event.label}
              </label>
              <p className="text-xs text-muted-foreground">{event.description}</p>
            </div>
          </div>
        ))}
      </div>

      {editingWebhook && (
        <div className="flex items-center space-x-2">
          <Switch
            id="enabled"
            checked={enabled}
            onCheckedChange={setEnabled}
          />
          <Label htmlFor="enabled" className="cursor-pointer">
            Enabled
          </Label>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Webhook Endpoints</h3>
            <p className="text-sm text-muted-foreground">
              Receive real-time notifications when events occur on your campaign
            </p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Webhook
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Webhook</DialogTitle>
                <DialogDescription>
                  Configure a new webhook endpoint to receive event notifications
                </DialogDescription>
              </DialogHeader>
              <WebhookForm />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddWebhook} disabled={isLoading || !url || selectedEvents.length === 0}>
                  {isLoading ? "Adding..." : "Add Webhook"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Webhooks Table */}
      {webhooks.length > 0 ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>URL</TableHead>
                <TableHead>Events</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Secret</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {webhooks.map((webhook) => (
                <TableRow key={webhook._id}>
                  <TableCell className="font-mono text-sm max-w-xs truncate">
                    {webhook.url}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {webhook.events.map((event) => (
                        <Badge key={event} variant="secondary" className="text-xs">
                          {event}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={webhook.enabled ? "default" : "secondary"}>
                      {webhook.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(webhook.secret || "");
                        toast.success("Secret copied to clipboard!");
                      }}
                      className="h-7"
                    >
                      <Copy className="w-3.5 h-3.5 mr-1" />
                      Copy
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleTestWebhook(webhook._id)}
                        title="Send test webhook"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(webhook)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteWebhook(webhook._id)}
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
      ) : (
        <div className="border rounded-lg p-12 text-center">
          <p className="text-muted-foreground mb-4">
            No webhooks configured yet. Add a webhook to start receiving event notifications.
          </p>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Webhook
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Webhook</DialogTitle>
                <DialogDescription>
                  Configure a new webhook endpoint to receive event notifications
                </DialogDescription>
              </DialogHeader>
              <WebhookForm />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddWebhook} disabled={isLoading || !url || selectedEvents.length === 0}>
                  {isLoading ? "Adding..." : "Add Webhook"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Webhook</DialogTitle>
            <DialogDescription>
              Update your webhook configuration
            </DialogDescription>
          </DialogHeader>
          <WebhookForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateWebhook} disabled={isLoading || !url || selectedEvents.length === 0}>
              {isLoading ? "Updating..." : "Update Webhook"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Info Section */}
      <div className="bg-muted/50 border rounded-lg p-4 space-y-2">
        <h4 className="text-sm font-semibold">Webhook Security</h4>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Each webhook has a unique secret for HMAC-SHA256 signature verification</li>
          <li>Verify the X-Webhook-Signature header to ensure requests are authentic</li>
          <li>Webhook payloads are sent as JSON with event details</li>
          <li>Use the test button to send a sample payload to your endpoint</li>
        </ul>
      </div>
    </div>
  );
}
