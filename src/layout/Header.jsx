import React, { useEffect, useState } from "react";
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
  useMediaQuery,
  Menu,
  MenuItem,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import useAuthentication from "../hooks/useAuthentication";
import Storage from "../utils/localStorage"; // Assuming you have a utility for local storage

const InvitationDropdown = ({ invitations, onAccept, onCancel }) => {
  if (!invitations.length) {
    return (
      <Paper sx={dropdownStyles}>
        <Typography>No new invitations</Typography>
      </Paper>
    );
  }
  return (
    <Paper sx={dropdownStyles}>
      {invitations.map((inv) => (
        <Box
          key={inv.id}
          sx={{ mb: 2, borderBottom: "1px solid #00bfa5", pb: 1 }}
        >
          <Typography variant="body1" fontWeight="bold" noWrap>
            <>
              <span style={{ color: "#00bfa5" }}>{inv.inviteeEmail}</span>{" "}
              invited you to join{" "}
            </>
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
                "&:hover": { backgroundColor: "#c62828", color: "#fff" },
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

const dropdownStyles = {
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
};

const Header = () => {
  const {
    getGroups,
    acceptInvitation,
    cancelInvitation,
    logout,
    getInvitation,
  } = useAuthentication();

  const [invitations, setInvitations] = useState([]);
  const [openInvitations, setOpenInvitations] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:768px)");

  const fetchInvitations = async () => {
    try {
      const res = await getInvitation();
      console.log("Fetched invitations RAW:", res);

      // ✅ Extract array safely
      const arr = Array.isArray(res?.payload?.data) ? res.payload.data : [];

      // ✅ Get current user safely
      const storedUser = Storage.getItem("user");
      const currentUser =
        typeof storedUser === "string" ? JSON.parse(storedUser) : storedUser;
      const currentEmail = currentUser?.email;

      console.log("Current user email:", currentEmail);

      // ✅ Filter for invites where current user is invitee
      const mapped = arr
  .filter(
    (inv) =>
      inv.status === "pending" && // ✅ sirf pending invitations
      inv.inviteeEmail?.toLowerCase() === currentEmail?.toLowerCase()
  )
  .map((inv) => ({
    ...inv,
    senderName: inv.inviterName || "Unknown Sender",
    orgName: inv.organization?.name || "Unknown Org",
  }));

      console.log("Filtered invitations:", mapped);
      setInvitations(mapped);
    } catch (error) {
      console.error("Failed to fetch invitations:", error);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

const handleAccept = async (id) => {
  const acceptedInvite = invitations.find((i) => i.id === id);
  if (!acceptedInvite) return;

  await acceptInvitation(id); // API call
  setInvitations((prev) => prev.filter((i) => i.id !== id));

  // Save current org to localStorage
  Storage.setItem("currentOrg", {
    id: acceptedInvite.orgId,
    name: acceptedInvite.orgName,
  });

  // Navigate and force Org refresh
  navigate("/org", { state: { refresh: true } });
};

  const handleCancel = async (id) => {
    await cancelInvitation(id);
    setInvitations((prev) => prev.filter((i) => i.id !== id));
  };

  const toggleInvitations = () => {
    if (!openInvitations) fetchInvitations();
    setOpenInvitations(!openInvitations);
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
          variant={isMobile ? "h6" : "h5"}
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

        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <MenuIcon sx={{ color: "#00bfa5" }} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
              <MenuItem onClick={() => navigate("/account")}>Account</MenuItem>
              <MenuItem onClick={() => navigate("/org")}>
                Organizations
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              position: "relative",
            }}
          >
            <ClickAwayListener onClickAway={() => setOpenInvitations(false)}>
              <Box>
                <IconButton color="inherit" onClick={toggleInvitations}>
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

            <IconButton color="inherit" onClick={() => navigate("/profile")}>
              <AccountCircleIcon sx={{ color: "#00bfa5" }} />
            </IconButton>
            <Button
              onClick={() => navigate("/account")}
              variant="outlined"
              sx={{
                borderColor: "#00bfa5",
                color: "#00bfa5",
                textTransform: "none",
                "&:hover": { backgroundColor: "#00bfa5", color: "#000" },
              }}
            >
              Account
            </Button>
            <Button
              onClick={handleLogout}
              variant="outlined"
              sx={{
                borderColor: "#00bfa5",
                color: "#00bfa5",
                textTransform: "none",
                "&:hover": { backgroundColor: "#00bfa5", color: "#000" },
              }}
            >
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
