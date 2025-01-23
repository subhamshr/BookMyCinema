import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
  quantity: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    add: (state, action) => {
      // for checking duplicate item
      const existingItem = state?.cart.find(
        (item) => item.slug === action.payload.slug
      );
      if (existingItem) {
        if (existingItem.quantity < action.payload.seats) {
          existingItem.quantity++;
          state.quantity++;
        }
      } else {
        state.cart.push({ ...action.payload, quantity: 1 });
        state.quantity++;
      }
    },
    getCount: (state, action) => {
      const existingItem = state?.cart.find(
        (item) => item?.slug === action?.payload?.slug
      );
      if (!existingItem) return 0;
      return existingItem.quantity;
    },
    removeItem: (state, action) => {
      const newItem = state?.cart.filter(
        (item) => item?.slug !== action?.payload
      );
      state.cart = newItem;
      state.quantity = newItem.reduce((acc, obj) => acc + obj.quantity, 0);
    },
    increaseQuantity: (state, action) => {
      const existingItem = state?.cart.find(
        (item) => item?.slug === action?.payload?.slug
      );
      if (existingItem && existingItem.quantity < action?.payload?.seats) {
        existingItem.quantity++;
        state.quantity++;
      }
    },
    decreaseQuantity: (state, action) => {
      const existingItem = state?.cart.find(
        (item) => item?.slug === action?.payload?.slug
      );
      if (existingItem.quantity === 1) {
        return;
      } else {
        existingItem.quantity--;
        state.quantity--;
      }
    },
    removeAll: (state) => {
      state.cart = [];
      state.quantity = 0;
    },
  },
});

export const {
  add,
  removeItem,
  increaseQuantity,
  decreaseQuantity,
  removeAll,
} = cartSlice.actions;

export const cartReducer = cartSlice.reducer;
