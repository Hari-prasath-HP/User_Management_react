import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfileImage } from "../api/userApi.js";
import { logout } from "../redux/authSlice.js";
import "./Profile.css";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(user.profileImage || "");
  const [editing, setEditing] = useState(false); // Track if a new file is selected
  const dispatch = useDispatch();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile)); // Live preview
    setEditing(true); // Show update button
  };

  const handleUpload = async () => {
    if (!file) return;
    const updatedUser = await updateProfileImage(file);
    alert("Profile image updated!");
    setPreview(updatedUser.profileImage);
    setEditing(false); // Hide update button
  };

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/login";
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-image-wrapper">
          <div className="profile-image">
            {preview ? (
              <img src={preview.startsWith("http") ? preview : `http://localhost:5000${preview}`} alt="Profile" />
            ) : (
              <div className="placeholder">
                <span>{user.name[0].toUpperCase()}</span>
              </div>
            )}

            {/* Edit icon to select new image */}
            <label className="edit-icon">
              <input type="file" onChange={handleFileChange} style={{ display: "none" }} />
              ✎
            </label>
          </div>
        </div>

        {editing && (
          <button className="upload-btn" onClick={handleUpload}>
            Update
          </button>
        )}

        <h2 className="profile-name">{user.name}</h2>
        <p className="profile-email">{user.email}</p>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
