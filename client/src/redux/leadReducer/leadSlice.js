import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API } from "../../utils/constants";

const initialState = {
  value: {
    lead: {},
    leads: [],
    leadsRemarks : [],
    isLoading: false,
    error: "",
    message: "",
  },
};

export const getAllLeads = createAsyncThunk(
  "lead/getAllLeads",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API.BASE_API}${API.GET_ALL_LEADS}`, {
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

export const getLeadById = createAsyncThunk(
  "lead/getLeadById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${API.BASE_API}${API.GET_ALL_LEADS}/${id}`,
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


export const getLeadByIdRemarks = createAsyncThunk(
  "lead/getLeadByIdRemarks",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${API.BASE_API}${API.GET_ALL_LEADS_REMARKS}/${id}`,
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

export const createLead = createAsyncThunk(
  "lead/createLead",
  async (lead, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${API.BASE_API}${API.GET_ALL_LEADS}/`,
        lead,
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

export const updateLead = createAsyncThunk(
  "lead/updateLead",
  async (leadData, { rejectWithValue }) => {
    const { id, lead } = leadData;

    try {
      const { data } = await axios.put(
        `${API.BASE_API}${API.GET_ALL_LEADS}/${id}`,
        {
          status: lead.status,
          company: lead.company,
          lastName: lead.lastName,
          phone: lead.phone,
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

export const deleteLead = createAsyncThunk(
  "lead/deleteLead",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${API.BASE_API}${API.DELETE_LEAD}/${id}`,
        {},
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

export const leadSlice = createSlice({
  name: "lead",
  initialState,
  reducers: {},
  extraReducers: {
    [getAllLeads.pending]: (state, action) => {
      state.value.isLoading = true;
    },
    [getAllLeads.fulfilled]: (state, action) => {
      state.value.isLoading = false;
      state.value.leads = action.payload;
    },
    [getAllLeads.rejected]: (state, action) => {
      state.value.isLoading = false;
      state.value.error = action.payload;
    },
    [getLeadById.pending]: (state, action) => {
      state.value.isLoading = true;
    },
    [getLeadById.fulfilled]: (state, action) => {
      state.value.isLoading = false;
      state.value.lead = action.payload;
    },
    [getLeadById.rejected]: (state, action) => {
      state.value.isLoading = false;
      state.value.error = action.payload;
    },
    [getLeadByIdRemarks.pending]: (state, action) => {
      state.value.isLoading = true;
    },
    [getLeadByIdRemarks.fulfilled]: (state, action) => {
      state.value.isLoading = false;
      state.value.leadsRemarks = action.payload;
    },
    [getLeadByIdRemarks.rejected]: (state, action) => {
      state.value.isLoading = false;
      state.value.error = action.payload;
    },
    [createLead.pending]: (state, action) => {
      state.value.isLoading = true;
    },
    [createLead.fulfilled]: (state, action) => {
      state.value.isLoading = false;
      state.value.lead = action.payload;
    },
    [createLead.rejected]: (state, action) => {
      state.value.isLoading = false;
      state.value.error = action.payload;
    },
    [updateLead.pending]: (state, action) => {
      state.value.isLoading = true;
    },
    [updateLead.fulfilled]: (state, action) => {
      state.value.isLoading = false;
      state.value.lead = action.payload;
    },
    [updateLead.rejected]: (state, action) => {
      state.value.isLoading = false;
      state.value.error = action.payload;
    },
    [deleteLead.pending]: (state, action) => {
      state.value.isLoading = true;
    },
    [deleteLead.fulfilled]: (state, action) => {
      state.value.isLoading = false;
      state.value.lead = action.payload;
    },
    [deleteLead.rejected]: (state, action) => {
      state.value.isLoading = false;
      state.value.error = action.payload;
    },
  },
});

export default leadSlice.reducer;