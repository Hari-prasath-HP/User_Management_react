import axios from "axios";

const API_URL = "http://localhost:5000/api/users";
const token = localStorage.getItem("token");

export const updateProfileImage = async (file) => {
  const formData = new FormData();
  formData.append("profileImage", file);
  const res = await axios.put(`${API_URL}/profile/image`, formData, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
