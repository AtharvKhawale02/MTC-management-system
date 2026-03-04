import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import "./ValveTypes.css";

const defaultForm = { name: "" };

function ValveTypes() {
  const [valveTypes, setValveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [valveToDelete, setValveToDelete] = useState(null);
  const [formData, setFormData] = useState(defaultForm);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchValveTypes();
  }, []);

  const fetchValveTypes = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/valve-types");
      setValveTypes(response.data.data || []);
    } catch (error) {
      if (error.response?.status === 401) {
        showMessage("error", "Session expired. Please login again.");
      } else {
        showMessage("error", error.response?.data?.message || "Failed to load valve types");
      }
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const openModal = (valveType = null) => {
    setEditMode(!!valveType);
    setFormData(valveType ? { ...valveType } : defaultForm);
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
        await axios.put(`/valve-types/${formData.id}`, { name: formData.name });
        showMessage("success", "Valve type updated successfully");
      } else {
        await axios.post("/valve-types", { name: formData.name });
        showMessage("success", "Valve type created successfully");
      }
      setShowModal(false);
      fetchValveTypes();
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
      await axios.delete(`/valve-types/${valveToDelete.id}`);
      showMessage("success", "Valve type deleted successfully");
      setValveToDelete(null);
      fetchValveTypes();
    } catch (error) {
      if (error.response?.status === 401) {
        showMessage("error", "Session expired. Please login again.");
      } else {
        showMessage("error", error.response?.data?.message || "Failed to delete valve type");
      }
    }
  };

  const handleEdit = (valveType) => {
    // Navigate to parameter management page
    navigate(`/admin/valve-config/valve-types/${valveType.id}/parameters`);
  };

  return (
    <div className="valve-types-container">
      <div className="valve-types-header">
        <div>
          <h1 className="valve-types-title">Valve Configuration Master</h1>
          <p className="valve-types-subtitle">Manage Valve Types</p>
        </div>
        <button className="btn-add-valve" onClick={() => openModal()}>
          + Add Valve Type
        </button>
      </div>

      {message.text && (
        <div className={`alert-message alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="loading-container">Loading valve types...</div>
      ) : (
        <div className="table-card">
          <div className="table-responsive">
            <table className="valve-types-table">
              <thead>
                <tr>
                  <th>Valve Type Name</th>
                  <th>No. of Parameters</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {valveTypes.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="no-data-row">
                      No valve types found
                    </td>
                  </tr>
                ) : (
                  valveTypes.map((valveType) => (
                    <tr key={valveType.id}>
                      <td className="valve-name-cell">{valveType.name}</td>
                      <td>
                        <span className="parameter-count-badge">
                          {valveType.parameter_count}
                        </span>
                      </td>
                      <td>
                        {new Date(valveType.created_at).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-edit"
                            onClick={() => handleEdit(valveType)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => setValveToDelete(valveType)}
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
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">
              {editMode ? "Edit Valve Type" : "Create New Valve Type"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">
                  Valve Type Name <span className="required-mark">*</span>
                </label>
                <input
                  className="form-input"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter valve type name"
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

      {valveToDelete && (
        <div className="modal-overlay" onClick={() => setValveToDelete(null)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h2 className="confirm-title">Confirm Deletion</h2>
            <p className="confirm-text">
              Are you sure you want to delete the valve type "
              <strong>{valveToDelete.name}</strong>"?
            </p>
            {valveToDelete.parameter_count > 0 && (
              <div className="confirm-warning">
                ⚠️ This valve type has {valveToDelete.parameter_count} associated
                parameter(s). Please remove all parameters before deleting.
              </div>
            )}
            <div className="confirm-actions">
              <button
                className="btn-cancel"
                onClick={() => setValveToDelete(null)}
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

export default ValveTypes;
