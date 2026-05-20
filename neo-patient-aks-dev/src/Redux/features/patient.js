import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getApiData, getSecureApiData, securePostData } from "../../Services/api";

// Async thunk to fetch patient profile
export const fetchPatientProfile = createAsyncThunk(
    "patientProfile/fetch",
    async (searchText, { rejectWithValue }) => {
        try {
            const response = await getSecureApiData(`patient/${localStorage.getItem('userId')}`);
            if (response.success) {
                return response.data;
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
export const fetchPatientDetail = createAsyncThunk(
    "patientDetail/fetch",
    async (searchText, { rejectWithValue }) => {
        try {
            const response = await getSecureApiData(`patient/detail/${localStorage.getItem('userId')}`);
            if (response.success) {
                return response;
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
const patientSlice = createSlice({
    name: "patientProfile",
    initialState: {
        profiles: null,
        medicalHistory: null,
        demographic: null,
        labAppointment: null,
        user:null,
        prescription:null,
        kyc: null,
        isRequest: null,
        loading: false,
        notAllowed:false,
        error: null,
        customId:null,
        role:null,
        allowEdit:false
    },
    reducers: {
        clearProfiles: (state) => {
            state.profiles = [];
            state.error = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPatientProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPatientProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profiles = action.payload;
            })
            .addCase(fetchPatientProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchPatientDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPatientDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.profiles = action.payload.user
                state.user=action.payload.patientUser;
                state.isRequest = action.payload.isRequest
                state.prescription = action.payload.prescription;
                state.medicalHistory = action.payload.medicalHistory;
                state.demographic = action.payload.demographic;
                state.labAppointment = action.payload.labAppointment;
                state.kyc = action.payload.kyc;
                state.notAllowed = action.payload.notAllowed
                state.role = action.payload.role;
                state.customId = action.payload.customId;
                state.allowEdit = action.payload.allowEdit;
            })
            .addCase(fetchPatientDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearProfiles,} = patientSlice.actions;
export default patientSlice.reducer;
