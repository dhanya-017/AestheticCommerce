import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

// Get seller + token from localStorage (persistence after refresh)
const sellerToken = localStorage.getItem("sellerToken");
const sellerData = localStorage.getItem("sellerData")
  ? JSON.parse(localStorage.getItem("sellerData"))
  : null;

// SELLER REGISTER
export const registerSeller = createAsyncThunk(
  "auth/registerSeller",
  async (sellerData, thunkAPI) => {
    try {
      return await authService.registerSeller(sellerData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// SELLER LOGIN
export const loginSeller = createAsyncThunk(
  "auth/loginSeller",
  async (loginData, thunkAPI) => {
    try {
      return await authService.loginSeller(loginData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// LOGOUT
export const logoutSeller = createAsyncThunk("auth/logout", async () => {
  return authService.logout();
});

const initialState = {
  seller: sellerData, // load persisted seller
  token: sellerToken || null, // load persisted token
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER SELLER
      .addCase(registerSeller.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerSeller.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.seller = action.payload.seller;
        state.token = action.payload.token;

        // persist to localStorage
        localStorage.setItem("sellerToken", action.payload.token);
        localStorage.setItem("sellerData", JSON.stringify(action.payload.seller));
      })
      .addCase(registerSeller.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // LOGIN SELLER
      .addCase(loginSeller.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginSeller.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.seller = action.payload.seller;
        state.token = action.payload.token;

        // persist to localStorage
        localStorage.setItem("sellerToken", action.payload.token);
        localStorage.setItem("sellerData", JSON.stringify(action.payload.seller));
      })
      .addCase(loginSeller.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // LOGOUT
      .addCase(logoutSeller.fulfilled, (state) => {
        state.seller = null;
        state.token = null;
        localStorage.removeItem("sellerToken");
        localStorage.removeItem("sellerData");
      });
  },
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;
