import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../libs/axios";

export const getOrgDetailsAction = createAsyncThunk(
  "organization/OrgDetails",
  async (orgId, thunkAPI) => {
    try {
      const response = await API.get(`/user/${orgId}/members`);
      console.log("Get Org Details success response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Get Org Details error:",
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

export const updateMemberRoleAction = createAsyncThunk(
  "organization/updateMemberRole",
  async ({ orgId, memberId, role }, thunkAPI) => {
    try {
      const response = await API.put(`/user/${orgId}/member/${memberId}/role`, { role });
      console.log("Update Member Role success response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Update Member Role error:",
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