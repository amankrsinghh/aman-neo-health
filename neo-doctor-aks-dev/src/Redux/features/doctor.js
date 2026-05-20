import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getApiData, getSecureApiData, securePostData } from "../../Services/api";

// Async thunk to fetch doctor profile
export const fetchDoctorProfile = createAsyncThunk(
    "doctorProfile/fetch",
    async (searchText, { rejectWithValue }) => {
        try {
            const response = await getSecureApiData(`doctor/${localStorage.getItem('userId')}`);
            if (response.success) {
                return response.data;
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
export const fetchDoctorDetail = createAsyncThunk(
    "doctorDetail/fetch",
    async (searchText, { rejectWithValue }) => {
        try {
            const response = await getSecureApiData(`doctor/detail/${localStorage.getItem('userId')}`);
            if (response.success) {
                return response;
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
export const fetchEmpDetail = createAsyncThunk(
    "empDetail/fetch",
    async (id, { rejectWithValue }) => {
        try {
            const response = await getSecureApiData(`api/staff/data/${id}`);
            if (response.success) {
                return response;
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
const doctorSlice = createSlice({
    name: "doctorProfile",
    initialState: {
        profiles: null,
        medicalLicense: null,
        aboutDoctor: null,
        educationWork: null,
        paymentInfo:null,
        user:null,
        kyc: null,
        isRequest: null,
        loading: false,
        error: null,
        customId: null,
        role: 'doctor',
        allowEdit: false,
        staffData: null,
        staffUser:null,
        employment:null,
        isOwner: true, // <-- read from localStorage
        permissions: null,
        clinicData: null
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
            .addCase(fetchDoctorProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDoctorProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profiles = action.payload;
            })
            .addCase(fetchDoctorProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchDoctorDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDoctorDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.profiles = action.payload.user;
                state.user=action.payload.doctorUser;
                state.isRequest = action.payload.isRequest
                state.educationWork = action.payload.eduWork;
                state.paymentInfo = action.payload.paymentInfo;
                state.medicalLicense = action.payload.medicalLicense;
                state.aboutDoctor = action.payload.aboutDoctor;
                state.kyc = action.payload.kyc;
                state.clinicData = action.payload.clinicData;
                // state.role = action.payload.role;
                state.customId = action.payload.customId;
                state.allowEdit = action.payload.allowEdit;
            })
            .addCase(fetchDoctorDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchEmpDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.staffData = action.payload.staffData;
                state.employment=action.payload.employment
                state.staffUser=action.payload.user
                state.isOwner =  false ;
                state.permissions = action.payload.employment.permissionId?.doctor || null;
            });
    },
});

export const { clearProfiles, } = doctorSlice.actions;
export default doctorSlice.reducer;
