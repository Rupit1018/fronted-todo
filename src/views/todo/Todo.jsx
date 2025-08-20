import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  InputBase,
  Paper,
  Typography,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useAuthentication from "../../hooks/useAuthentication";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const CreateTodo = () => {
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [orgMembers, setOrgMembers] = useState([]);
  const [todos, setTodos] = useState([]);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const { craeateTodo, getTodos, deleteTodo, updateTodo, authMe } =
    useAuthentication();
  const navigate = useNavigate();
  const orgRole = localStorage.getItem("orgRole");
  const orgName = localStorage.getItem("selectedOrgName");
  const currentUserId = localStorage.getItem("userId") || null;
  const orgId = localStorage.getItem("selectedOrgId") || null;
  const [currentUserRole, setCurrentUserRole] = useState(null);
  console.log(
    "OrgId from localStorage:",
    localStorage.getItem("selectedOrgId")
  );
  console.log("Parsed OrgId:", orgId);
  console.log("Current User Role-:", currentUserRole);
  useEffect(() => {
    const fetchOrgMembers = async () => {
      if (!orgId) return;

      const res = await authMe();
      if (!res?.payload) return;

      const currentUserId = res.payload.id; //  sahi userId
      console.log(" CurrentUserId:", currentUserId);

      const currentOrg =
        res.payload.orgs?.find((o) => o.id === orgId) ||
        res.payload.ownedOrgs?.find((o) => o.id === orgId);

      console.log("Fetched org:", currentOrg);

      if (currentOrg) {
        const members =
          currentOrg.members?.map((m) => ({
            id: m.id,
            name: m.name,
            email: m.email,
            role: m.OrgMember?.role || "viewer",
          })) || [];

        setOrgMembers(members);

        const role =
          members.find((m) => String(m.id) === String(currentUserId))?.role ||
          null;

        setCurrentUserRole(role);
        console.log("Current User Role:", role);
      } else {
        console.log(" Org not found for orgId:", orgId);
      }
    };

    fetchOrgMembers();
  }, [orgId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trim values to avoid spaces-only titles/descriptions
    const title = newTitle.trim();
    const desc = newDesc.trim();

    // Basic validation
    if (!title) {
      toast.error("Please enter a title for the TODO.");
      return;
    }
    if (!desc) {
      toast.error("Please enter a description for the TODO.");
      return;
    }

    try {
      if (editingTodoId) {
        const todoData = { title, desc };
        await updateTodo({ todoId: editingTodoId, orgId, todoData });
        await refreshTodos();
        setNewTitle("");
        setNewDesc("");
        setEditingTodoId(null);
        toast.success("Todo updated successfully!");
      } else {
        if (!orgId) {
          toast.error("Org ID not found. Cannot create todo.");
          return;
        }
        const todoData = { title, desc, orgId };
        await craeateTodo(todoData);
        await refreshTodos();
        setNewTitle("");
        setNewDesc("");
        toast.success("Todo created successfully!");
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error("Operation failed");
    }
  };

  const refreshTodos = async () => {
    if (!orgId) return;
    const res = await getTodos(orgId);
    if (res?.payload?.data && Array.isArray(res.payload.data)) {
      setTodos(res.payload.data);
    }
  };

  useEffect(() => {
    refreshTodos();
  }, [orgId]);

  const handleDelete = async (todoId) => {
    try {
      await deleteTodo({ todoId, orgId });
      await refreshTodos();
      toast.success("Todo deleted successfully!");
    } catch (error) {
      console.error("Failed to delete todo:", error);
      toast.error("Failed to delete todo");
    }
  };

  const handleStartEdit = (todo) => {
    setNewTitle(todo.title);
    setNewDesc(todo.desc);
    setEditingTodoId(todo.id);
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
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
      </Box>
      <ToastContainer position="top-right" autoClose={3000} />
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, px: 2 }}>
        {orgName && (
          <Typography
            variant="h5"
            sx={{ mb: 2, color: "#00bfa5", fontWeight: "bold" }}
          >
            Organization: {orgName}
            Role :{currentUserRole}
          </Typography>
        )}
        {currentUserRole !== "viewer" && (
          <form onSubmit={handleSubmit}>
            <Paper
              sx={{
                px: 2,
                py: 1,
                mb: 2,
                backgroundColor: "#1e293b",
                border: "2px solid #00bfa5",
                borderRadius: "16px",
              }}
            >
              <InputBase
                fullWidth
                placeholder="Enter TODO title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                sx={{ color: "#00bfa5" }}
              />
            </Paper>

            <Paper
              sx={{
                px: 2,
                py: 1,
                mb: 2,
                backgroundColor: "#1e293b",
                border: "2px solid #00bfa5",
                borderRadius: "16px",
              }}
            >
              <InputBase
                fullWidth
                multiline
                placeholder="Enter TODO description"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                sx={{ color: "#00bfa5" }}
              />
            </Paper>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#00bfa5",
                borderRadius: "16px",
                mb: 2,
                "&:hover": { backgroundColor: "#009e87" },
              }}
              startIcon={<AddIcon />}
            >
              {editingTodoId ? "Update TODO" : "Add TODO"}
            </Button>
          </form>
        )}
      </Box>

      {/* Responsive Grid for Todos */}
      <Box sx={{ px: 2, pb: 4 }}>
        <Grid container spacing={2} columns={12}>
          {todos.map((todo) => (
            <Grid key={todo.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  borderRadius: "20px",
                  boxShadow: 3,
                  backgroundColor: "#0f172a",
                  border: "3px solid #00bfa5",
                  color: "#00bfa5",
                  transition: "0.3s",
                  "&:hover": {
                    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.2)",
                    backgroundColor: "#1e293b",
                  },
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">{todo.title}</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {todo.desc}
                  </Typography>
                  <Box display="flex" gap={1}>
                    {currentUserRole !== "viewer" && (
                      <>
                        <Button
                          onClick={() => handleStartEdit(todo)}
                          variant="contained"
                          size="small"
                          startIcon={<EditIcon />}
                          sx={{
                            backgroundColor: "#00bfa5",
                            color: "#0f172a",
                            borderRadius: "12px",
                            fontWeight: 600,
                            border: "1px solid transparent",
                            "&:hover": {
                              backgroundColor: "#0f172a",
                              color: "#00bfa5",
                              border: "1px solid #00bfa5",
                            },
                            flex: 1,
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(todo.id)}
                          variant="outlined"
                          size="small"
                          startIcon={<DeleteIcon />}
                          sx={{
                            borderColor: "#00bfa5",
                            color: "#00bfa5",
                            borderRadius: "12px",
                            fontWeight: 600,
                            "&:hover": {
                              backgroundColor: "#00bfa5",
                              color: "#0f172a",
                            },
                            flex: 1,
                          }}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default CreateTodo;
