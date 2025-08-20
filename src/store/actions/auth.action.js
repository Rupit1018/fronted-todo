import { createAsyncThunk } from "@reduxjs/toolkit";
import Storage from "../../utils/localStorage";
import API from "../../libs/axios";

export const loginAction = createAsyncThunk(
  "auth/login",
  async (arg, thunkAPI) => {
    try {
      const { data } = await API.post("/auth/login", arg);
      const { token, user } = data;

      Storage.setItem("access_token", token);
      Storage.setItem("user", JSON.stringify(user));
      console.log(" Login successful:", user);

      console.log(" Token saved:", token);
      console.log("Storage.getItem:", Storage.getItem("access_token"));

      return data;
    } catch (err) {
      console.error(" Login error:", {
        message: err.message,
        isAxiosError: err.isAxiosError,
        response: err.response,
        request: err.request,
      });
      console.error(" Login error:", err.response?.data || err.message);
      return thunkAPI.rejectWithValue(
        err.response?.data || {
          message: "Something went wrong",
          status: 500,
        }
      );
    }
  }
);

export const signUpAction = createAsyncThunk(
  "auth/signup",
  async (arg, thunkAPI) => {
    try {
      const response = await API.post("/auth/signup", arg);
      return thunkAPI.fulfillWithValue(response?.data);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error?.response?.data?.message || "Something is wrong here",
        status: error?.response?.status || 500,
      });
    }
  }
);

export const logoutAction = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      Storage.removeItem("user");
      Storage.removeItem("access_token");
      Storage.removeItem("refresh_token");
      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error?.data?.message || "Something is wrong here",
      });
    }
  }
);

export const forgotPasswordAction = createAsyncThunk(
  "auth/forgot-Password",
  async (email, thunkAPI) => {
    try {
      const response = await API.post("/auth/forgot-password", { email });
      return thunkAPI.fulfillWithValue(response?.data);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error?.response?.data?.message || "Something is wrong here",
        status: error?.response?.status || 500,
      });
    }
  }
);

export const resetPasswordAction = createAsyncThunk(
  "auth/reset-Password",
  async ({ token, password }, thunkAPI) => {
    try {
      const response = await API.post(`/auth/reset-password?token=${token}`, {
        password,
      });
      return thunkAPI.fulfillWithValue(response?.data);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error?.response?.data?.message || "Something is wrong here",
        status: error?.response?.status || 500,
      });
    }
  }
);

export const getUserAction = createAsyncThunk(
  "auth/getUser",
  async (_, thunkAPI) => {
    try {
      const response = await API.get("/auth/me");
      return thunkAPI.fulfillWithValue(response?.data);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error?.response?.data?.message || "Something is wrong here",
        status: error?.response?.status || 500,
      });
    }
  }
);