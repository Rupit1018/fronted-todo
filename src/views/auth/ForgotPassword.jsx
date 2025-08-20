import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  InputAdornment,
  Alert,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import useAuthentication from "../../hooks/useAuthentication";
import { forgotPasswordAction } from "../../store/actions/auth.action";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [alertData, setAlertData] = useState({
    show: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { ForgotPassword } = useAuthentication();
  const isMobile = useMediaQuery("(max-width:500px)");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlertData({ show: false, message: "", severity: "success" });

    try {
      const result = await ForgotPassword(email);
      console.log("ForgotPassword Result:", result);

      if (forgotPasswordAction.fulfilled.match(result)) {
        setAlertData({
          show: true,
          message: result.payload?.message || "Reset link sent successfully!",
          severity: "success",
        });
        setEmail("");
      } else {
        setAlertData({
          show: true,
          message: result?.payload?.message || "Unexpected error occurred!",
          severity: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#0f172a",
        position: "fixed",
        inset: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Box
        sx={{
          backgroundColor: "#1e293b",
          border: "1px solid #00bfa5",
          padding: isMobile ? 3 : 4,
          borderRadius: 3,
          width: isMobile ? "100%" : 340,
          maxWidth: "100%",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        }}
      >
        {alertData.show && (
          <Alert
            severity={alertData.severity}
            sx={{ mb: 2 }}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setAlertData({ ...alertData, show: false })}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {alertData.message}
          </Alert>
        )}

        <Typography
          variant={isMobile ? "h6" : "h5"}
          align="center"
          color="white"
          fontWeight="bold"
          mb={3}
        >
          Forgot Password
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            placeholder="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: "#ffffffcc" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              input: { color: "white" },
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#334155",
                "& fieldset": { borderColor: "#64748b" },
                "&:hover fieldset": { borderColor: "#00bfa5" },
                "&.Mui-focused fieldset": { borderColor: "#00bfa5" },
              },
            }}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              mt: 3,
              backgroundColor: "#00bfa5",
              fontWeight: "bold",
              color: "#0f172a",
              "&:hover": {
                backgroundColor: "#00a38f",
              },
            }}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>

        <Typography
          variant="body2"
          align="center"
          sx={{ color: "#cbd5e1", mt: 3 }}
        >
          Back to{" "}
          <span
            style={{ color: "#00bfa5", fontWeight: "bold", cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </Typography>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
