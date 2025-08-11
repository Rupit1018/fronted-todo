import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // import useNavigate
import {
  Box,
  Button,
  InputBase,
  Paper,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useAuthentication from "../../hooks/useAuthentication";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateTodo = () => {
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const { craeateTodo, getTodos, deleteTodo, updateTodo } = useAuthentication();
  const orgId = localStorage.getItem("selectedOrgId");
  const navigate = useNavigate(); // initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTodoId) {
        const todoData = { title: newTitle, desc: newDesc };
        const res = await updateTodo({ todoId: editingTodoId, orgId, todoData });
        console.log("Todo updated:", res);

        const refreshed = await getTodos(orgId);
        if (refreshed?.payload?.data && Array.isArray(refreshed.payload.data)) {
          setTodos(refreshed.payload.data);
        }

        setNewTitle("");
        setNewDesc("");
        setEditingTodoId(null);
        toast.success("Todo updated successfully!");
      } else {
        if (!orgId) {
          console.error(" Org ID not found. Cannot create todo.");
          return;
        }

        const todoData = { title: newTitle, desc: newDesc, orgId };

        try {
          const res = await craeateTodo(todoData);
          console.log("Todo created:", res);

          const refreshed = await getTodos(orgId);
          if (refreshed?.payload?.data && Array.isArray(refreshed.payload.data)) {
            setTodos(refreshed.payload.data);
          }

          setNewTitle("");
          setNewDesc("");
          toast.success("Todo created successfully!");
        } catch (err) {
          console.error("Failed to create todo:", err);
          toast.error("Failed to create todo");
        }
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

  useEffect(() => {
    const fetchTodos = async () => {
      if (!orgId) {
        console.error(" Org ID not found. Cannot fetch todos.");
        return;
      }
      try {
        const res = await getTodos(orgId);
        console.log("getTodos response:", res);
        if (res?.payload?.data && Array.isArray(res.payload.data)) {
          setTodos(res.payload.data);
        } else {
          console.warn("No todos found");
        }
      } catch (err) {
        console.error("Failed to fetch todos:", err);
      }
    };
    fetchTodos();
  }, [orgId]);

  const handleDelete = async (todoId) => {
    try {
      const res = await deleteTodo({ todoId, orgId });
      console.log("Delete Todo Response:", res);

      const refreshed = await getTodos(orgId);
      if (refreshed?.payload?.data && Array.isArray(refreshed.payload.data)) {
        setTodos(refreshed.payload.data);
      }

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
    console.log("Editing Todo:", todo);
  };

  // New handler to navigate to CreateGroup page
 const handleCreateGroupClick = () => {
  if (!orgId) {
    toast.error("No organization selected!");
    return;
  }
  navigate(`/creategroup/${orgId}`);
};


  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
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

        {/* Create Group Button below Add TODO */}
        <Button
          variant="outlined"
          fullWidth
          sx={{
            borderColor: "#00bfa5",
            color: "#00bfa5",
            borderRadius: "16px",
            fontWeight: "bold",
            mb: 4,
            "&:hover": {
              backgroundColor: "#00bfa5",
              color: "#0f172a",
            },
          }}
          onClick={handleCreateGroupClick}
        >
          Create Group
        </Button>
      </Box>

      <Box display="grid" gridTemplateColumns="repeat(5, 1fr)" gap={2} px={2}>
        {todos.map((todo) => (
          <Card
            key={todo.id}
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
            }}
          >
            <CardContent>
              <Typography variant="h6">{todo.title}</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {todo.desc}
              </Typography>

              <Box display="flex" justifyContent="space-between" gap={1}>
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
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </>
  );
};

export default CreateTodo;
