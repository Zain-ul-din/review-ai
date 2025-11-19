"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Globe } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { updateCampaignWidgetSettings } from "@/server/actions/campaign";

interface WidgetSettingsProps {
  campaignId: string;
  initialDomains: string[];
}

export function WidgetSettings({ campaignId, initialDomains }: WidgetSettingsProps) {
  const [domains, setDomains] = useState<string[]>(initialDomains || []);
  const [newDomain, setNewDomain] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAddDomain = () => {
    const trimmedDomain = newDomain.trim();

    if (!trimmedDomain) {
      toast.error("Please enter a domain");
      return;
    }

    // Validate URL format
    try {
      new URL(trimmedDomain);
    } catch {
      toast.error("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    // Check for duplicates
    if (domains.includes(trimmedDomain)) {
      toast.error("This domain is already in the whitelist");
      return;
    }

    setDomains([...domains, trimmedDomain]);
    setNewDomain("");
  };

  const handleRemoveDomain = (domainToRemove: string) => {
    setDomains(domains.filter(domain => domain !== domainToRemove));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateCampaignWidgetSettings(campaignId, domains);
      toast.success("Widget settings saved successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Widget Domain Whitelist</h3>
        <p className="text-sm text-muted-foreground">
          Control which domains can embed your review widget. Leave empty to allow all domains.
        </p>
      </div>

      {/* Add Domain Input */}
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder="https://example.com"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddDomain();
              }
            }}
          />
        </div>
        <Button onClick={handleAddDomain} variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Add Domain
        </Button>
      </div>

      {/* Domain List */}
      {domains.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm font-medium">Whitelisted Domains ({domains.length})</p>
          <div className="flex flex-wrap gap-2">
            {domains.map((domain) => (
              <Badge
                key={domain}
                variant="secondary"
                className="px-3 py-1.5 flex items-center gap-2"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="text-sm">{domain}</span>
                <button
                  onClick={() => handleRemoveDomain(domain)}
                  className="ml-1 hover:text-destructive transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-6 text-center">
          <Globe className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            No domains whitelisted. Widget will work on all domains.
          </p>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      {/* Info Box */}
      <div className="bg-muted/50 border rounded-lg p-4 space-y-2">
        <h4 className="text-sm font-semibold">How it works:</h4>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Add the full URL of domains where you want to embed the widget (e.g., https://example.com)</li>
          <li>Only requests from these domains will be able to load reviews via the widget</li>
          <li>If no domains are added, the widget will work on any domain (not recommended for production)</li>
          <li>Changes take effect immediately after saving</li>
        </ul>
      </div>
    </div>
  );
}
