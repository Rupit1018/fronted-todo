import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Button,
  IconButton,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import useAuthentication from "../../hooks/useAuthentication";
import Toast from "../../components/common/Toast";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { useLocation } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const Org = () => {
  const {
    getOrgs,
    createOrg,
    deleteOrg,
    updateOrg,
    logout,
    inviteAction,
    getGroups,
  } = useAuthentication();

  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [editingOrgId, setEditingOrgId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmSignOutOpen, setConfirmSignOutOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [invitations, setInvitations] = useState([]);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("viewer");
  const [redirectingId, setRedirectingId] = useState(null);
  const [activeOrgName, setActiveOrgName] = useState(
    localStorage.getItem("activeOrgName") || ""
  );
  const [selectedOrgId, setSelectedOrgId] = useState(() => {
    const savedId = localStorage.getItem("selectedOrgId");
    return savedId ? Number(savedId) : null;
  });
  const location = useLocation();
  const [errors, setErrors] = useState({
    name: "",
  });
  const orgsPerPage = 5;
  const navigate = useNavigate();
  useEffect(() => {
    // 🔹 On mount, ensure state syncs with localStorage
    const savedName = localStorage.getItem("activeOrgName");
    if (savedName) {
      setActiveOrgName(savedName);
    }
  }, []);
  useEffect(() => {
    const fetchOrgs = async () => {
      const res = await getOrgs();
      if (res?.payload?.data) setOrgs(res.payload.data);
    };

    fetchOrgs();
  }, [location.state?.refresh]);
  // Fetch orgs from backend
  useEffect(() => {
    if (!selectedOrgId) return;

    const fetchInvites = async () => {
      try {
        const invites = await getGroups(selectedOrgId);
        console.log("Fetched invitations:", invites);
        // make sure it's an array
        setInvitations(Array.isArray(invites) ? invites : []);
      } catch (err) {
        console.error("Failed to fetch invitations:", err);
      }
    };

    fetchInvites();
  }, [selectedOrgId]);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOrgName("");
    setEditingOrgId(null);
    setOpen(false);
  };

  const handleCreateOrg = async () => {
    const newErrors = { name: "" };
    let hasError = false;

    if (!orgName.trim()) {
      newErrors.name = "Name is required";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    try {
      if (editingOrgId) {
        const orgdata = { name: orgName };
        const res = await updateOrg({ orgId: editingOrgId, orgData: orgdata });

        if (res?.payload?.data) {
          setOrgs((prev) =>
            prev.map((org) =>
              org.id === editingOrgId ? { ...org, name: orgName } : org
            )
          );
          Toast.success("Organization updated successfully!");
          handleClose();
        } else {
          Toast.error("Failed to update organization");
        }
      } else {
        const trimmedName = orgName.trim();
        setLoading(true);
        const res = await createOrg({ name: trimmedName });
        const createdOrg = res?.payload?.data;

        if (createdOrg) {
          const updatedOrgs = await getOrgs();
          if (updatedOrgs?.payload?.data) setOrgs(updatedOrgs.payload.data);
          Toast.success("Organization created successfully!");
          handleClose();
        }
      }
    } catch (error) {
      console.error("Failed to create org:", error);
      Toast.error("Failed to create organization");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const indexOfLastOrg = currentPage * orgsPerPage;
  const indexOfFirstOrg = indexOfLastOrg - orgsPerPage;
  const currentOrgs = orgs.slice(indexOfFirstOrg, indexOfLastOrg);
  const totalPages = Math.ceil(orgs.length / orgsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  console.log("Current Orgs on page:", currentOrgs);

  // Pagination reset on orgs update
  useEffect(() => {
    setCurrentPage(1);
  }, [orgs]);
  const handleOrgClick = (orgId, orgName, orgRole) => {
    localStorage.setItem("selectedOrgId", orgId.toString());
    localStorage.setItem("selectedOrgName", orgName);
    localStorage.setItem("activeOrgName", orgName);
    localStorage.setItem("orgRole", orgRole);
    setSelectedOrgId(orgId);
    setActiveOrgName(orgName);
    setRedirectingId(orgId);
    setTimeout(() => {
      navigate("/todo", {
        state: { orgId: orgs.id, orgName: orgs.name, orgRole: orgs.role },
      });
    }, 3000);
  };

  const handleUpdateOrg = (org) => {
    setOrgName(org.name);
    setEditingOrgId(org.id);
    setOpen(true);
  };

  const handleDeleteOrg = async (orgId) => {
    try {
      const res = await deleteOrg(orgId);

      if (res?.payload?.message === "Organization deleted successfully") {
        // remove deleted org locally
        setOrgs((prev) => prev.filter((org) => org.id !== orgId));
        const updatedOrgs = await getOrgs();
        if (updatedOrgs?.payload?.data) setOrgs(updatedOrgs.payload.data);

        Toast.success("Organization deleted successfully!");
      } else {
        Toast.error(res?.payload?.message || "Failed to delete organization");
      }
    } catch (error) {
      console.error("Failed to delete org:", error);
      Toast.error("Failed to delete organization");
    }
  };

  const handleInviteSubmit = async () => {
    try {
      const res = await inviteAction({
        orgId: selectedOrgId,
        email: inviteEmail,
        role: inviteRole,
      });

      if (res?.payload?.data) {
        setInvitations((prev) => [...prev, res.payload.data]);
        Toast.success("Invitation sent!");
        setInviteOpen(false);
        setInviteEmail("");
        setInviteRole("viewer");
      } else {
        // payload missing → server returned failure
        Toast.error(res?.payload?.message || "Failed to send invite");
      }
    } catch (err) {
      console.error("Invite action error:", err);
      Toast.error("Failed to send invite");
    }
  };
  const handleInviteClick = (e, orgId) => {
    e.stopPropagation();
    setSelectedOrgId(orgId);
    setInviteOpen(true);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        overflow: "hidden",
        bgcolor: "#0f172a",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pt: 1,
        p: 0,
        m: 0,
      }}
    >
      <Box
        sx={{
          bgcolor: "#1e293b",
          p: 4,
          borderRadius: 3,
          width: "100%",
          maxWidth: 400,
          boxShadow: 6,
          border: "1px solid #00bfa5",
        }}
      >
        <Typography
          variant="h6"
          align="center"
          color="#ffffff"
          gutterBottom
          fontWeight="bold"
        >
          {activeOrgName
            ? `Active: ${activeOrgName}`
            : "Select an Organization"}
        </Typography>

        <Typography
          variant="h3"
          align="center"
          fontWeight="bold"
          sx={{ color: "#00bfa5", fontFamily: "monospace", mb: 3 }}
        >
          Todo
        </Typography>

        <Typography
          variant="h6"
          align="center"
          color="#ffffff"
          gutterBottom
          fontWeight="bold"
        >
          Select an Organization
        </Typography>

        <Stack spacing={2} mt={3}>
          {currentOrgs.map((org) => {
            const isSelected = selectedOrgId === org.id;
            return (
              <Box
                key={org.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "1px solid #00bfa5",
                  px: 2,
                  py: 1.5,
                  borderRadius: 2,
                  color: "#fff",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                  "&:hover": { backgroundColor: "#11212f" },
                }}
                onClick={() =>
                  setSelectedOrgId((prevId) =>
                    prevId === org.id ? null : org.id
                  )
                }
              >
                {/* Org Name */}
                <Typography fontWeight="bold">{org.name}</Typography>

                {/* Right side buttons */}
                <Box display="flex" gap={1} alignItems="center">
                  {/* Edit & Delete only if selected */}
                  {isSelected && (
                    <>
                      {console.log("Current Org Role:", org)}

                      {(org.role?.toLowerCase() === "owner" ||
                        org.role?.toLowerCase() === "writer") && (
                        <>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateOrg(org);
                            }}
                            sx={{
                              bgcolor: "#00bfa5",
                              color: "#000",
                              "&:hover": { bgcolor: "#00a18d" },
                            }}
                            size="small"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteOrg(org.id);
                            }}
                            sx={{
                              bgcolor: "#e53935",
                              color: "#fff",
                              "&:hover": { bgcolor: "#c62828" },
                            }}
                            size="small"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            onClick={(e) => handleInviteClick(e, org.id)}
                            sx={{
                              bgcolor: "#00bfa5",
                              color: "#000",
                              "&:hover": { bgcolor: "#00a18d" },
                              width: "36px",
                              height: "36px",
                            }}
                            size="small"
                          >
                            <PersonAddIcon fontSize="small" />
                          </IconButton>
                        </>
                      )}
                    </>
                  )}

                  {/* Navigate button always visible */}
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent selecting org
                      handleOrgClick(org.id, org.name, org.role);
                    }}
                    sx={{
                      bgcolor: "#00bfa5",
                      color: "#000",
                      "&:hover": { bgcolor: "#00a18d" },
                      width: "36px",
                      height: "36px",
                    }}
                    size="small"
                  >
                    {redirectingId === org.id ? (
                      <CircularProgress size={18} sx={{ color: "#000" }} />
                    ) : (
                      <ChevronRightIcon fontSize="small" />
                    )}
                  </IconButton>
                </Box>
              </Box>
            );
          })}
        </Stack>

        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            size="small"
            shape="rounded"
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#fff",
                "&.Mui-selected": {
                  bgcolor: "#00bfa5",
                  color: "#000",
                },
              },
            }}
          />
        </Box>

        <Button
          onClick={handleOpen}
          fullWidth
          startIcon={<AddIcon />}
          sx={{
            mt: 3,
            py: 1,
            borderRadius: 2,
            backgroundColor: "transparent",
            border: "1px solid #00bfa5",
            color: "#00bfa5",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#003f39",
            },
          }}
        >
          {editingOrgId ? "Update Organization" : "Create an Organization"}
        </Button>

        <Button
          fullWidth
          startIcon={<LogoutIcon />}
          sx={{
            mt: 2,
            color: "#fff",
            textTransform: "none",
            "&:hover": { backgroundColor: "#222" },
          }}
          onClick={() => setConfirmSignOutOpen(true)}
        >
          Sign Out
        </Button>
      </Box>

      {/* Create / Update Org Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            position: "relative",
            backgroundColor: "#1e293b",
            border: "1px solid #00bfa5",
            borderRadius: 2,
            color: "#fff",
          },
        }}
        BackdropProps={{
          style: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(4px)",
          },
        }}
      >
        <DialogTitle sx={{ color: "#00bfa5", fontWeight: "bold" }}>
          {editingOrgId ? "Update Organization" : "Create Organization"}
        </DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Organization Name"
            fullWidth
            variant="outlined"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            disabled={loading}
            helperText={errors.name ? errors.name : ""}
            FormHelperTextProps={{
              sx: {
                fontSize: "0.9rem",
                color: "#f03800ff",
                marginLeft: 0,
                marginTop: "4px",
              },
            }}
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{
              style: {
                color: "#fff",
                backgroundColor: "#2a2a2a",
                borderRadius: 6,
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#00bfa5",
                },
                "&:hover fieldset": {
                  borderColor: "#00e1c2",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#00bfa5",
                },
              },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleClose}
            disabled={loading}
            sx={{
              color: "#fff",
              textTransform: "none",
              "&:hover": { backgroundColor: "#333" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateOrg}
            disabled={loading}
            sx={{
              backgroundColor: "#00bfa5",
              color: "#000",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#00a18d",
              },
            }}
          >
            {editingOrgId ? "Update" : "Create"}
          </Button>
        </DialogActions>

        {loading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              bgcolor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 2,
              zIndex: 10,
            }}
          >
            <CircularProgress sx={{ color: "#00bfa5" }} />
          </Box>
        )}
      </Dialog>
      <Dialog
        open={confirmSignOutOpen}
        onClose={() => setConfirmSignOutOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: "#1e293b",
            border: "1px solid #00bfa5",
            borderRadius: 2,
            color: "#fff",
          },
        }}
      >
        <DialogTitle sx={{ color: "#00bfa5", fontWeight: "bold" }}>
          Confirm Sign Out
        </DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to sign out?</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmSignOutOpen(false)}
            sx={{
              color: "#fff",
              textTransform: "none",
              "&:hover": { backgroundColor: "#333" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogout}
            sx={{
              backgroundColor: "#00bfa5",
              color: "#000",
              textTransform: "none",
              "&:hover": { backgroundColor: "#00a18d" },
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: "#0f172a",
            color: "#fff",
            borderRadius: 3,
            border: "1px solid #00bfa5",
            p: 2,
            minWidth: 400, // fixed width for stability
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#00bfa5",
            fontWeight: "bold",
            borderBottom: "1px solid #1e293b",
            mb: 1,
          }}
        >
          Invite User
        </DialogTitle>

        <DialogContent sx={{ minHeight: 180 }}>
          {" "}
          {/* fixed height */}
          <TextField
            fullWidth
            variant="outlined"
            label="User Email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            sx={{
              mt: 1,
              input: { color: "#fff" },
              "& .MuiInputLabel-root": { color: "#aaa" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#444" },
                "&:hover fieldset": { borderColor: "#00bfa5" },
                "&.Mui-focused fieldset": { borderColor: "#00bfa5" },
              },
            }}
          />
          <TextField
            select
            fullWidth
            label="Role"
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
            InputLabelProps={{ shrink: true }} // prevent label animation jump
            sx={{
              mt: 2,
              "& .MuiInputBase-input": { color: "#fff" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#444" },
                "&:hover fieldset": { borderColor: "#00bfa5" },
                "&.Mui-focused fieldset": { borderColor: "#00bfa5" },
              },
              "& .MuiSelect-icon": { color: "#fff" },
              "& .MuiInputLabel-root": { color: "#aaa" },
            }}
          >
            <MenuItem value="writer">Writer</MenuItem>
            <MenuItem value="viewer">Viewer</MenuItem>
          </TextField>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between", px: 3 }}>
          <Button
            variant="outlined"
            onClick={() => setInviteOpen(false)}
            sx={{
              borderColor: "#00bfa5",
              color: "#00bfa5",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#0f172a" },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleInviteSubmit}
            sx={{
              backgroundColor: "#00bfa5",
              color: "#000",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#00a58c" },
            }}
          >
            Send Invite
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Org;
