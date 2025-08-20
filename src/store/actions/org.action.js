import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../libs/axios";

export const getOrgsAction = createAsyncThunk(
  "organization/getOrganization",
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
  "organization/createOrganization",
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
  "organization/deleteOrganization",
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
  "organization/updateOrgName",
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
export const inviteUserAction = createAsyncThunk(
  "organization/inviteUser",
  async ({ email, orgId, role }, thunkAPI) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await API.post(
        `/invitations/send/${orgId}`,
        { email, role }, // only email + role in body
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Something went wrong", status: 500 }
      );
    }
  }
);
export const getInvitationsAction = createAsyncThunk(
  "organization/getInvitations",
  async (orgId, thunkAPI) => {
    if (!orgId) return thunkAPI.rejectWithValue({ message: "Invalid orgId" });
    try {
      const response = await API.get(`/invitations/org/${orgId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data || { message: "Something went wrong" }
      );
    }
  }
);

export const getInvitationAction = createAsyncThunk(
  "organization/getInvitation",
  async (_, thunkAPI) => {
    try {
      const response = await API.get("/invitations");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data || { message: "Something went wrong" }
      );
    }
  }
);

export const cancelInvitationAction = createAsyncThunk(
  "organization/cancelInvitation",
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
  "organization/acceptInvitation",
  async (invitationId, thunkAPI) => {
    try {
      await API.patch(`/invitations/${invitationId}/accept`);
      return invitationId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data || { message: "Something went wrong" }
      );
    }
  }
);
export const declineInvitationAction = createAsyncThunk(
  "organization/declineInvitation",
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
