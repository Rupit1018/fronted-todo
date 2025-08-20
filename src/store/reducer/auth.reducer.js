import { createSlice } from "@reduxjs/toolkit";
import {
  getUserAction,
  loginAction,
  logoutAction,
  signUpAction,
} from "../actions/auth.action";

const initialState = {
  loading: "",
  message: "",
  error: false,
  apiName: "",
  alertType: "",
  verifyResetToken: null,
  emailStatus: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearMessage: (state) => {
      state.alertType = "";
      state.apiName = "";
      state.message = "";
    },
    errorMessage: (state, action) => {
      state.alertType = action.payload.alertType;
      state.apiName = action.payload.apiName;
      state.message = action.payload.message;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserAction.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // 👈 Ahiya user save karvo
      })
      .addCase(getUserAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
    builder.addCase(signUpAction.pending, (state) => {
      state.apiName = "signup";
      state.loading = "signup";
    });
    builder.addCase(signUpAction.fulfilled, (state, { payload }) => {
      state.loading = "";
      state.alertType = "success";
      state.message = payload.message;
    });
    builder.addCase(signUpAction.rejected, (state, { payload }) => {
      state.loading = "";
      state.alertType = "error";
      if (payload) {
        state.message = payload.message;
      }
    });
    builder.addCase(loginAction.pending, (state) => {
      state.apiName = "login";
      state.loading = "login";
    });
    builder.addCase(loginAction.fulfilled, (state, { payload }) => {
      state.loading = "";
      state.message = payload.message;
    });
    builder.addCase(loginAction.rejected, (state, { payload }) => {
      state.loading = "";
      state.alertType = "error";
      if (payload) {
        state.message = payload.message;
      }
    });
    builder.addCase(logoutAction.pending, (state) => {
      state.loading = "logout";
    });

    builder.addCase(logoutAction.fulfilled, (state) => {
      state.loading = "";
      state.message = "Logged out successfully";
      state.apiName = "logout";

      //  Clear user info from Redux state
      state.user = null;
      state.isAuthenticated = false;
    });

    builder.addCase(logoutAction.rejected, (state) => {
      state.loading = "";
      state.apiName = "logout";

      //  Also clear on error, to force logout if needed
      state.user = null;
      state.isAuthenticated = false;
    });
  },
});

export const { clearMessage, errorMessage } = authSlice.actions;
export default authSlice;
