import { createSlice } from "@reduxjs/toolkit";

const orgSlice = createSlice({
  name: "org",
  initialState: {
    invitations: [],
    loading: false,
  },
  reducers: {
    removeInvitationFromList: (state, action) => {
      state.invitations = state.invitations.filter(
        (inv) => inv.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getInvitationsAction.fulfilled, (state, action) => {
        state.invitations = action.payload;
      })
      .addCase(acceptInvitationAction.fulfilled, (state, action) => {
        state.invitations = state.invitations.filter(
          (inv) => inv.id !== action.payload
        );
      });
  },
});

export const { removeInvitationFromList } = orgSlice.actions;
export default orgSlice.reducer;