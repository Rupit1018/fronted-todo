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
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import useAuthentication from "../../hooks/useAuthentication";
import Toast from "../../components/common/Toast";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Org = () => {
  const { getOrgs, createOrg, deleteOrg, updateOrg } = useAuthentication();

  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [editingOrgId, setEditingOrgId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [redirectingId, setRedirectingId] = useState(null);
  const orgsPerPage = 5;
  const navigate = useNavigate();

  // Fetch orgs from backend
 const fetchOrgs = async () => {
    console.log("Fetching orgs...");
    setLoading(true);
    try {
      const res = await getOrgs();
      let orgsArray = [];
      if (res?.payload?.data && Array.isArray(res.payload.data)) {
        orgsArray = res.payload.data;
      } else if (res?.data && Array.isArray(res.data)) {
        orgsArray = res.data;
      }
      setOrgs(orgsArray);
      console.log("Orgs fetched:", orgsArray);
    } catch (err) {
      console.error("Failed to fetch orgs:", err);
      setOrgs([]);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  fetchOrgs();

  const onOrgsUpdated = () => {
    console.log("Event received: orgsUpdated");
    fetchOrgs();
  };

  window.addEventListener("orgsUpdated", onOrgsUpdated);

  return () => {
    window.removeEventListener("orgsUpdated", onOrgsUpdated);
  };
}, []);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOrgName("");
    setEditingOrgId(null);
    setOpen(false);
  };

  const handleCreateOrg = async () => {
    try {
      if (editingOrgId) {
        // Update existing org
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
        if (!trimmedName) return;

        try {
          setLoading(true);
          const res = await createOrg({ name: trimmedName });

          const createdOrg = res?.payload?.data;

          if (createdOrg) {
            setOrgs((prev) => [...prev, createdOrg]);
            Toast.success("Organization created successfully!");
            handleClose();
          } else {
            Toast.error("Failed to create organization");
          }
        } catch (err) {
          console.error("Failed to create org:", err);
        } finally {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Failed to create org:", error);
    }
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
  const handleOrgClick = (orgId) => {
    localStorage.setItem("selectedOrgId", orgId);
    setRedirectingId(orgId);
    setTimeout(() => {
      navigate("/todo");
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
      if (res?.payload?.data) {
        setOrgs((prev) => prev.filter((org) => org.id !== orgId));
        Toast.success("Organization deleted successfully!");
      } else {
        Toast.error("Failed to delete organization");
      }
    } catch (error) {
      console.error("Failed to delete org:", error);
      Toast.error("Failed to delete organization");
    }
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
          {currentOrgs.map((org) => (
            <Box
              key={org.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: "#1e293b",
                border: "1px solid #00bfa5",
                px: 2,
                py: 1.5,
                borderRadius: 2,
                color: "#fff",
              }}
            >
              <Typography fontWeight="bold" sx={{ flex: 1 }}>
                {org.name}
              </Typography>

              <Box display="flex" gap={1} alignItems="center">
                <IconButton
                  onClick={() => handleUpdateOrg(org)}
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
                  onClick={() => handleDeleteOrg(org.id)}
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
                  onClick={() => handleOrgClick(org.id)}
                  sx={{
                    bgcolor: "#00bfa5",
                    color: "#000",
                    "&:hover": { bgcolor: "#00a18d" },
                    width: "40px",
                    height: "40px",
                  }}
                >
                  {redirectingId === org.id ? (
                    <CircularProgress size={20} sx={{ color: "#000" }} />
                  ) : (
                    <ChevronRightIcon />
                  )}
                </IconButton>
              </Box>
            </Box>
          ))}
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
          // Add your sign out handler here if needed
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
    </Box>
  );
};

export default Org;
