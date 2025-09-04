import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

const userFromStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

export const login = createAsyncThunk("auth/login", async (userData) => {
  const res = await axios.post(`${API_URL}/login`, userData);
  return res.data;
});

export const register = createAsyncThunk("auth/register", async (userData) => {
  const res = await axios.post(`${API_URL}/register`, userData);
  return res.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState: { user: userFromStorage, loading: false, error: null },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(register.pending, (state) => { state.loading = true; })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(register.rejected, (state, action) => { state.loading = false; state.error = action.error.message; });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
