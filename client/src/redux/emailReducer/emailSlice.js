import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API } from "../../utils/constants";

const initialState = {
  value: {
    data: "",
    isLoading: false,
    error: "",
  },
};

export const syncWithEmail = createAsyncThunk(
  "email/syncWithEmail",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${API.BASE_API}${API.SYNC_WITH_EMAIL}`,
        {
          headers: { Authorization: `Bearer ${sessionStorage.getItem("jwt")}` },
        }
      );
      return data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const emailSlice = createSlice({
  name: "email",
  initialState,
  reducers: {
    resetEmail: (state) => {
      state.value.data = "";
    },
  },
  extraReducers: {
    [syncWithEmail.pending]: (state, action) => {
      state.value.isLoading = true;
    },
    [syncWithEmail.fulfilled]: (state, action) => {
      state.value.isLoading = false;
      state.value.data = action.payload.message;
    },
    [syncWithEmail.rejected]: (state, action) => {
      state.value.isLoading = false;
      state.value.error = action.payload;
    },
  },
});

export const { resetEmail } = emailSlice.actions;
export default emailSlice.reducer;