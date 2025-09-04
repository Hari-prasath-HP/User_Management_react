import axios from "axios"
import store from "../redux/store"
import {setTokens, logout} from "../redux/slices/authSlice"

const api = axios.create({
    baseURL:"http://localhost:5000/api"
})

api.interceptors.request.use((config)=>{
    const state = store.getState()
    const accessToken = state.auth.accessToken
    if(accessToken) config.headers.Authorization = `Bearer ${accessToken}`
    return config
})

let isRefreshing = false
let pending = []
const processQueue = (error, token = null) => {
    pending.forEach((p)=>(error?p.reject(error):p.resolve(token)))
    pending = []
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pending.push({ resolve, reject });
        }).then((newToken) => {
          original.headers.Authorization = `Bearer ${newToken}`;
          return api(original);
        });
      }

      try {
        isRefreshing = true;
        const refreshToken = store.getState().auth.refreshToken || localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await axios.post("http://localhost:5000/api/auth/refresh-token", { token: refreshToken });
        store.dispatch(setTokens({ accessToken: data.accessToken }));
        processQueue(null, data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch (err) {
        processQueue(err, null);
        store.dispatch(logout());
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api