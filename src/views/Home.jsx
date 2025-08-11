import React from "react";
import { Box, Typography, Button, Stack, Container } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const Home = () => {
  return (
  <Box
  sx={{
    backgroundColor: "#0f172a",
    color: "#fff",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    py: -8, 
  }}
>
      <Container maxWidth="md">
        <Stack spacing={4} alignItems="center" textAlign="center">
          <Typography variant="h2" fontWeight="bold">
            Plan Smarter. Get Things Done.
          </Typography>

          <Typography variant="h6" color="gray">
            Welcome to <span style={{ color: "#00bfa5", fontWeight: "bold" }}>TODO</span> – your ultimate productivity companion.
            Designed to help you focus, act, and accomplish.
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#00bfa5",
                color: "#000",
                fontWeight: "bold",
                px: 4,
                py: 1.5,
                "&:hover": {
                  backgroundColor: "#00a58c",
                },
              }}
              size="large"
              href="/org"
            >
              Start Organizing
            </Button>
          </Stack>

          <Stack spacing={1} mt={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              Why TODO?
            </Typography>
            <Feature text="Organize by Workspace & Teams" />
            <Feature text="Real-time Sync & Beautiful UI" />
            <Feature text="Upload Files & Profile Pics" />
            <Feature text="Secure JWT Auth & Role-based Access" />
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

const Feature = ({ text }) => (
  <Stack direction="row" alignItems="center" spacing={1}>
    <CheckCircleOutlineIcon sx={{ color: "#00bfa5" }} />
    <Typography variant="body1">{text}</Typography>
  </Stack>
);

export default Home;
