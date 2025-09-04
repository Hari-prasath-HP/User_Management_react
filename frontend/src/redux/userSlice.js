import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
});

export const deleteUser = createAsyncThunk("users/deleteUser", async (id) => {
  const token = localStorage.getItem("token");
  await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
  return id;
});

const userSlice = createSlice({
  name: "users",
  initialState: { list: [], loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.loading = true; })
      .addCase(fetchUsers.fulfilled, (state, action) => { state.loading = false; state.list = action.payload.users; })
      .addCase(fetchUsers.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(deleteUser.fulfilled, (state, action) => { state.list = state.list.filter(u => u._id !== action.payload); });
  }
});

export default userSlice.reducer;
