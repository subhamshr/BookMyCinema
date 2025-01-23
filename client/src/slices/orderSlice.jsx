import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import OrderServices from "../services/orders";

const initialState = {
  orders: [],
  order: {},
  limit: 20,
  currentPage: 1,
  total: 0,
  error: false,
};

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (payload) => {
    const result = await OrderServices.create(payload);
    return result?.data;
  }
);
export const listOrder = createAsyncThunk(
  "orders/listOrder",
  async ({ limit, page }) => {
    const result = await OrderServices.list(limit, page);
    return result?.data;
  }
);
export const getOneOrder = createAsyncThunk(
  "orders/getOneOrder",
  async (id) => {
    const result = await OrderServices.getById(id);
    return result?.data;
  }
);
export const changeOrderStatus = createAsyncThunk(
  "orders/changeOrderStatus",
  async ({ id, payload }) => {
    const result = await OrderServices.updateStatus(id, payload);
    return result?.data;
  }
);
export const updateOrder = createAsyncThunk(
  "orders/updateOrder",
  async ({ id, payload }) => {
    const result = await OrderServices.update(id, payload);
    return result?.data;
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = Number(action.payload);
    },
    setLimit: (state, action) => {
      state.limit = Number(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.fulfilled, (state, action) => {
        state.laoding = false;
        state.orders = action.payload;
      })
      .addCase(createOrder.pending, (state) => {
        state.laoding = true;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.laoding = false;
        state.error = action.error.message;
      })
      .addCase(listOrder.fulfilled, (state, action) => {
        state.laoding = false;
        state.orders = action.payload.data.orders;
        state.total = action.payload.data.total;
      })
      .addCase(listOrder.pending, (state) => {
        state.laoding = true;
      })
      .addCase(listOrder.rejected, (state, action) => {
        state.laoding = false;
        state.error = action.error.message;
      })
      .addCase(getOneOrder.fulfilled, (state, action) => {
        state.laoding = false;
        state.order = action.payload.data;
      })
      .addCase(getOneOrder.pending, (state) => {
        state.laoding = true;
      })
      .addCase(getOneOrder.rejected, (state, action) => {
        state.laoding = false;
        state.error = action.error.message;
      })
      .addCase(changeOrderStatus.fulfilled, (state, action) => {
        state.laoding = false;
        state.order = action.payload.data;
      })
      .addCase(changeOrderStatus.pending, (state) => {
        state.laoding = true;
      })
      .addCase(changeOrderStatus.rejected, (state, action) => {
        state.laoding = false;
        state.error = action.error.message;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.laoding = false;
        state.order = action.payload;
      })
      .addCase(updateOrder.pending, (state) => {
        state.laoding = true;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.laoding = false;
        state.error = action.error.message;
      });
  },
});

export const { setCurrentPage, setLimit } = orderSlice.actions;

export const orderReducer = orderSlice.reducer;
