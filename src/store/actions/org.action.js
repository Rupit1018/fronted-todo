import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../libs/axios";

export const getOrgsAction = createAsyncThunk(
  "org/getOrgs",
  async (_, thunkAPI) => {
    try {
      const response = await API.get("/org/getorg");
      console.log(" Get Orgs success response:", response.data);
      return response.data;
    } catch (error) {
      console.error(" Get Orgs error:", error?.response?.data || error.message);
      return thunkAPI.rejectWithValue(
        error?.response?.data || {
          message: "Something went wrong",
          status: 500,
        }
      );
    }
  }
);

export const createOrgAction = createAsyncThunk(
  "org/createOrg",
  async (orgData, thunkAPI) => {
    try {
      const response = await API.post("/org/createorg", orgData);
      console.log(" Create Org success response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        " Create Org error:",
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

export const deleteOrgAction = createAsyncThunk(
  "org/deleteOrg",
  async (orgId, thunkAPI) => {
    try {
      const response = await API.delete(`/org/deleteorg/${orgId}`);
      console.log("Delete Org success response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        " Delete Org error:",
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

export const updateOrgAction = createAsyncThunk(
  "org/updateOrg",
  async ({ orgId, orgData }, thunkAPI) => {
    try {
      const response = await API.put(`/org/updateorg/${orgId}`, orgData);
      console.log(" Update Org success response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        " Update Org error:",
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

export const createGroupAction = createAsyncThunk(
  "org/createGroup",
  async ({ email, orgId }, thunkAPI) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await API.post(
        "/invitations",
        { orgId, email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Something went wrong", status: 500 }
      );
    }
  }
);
export const getInvitationsAction = createAsyncThunk(
  "org/getInvitations",
  async (_, thunkAPI) => {
    try {
      const response = await API.get("/invitations");
      console.log(" Get Invitations success response:", response);
      return response.data;
    } catch (error) {
      console.error(
        " Get Invitations error:",
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

export const cancelInvitationAction = createAsyncThunk(
  "org/cancelInvitation",
  async (invitationId, thunkAPI) => {
    try {
      const response = await API.patch(`/invitations/${invitationId}/cancel`);
      console.log("Cancel Invitation success response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        " Cancel Invitation error:",
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
export const acceptInvitationAction = createAsyncThunk(
  "org/acceptInvitation",
  async (invId, thunkAPI) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await API.patch(`/invitations/${invId}/accept`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Something went wrong", status: 500 }
      );
    }
  }
);

export const declineInvitationAction = createAsyncThunk(
  "org/declineInvitation",
  async (invitationId, thunkAPI) => {
    try {
      const response = await API.post(`/invitations/decline/${invitationId}`);
      console.log(" Decline Invitation success response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        " Decline Invitation error:",
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
