import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getApiData, getSecureApiData, securePostData } from "../../Services/api";

// Async thunk to fetch user profile
export const fetchUserProfile = createAsyncThunk(
    "userProfile/fetch",
    async (searchText, { rejectWithValue }) => {
        try {
            const response = await getSecureApiData(`pharmacy/${localStorage.getItem('userId')}`);
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
            const response = await getSecureApiData(`pharmacy/detail/${localStorage.getItem('userId')}`);
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
            const response =id && await getSecureApiData(`api/staff/data/${id}`);
            console.log("res",response)
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
        profiles: null,
        pharPerson: null,
        pharAddress: null,
        pharImg: null,
        rating: null,
        avgRating: null,
        pharLicense: null,
        user:null,
        customId:null,
        unRead:0,
        isRequest: null,
        paymentInfo:null,
        allowEdit:null,
        loading: false,
        error: null,
        staffData: null,
        staffUser:null,
        employment:null,
        isOwner: true,
        permissions:null
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
                state.profiles = action.payload.data
                state.user=action.payload.user
                state.pharAddress = action.payload.pharAddress;
                state.pharImg = action.payload.pharImg;
                state.rating = action.payload.rating;
                state.unRead = action.payload.unRead;
                state.paymentInfo = action.payload.paymentInfo;
                state.avgRating = action.payload.avgRating;
                state.pharPerson = action.payload.pharPerson;
                state.isRequest = action.payload.isRequest
                state.allowEdit = action.payload.allowEdit
                state.customId = action.payload.customId
                state.pharLicense = action.payload.pharLicense;
                state.isOwner= localStorage.getItem('staffId')  ?false:true;
                // state.permissions= JSON.parse(localStorage.getItem('permissions')) || null;
            })
            .addCase(fetchUserDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchEmpDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.staffData = action.payload.staffData;
                state.employment=action.payload.employment
                state.staffUser=action.payload.user
                state.isOwner =  false ;
                state.permissions = action.payload.employment.permissionId?.pharmacy || null;
            });
          
    },
});

export const { clearProfiles, setOwner, setPermissions } = userSlice.actions;
export default userSlice.reducer;
