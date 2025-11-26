import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderService from './orderService';

export const getMyOrders = createAsyncThunk(
  'orders/getMyOrders',
  async (_, { getState, rejectWithValue }) => {
    try {
      const getStateFn = () => getState();
      const ordersData = await orderService.listMy(getStateFn);
      return ordersData;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error fetching orders');
    }
  }
);

export const getOrderById = createAsyncThunk(
  'orders/getOrderById',
  async (orderId, { getState, rejectWithValue }) => {
    try {
      const getStateFn = () => getState();
      const orderData = await orderService.getById(getStateFn, orderId);
      return orderData;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error fetching order details');
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { getState, rejectWithValue }) => {
    try {
      const getStateFn = () => getState();
      const newOrder = await orderService.create(getStateFn, orderData);
      return newOrder;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error creating order');
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (orderId, { getState, rejectWithValue }) => {
    try {
      const getStateFn = () => getState();
      const cancelledOrder = await orderService.cancelOrder(getStateFn, orderId);
      return cancelledOrder;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error cancelling order');
    }
  }
);

export const submitOrderRating = createAsyncThunk(
  'orders/submitRating',
  async ({ orderId, ratingData }, { getState, rejectWithValue }) => {
    try {
      const getStateFn = () => getState();
      const updatedOrder = await orderService.submitRating(getStateFn, orderId, ratingData);
      return updatedOrder;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error submitting rating');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    myOrders: [],
    currentOrder: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get my orders
      .addCase(getMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.myOrders = action.payload;
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get order by ID
      .addCase(getOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.myOrders.unshift(action.payload);
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cancel order
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        // Update the order in myOrders array
        const orderIndex = state.myOrders.findIndex(order => order._id === action.payload._id);
        if (orderIndex !== -1) {
          state.myOrders[orderIndex] = action.payload;
        }
        // Update currentOrder if it's the same order
        if (state.currentOrder && state.currentOrder._id === action.payload._id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Submit rating
      .addCase(submitOrderRating.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitOrderRating.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(submitOrderRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentOrder, clearError } = orderSlice.actions;
export default orderSlice.reducer;