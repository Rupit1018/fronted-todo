import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Stack,
  Divider,
  Chip,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useAuthentication from "../../hooks/useAuthentication";
import { useAuth } from "../../context/AuthContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const [user, setUser] = useState(null);
  const [orgDetails, setOrgDetails] = useState([]);
  const { authMe, updateMemberRole } = useAuthentication();
  const { setOrgRole } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = async (orgId, memberId, newRole) => {
    try {
      setOrgDetails((prev) =>
        prev.map((org) =>
          org.orgId === orgId
            ? {
                ...org,
                members: org.members.map((m) =>
                  m.id === memberId ? { ...m, role: newRole } : m
                ),
              }
            : org
        )
      );

      await updateMemberRole({ orgId, memberId, role: newRole });

      if (user && memberId === user.id) {
        localStorage.setItem("orgRole", newRole);
        setOrgRole(newRole);
        console.log("Updated role:", newRole);
      }
    } catch (err) {
      console.error("Role update failed:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await authMe();
        if (res.error) return console.error(res.error);

        const userData = res.payload;
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          profilepic: userData.profilepic,
        });

        const allOrgs = [
          ...(userData.orgs || []),
          ...(userData.ownedOrgs || []),
        ];

        setOrgDetails(
          allOrgs.map((org) => ({
            orgId: org.id,
            orgName: org.name,
            owner: org.owner,
            totalMembers: org.members?.length || 0,
            members:
              org.members?.map((m) => ({
                id: m.id,
                name: m.name,
                email: m.email,
                role: m.OrgMember?.role || "viewer",
              })) || [],
          }))
        );

        if (allOrgs.length > 0) {
          localStorage.setItem("selectedOrgId", allOrgs[0].id);
          localStorage.setItem("selectedOrgName", allOrgs[0].name);
          localStorage.setItem(
            "orgRole",
            allOrgs[0].members?.find((m) => m.id === userData.id)?.role ||
              "viewer"
          );
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const imageURL = user?.profilepic?.startsWith("http")
    ? user.profilepic
    : `http://localhost:5000/uploads/${user?.profilepic}`;

  return (
    <>
      <ArrowBackIcon
        onClick={() => navigate("/org")}
        sx={{
          cursor: "pointer",
          color: "#00bfa5",
          fontSize: 28,
          "&:hover": { color: "#009e87" },
          marginLeft: 2,
          marginTop: 2,
        }}
      />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          px: 2,
          py: 4,
          backgroundColor: "#0d1627",
        }}
      >
        {/* Profile */}
        {user && (
          <Card
            sx={{
              width: { xs: "100%", sm: 500, md: 600 },
              borderRadius: 3,
              boxShadow: "0 4px 12px #0d1627",
              mb: 4,
            }}
          >
            <CardContent
              sx={{
                backgroundColor: "#131e33",
                border: "2px solid #00bfa5",
                color: "#fff",
              }}
            >
              <Stack direction="row" spacing={3} alignItems="center">
                <Avatar src={imageURL} sx={{ width: 64, height: 64 }} />
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {user.name}
                  </Typography>
                  <Typography color="text.secondary" sx={{ color: "#00bfa5" }}>
                    {user.email}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Organizations */}
        <Typography variant="h5" fontWeight={600} sx={{ color: "#00bfa5" }}>
          My Organizations
        </Typography>

        {orgDetails.length > 0 ? (
          orgDetails.map((org) => (
            <Accordion
              key={org.orgId}
              sx={{
                width: { xs: "100%", sm: 500, md: 600 },
                backgroundColor: "#131e33",
                border: "2px solid #00bfa5",
                borderRadius: 2,
                mb: 2,
                color: "#fff",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "#00bfa5" }} />}
              >
                <Typography variant="h6" color="#00bfa5">
                  {org.orgName} ({org.totalMembers} members)
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ mb: 1, color: "#00bfa5" }}>
                  Owner: {org.owner?.name} ({org.owner?.email})
                </Typography>
                <Divider sx={{ my: 2, borderColor: "#00bfa5" }} />
                {org.members.map((m) => (
                  <Box
                    key={m.id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      py: 1,
                    }}
                  >
                    <Typography>
                      {m.name} ({m.email})
                    </Typography>
                    {org.owner.id === user?.id ? (
                      <Select
                        value={m.role}
                        size="small"
                        onChange={(e) =>
                          handleRoleChange(org.orgId, m.id, e.target.value)
                        }
                        sx={{
                          backgroundColor: "#00bfa5",
                          color: "#fff",
                          borderRadius: 2,
                        }}
                      >
                        <MenuItem value="writer">Writer</MenuItem>
                        <MenuItem value="viewer">Viewer</MenuItem>
                      </Select>
                    ) : (
                      <Chip
                        label={m.role}
                        size="small"
                        sx={{
                          backgroundColor: "#00bfa5",
                          color: "#fff",
                          fontWeight: 500,
                        }}
                      />
                    )}
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <Typography sx={{ color: "#fff" }}>No organizations found</Typography>
        )}
      </Box>
    </>
  );
};

export default Account;
