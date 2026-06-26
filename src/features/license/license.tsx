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
import { authService } from "@/core/services";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../_global";
import { Backdrop, CircularProgress } from "@mui/material";

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
  const alert = useAlert();

  const navigate = useNavigate();

  const fetchStatus = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_CONFIG.baseUrl}/license/status`);

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
      await new Promise((r) => setTimeout(r, 1000));

      const formData = new FormData();
      formData.append("license", file);

      const response = await fetch(`${API_CONFIG.baseUrl}/license/upload`, {
        method: "POST",
        body: formData,
      });

      const res = await response.json();

      if (res.success) {
        // navigate("/", { replace: true });
        window.location.href = "/";
        alert.success("Successfully activate license");
      }

      // await fetchStatus();
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

              <div className="rounded-xl border-2 border-dashed border-muted-foreground/30 p-8 text-center">
                <Upload className="mx-auto mb-4 h-12 w-12 text-primary" />

                <h3 className="text-lg font-semibold">Upload License</h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  Select your <strong>.lic</strong> file to activate this
                  application.
                </p>

                <label className="mt-6 inline-block cursor-pointer">
                  <input
                    type="file"
                    accept=".lic"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />

                  <div className="rounded-lg border px-5 py-2 hover:bg-muted transition">
                    Choose License File
                  </div>
                </label>

                {file && (
                  <div className="mt-5 rounded-lg border bg-muted/40 p-4">
                    <div className="font-medium">{file.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(2)} KB
                    </div>
                  </div>
                )}

                <Button
                  className="mt-6 w-full"
                  onClick={handleUpload}
                  disabled={!file || uploading}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {uploading ? "Uploading License..." : "Activate License"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <Backdrop
        open={uploading}
        sx={{
          color: "primary.main",
          zIndex: (theme) => theme.zIndex.drawer + 9999,
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
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
