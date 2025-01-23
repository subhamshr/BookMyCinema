import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserServices from "../services/users";

const initialState = {
  users: [],
  user: {},
  limit: 20,
  currentPage: 1,
  total: 0,
  error: "",
  loading: false,
};

export const createUser = createAsyncThunk(
  "users/createUser",
  async (payload) => {
    const result = await UserServices.create(payload);
    return result?.data;
  }
);
export const listUser = createAsyncThunk(
  "users/listUser",
  async ({ page, limit, title }) => {
    const result = await UserServices.list(limit, page, title);
    return result?.data;
  }
);
export const getOneUser = createAsyncThunk("users/getOneUser", async (id) => {
  const result = await UserServices.getById(id);
  return result?.data;
});
export const blockUserByAdmin = createAsyncThunk(
  "users/blockUserByAdmin",
  async ({ id }) => {
    const result = await UserServices.blockById(id);
    return result?.data;
  }
);
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, payload }) => {
    const result = await UserServices.update(id, payload);
    return result?.data;
  }
);

export const updateUserByAdmin = createAsyncThunk(
  "users/updateUserByAdmin",
  async ({ id, payload }) => {
    const result = await UserServices.updateByAdmin(id, payload);
    return result?.data;
  }
);

export const resetUserPassword = createAsyncThunk(
  "users/resetUserPassword",
  async (payload) => {
    const result = await UserServices.resetPassword(payload);
    return result?.data;
  }
);

export const deleteUser = createAsyncThunk("users/deleteUser", async (id) => {
  // commented the actual process to avoid any data issues
  const result = await UserServices.removeUser(id);
  return result?.data;
  // console.log(id);
});

const userSlice = createSlice({
  name: "users",
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
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(createUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(listUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data.users;
        state.total = action.payload.data.total;
      })
      .addCase(listUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(listUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getOneUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(getOneUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOneUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(blockUserByAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(blockUserByAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(blockUserByAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(resetUserPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(resetUserPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetUserPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateUserByAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(updateUserByAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserByAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setCurrentPage, setLimit } = userSlice.actions;

export const userReducer = userSlice.reducer;
