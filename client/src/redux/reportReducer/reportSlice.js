import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API } from "../../utils/constants";

const initialState = {
  value: {
    report: [],
    isLoading: false,
    message: null,
    error: null,
    message: '',
  },
};

export const leadBackup = createAsyncThunk(
  "leads/leadBackup",
  async (reportData, { rejectWithValue }) => {
    try {
      let status;
      if (reportData && reportData.status) {
        status = reportData.status;
      } else {
        status = "Open";
      }
      const { data } = await axios.post(
        `${API.BASE_API}${API.LEAD_BACKUP}`,
        {
          startDate: reportData.startDate,
          status: status,
          endDate: reportData.endDate,
        },
        {
          headers: { Authorization: `Bearer ${sessionStorage.getItem("jwt")}` },
        }
      );

      return data;
    } catch (error) {
      if (error.response) {
        const message = error.response.data.message;
        return rejectWithValue(message);
      } else {
        return rejectWithValue("Error occurred");
      }
    }
  }
);

export const taskBackup = createAsyncThunk(
  "tasks/taskBackup",
  async (reportData, { rejectWithValue }) => {
    try {
      let status;
      if (reportData && reportData.status) {
        status = reportData.status;
      } else {
        status = "Open";
      }
      const { data } = await axios.post(
        `${API.BASE_API}${API.TASK_BACKUP}`,
        {
          startDate: reportData.startDate,
          status: status,
          endDate: reportData.endDate,
        },
        {
          headers: { Authorization: `Bearer ${sessionStorage.getItem("jwt")}` },
        }
      );

      return data;
    } catch (error) {
      if (error.response) {
        const message = error.response.data.message;
        return rejectWithValue(message);
      } else {
        return rejectWithValue(error);
      }
    }
  }
);

export const showTaskBackup = createAsyncThunk(
  "tasks/showTaskBackup",
  async (reportData, { rejectWithValue }) => {
    try {
      let status;
      if (reportData && reportData.status) {
        status = reportData.status;
      } else {
        status = "Open";
      }

      const { data } = await axios.post(
        `${API.BASE_API}${API.SHOW_TASK_BACKUP}`,
        {
          startDate: reportData.startDate,
          status: status,
          endDate: reportData.endDate,
        },
        {
          headers: { Authorization: `Bearer ${sessionStorage.getItem("jwt")}` },
        }
      );

      return data;
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.response.data);
      }
    }
  }
);

export const showLeadBackup = createAsyncThunk(
  "tasks/showLeadBackup",
  async (reportData, { rejectWithValue }) => {
    try {
      let status;
      if (reportData && reportData.status) {
        status = reportData.status;
      } else {
        status = "Open";
      }
      const { data } = await axios.post(
        `${API.BASE_API}${API.SHOW_LEAD_BACKUP}`,
        {
          startDate: reportData.startDate,
          status: status,
          endDate: reportData.endDate,
        },
        {
          headers: { Authorization: `Bearer ${sessionStorage.getItem("jwt")}` },
        }
      );
      return data;
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.response.data);
      }
    }
  }
);

export const reportSlice = createSlice({
  name: "lead",
  initialState,
  reducers: {},
  extraReducers: {
    [leadBackup.pending]: (state, action) => {
      state.value.isLoading = true;
    },
    [leadBackup.fulfilled]: (state, action) => {
      state.value.isLoading = false;
      state.value.message = action.payload.message;
    },
    [leadBackup.rejected]: (state, action) => {
      state.value.isLoading = false;
      state.value.error = action.payload;
    },

    [taskBackup.pending]: (state, action) => {
      state.value.isLoading = true;
    },
    [taskBackup.fulfilled]: (state, action) => {
      state.value.isLoading = false;
      state.value.message = action.payload.message;
    },
    [taskBackup.rejected]: (state, action) => {
      state.value.isLoading = false;
      state.value.error = action.payload;
    },

    [showTaskBackup.pending]: (state, action) => {
      state.value.isLoading = true;
    },
    [showTaskBackup.fulfilled]: (state, action) => {
      state.value.isLoading = false;
      state.value.report = action.payload;
    },
    [showTaskBackup.rejected]: (state, action) => {
      state.value.isLoading = false;
      state.value.error = action.payload.error;
    },

    [showLeadBackup.pending]: (state, action) => {
      state.value.isLoading = true;
    },
    [showLeadBackup.fulfilled]: (state, action) => {
      state.value.isLoading = false;
      state.value.report = action.payload;
    },
    [showLeadBackup.rejected]: (state, action) => {
      state.value.isLoading = false;
      state.value.error = action.payload.error;

    },
  },
});

export default reportSlice.reducer;
