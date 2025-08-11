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
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useAuthentication from "../../hooks/useAuthentication";
import { loginAction } from "../../store/actions/auth.action";
import Storage from "../../utils/localStorage";

const Login = () => {
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();
  const { login } = useAuthentication();
  const [formData, setformData] = useState({
    email: "",
    password: "",
  });

  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "success",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData);
    console.log("Login result:", result);

    if (result?.type !== loginAction.rejected.type) {
      const user = result?.payload?.user;
      const token = result?.payload?.token;

      if (user && token) {
        setAuthUser(user);
        Storage.setItem("user", user);
        Storage.setItem("access_token", token);

        console.log(" Login success:", result.payload);
        console.log("Token saved:", token);
        setformData({ email: "", password: "" });
        setAlert({
          show: true,
          message: "Login successful!",
          severity: "success",
        });

        // Navigate with slight delay so alert is visible briefly
        setTimeout(() => navigate("/home"), 0);
      } else {
        setAlert({
          show: true,
          message: "User or token missing in response.",
          severity: "error",
        });
      }
    } else {
      const msg = result?.payload?.message || "Login failed!";
      setAlert({
        show: true,
        message: msg,
        severity: "error",
      });
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
        {alert.show && (
          <Alert
            severity={alert.severity}
            sx={{ mb: 2 }}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setAlert({ ...alert, show: false })}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {alert.message}
          </Alert>
        )}

        <Typography
          variant="h5"
          align="center"
          color="white"
          fontWeight="bold"
          mb={3}
        >
          Login Form
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            placeholder="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setformData({ ...formData, email: e.target.value })
            }
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

          <TextField
            fullWidth
            placeholder="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setformData({ ...formData, password: e.target.value })
            }
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

          <Box display="flex" justifyContent="flex-end" mt={1}>
            <Link
              to="/forgot-password"
              style={{
                color: "#00bfa5",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              Forgot Password?
            </Link>
          </Box>

          <Button
            fullWidth
            type="submit"
            variant="contained"
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
            Login
          </Button>
        </form>

        <Typography
          variant="body2"
          align="center"
          sx={{ color: "#cbd5e1", mt: 3 }}
        >
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "#00bfa5", fontWeight: "bold" }}>
            Signup now
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
