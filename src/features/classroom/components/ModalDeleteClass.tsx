import { lang } from "@/core/libs";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { XIcon } from "lucide-react";

interface DeleteConfirmationDialogProps {
  open: boolean;
  title: string;
  message: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
  cancelText?: string;
  confirmText?: string;
}

const ModalDeleteClass = ({
  open,
  title,
  message,
  loading = false,
  onClose,
  onConfirm,
  cancelText = "Cancel",
  confirmText = "Delete",
}: DeleteConfirmationDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        {title}
        <IconButton onClick={onClose}>
          <XIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          color="primary"
          variant="outlined"
          sx={{ textTransform: "capitalize" }}
        >
          {cancelText}
        </Button>

        <Button
          onClick={onConfirm}
          disabled={loading}
          variant="contained"
          color="primary"
          sx={{ textTransform: "capitalize" }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalDeleteClass;
