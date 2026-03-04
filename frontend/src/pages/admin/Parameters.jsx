import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import "./ValveTypes.css"; // Reusing the same styles

const defaultForm = { 
  name: "", 
  type: "dropdown", 
  is_mandatory: false,
  validation_rule: "Max 200 characters"
};

function Parameters() {
  const [parameters, setParameters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [parameterToDelete, setParameterToDelete] = useState(null);
  const [formData, setFormData] = useState(defaultForm);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchParameters();
  }, []);

  const fetchParameters = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/parameters");
      setParameters(response.data.data || []);
    } catch {
      showMessage("error", "Failed to load parameters");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const openModal = (parameter = null) => {
    setEditMode(!!parameter);
    setFormData(parameter ? { ...parameter } : defaultForm);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(`/parameters/${formData.id}`, formData);
        showMessage("success", "Parameter updated successfully");
      } else {
        await axios.post("/parameters", formData);
        showMessage("success", "Parameter created successfully");
      }
      setShowModal(false);
      fetchParameters();
    } catch (error) {
      showMessage("error", error.response?.data?.message || "Error occurred");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/parameters/${parameterToDelete.id}`);
      showMessage("success", "Parameter deleted successfully");
      setParameterToDelete(null);
      fetchParameters();
    } catch (error) {
      showMessage("error", error.response?.data?.message || "Failed to delete parameter");
    }
  };

  const handleEdit = (parameter) => {
    // Navigate to parameter values page if it's a dropdown type
    if (parameter.type === 'dropdown') {
      navigate(`/admin/valve-config/parameters/${parameter.id}/values`);
    } else {
      // For non-dropdown types, just open edit modal
      openModal(parameter);
    }
  };

  return (
    <div className="valve-types-container">
      <div className="valve-types-header">
        <div>
          <h1 className="valve-types-title">Valve Configuration Master</h1>
          <p className="valve-types-subtitle">Manage Parameters</p>
        </div>
        <button className="btn-add-valve" onClick={() => openModal()}>
          + Add Parameter
        </button>
      </div>

      {message.text && (
        <div className={`alert-message alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="loading-container">Loading parameters...</div>
      ) : (
        <div className="table-card">
          <div className="table-responsive">
            <table className="valve-types-table">
              <thead>
                <tr>
                  <th>Parameter Name</th>
                  <th>Type</th>
                  <th>Mandatory</th>
                  <th>No. of Values</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {parameters.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-data-row">
                      No parameters found
                    </td>
                  </tr>
                ) : (
                  parameters.map((parameter) => (
                    <tr key={parameter.id}>
                      <td className="valve-name-cell">{parameter.name}</td>
                      <td>
                        <span className={`type-badge type-${parameter.type}`}>
                          {parameter.type}
                        </span>
                      </td>
                      <td>
                        <span className={`mandatory-badge ${parameter.is_mandatory ? 'mandatory-yes' : 'mandatory-no'}`}>
                          {parameter.is_mandatory ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td>
                        {parameter.type === 'dropdown' ? (
                          <span className="parameter-count-badge">
                            {parameter.value_count}
                          </span>
                        ) : (
                          <span className="text-muted">N/A</span>
                        )}
                      </td>
                      <td>
                        {new Date(parameter.created_at).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-edit"
                            onClick={() => handleEdit(parameter)}
                          >
                            {parameter.type === 'dropdown' ? 'Manage Values' : 'Edit'}
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => setParameterToDelete(parameter)}
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
              {editMode ? "Edit Parameter" : "Create New Parameter"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">
                  Parameter Name <span className="required-mark">*</span>
                </label>
                <input
                  className="form-input"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter parameter name"
                  required
                  maxLength={100}
                />
                <span className="help-text">Maximum 100 characters</span>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Type <span className="required-mark">*</span>
                </label>
                <select
                  className="form-input"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  disabled={editMode} // Don't allow changing type after creation
                >
                  <option value="text">Text</option>
                  <option value="dropdown">Dropdown</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                </select>
                {editMode && (
                  <span className="help-text">Parameter type cannot be changed</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label checkbox-label">
                  <input
                    type="checkbox"
                    name="is_mandatory"
                    checked={formData.is_mandatory}
                    onChange={handleInputChange}
                  />
                  <span>Mandatory Field</span>
                </label>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Validation Rule
                </label>
                <input
                  className="form-input"
                  name="validation_rule"
                  value={formData.validation_rule}
                  onChange={handleInputChange}
                  placeholder="e.g., Max 200 characters"
                  maxLength={500}
                />
                <span className="help-text">Maximum 500 characters</span>
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

      {parameterToDelete && (
        <div className="modal-overlay" onClick={() => setParameterToDelete(null)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h2 className="confirm-title">Confirm Deletion</h2>
            <p className="confirm-text">
              Are you sure you want to delete the parameter "
              <strong>{parameterToDelete.name}</strong>"?
            </p>
            {parameterToDelete.value_count > 0 && (
              <div className="confirm-warning">
                ⚠️ This parameter has {parameterToDelete.value_count} associated
                value(s). All values will be deleted along with this parameter.
              </div>
            )}
            <div className="confirm-actions">
              <button
                className="btn-cancel"
                onClick={() => setParameterToDelete(null)}
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

export default Parameters;
