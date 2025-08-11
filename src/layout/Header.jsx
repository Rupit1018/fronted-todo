import React, { useEffect, useState, useRef } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Typography,
  Box,
  Paper,
  Button,
  ClickAwayListener,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import useAuthentication from "../hooks/useAuthentication";
import { useNavigate } from "react-router-dom";
import Toast from "../components/common/Toast";

const InvitationDropdown = ({ invitations, onAccept, onCancel }) => {
  const navigate = useNavigate();
  if (!invitations.length) {
    return (
      <Paper
        sx={{
          position: "absolute",
          top: "48px",
          right: 0,
          width: 320,
          bgcolor: "#1e293b",
          color: "#fff",
          p: 2,
          borderRadius: 2,
          boxShadow: 3,
          zIndex: 1300,
          userSelect: "none",
        }}
      >
        <Typography>No new invitations</Typography>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        position: "absolute",
        top: "48px",
        right: 0,
        width: 320,
        maxHeight: 360,
        overflowY: "auto",
        bgcolor: "#1e293b",
        color: "#fff",
        p: 2,
        borderRadius: 2,
        boxShadow: 3,
        zIndex: 1300,
        userSelect: "none",
      }}
    >
      {invitations.map((inv) => (
        <Box
          key={inv.id}
          sx={{
            mb: 2,
            borderBottom: "1px solid #00bfa5",
            pb: 1,
          }}
        >
          <Typography variant="body1" fontWeight="bold" noWrap>
            Invitation to join{" "}
            <span style={{ color: "#00bfa5" }}>{inv.orgName}</span>
          </Typography>
          <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
            <Button
              size="small"
              variant="contained"
              onClick={() => onAccept(inv.id)}
              sx={{
                backgroundColor: "#00bfa5",
                color: "#000",
                "&:hover": { backgroundColor: "#00a18d" },
                flex: 1,
                textTransform: "none",
              }}
            >
              Accept
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => onCancel(inv.id)}
              sx={{
                borderColor: "#e53935",
                color: "#e53935",
                "&:hover": {
                  backgroundColor: "#c62828",
                  color: "#fff",
                },
                flex: 1,
                textTransform: "none",
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      ))}
    </Paper>
  );
};

const Header = () => {
  const { getGroups, acceptInvitation, cancelInvitation, logout, getOrgs } =
    useAuthentication();
  const [invitations, setInvitations] = useState([]);
  const [openInvitations, setOpenInvitations] = useState(false);
  const [orgs, setOrgs] = useState([]);
  const navigate = useNavigate();

  // Fetch orgs - optional if you want to keep orgs here as well
  const fetchOrgs = async () => {
    try {
      const res = await getOrgs();
      let orgsArray = [];
      if (res?.payload?.data && Array.isArray(res.payload.data)) {
        orgsArray = res.payload.data;
      } else if (res?.data && Array.isArray(res.data)) {
        orgsArray = res.data;
      }
      setOrgs(orgsArray);
      return orgsArray; // return orgs for further use
    } catch (err) {
      console.error("Failed to fetch orgs:", err);
      setOrgs([]);
      return [];
    }
  };

  // Fetch invitations
  const fetchInvitations = async () => {
    try {
      const res = await getGroups(); // getGroups backend API call
      let invitationsArray = [];

      if (Array.isArray(res)) invitationsArray = res;
      else if (res.payload && Array.isArray(res.payload))
        invitationsArray = res.payload;
      else if (res.data && Array.isArray(res.data)) invitationsArray = res.data;

      // Filter cancelled invitations (optional if backend not filtering)
      invitationsArray = invitationsArray.filter(
        (inv) => inv.status !== "cancelled"
      );

      setInvitations(invitationsArray);
    } catch (error) {
      console.error("Failed to fetch invitations:", error);
    }
  };

  useEffect(() => {
    fetchInvitations();
    fetchOrgs();
  }, []);

  const handleAccept = async (invId) => {
    try {
      const res = await acceptInvitation(invId);
      console.log(" Accept Invitation success:", res);
      window.dispatchEvent(new Event("orgsUpdated"));
      // Remove accepted invitation from state
      setInvitations((prev) => prev.filter((inv) => inv.id !== invId));

      // Fetch updated orgs from backend
      const orgsRes = await getOrgs();
      let updatedOrgs = [];

      if (orgsRes?.payload?.data && Array.isArray(orgsRes.payload.data)) {
        updatedOrgs = orgsRes.payload.data;
      } else if (orgsRes?.data && Array.isArray(orgsRes.data)) {
        updatedOrgs = orgsRes.data;
      }

      setOrgs(updatedOrgs);

      // Dispatch event for Org page to listen and refresh
      localStorage.setItem("orgsUpdated", Date.now().toString());
      window.dispatchEvent(new Event("orgsUpdated"));

      // Optional: update localStorage selectedOrgId for redirect or whatever you want
      const acceptedOrgId =
        res?.payload?.data?.invitation?.orgId || res?.data?.invitation?.orgId;
      if (acceptedOrgId) {
        localStorage.setItem("selectedOrgId", acceptedOrgId);
      }

      navigate("/org"); // navigate to org page or wherever you want
    } catch (err) {
      console.error("Failed to accept invitation:", err);
    }
  };

  const handleCancel = async (invId) => {
    try {
      await cancelInvitation(invId); // આ API call PATCH request કરવી જોઇએ
      setInvitations((prev) => prev.filter((inv) => inv.id !== invId)); // UI થી હટાવવું
    } catch (err) {
      console.error("Failed to cancel invitation:", err);
    }
  };

  const toggleInvitations = () => {
    if (!openInvitations) {
      fetchInvitations();
    }
    setOpenInvitations(!openInvitations);
  };

  const handleClickAway = () => {
    setOpenInvitations(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: "#0f172a",
        boxShadow: "none",
        borderBottom: "1px solid #00bfa5",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: "monospace",
            fontWeight: "bold",
            color: "#00bfa5",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          Todo App
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            position: "relative",
          }}
        >
          <ClickAwayListener onClickAway={handleClickAway}>
            <Box>
              <IconButton
                size="large"
                color="inherit"
                onClick={toggleInvitations}
                aria-label="show invitations"
              >
                <Badge
                  badgeContent={invitations.length}
                  color="error"
                  invisible={invitations.length === 0}
                >
                  <NotificationsIcon sx={{ color: "#00bfa5" }} />
                </Badge>
              </IconButton>

              {openInvitations && (
                <InvitationDropdown
                  invitations={invitations}
                  onAccept={handleAccept}
                  onCancel={handleCancel}
                />
              )}
            </Box>
          </ClickAwayListener>

          <IconButton
            size="large"
            color="inherit"
            onClick={() => navigate("/profile")}
          >
            <AccountCircleIcon sx={{ color: "#00bfa5" }} />
          </IconButton>

          <Button
            onClick={() => navigate("/org")}
            variant="outlined"
            sx={{
              borderColor: "#00bfa5",
              color: "#00bfa5",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#00bfa5",
                color: "#000",
              },
            }}
          >
            Organizations
          </Button>

          <Button
            onClick={handleLogout}
            variant="outlined"
            sx={{
              borderColor: "#00bfa5",
              color: "#00bfa5",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#00bfa5",
                color: "#000",
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
