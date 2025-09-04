import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser } from "../redux/userSlice.js";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.users);

  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", role: "" });
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => { dispatch(fetchUsers()); }, []);

  const handleEditClick = (user) => {
    setEditUser(user);
    setForm({ name: user.name, email: user.email, role: user.role });
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    await axios.put(`http://localhost:5000/api/users/${editUser._id}`, form, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setEditUser(null);
    dispatch(fetchUsers());
  };

  const filteredUsers = list.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-container">
      <div className="admin-card">
        <h2 className="admin-title">Admin Dashboard</h2>
        {loading ? <p>Loading users...</p> : (
          <>
            <p className="total-users">Total Users: <strong>{list.length}</strong></p>

            <input
              type="text"
              className="search-bar"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="table-wrapper">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        <button className="edit-btn" onClick={() => handleEditClick(user)}>Edit</button>
                        <button className="delete-btn" onClick={() => dispatch(deleteUser(user._id))}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {editUser && (
              <div className="edit-modal">
                <div className="edit-card">
                  <h3>Edit User</h3>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
                  <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
                  <select name="role" value={form.role} onChange={handleChange}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  <div className="edit-actions">
                    <button className="update-btn" onClick={handleUpdate}>Update</button>
                    <button className="cancel-btn" onClick={() => setEditUser(null)}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
