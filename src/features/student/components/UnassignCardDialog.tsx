import { lang } from "@/core/libs";
import {
  Autocomplete,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { XIcon } from "lucide-react";

interface UnassignCardDialogProps {
  open: boolean;
  onClose: () => void;
  userCards: any[];
  isLoading: boolean;
  unassignCardId: number | null;
  setUnassignCardId: (id: number | null) => void;
  onUnassign: () => void;
  isUnassigning: boolean;
}

export default function UnassignCardDialog({
  open,
  onClose,
  userCards,
  isLoading,
  unassignCardId,
  setUnassignCardId,
  onUnassign,
  isUnassigning,
}: UnassignCardDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        Unassign Card
        <IconButton onClick={onClose}>
          <XIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <>
            <Typography mb={2}>{lang.text("chooseCards")}</Typography>
            <Autocomplete
              options={userCards}
              value={
                userCards.find((c: any) => c.id === unassignCardId) || null
              }
              onChange={(_, newValue) => {
                setUnassignCardId(newValue?.id || null);
              }}
              getOptionLabel={(option: any) =>
                option.nomorKartu || option.nomerNfc || "Unknown Card"
              }
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => <TextField {...params} label="" />}
            />
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button
          color="error"
          variant="contained"
          onClick={onUnassign}
          disabled={!unassignCardId || isUnassigning}
        >
          {isUnassigning ? "Unassigning..." : "Unassign"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
