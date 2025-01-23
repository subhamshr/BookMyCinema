import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import MovieServices from "../services/movies";

const initialState = {
  movies: [],
  movie: {},
  limit: 12,
  currentPage: 1,
  total: 0,
  error: "",
  loading: false,
};

export const createMovie = createAsyncThunk(
  "movies/createMovie",
  async (payload) => {
    const result = await MovieServices.create(payload);
    return result?.data;
  }
);
export const listMovie = createAsyncThunk(
  "movies/listMovie",
  async ({ page, limit, title }) => {
    const result = await MovieServices.list(limit, page, title);
    return result?.data;
  }
);
export const getOneMovie = createAsyncThunk(
  "movies/getOneMovie",
  async (slug) => {
    const result = await MovieServices.getBySlug(slug);
    return result?.data;
  }
);
export const changeMovieSeats = createAsyncThunk(
  "movies/changeMovieSeats",
  async ({ slug, payload }) => {
    const result = await MovieServices.updateSeats(slug, payload);
    return result?.data;
  }
);
export const updateMovie = createAsyncThunk(
  "movies/updateMovie",
  async ({ slug, payload }) => {
    const result = await MovieServices.update(slug, payload);
    return result?.data;
  }
);

export const updateReleaseDate = createAsyncThunk(
  "movies/updateReleaseDate",
  async ({ slug, payload }) => {
    const result = await MovieServices.updateReleaseDate(slug, payload);
    return result?.data;
  }
);

export const deleteMovie = createAsyncThunk(
  "movies/deleteMovie",
  async (slug) => {
    // commented the actual process to avoid any data issues
    // const result = await MovieServices.remove(slug);
    // return result?.data;
    console.log(slug);
  }
);

const movieSlice = createSlice({
  name: "movies",
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
      .addCase(createMovie.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload;
      })
      .addCase(createMovie.pending, (state) => {
        state.loading = true;
      })
      .addCase(createMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(listMovie.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload.data.movies;
        state.total = action.payload.data.total;
      })
      .addCase(listMovie.pending, (state) => {
        state.loading = true;
      })
      .addCase(listMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getOneMovie.fulfilled, (state, action) => {
        state.loading = false;
        state.movie = action.payload.data;
      })
      .addCase(getOneMovie.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOneMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(changeMovieSeats.fulfilled, (state, action) => {
        state.loading = false;
        state.movie = action.payload.data;
      })
      .addCase(changeMovieSeats.pending, (state) => {
        state.loading = true;
      })
      .addCase(changeMovieSeats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateMovie.fulfilled, (state, action) => {
        state.loading = false;
        state.movie = action.payload;
      })
      .addCase(updateMovie.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateReleaseDate.fulfilled, (state, action) => {
        state.loading = false;
        state.movie = action.payload.data;
      })
      .addCase(updateReleaseDate.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateReleaseDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteMovie.fulfilled, (state, action) => {
        state.loading = false;
        state.movie = action.payload;
      })
      .addCase(deleteMovie.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setCurrentPage, setLimit } = movieSlice.actions;

export const movieReducer = movieSlice.reducer;
