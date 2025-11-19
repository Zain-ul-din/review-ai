"use client";

import { useState, useRef } from "react";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Download,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  FileSpreadsheet,
} from "lucide-react";
import { toast } from "sonner";
import { generateBulkMagicLinks } from "@/server/actions/magic-links";

interface CSVRow {
  customerName: string;
  customerEmail: string;
  orderId?: string;
}

interface ParsedData extends CSVRow {
  rowNumber: number;
  isValid: boolean;
  errors: string[];
}

interface BulkUploadResult {
  customerName: string;
  customerEmail: string;
  orderId?: string;
  success: boolean;
  url?: string;
  error?: string;
}

interface BulkMagicLinksUploadProps {
  campaignId: string;
  onComplete?: () => void;
}

export function BulkMagicLinksUpload({ campaignId, onComplete }: BulkMagicLinksUploadProps) {
  const [parsedData, setParsedData] = useState<ParsedData[]>([]);
  const [results, setResults] = useState<BulkUploadResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<"upload" | "preview" | "results">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Download CSV template
  const downloadTemplate = () => {
    const csvContent = `customerName,customerEmail,orderId
John Doe,john@example.com,ORD-001
Jane Smith,jane@example.com,ORD-002
Bob Johnson,bob@example.com,`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "magic-links-template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Validate email
  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Validate CSV row
  const validateRow = (row: CSVRow, rowNumber: number): ParsedData => {
    const errors: string[] = [];

    if (!row.customerName || row.customerName.trim() === "") {
      errors.push("Name is required");
    }

    if (!row.customerEmail || row.customerEmail.trim() === "") {
      errors.push("Email is required");
    } else if (!isValidEmail(row.customerEmail)) {
      errors.push("Invalid email format");
    }

    return {
      ...row,
      rowNumber,
      isValid: errors.length === 0,
      errors,
    };
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  // Handle drag & drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Parse CSV file
  const handleFile = (selectedFile: File) => {
    if (!selectedFile.name.endsWith(".csv")) {
      toast.error("Please upload a CSV file");
      return;
    }

    Papa.parse<CSVRow>(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const validated = results.data.map((row, index) =>
          validateRow(row, index + 2) // +2 because row 1 is header
        );

        setParsedData(validated);
        setStep("preview");

        const validCount = validated.filter((r) => r.isValid).length;
        const invalidCount = validated.filter((r) => !r.isValid).length;

        if (invalidCount > 0) {
          toast.warning(`${validCount} valid, ${invalidCount} invalid rows`);
        } else {
          toast.success(`${validCount} rows ready to process`);
        }
      },
      error: () => {
        toast.error("Failed to parse CSV file");
      },
    });
  };

  // Generate magic links
  const handleGenerate = async () => {
    const validRows = parsedData.filter((row) => row.isValid);

    if (validRows.length === 0) {
      toast.error("No valid rows to process");
      return;
    }

    setIsProcessing(true);

    try {
      const result = await generateBulkMagicLinks({
        campaignId,
        customers: validRows.map((row) => ({
          customerName: row.customerName,
          customerEmail: row.customerEmail,
          orderId: row.orderId,
        })),
      });

      setResults(result.results);
      setStep("results");

      toast.success(
        `Successfully generated ${result.successful} magic links${
          result.failed > 0 ? `, ${result.failed} failed` : ""
        }`
      );

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate magic links");
    } finally {
      setIsProcessing(false);
    }
  };

  // Export results as CSV
  const exportResults = () => {
    const csvContent = Papa.unparse({
      fields: ["customerName", "customerEmail", "orderId", "status", "magicLinkUrl", "error"],
      data: results.map((result) => ({
        customerName: result.customerName,
        customerEmail: result.customerEmail,
        orderId: result.orderId || "",
        status: result.success ? "Success" : "Failed",
        magicLinkUrl: result.url || "",
        error: result.error || "",
      })),
    });

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `magic-links-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success("Results exported successfully");
  };

  // Reset
  const handleReset = () => {
    setParsedData([]);
    setResults([]);
    setStep("upload");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Upload step
  if (step === "upload") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bulk Upload Magic Links</CardTitle>
          <CardDescription>
            Upload a CSV file to generate magic links for multiple customers at once
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Template download */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Download CSV Template</p>
                <p className="text-sm text-muted-foreground">
                  Get started with our pre-formatted template
                </p>
              </div>
            </div>
            <Button onClick={downloadTemplate} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>

          {/* File upload */}
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-1">Upload CSV File</p>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop your file here, or click to browse
            </p>
            <Input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button variant="secondary" size="sm">
              Select File
            </Button>
          </div>

          {/* Format info */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Required columns:</strong> customerName, customerEmail
              <br />
              <strong>Optional column:</strong> orderId
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Preview step
  if (step === "preview") {
    const validCount = parsedData.filter((r) => r.isValid).length;
    const invalidCount = parsedData.filter((r) => !r.isValid).length;

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Preview & Validate</CardTitle>
              <CardDescription>
                Review the data before generating magic links
              </CardDescription>
            </div>
            <Button onClick={handleReset} variant="outline" size="sm">
              Upload Different File
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Stats */}
          <div className="flex gap-4">
            <Badge variant="default" className="text-sm">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              {validCount} Valid
            </Badge>
            {invalidCount > 0 && (
              <Badge variant="destructive" className="text-sm">
                <XCircle className="h-3 w-3 mr-1" />
                {invalidCount} Invalid
              </Badge>
            )}
          </div>

          {/* Data table */}
          <div className="border rounded-lg max-h-[400px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Row</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead className="w-24">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parsedData.map((row) => (
                  <TableRow key={row.rowNumber}>
                    <TableCell className="font-mono text-xs">
                      {row.rowNumber}
                    </TableCell>
                    <TableCell>{row.customerName}</TableCell>
                    <TableCell>{row.customerEmail}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {row.orderId || "-"}
                    </TableCell>
                    <TableCell>
                      {row.isValid ? (
                        <Badge variant="default" className="text-xs">
                          <CheckCircle2 className="h-3 w-3" />
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-xs">
                          <XCircle className="h-3 w-3" />
                        </Badge>
                      )}
                      {!row.isValid && row.errors.length > 0 && (
                        <p className="text-xs text-destructive mt-1">
                          {row.errors.join(", ")}
                        </p>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4">
            <Button onClick={handleReset} variant="outline">
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={validCount === 0 || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>Generate {validCount} Magic Links</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Results step
  if (step === "results") {
    const successCount = results.filter((r) => r.success).length;
    const failedCount = results.filter((r) => !r.success).length;

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Generation Complete</CardTitle>
              <CardDescription>
                Magic links have been generated successfully
              </CardDescription>
            </div>
            <Button onClick={handleReset} variant="outline" size="sm">
              Upload Another File
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Stats */}
          <div className="flex gap-4">
            <Badge variant="default" className="text-sm">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              {successCount} Successful
            </Badge>
            {failedCount > 0 && (
              <Badge variant="destructive" className="text-sm">
                <XCircle className="h-3 w-3 mr-1" />
                {failedCount} Failed
              </Badge>
            )}
          </div>

          {/* Results table */}
          <div className="border rounded-lg max-h-[400px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Magic Link URL</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell>{result.customerName}</TableCell>
                    <TableCell>{result.customerEmail}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {result.orderId || "-"}
                    </TableCell>
                    <TableCell>
                      {result.success ? (
                        <Badge variant="default" className="text-xs">
                          Success
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-xs">
                          Failed
                        </Badge>
                      )}
                      {!result.success && result.error && (
                        <p className="text-xs text-destructive mt-1">
                          {result.error}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      {result.url ? (
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {result.url.substring(0, 40)}...
                        </code>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button onClick={exportResults} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Results as CSV
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
