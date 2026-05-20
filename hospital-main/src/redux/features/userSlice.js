import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getApiData, getSecureApiData } from "../../Service/api";

// Async thunk to fetch user profile
export const fetchUserProfile = createAsyncThunk(
    "userProfile/fetch",
    async (searchText, { rejectWithValue }) => {
        try {
            const response = await getApiData(`lab/${localStorage.getItem('userId')}`);
            if (response.success) {
                return response.data;
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
export const fetchUserDetail = createAsyncThunk(
    "userDetail/fetch",
    async (searchText, { rejectWithValue }) => {
        try {
            const response = await getSecureApiData(`api/hospital/get-hospital-profile`);
            if (response.success) {
                return response.profile;
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
            const response =id && await getSecureApiData(`api/staff/data/${id}`);
            if (response.success) {
                return response;
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
const userSlice = createSlice({
    name: "userProfile",
    initialState: {
        hospitalBasic: null,
        hospitalPerson: null,
        hospitalAddress: null,
        hospitalImg: null,
        rating: null,
        avgRating: null,
        hospitalLicense: null,
        paymentInfo:null,
        isRequest: null,
        allowEdit:null,
        loading: false,
        error: null,
        hospitalCustomId:null,
        isOwner: true, // <-- read from localStorage
        permissions:  null,
        staffData:null,
        staffUser:null,
        employment:null,
        user:null,
        notification:0
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
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profiles = action.payload;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchUserDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.hospitalBasic = action.payload.basic
                state.hospitalAddress = action.payload.address;
                state.hospitalImg = action.payload.images;
                state.paymentInfo=action.payload.paymentInfo
                // state.rating = action.payload.rating;
                // state.avgRating = action.payload.avgRating;
                state.hospitalPerson = action.payload.contact;
                // state.isRequest = action.payload.isRequest
                // state.allowEdit = action.payload.allowEdit
                state.hospitalLicense = action.payload.labLicense;
                state.user = action.payload.user;
                state.hospitalCustomId = action.payload.user.unique_id
                state.notification = action.payload.unRead
            })
            .addCase(fetchUserDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchEmpDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.isOwner=false;
                state.staffData = action.payload.staffData;
                state.employment=action.payload.employment
                state.staffUser=action.payload.user
                state.permissions = action.payload.employment.permissionId?.hospital || null;
            })
    },
});

export const { clearProfiles, setOwner, setPermissions } = userSlice.actions;
export default userSlice.reducer;
