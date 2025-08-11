import React from "react";
import {
  Cancel,
  CheckCircle,
  DoneAll,
  HourglassEmpty,
  NotInterested,
} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import ErrorIcon from "@mui/icons-material/Error";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Button } from "@mui/material";
import CustomAlert from "@mui/material/Alert";

const alertStyles = {
  success: {
    backgroundColor: "#D4EDDA",
    color: "#155724",
    border: "4px solid #155724",
    icon: <CheckCircle className="!w-4.5 !h-4.5 text-[#155724] mt-0.5" />,
  },
  error: {
    backgroundColor: "#ffebed",
    color: "#bc2f2e",
    border: "4px solid #bc2f2e",
    icon: <ErrorIcon className="!w-4.5 !h-4.5 mt-0.5" />,
  },
  warning: {
    backgroundColor: "#FFEEBA",
    color: "#856404",
    border: "4px solid #856404",
    icon: <WarningAmberIcon className="!w-4.5 !h-4.5 !text-[#856404]" />,
  },
  reject: {
    backgroundColor: "#E2E3E5",
    color: "#383D41",
    border: "4px solid #383D41",
    icon: <NotInterested className="!w-4.5 !h-4.5 !text-[#383D41]" />,
  },
  pending: {
    backgroundColor: "#FFEEBA",
    color: "#b38c19",
    border: "4px solid #b38c19",
    icon: <HourglassEmpty className="!w-4.5 !h-4.5 !text-[#b38c19]" />,
  },
  complet: {
    backgroundColor: "#dbdff7",
    color: "#3F51B5",
    border: "4px solid #3F51B5",
    icon: <DoneAll className="!w-4.5 !h-4.5 !text-[#3F51B5]" />,
  },
  alert: {
    backgroundColor: "#fce2e5",
    color: "#F44336",
    border: "4px solid #F44336",
    icon: <Cancel className="!w-4.5 !h-4.5 !text-[#F44336]" />,
  },
};

const Alert = ({
  severity,
  message,
  showButton,
  closeAlert,
  className,
  sx,
}) => {
  const styles = alertStyles[severity] || alertStyles.error;

  return (
    <CustomAlert
      severity={severity}
      icon={styles.icon}
      sx={{
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        width: "-webkit-fill-available",
        maxWidth: "850px",
        minWidth: { xs: "95%", sm: "400px" },
        borderLeft: styles.border,
        padding: "2px 16px !important",
        marginBottom: "16px ",
        position: "relative",
        borderRadius: "4px !important",
        ".MuiAlert-icon": {
          marginRight: "8px !important",
        },
        ".MuiAlert-message": {
          padding: "8px 15px 8px 0 !important",
        },
        ...sx,
      }}
      className={className}
    >
      {message}
      {showButton && (
        <Button
          sx={{
            color: styles.color,
            position: "absolute",
            right: "9px",
            top: "50%",
            transform: "translateY(-50%)",
            padding: "0",
            minWidth: "fit-content !important",
            marginLeft: "0px !important",
          }}
          onClick={closeAlert}
        >
          <CloseIcon sx={{ fontSize: "18px" }} />
        </Button>
      )}
    </CustomAlert>
  );
};

export default Alert;
