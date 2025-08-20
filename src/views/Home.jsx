import React from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Container,
  useMediaQuery,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Link as RouterLink } from "react-router-dom";

const Home = () => {
  const isMobile = useMediaQuery("(max-width:768px)");

  return (
    <Box
      sx={{
        backgroundColor: "#0f172a",
        color: "#fff",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        py: isMobile ? 4 : 8,
        px: 2,
      }}
    >
      <Container maxWidth="md">
        <Stack
          spacing={isMobile ? 3 : 4}
          alignItems="center"
          textAlign="center"
        >
          <Typography
            variant={isMobile ? "h4" : "h2"}
            fontWeight="bold"
            sx={{ lineHeight: 1.2 }}
          >
            Plan Smarter. Get Things Done.
          </Typography>

          <Typography
            variant={isMobile ? "body1" : "h6"}
            color="gray"
            sx={{ maxWidth: 700 }}
          >
            Welcome to{" "}
            <span style={{ color: "#00bfa5", fontWeight: "bold" }}>TODO</span> –
            your ultimate productivity companion. Designed to help you focus,
            act, and accomplish.
          </Typography>

          <Stack
            direction={isMobile ? "column" : "row"}
            spacing={2}
            width={isMobile ? "100%" : "auto"}
          >
            <Button
              component={RouterLink}
              to="/org"
              variant="contained"
              sx={{
                backgroundColor: "#00bfa5",
                color: "#000",
                fontWeight: "bold",
                px: 4,
                py: 1.5,
                width: isMobile ? "100%" : "auto",
                "&:hover": {
                  backgroundColor: "#00a58c",
                },
              }}
              size="large"
            >
              Start Organizing
            </Button>
          </Stack>

          <Stack spacing={1} mt={isMobile ? 4 : 6} alignItems="center">
            <Typography
              variant={isMobile ? "subtitle2" : "subtitle1"}
              fontWeight="bold"
            >
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
  <Stack
    direction="row"
    alignItems="center"
    spacing={1}
    sx={{ flexWrap: "wrap", justifyContent: "center" }}
  >
    <CheckCircleOutlineIcon sx={{ color: "#00bfa5" }} />
    <Typography variant="body1" textAlign="center">
      {text}
    </Typography>
  </Stack>
);

export default Home;
