import React, { useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Button,
  IconButton,
  Avatar,
  TextField,
  Paper,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteIcon from "@mui/icons-material/Delete";
import ApartmentIcon from "@mui/icons-material/Apartment";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useAuthentication from "../../hooks/useAuthentication";
import API from "../../libs/axios";

const UserProfile = () => {
  const { authUser, setAuthUser } = useAuth();
  const { logout } = useAuthentication();
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: authUser?.name || "",
    email: authUser?.email || "",
  });
  const [profileFile, setProfileFile] = useState(null);
  console.log("authUser:", authUser);
  const handleEditToggle = () => setEditMode((prev) => !prev);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    setProfileFile(e.target.files[0]);
  };

  const handleSave = async () => {
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("email", formData.email);
      if (profileFile) form.append("profilepic", profileFile);

      const { data } = await API.put("/user/update-profile", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAuthUser(data.data);
      setEditMode(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleMyOrganization = () => navigate("/org");

  // Image URL base
  const imageURL =
  authUser?.profilepic?.startsWith("http")
    ? authUser.profilepic // external full image URL
    : `http://localhost:5000/uploads/${authUser?.profilepic}`; 
  console.log("Profile Image URL:", imageURL);
  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      px={2}
      bgcolor="#0d1627"
    >
      <Paper
        elevation={5}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 600,
          bgcolor: "#131e33",
          border: "1px solid #00bfa5",
          borderRadius: 4,
        }}
      >
        <Stack spacing={4} alignItems="center">
          {/* Avatar */}
          <Avatar
            src={imageURL}
            alt="Profile"
            sx={{
              width: 110,
              height: 110,
              bgcolor: "#00bfa5",
              fontSize: 38,
            }}
          >
            {!authUser?.profilepic && authUser?.name?.[0]?.toUpperCase()}
          </Avatar>

          {/* Form Fields */}
          <Box width="100%">
            {editMode ? (
              <Stack spacing={2}>
                <TextField
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ style: { color: "#00bfa5" } }}
                  InputProps={{ style: { color: "white" } }}
                />
                <TextField
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ style: { color: "#00bfa5" } }}
                  InputProps={{ style: { color: "white" } }}
                />
                <Button
                  variant="outlined"
                  component="label"
                  sx={{ color: "#00bfa5", borderColor: "#00bfa5" }}
                >
                  Choose Profile Picture
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>
              </Stack>
            ) : (
              <Box textAlign="center">
                <Typography variant="h5" color="#00bfa5" fontWeight={600}>
                  {authUser?.name}
                </Typography>
                <Typography variant="body2" color="#ccc">
                  {authUser?.email}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center">
            {editMode ? (
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                sx={{
                  bgcolor: "#00bfa5",
                  "&:hover": { bgcolor: "#00a58d" },
                }}
              >
                Save
              </Button>
            ) : (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleEditToggle}
                sx={{
                  bgcolor: "#00bfa5",
                  "&:hover": { bgcolor: "#00a58d" },
                }}
              >
                Edit
              </Button>
            )}

            <Button
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                color: "#00bfa5",
                borderColor: "#00bfa5",
                "&:hover": {
                  backgroundColor: "rgba(0,191,165,0.1)",
                  borderColor: "#00a58d",
                },
              }}
            >
              Logout
            </Button>

            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              sx={{
                borderColor: "#d32f2f",
                "&:hover": {
                  backgroundColor: "rgba(211,47,47,0.1)",
                  borderColor: "#b71c1c",
                },
              }}
            >
              Delete
            </Button>
          </Stack>

          {/* My Org */}
          <Button
            variant="contained"
            startIcon={<ApartmentIcon />}
            onClick={handleMyOrganization}
            fullWidth
            sx={{
              mt: 2,
              bgcolor: "#00bfa5",
              "&:hover": { bgcolor: "#00a58d" },
            }}
          >
            My Organization
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default UserProfile;
