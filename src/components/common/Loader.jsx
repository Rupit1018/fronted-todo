import React from "react";
import { CircularProgress, Box, Typography } from "@mui/material";

const Loader = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        width: "100vw",
        height: "100vh",
        bgcolor: "rgba(0, 0, 0, 0.85)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress size={60} sx={{ color: "#00bfa5", mb: 2 }} />
      <Typography variant="h6" sx={{ color: "#fff" }}>
        Redirecting...
      </Typography>
    </Box>
  );
};

export default Loader;
