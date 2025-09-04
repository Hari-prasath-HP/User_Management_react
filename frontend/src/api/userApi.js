import api from "./axios"

export const getUsersApi = () => api.get("/users")
export const getUserApi = (id) => api.get(`/users/${id}`)
export const updateUserApi = (id,payload) => api.put(`/users/${id}`,payload)
export const deleteUserApi = (id) => api.delete(`/users/${id}`);
export const uploadProfileImageApi = (id, file) => {
  const form = new FormData();
  form.append("profileImage", file);
  return api.put(`/users/${id}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}; 