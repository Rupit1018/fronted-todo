import { Close } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { IconButton } from "@mui/material";

// CloseSnackbar component receives `id` for closing the snackbar
export const CloseButton = ({ id }) => {
  const { closeSnackbar } = useSnackbar();

  return (
    <IconButton
      color="inherit"
      size="small"
      onClick={() => closeSnackbar(id)}
    >
      <Close fontSize="small" />
    </IconButton>
  );
};

// Global reference to snackbar
let useSnackbarRef;

export const SnackbarUtilsConfiguration = () => {
  useSnackbarRef = useSnackbar();
  return null;
};

// Toast helper object for reusable notifications
const Toast = {
  success(message) {
    this.toast(message, "success");
  },
  warning(message) {
    this.toast(message, "warning");
  },
  info(message) {
    this.toast(message, "info");
  },
  error(message) {
    this.toast(message, "error");
  },
  toast(message, variant = "default") {
    useSnackbarRef.enqueueSnackbar(message, { variant });
  },
};

export default Toast;
