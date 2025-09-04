import api from "./axios"

export const registerApi = (payload) => api.post("/auth/register",payload)
export const loginApi = (payload) => api.post("/auth/login",payload)
export const refreshApi = (token) => api.post("/refresh-token",{token})
export const logoutApi = (token) => api.post("/auth/logout",{token})
