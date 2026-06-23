import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
} from "@/core/libs";
import { AlertCircle, CheckCircle2, Upload } from "lucide-react";
import { API_CONFIG } from "@/core/configs";

interface LicenseStatus {
  isValid: boolean;
  customer: string | null;
  maxWaDaily: number;
  expiryDate: string | null;
  currentWaCount: number;
  error: string | null;
}

const LicenseLanding = () => {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<LicenseStatus | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchStatus = async () => {
    try {
      setLoading(true);

      //   const res = await fetch("/license/status");
      const response = await fetch(`${API_CONFIG.baseUrl}/license/status`);

      //   const json = await

      setStatus(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      await fetch("/license/upload", {
        method: "POST",
        body: formData,
      });

      await fetchStatus();
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container max-w-3xl mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle>License Management</CardTitle>
          <CardDescription>
            Upload and manage your application license.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              <div
                className={`rounded-lg border p-4 ${
                  status?.isValid
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  {status?.isValid ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}

                  <span className="font-medium">
                    {status?.isValid ? "License Active" : "License Not Valid"}
                  </span>
                </div>

                {status?.error && (
                  <p className="mt-2 text-sm text-red-600">{status.error}</p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Info label="Customer" value={status?.customer ?? "-"} />

                <Info label="Expiry Date" value={status?.expiryDate ?? "-"} />

                <Info
                  label="WA Usage"
                  value={`${status?.currentWaCount ?? 0} / ${
                    status?.maxWaDaily ?? 0
                  }`}
                />

                <Info
                  label="Status"
                  value={status?.isValid ? "Active" : "Inactive"}
                />
              </div>

              <div className="border rounded-lg p-6">
                <div className="space-y-4">
                  <input
                    type="file"
                    accept=".lic"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />

                  <Button onClick={handleUpload} disabled={!file || uploading}>
                    <Upload className="mr-2 h-4 w-4" />

                    {uploading ? "Uploading..." : "Upload License"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const Info = ({ label, value }: { label: string; value: React.ReactNode }) => {
  return (
    <div className="rounded-lg border p-4">
      <div className="text-sm text-muted-foreground">{label}</div>

      <div className="mt-1 font-semibold">{value}</div>
    </div>
  );
};

export default LicenseLanding;
