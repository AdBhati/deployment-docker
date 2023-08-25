import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API } from "../../utils/constants";

const initialState = {
  value: {
    task: {},
    tasks: [],
    leadRelatedTasks: [],
    openPopup: false,
    isLoading: false,
    message: null,
    error: "",
  },
};

export const getAllTasks = createAsyncThunk(
  "task/getAllTasks",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API.BASE_API}${API.GET_ALL_TASKS}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("jwt")}` },
      });

      return data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const getTaskById = createAsyncThunk(
  "task/getTaskById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${API.BASE_API}${API.GET_ALL_TASKS}/${id}`,
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

export const getTasksByLeadId = createAsyncThunk(
  "task/getTasksByLeadId",
  async (leadId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${API.BASE_API}${API.GET_ALL_TASKS_BY_LEAD_ID}/${leadId}`,
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

export const createNewTask = createAsyncThunk(
  "task/createNewTask",
  async (task, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${API.BASE_API}${API.GET_ALL_TASKS}`,
        task,
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

export const updateTask = createAsyncThunk(
  "task/updateTask",

  async (task, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${API.BASE_API}${API.UPDATE_TASKS}/${task._id}`,
        task,
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

export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    isPopup: (state, action) => {
      state.value.openPopup = action.payload;

    },
    resetError: (state, action) => {
      state.value.error = "";
    },
  },
  extraReducers: {
    [getAllTasks.pending]: (state, action) => {
      state.value.isLoading = true;
    },
    [getAllTasks.fulfilled]: (state, action) => {
      state.value.isLoading = false;
      state.value.tasks = action.payload;
    },
    [getAllTasks.rejected]: (state, action) => {
      state.value.isLoading = false;
      state.value.error = action.payload;
    },
    [getTaskById.pending]: (state, action) => {
      state.value.isLoading = true;
    },
    [getTaskById.fulfilled]: (state, action) => {
      state.value.isLoading = false;
      state.value.task = action.payload;
    },
    [getTaskById.rejected]: (state, action) => {
      state.value.isLoading = false;
      state.value.error = action.payload;
    },
    [getTasksByLeadId.pending]: (state, action) => {
      state.value.isLoading = true;
    },
    [getTasksByLeadId.fulfilled]: (state, action) => {
      state.value.isLoading = false;
      state.value.leadRelatedTasks = action.payload;
    },
    [getTasksByLeadId.rejected]: (state, action) => {
      state.value.isLoading = false;
      state.value.error = action.payload;
    },
    [createNewTask.pending]: (state, action) => {
      state.value.isLoading = true;
    },
    [createNewTask.fulfilled]: (state, action) => {
      state.value.isLoading = false;
      state.value.tasks.push = action.payload;
    },

    [createNewTask.rejected]: (state, action) => {
      state.value.isLoading = false;
      state.value.error = action.payload;
    },
    [updateTask.pending]: (state, action) => {
      state.value.isLoading = true;
    },
    [updateTask.fulfilled]: (state, action) => {
      state.value.isLoading = false;
      state.value.task = action.payload;
    },
    [updateTask.rejected]: (state, action) => {
      state.value.isLoading = false;
      state.value.error = action.payload;
    },
  },
});

export const { isPopup, resetError } = taskSlice.actions;
export default taskSlice.reducer;
