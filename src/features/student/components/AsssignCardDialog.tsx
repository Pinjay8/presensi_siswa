import {
  Autocomplete,
  Box,
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
import { useQueryClient } from "@tanstack/react-query";
import { XIcon } from "lucide-react";

interface AssignCardDialogProps {
  open: boolean;
  onClose: () => void;
  assignList: any[];
  isLoading: boolean;
  selectedCardId: number | null;
  setSelectedCardId: (id: number) => void;
  onAssign: () => void;
  isAssigning: boolean;
  lang: any;
}

export default function AssignCardDialog({
  open,
  onClose,
  assignList,
  isLoading,
  selectedCardId,
  setSelectedCardId,
  onAssign,
  isAssigning,
  lang,
}: AssignCardDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {lang.text("assignCard")}
        <IconButton onClick={onClose}>
          <XIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Typography mb={2}>{lang.text("chooseCards")}</Typography>

        {isLoading ? (
          <CircularProgress />
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Autocomplete
              options={assignList || []}
              loading={isLoading}
              value={
                assignList?.find((item: any) => item.id === selectedCardId) ||
                null
              }
              onChange={(_, newValue) => {
                if (newValue) {
                  setSelectedCardId(newValue.id);
                }
              }}
              getOptionLabel={(option: any) =>
                option.nomorKartu || option.nomerNfc || "Unknown Card"
              }
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderOption={(props, option) => (
                <Box component="li" {...props} key={option.id}>
                  <Box>
                    <Typography fontWeight={600}>
                      {option.nomorKartu || option.nomerNfc}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      Tipe: {option.tipe}
                    </Typography>
                  </Box>
                </Box>
              )}
              renderInput={(params) => (
                <TextField {...params} label="" placeholder="" />
              )}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onAssign}
          variant="contained"
          disabled={!selectedCardId || isAssigning}
        >
          {isAssigning ? "Assigning..." : "Assign"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
