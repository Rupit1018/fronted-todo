import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  InputAdornment,
  IconButton,
  Collapse,
  Alert,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import CloseIcon from "@mui/icons-material/Close";
import LockIcon from "@mui/icons-material/Lock";
import UploadIcon from "@mui/icons-material/Upload";
import { Link } from "react-router-dom";
import useAuthentication from "../../hooks/useAuthentication";

const Signup = () => {
  const { signup } = useAuthentication();
  const fileInputRef = useRef();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [profilePic, setProfilePic] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      if (profilePic) {
        data.append("profilepic", profilePic);
      }

      await signup(data);

      setAlertMessage("Signup successful!");
      setAlertSeverity("success");
      setAlertOpen(true);

      setFormData({ name: "", email: "", password: "" });
      setProfilePic(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      setAlertMessage("Signup failed. Please try again.");
      setAlertSeverity("error");
      setAlertOpen(true);
    }
  };

  useEffect(() => {
    if (alertOpen) {
      const timer = setTimeout(() => {
        setAlertOpen(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alertOpen]);

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
          padding: 4,
          borderRadius: 3,
          width: 360,
          boxShadow: 4,
        }}
      >
        <Typography
          variant="h5"
          align="center"
          color="white"
          fontWeight="bold"
          mb={2}
        >
          Signup Form
        </Typography>

        {/* MUI Alert with Collapse */}
        <Collapse in={alertOpen}>
          <Alert
            severity={alertSeverity}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setAlertOpen(false)}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            {alertMessage}
          </Alert>
        </Collapse>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            placeholder="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: "#ffffffcc" }} />
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
            placeholder="Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
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
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
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

          <Box
            sx={{
              mt: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{
                color: "#00bfa5",
                borderColor: "#00bfa5",
                "&:hover": {
                  backgroundColor: "#00bfa511",
                  borderColor: "#00bfa5",
                },
                textTransform: "none",
                fontWeight: "bold",
              }}
              startIcon={<UploadIcon />}
            >
              {profilePic ? "Change Image" : "Upload Profile Picture"}
              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setProfilePic(e.target.files[0])}
              />
            </Button>
          </Box>

          {profilePic && (
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 1,
                color: "#cbd5e1",
                wordBreak: "break-all",
              }}
            >
              Selected: {profilePic.name}
            </Typography>
          )}

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
            Register
          </Button>
        </form>

        <Typography
          variant="body2"
          align="center"
          sx={{ color: "#cbd5e1", mt: 3 }}
        >
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#00bfa5", fontWeight: "bold" }}>
            Login now
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Signup;
