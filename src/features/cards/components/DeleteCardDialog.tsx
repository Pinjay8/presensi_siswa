import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { lang } from "@/core/libs";

type DeleteDialogProps = {
  open: any;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  title?: string;
  message?: string;
};

export const DeleteDialog = ({
  open,
  onClose,
  onConfirm,
  loading = false,
  title,
  message,
}: DeleteDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title || lang.text("delete")}</DialogTitle>

      <DialogContent dividers>
        <DialogContentText>
          {message || lang.text("deleteMessage")}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="primary">
          {lang.text("cancel")}
        </Button>

        <Button
          onClick={onConfirm}
          disabled={loading}
          variant="contained"
          color="primary"
        >
          {lang.text("delete")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
