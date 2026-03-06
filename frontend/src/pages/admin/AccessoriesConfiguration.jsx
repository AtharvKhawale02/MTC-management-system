import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import "./Accessories.css";

const defaultForm = { name: "" };

function AccessoriesConfiguration() {
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [accessoryToDelete, setAccessoryToDelete] = useState(null);
  const [formData, setFormData] = useState(defaultForm);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchAccessories();
  }, []);

  const fetchAccessories = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/accessories");
      setAccessories(response.data.data || []);
    } catch (error) {
      if (error.response?.status === 401) {
        showMessage("error", "Session expired. Please login again.");
      } else {
        showMessage("error", error.response?.data?.message || "Failed to load accessories");
      }
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const openModal = (accessory = null) => {
    setEditMode(!!accessory);
    setFormData(accessory ? { ...accessory } : defaultForm);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(`/accessories/${formData.id}`, { name: formData.name });
        showMessage("success", "Accessory updated successfully");
      } else {
        await axios.post("/accessories", { name: formData.name });
        showMessage("success", "Accessory created successfully");
      }
      setShowModal(false);
      fetchAccessories();
    } catch (error) {
      if (error.response?.status === 401) {
        showMessage("error", "Session expired. Please login again.");
      } else {
        showMessage("error", error.response?.data?.message || "Error occurred");
      }
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/accessories/${accessoryToDelete.id}`);
      showMessage("success", "Accessory deleted successfully");
      setAccessoryToDelete(null);
      fetchAccessories();
    } catch (error) {
      if (error.response?.status === 401) {
        showMessage("error", "Session expired. Please login again.");
      } else {
        showMessage("error", error.response?.data?.message || "Failed to delete accessory");
      }
    }
  };

  const handleEdit = (accessory) => {
    // Navigate to parameter management page
    navigate(`/admin/accessories-config/${accessory.id}/parameters`);
  };

  return (
    <div className="accessories-container">
      <div className="accessories-header">
        <div>
          <h1 className="accessories-title">Accessories Configuration Master</h1>
          <p className="accessories-subtitle">Manage Accessories</p>
        </div>
        <button className="btn-add-accessory" onClick={() => openModal()}>
          + Add Accessory
        </button>
      </div>

      {message.text && (
        <div className={`alert-message alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="loading-container">Loading accessories...</div>
      ) : (
        <div className="table-responsive">
          <table className="accessories-table">
            <thead>
              <tr>
                <th>Accessory Name</th>
                <th>No. of Parameters</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {accessories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="no-data-row">
                    No accessories found
                  </td>
                </tr>
              ) : (
                accessories.map((accessory) => (
                  <tr key={accessory.id}>
                    <td className="accessory-name-cell">{accessory.name}</td>
                    <td>
                      <span className="parameter-count-badge">
                        {accessory.parameter_count}
                      </span>
                    </td>
                    <td>
                      {new Date(accessory.created_at).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(accessory)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => setAccessoryToDelete(accessory)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">
              {editMode ? "Edit Accessory" : "Create New Accessory"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">
                  Accessory Name <span className="required-mark">*</span>
                </label>
                <input
                  className="form-input"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter accessory name"
                  required
                  maxLength={100}
                />
                <span className="help-text">Maximum 100 characters</span>
              </div>
              <div className="modal-actions">
                <button
                  className="btn-cancel"
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button className="btn-submit" type="submit">
                  {editMode ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {accessoryToDelete && (
        <div className="modal-overlay" onClick={() => setAccessoryToDelete(null)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h2 className="confirm-title">Confirm Deletion</h2>
            <p className="confirm-text">
              Are you sure you want to delete the accessory "
              <strong>{accessoryToDelete.name}</strong>"?
            </p>
            {accessoryToDelete.parameter_count > 0 && (
              <div className="confirm-warning">
                ⚠️ This accessory has {accessoryToDelete.parameter_count} associated
                parameter(s). Please remove all parameters before deleting.
              </div>
            )}
            <div className="confirm-actions">
              <button
                className="btn-cancel"
                onClick={() => setAccessoryToDelete(null)}
              >
                Cancel
              </button>
              <button className="btn-confirm-delete" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccessoriesConfiguration;
