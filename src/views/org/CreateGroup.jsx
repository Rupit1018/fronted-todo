import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import useAuthentication from "../../hooks/useAuthentication";
import { useParams } from "react-router-dom";

const CreateGroup = () => {
  const { createGroup } = useAuthentication();
  const { orgId } = useParams();  // orgId URL param thi levay chhe

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  if (!orgId) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#0f172a",
          color: "#f87171",
          px: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="h6">
          Organization ID is required to invite users.<br />
          Please access this page via your organization's invite link.
        </Typography>
      </Box>
    );
  }

  const isValidEmail = (email) => {
    // Basic email regex check
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleInvite = async () => {
  if (!email) {
    toast.error("Please enter an email address");
    return;
  }
  if (!isValidEmail(email)) {
    toast.error("Please enter a valid email address");
    return;
  }

  setLoading(true);
  try {
    const response = await createGroup({ email, orgId });
    console.log("Create Group response:", response);
    toast.success(response.message || "Invitation sent successfully");
    setEmail("");
  } catch (error) {
    console.error("Create Group error:", error);
    toast.error(error?.message || "Failed to send invitation");
  } finally {
    setLoading(false);
  }
};

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        bgcolor: "#0f172a",
        px: 2,
        pt: 10,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 500,
          width: "100%",
          bgcolor: "#1e293b",
          borderRadius: 3,
          border: "1px solid #00bfa5",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          mb={3}
          color="#00bfa5"
          textAlign="center"
        >
          Invite User to Organization
        </Typography>

        <Stack spacing={3}>
          <TextField
            fullWidth
            label="User Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{ style: { color: "#94a3b8" } }}
            InputProps={{
              style: { color: "white" },
            }}
            disabled={loading}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#334155" },
                "&:hover fieldset": { borderColor: "#00bfa5" },
                "&.Mui-focused fieldset": { borderColor: "#00bfa5" },
              },
            }}
          />

          <Button
            variant="contained"
            onClick={handleInvite}
            disabled={loading}
            sx={{
              bgcolor: "#00bfa5",
              color: "#0f172a",
              fontWeight: "bold",
              "&:hover": { bgcolor: "#00bfa5cc" },
              py: 1.2,
              fontSize: "1rem",
              position: "relative",
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "#0f172a" }} />
            ) : (
              "Send Invitation"
            )}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default CreateGroup;
