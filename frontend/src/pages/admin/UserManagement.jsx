import React, { useState, useEffect } from "react";
import axios from "../../utils/axiosConfig";
import "./UserManagement.css";

const defaultForm = { name: "", email: "", password: "", role: "", unit_id: "", is_active: true };

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState(defaultForm);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => { fetchUsers(); fetchUnits(); }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/admin/users`);
      setUsers(response.data.users || response.data);
    } catch {
      showMessage("error", "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const fetchUnits = async () => {
    try {
      const response = await axios.get("/admin/units");
      setUnits(response.data);
    } catch {}
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const openModal = (user = null) => {
    setEditMode(!!user);
    setFormData(user ? { ...user, password: "" } : defaultForm);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(`/admin/users/${formData.id}`, formData);
        showMessage("success", "User updated successfully");
      } else {
        await axios.post("/admin/register", formData);
        showMessage("success", "User created successfully");
      }
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      showMessage("error", error.response?.data?.message || "Error occurred");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/admin/users/${userToDelete.id}`);
      showMessage("success", "User deleted successfully");
      setUserToDelete(null);
      fetchUsers();
    } catch {
      showMessage("error", "Failed to delete user");
    }
  };

  const usersPerPage = 20;
  const totalPages = Math.ceil(users.length / usersPerPage);
  const currentUsers = users.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  return (
    <div className="user-management-container">
      <div className="user-management-header">
        <h1>User Management</h1>
        <button className="btn-add-user" onClick={() => openModal()}>+ Add User</button>
      </div>

      {message.text && <div className={`alert-message alert-${message.type}`}>{message.text}</div>}

      {loading ? (
        <div className="loading-container">Loading users...</div>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Unit</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan="6" className="no-data-row">No users found</td></tr>
            ) : (
              currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.unit_name || "-"}</td>
                  <td>
                    <span className={`status-badge ${user.is_active ? 'status-active' : 'status-inactive'}`}>
                      {user.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-edit" onClick={() => openModal(user)}>Edit</button>
                      <button className="btn-delete" onClick={() => setUserToDelete(user)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {!loading && users.length > usersPerPage && (
        <div className="pagination-container">
          <button className="btn-page" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>
            Previous
          </button>
          <span className="page-info">Page {currentPage} of {totalPages}</span>
          <button className="btn-page" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">{editMode ? "Edit User" : "Create New User"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Name <span className="required-mark">*</span></label>
                <input className="form-input" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter full name" required />
              </div>
              <div className="form-group">
                <label className="form-label">Email <span className="required-mark">*</span></label>
                <input className="form-input" type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="user@example.com" required />
              </div>
              <div className="form-group">
                <label className="form-label">Password {!editMode && <span className="required-mark">*</span>}</label>
                <input className="form-input" type="password" name="password" value={formData.password} onChange={handleInputChange} 
                  placeholder={editMode ? "Leave blank to keep current" : "Enter password"} required={!editMode} />
                {editMode && <span className="help-text">Leave blank to keep current password</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Role <span className="required-mark">*</span></label>
                <select className="form-select" name="role" value={formData.role} onChange={handleInputChange} required>
                  <option value="">Select Role</option>
                  <option value="sales">Sales</option>
                  <option value="quality">Quality</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Unit <span className="required-mark">*</span></label>
                <select className="form-select" name="unit_id" value={formData.unit_id} onChange={handleInputChange} required>
                  <option value="">Select Unit</option>
                  {units.map((unit) => <option key={unit.id} value={unit.id}>{unit.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input className="form-checkbox" type="checkbox" name="is_active" checked={formData.is_active} onChange={handleInputChange} />
                  Active User
                </label>
                <span className="help-text">Inactive users cannot log in</span>
              </div>
              <div className="modal-actions">
                <button className="btn-cancel" type="button" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn-submit" type="submit">{editMode ? "Update User" : "Create User"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {userToDelete && (
        <div className="modal-overlay">
          <div className="confirm-dialog">
            <h3 className="confirm-title">Confirm Deletion</h3>
            <p className="confirm-text">Are you sure you want to delete <strong>{userToDelete.name}</strong>?</p>
            <div className="confirm-warning">This action cannot be undone.</div>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setUserToDelete(null)}>Cancel</button>
              <button className="btn-confirm-delete" onClick={handleDelete}>Delete User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;