import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

// 🔹 Async thunk for adding a product
export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (productData, { getState, rejectWithValue }) => {
    try {
      const formData = new FormData();

      Object.keys(productData).forEach((key) => {
        if (key === "images") {
          productData.images.forEach((file) => formData.append("images", file));
        } else if (key === "tags") {
          formData.append("tags", JSON.stringify(productData.tags));
        } else if (
          ["price", "originalPrice", "discount", "rating", "inStock"].includes(key)
        ) {
          formData.append(key, productData[key] !== "" ? Number(productData[key]) : "");
        } else {
          formData.append(key, productData[key]);
        }
      });

      const token = getState().auth.token;

      const res = await axios.post(`${BASE_URL}/api/products`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔹 Slice
const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.success = true;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export default productSlice.reducer;
export const { clearSuccess } = productSlice.actions;
