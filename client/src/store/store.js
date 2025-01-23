import { configureStore } from "@reduxjs/toolkit";

import { cartReducer } from "../slices/cartSlice";
import { orderReducer } from "../slices/orderSlice";
import { movieReducer } from "../slices/movieSlice";
import { userReducer } from "../slices/userSlice";

import {
  persistStore,
  persistReducer,
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";

import storage from "redux-persist/lib/storage"; // store in local storage
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";

const persistConfig = {
  key: "BookMyCinema-Cart",
  storage,
  stateReconcile: autoMergeLevel2,
};

const persistCart = persistReducer(persistConfig, cartReducer);

export const store = configureStore({
  reducer: {
    cart: persistCart,
    movies: movieReducer,
    orders: orderReducer,
    users: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: [FLUSH, PAUSE, PURGE, PERSIST, REGISTER, REHYDRATE],
      },
    }),
});

export const newStore = persistStore(store);
