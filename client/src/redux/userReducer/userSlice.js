import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API } from "../../utils/constants";

const initialState = {
  value: {
    jwt: sessionStorage.getItem("jwt") ? sessionStorage.getItem("jwt") : "",
    users: [],
    dashBoard: {},
    dashBoards: [],
    loggedInUser: {},
    isLoading: false,
    message: "",
    error: "",
  },
};

export const login = createAsyncThunk(
  "user/login",
  async (userData, { rejectWithValue }) => {
    const { email, password } = userData;
    try {
      const { data } = await axios.post(`${API.BASE_API}${API.AUTHENTICATE}`, {
        email,
        password,
      });
      sessionStorage.setItem("jwt", data.jwt);
      return data.jwt;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data.error);

    }
  }
);

export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API.BASE_API}${API.GET_ALL_USERS}`, {
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

export const compareOldAndNewPasswords = createAsyncThunk(
  "user/compareOldAndNewPasswords",
  async (userData, { rejectWithValue }) => {
    const { id, oldPassword } = userData;

    try {
      const { data } = await axios.post(
        `${API.BASE_API}${API.COMPARE_OLD_PASSWORD}/${id}`,

        { oldPassword },
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

export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async (userData, { rejectWithValue }) => {
    const { id, oldPasswordFill, password } = userData;

    try {
      const { data } = await axios.post(
        `${API.BASE_API}${API.RESET_PASSWORD}/${id}`,
        {
          oldPassword: oldPasswordFill,
          newPassword: password,
        },
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

export const getDashboardData = createAsyncThunk(
  "user/getDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${API.BASE_API}${API.GET_ALL_DASHBOARD_DATA}`,
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


export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      sessionStorage.removeItem("jwt");
      state.value.jwt = "";
      state.value.users = [];
      state.value.dashBoard = {};
      state.value.dashBoards = [];
      state.value.loggedInUser = {};
      state.value.isLoading = false;
      state.value.error = "";
    },
    setLoggedInUser: (state, action) => {
      const data = action.payload;
      state.value.loggedInUser.id = data.userId;
      state.value.loggedInUser.name = data.name;
      state.value.loggedInUser.role = data.role;
      state.value.loggedInUser.email = data.email;
      state.value.loggedInUser.gender = data.gender;
      state.value.loggedInUser.salutation = data.salutation;
    },
    resetError: (state, action) => {
      state.value.error = "";
    },
    resetUserState: (state) => {
      state = initialState;
    },
  },
  extraReducers: {
    [login.pending]: (state, action) => {
      state.value.isLoading = true;
    },
    [login.fulfilled]: (state, action) => {
      state.value.isLoading = false;
      state.value.jwt = action.payload;
    },
    [login.rejected]: (state, action) => {
      state.value.isLoading = false;
      state.value.error = action.payload;
    },
    [getAllUsers.pending]: (state, action) => {
      state.value.isLoading = true;
    },
    [getAllUsers.fulfilled]: (state, action) => {
      state.value.isLoading = false;
      state.value.users = action.payload;
    },
    [getAllUsers.rejected]: (state, action) => {
      state.value.isLoading = false;
      state.value.error = action.payload;
    },
    [resetPassword.pending]: (state, action) => {
      state.value.isLoading = true;
    },
    [resetPassword.fulfilled]: (state, action) => {
      state.value.isLoading = false;
      state.value.message = action.payload.message;
    },
    [resetPassword.rejected]: (state, action) => {
      state.value.isLoading = false;
      state.value.error = action.payload;
    },
    [getDashboardData.pending]: (state, action) => {
      state.value.isLoading = true;
    },
    [getDashboardData.fulfilled]: (state, action) => {
      state.value.isLoading = false;
      state.value.dashBoard = action.payload;
    },
    [getDashboardData.rejected]: (state, action) => {
      state.value.isLoading = false;
      state.value.error = action.payload;
    },
    [compareOldAndNewPasswords.pending]: (state, action) => {
      state.value.isLoading = true;
    },
    [compareOldAndNewPasswords.fulfilled]: (state, action) => {
      state.value.isLoading = false;
      state.value.message = action.payload;
    },
    [compareOldAndNewPasswords.rejected]: (state, action) => {
      state.value.isLoading = false;
      state.value.error = action.payload;
    },
  },
});

export const { logout, setLoggedInUser, resetError, resetUserState } =
  userSlice.actions;

export default userSlice.reducer;
