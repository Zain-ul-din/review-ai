"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X, Globe, Copy, Check, Palette } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { updateCampaignWidgetSettings, updateWidgetCustomization } from "@/server/actions/campaign";
import { WidgetCustomization } from "@/types/index.d";

interface WidgetSettingsProps {
  campaignId: string;
  initialDomains: string[];
  initialCustomization?: WidgetCustomization;
}

export function WidgetSettings({ campaignId, initialDomains, initialCustomization }: WidgetSettingsProps) {
  const [domains, setDomains] = useState<string[]>(initialDomains || []);
  const [newDomain, setNewDomain] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingCustomization, setSavingCustomization] = useState(false);
  const [copied, setCopied] = useState(false);

  // Widget customization state
  const [customization, setCustomization] = useState<WidgetCustomization>({
    primaryColor: initialCustomization?.primaryColor || "#000000",
    backgroundColor: initialCustomization?.backgroundColor || "#ffffff",
    textColor: initialCustomization?.textColor || "#333333",
    headerText: initialCustomization?.headerText || "Customer Reviews",
    layout: initialCustomization?.layout || "list",
    showAvatars: initialCustomization?.showAvatars ?? true,
    showDates: initialCustomization?.showDates ?? true,
    showTitles: initialCustomization?.showTitles ?? true,
    brandingText: initialCustomization?.brandingText || "Powered by Reviews Plethora",
  });

  const widgetCode = `<!-- Add this script tag to your <head> or before </body> -->
<script src="${typeof window !== 'undefined' ? window.location.origin : ''}/widget.js" async></script>

<!-- Add this div where you want the reviews to appear -->
<div data-reviews-plethora-campaign="${campaignId}"></div>`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(widgetCode);
    setCopied(true);
    toast.success("Widget code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

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

  const handleSaveCustomization = async () => {
    setSavingCustomization(true);
    try {
      await updateWidgetCustomization(campaignId, customization);
      toast.success("Widget customization saved successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save customization");
    } finally {
      setSavingCustomization(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Widget Code Section */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Widget Installation Code</h3>
          <p className="text-sm text-muted-foreground">
            Copy and paste this code into your website to display your reviews.
          </p>
        </div>

        <div className="relative">
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm border">
            <code>{widgetCode}</code>
          </pre>
          <Button
            onClick={handleCopyCode}
            variant="outline"
            size="sm"
            className="absolute top-2 right-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy Code
              </>
            )}
          </Button>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="text-sm font-semibold mb-2 text-blue-900 dark:text-blue-100">
            📋 Quick Setup
          </h4>
          <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
            <li>Copy the code above</li>
            <li>Paste it into your HTML file</li>
            <li>The widget will automatically display your reviews!</li>
          </ol>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t" />

      {/* Widget Customization Section */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Widget Customization</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Customize the appearance and behavior of your review widget.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Color Settings */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Colors</h4>

            <div className="space-y-2">
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={customization.primaryColor}
                  onChange={(e) => setCustomization({ ...customization, primaryColor: e.target.value })}
                  className="w-20 h-10 cursor-pointer"
                />
                <Input
                  type="text"
                  value={customization.primaryColor}
                  onChange={(e) => setCustomization({ ...customization, primaryColor: e.target.value })}
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="backgroundColor">Background Color</Label>
              <div className="flex gap-2">
                <Input
                  id="backgroundColor"
                  type="color"
                  value={customization.backgroundColor}
                  onChange={(e) => setCustomization({ ...customization, backgroundColor: e.target.value })}
                  className="w-20 h-10 cursor-pointer"
                />
                <Input
                  type="text"
                  value={customization.backgroundColor}
                  onChange={(e) => setCustomization({ ...customization, backgroundColor: e.target.value })}
                  placeholder="#ffffff"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="textColor">Text Color</Label>
              <div className="flex gap-2">
                <Input
                  id="textColor"
                  type="color"
                  value={customization.textColor}
                  onChange={(e) => setCustomization({ ...customization, textColor: e.target.value })}
                  className="w-20 h-10 cursor-pointer"
                />
                <Input
                  type="text"
                  value={customization.textColor}
                  onChange={(e) => setCustomization({ ...customization, textColor: e.target.value })}
                  placeholder="#333333"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* Content Settings */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Content</h4>

            <div className="space-y-2">
              <Label htmlFor="headerText">Header Text</Label>
              <Input
                id="headerText"
                type="text"
                value={customization.headerText}
                onChange={(e) => setCustomization({ ...customization, headerText: e.target.value })}
                placeholder="Customer Reviews"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="layout">Layout Style</Label>
              <Select
                value={customization.layout}
                onValueChange={(value: "list" | "grid" | "carousel") =>
                  setCustomization({ ...customization, layout: value })
                }
              >
                <SelectTrigger id="layout">
                  <SelectValue placeholder="Select layout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="list">List</SelectItem>
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="carousel">Carousel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brandingText">Branding Text</Label>
              <Input
                id="brandingText"
                type="text"
                value={customization.brandingText}
                onChange={(e) => setCustomization({ ...customization, brandingText: e.target.value })}
                placeholder="Powered by Reviews Plethora"
              />
            </div>
          </div>
        </div>

        {/* Display Options */}
        <div className="space-y-4 pt-4 border-t">
          <h4 className="text-sm font-semibold">Display Options</h4>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="showAvatars" className="cursor-pointer">
                Show Avatars
              </Label>
              <Switch
                id="showAvatars"
                checked={customization.showAvatars}
                onCheckedChange={(checked) =>
                  setCustomization({ ...customization, showAvatars: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="showDates" className="cursor-pointer">
                Show Dates
              </Label>
              <Switch
                id="showDates"
                checked={customization.showDates}
                onCheckedChange={(checked) =>
                  setCustomization({ ...customization, showDates: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="showTitles" className="cursor-pointer">
                Show Titles
              </Label>
              <Switch
                id="showTitles"
                checked={customization.showTitles}
                onCheckedChange={(checked) =>
                  setCustomization({ ...customization, showTitles: checked })
                }
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleSaveCustomization} disabled={savingCustomization}>
            {savingCustomization ? "Saving..." : "Save Customization"}
          </Button>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t" />

      {/* Domain Whitelist Section */}
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
