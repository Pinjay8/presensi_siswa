import { API_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface ProfileDialogProps {
  open: boolean;
  onClose: () => void;
  user: any;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  handleToggle: (checked: boolean) => void;
  profile: any;
}

export default function ProfileDialog({
  open,
  onClose,
  user,
  loading,
  setLoading,
  handleToggle,
  profile,
}: ProfileDialogProps) {
  const isAdmin = profile?.user?.role === "admin";

  //   const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<any>(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_CONFIG.baseUrl}/license/status`);

      const data = await response.json();
      setStatus(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      disableAutoFocus
      disableEnforceFocus
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        Profile
        <IconButton onClick={onClose}>
          <XIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 2,
              borderRadius: 2,
              color: "#fff",
              bgcolor: "primary.main",
            }}
          >
            <Avatar
              sx={{
                width: 56,
                height: 56,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                fontWeight: 600,
                border: "1px solid #fff",
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || ""}
            </Avatar>

            <Box>
              <Typography variant="h6" className="capitalize">
                {user?.name}
              </Typography>
            </Box>
          </Box>

          <Card variant="outlined">
            <CardContent>
              <Stack spacing={1.5}>
                <Box>
                  <Typography variant="body1" color="text.secondary">
                    Email
                  </Typography>
                  <Typography>{user?.email}</Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="body1" color="text.secondary">
                    {lang.text("numberPhone")}
                  </Typography>
                  <Typography>{user?.noTlp || "-"}</Typography>
                </Box>

                <Divider />
                {isAdmin && (
                  <>
                    <Box>
                      <Typography variant="body1" color="text.secondary">
                        {lang.text("license")}
                      </Typography>
                      <Typography color="text.secondary">
                        {status?.data.expiryDate
                          ? new Date(status.data.expiryDate).toLocaleString(
                              "id-ID",
                              {
                                dateStyle: "long",
                                timeStyle: "medium",
                              },
                            )
                          : "-"}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box>
                      <Typography variant="body1" color="text.secondary">
                       {lang.text("school")}
                      </Typography>
                      <Typography>
                        {user?.sekolah?.namaSekolah || "-"}
                      </Typography>
                    </Box>
                    <Divider />
                    <div className="flex  flex-col gap-2">
                      <Typography variant="body1" color="text.secondary">
                        {lang.text("notify")}
                      </Typography>

                      <Switch
                        checked={user?.notifOrtuEnabled ?? false}
                        disabled={loading}
                        onChange={(e) => handleToggle(e.target.checked)}
                      />

                      {loading && (
                        <span className="text-xs text-gray-400">Saving...</span>
                      )}
                    </div>
                  </>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
