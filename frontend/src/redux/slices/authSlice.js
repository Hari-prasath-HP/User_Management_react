import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {loginApi,registerApi,logoutApi} from "../../api/authApi"

const initialToken = null
const initialRefresh = localStorage.getItem("refreshToken") || null
const initialUser = JSON.parse(localStorage.getItem("user")|| "null")