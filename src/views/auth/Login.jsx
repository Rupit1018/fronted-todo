import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  InputAdornment,
  Alert,
  IconButton,
  CircularProgress,
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

  const [loading, setLoading] = useState(false);
  const [formData, setformData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
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
    const newErrors = { email: "", password: "" };
    let hasError = false;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      hasError = true;
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    setLoading(true);
    console.log("Loading set to true");

    try {
      // Simulate 3 seconds loading spinner regardless of login speed
      const loginPromise = login(formData);
      const delayPromise = new Promise((r) => setTimeout(r, 3000));

      // Wait for both login and delay to finish
      const [result] = await Promise.all([loginPromise, delayPromise]);

      console.log("Login result:", result);

      if (result?.type !== loginAction.rejected.type) {
        const user = result?.payload?.user;
        const token = result?.payload?.token;

        if (user && token) {
          setAuthUser(user);
          Storage.setItem("user", user);
          Storage.setItem("access_token", token);

          setformData({ email: "", password: "" });
          setAlert({
            show: true,
            message: "Login successful!",
            severity: "success",
          });
          
          navigate("/home");
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
    } catch (error) {
      setAlert({
        show: true,
        message: "Unexpected error occurred.",
        severity: "error",
      });
    } finally {
      setLoading(false);
      console.log("Loading set to false");
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
        overflowY: "auto",
        p: { xs: 2, sm: 3 },
      }}
    >
      <Box
        sx={{
          backgroundColor: "#1e293b",
          border: "1px solid #00bfa5",
          padding: { xs: 3, sm: 4 },
          borderRadius: 3,
          width: { xs: "100%", sm: 340 },
          maxWidth: "100%",
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
          sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
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
            onChange={(e) => setformData({ ...formData, email: e.target.value })}
            margin="normal"
            helperText={errors.email ? errors.email : ""}
            FormHelperTextProps={{
              sx: {
                fontSize: "0.9rem",
                color: "#f03800ff",
                marginLeft: 0,
                marginTop: "4px",
              },
            }}
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
            helperText={errors.password ? errors.password : ""}
            FormHelperTextProps={{
              sx: {
                fontSize: "0.9rem",
                color: "#f03800ff",
                marginLeft: 0,
                marginTop: "4px",
              },
            }}
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
            disabled={loading}
            sx={{
              mt: 3,
              backgroundColor: "#00bfa5",
              fontWeight: "bold",
              color: "#0f172a",
              "&:hover": {
                backgroundColor: "#00a38f",
              },
              py: { xs: 1.2, sm: 1.5 },
            }}
          >
            {loading ? <CircularProgress size={24} sx={{color:"#00bfa5"}} /> : "Login"}
          </Button>
        </form>

        <Typography
          variant="body2"
          align="center"
          sx={{
            color: "#cbd5e1",
            mt: 3,
            fontSize: { xs: "0.85rem", sm: "0.875rem" },
          }}
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
