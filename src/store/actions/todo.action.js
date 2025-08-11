import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../libs/axios";

export const createTodoAction = createAsyncThunk(
  "todo/createTodo",
  async (todoData, thunkAPI) => {
    try {
      const response = await API.post(
        `/todo/createtodo/${todoData.orgId}`,
        todoData
      );
      console.log("Create Todo success response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        " Create Todo error:",
        error?.response?.data || error.message
      );
      return thunkAPI.rejectWithValue(
        error?.response?.data || {
          message: "Something went wrong",
          status: 500,
        }
      );
    }
  }
);

export const getTodosAction = createAsyncThunk(
  "todo/getTodos",
  async (orgId, thunkAPI) => {
    try {
      const response = await API.get(`/todo/gettodo/${orgId}`);
      console.log(" Get Todos success response:", response.data);
      return response.data; // response.data = { data: todos, message }
    } catch (error) {
      console.error(
        " Get Todos error:",
        error?.response?.data || error.message
      );
      return thunkAPI.rejectWithValue(
        error?.response?.data || {
          message: "Something went wrong",
          status: 500,
        }
      );
    }
  }
);

export const deleteTodoAction = createAsyncThunk(
  "todo/deleteTodo",
  async ({ todoId, orgId }, thunkAPI) => {
    try {
      const response = await API.delete(
        `/todo/deletetodo/${orgId}/todo/${todoId}`
      );
      console.log(" Delete Todo success response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        " Delete Todo error:",
        error?.response?.data || error.message
      );
      return thunkAPI.rejectWithValue(
        error?.response?.data || {
          message: "Something went wrong",
          status: 500,
        }
      );
    }
  }
);

export const updateTodoAction = createAsyncThunk(
  "todo/updateTodo",
  async ({ todoId, orgId, todoData }, thunkAPI) => {
    try {
      const response = await API.put(
        `/todo/updatetodo/${orgId}/todo/${todoId}`,
        todoData
      );
      console.log(" Update Todo success response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        " Update Todo error:",
        error?.response?.data || error.message
      );
      return thunkAPI.rejectWithValue(
        error?.response?.data || {
          message: "Something went wrong",
          status: 500,
        }
      );
    }
  }
);
