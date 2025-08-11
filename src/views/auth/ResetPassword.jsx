import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  InputAdornment,
  Alert,
  IconButton,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertData, setAlertData] = useState({
    show: false,
    message: "",
    severity: "success",
  });

  // Extract token from URL
  const query = new URLSearchParams(location.search);
  const token = query.get("token");

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (password !== confirm) {
    setAlertData({
      show: true,
      message: "Passwords do not match.",
      severity: "error",
    });
    return;
  }

  setLoading(true);
  setAlertData({ show: false, message: "", severity: "success" });

  try {
    const { data } = await axios.post(
      `http://localhost:5000/auth/reset-password?token=${token}`,
      { password }
    );

    setAlertData({
      show: true,
      message: data.message || "Password reset successful!",
      severity: "success",
    });

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  } catch (error) {
    setAlertData({
      show: true,
      message: error.response?.data?.message || "Reset failed.",
      severity: "error",
    });
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
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#1e293b",
          border: "1px solid #00bfa5",
          padding: 4,
          borderRadius: 3,
          width: 340,
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
          variant="h5"
          align="center"
          color="white"
          fontWeight="bold"
          mb={3}
        >
          Reset Password
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: "#ffffffcc" }} />
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

          <TextField
            fullWidth
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: "#ffffffcc" }} />
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
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default ResetPassword;
